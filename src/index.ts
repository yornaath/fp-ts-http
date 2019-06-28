
import Koa from 'koa'
import composeMiddleware from 'koa-compose'
import { Route, zero, parse, lit, end, Parser, Match, int } from 'fp-ts-routing'
import { Task, task } from 'fp-ts/lib/Task'
import * as t from "io-ts"
import { isNull } from 'util';
import koaBody from "koa-body"
import { identity } from 'fp-ts/lib/function';


export type TResponse<RT> = {
  status: number,
  body: RT,
  headers: Record<string, string>
}

export type TRequest<PT, BT = any> = {
  url: string
  path: PT
  status: number
  body: BT
  headers: Record<string, string>
}

export interface IServer {
  platform: Koa
  middleware?: Koa.Middleware[]
}

export const createServer = (): IServer => {
  return {
    platform: new Koa(),
    middleware: []
  }
}

export const use = (server: IServer, middleware: Koa.Middleware) => {
  return {
    ...server,
    middleware: [...(server.middleware || []), middleware]
  }
}

export const get = <TPath extends object, TResponseBody> (server: IServer, matcher: Match<TPath>, handler: (req: TRequest<TPath>) => Promise<TResponse<TResponseBody>>) => {
  return use(server, async (ctx, next) => {
    
    if(ctx.method.toUpperCase() !== "GET")
      return next()

    const pathParser = matcher.parser.map(identity)
    const match = parse(pathParser, Route.parse(ctx.request.url), null as any)

    if(isNull(match))
      return next()

    const request = koaContextToRequest(ctx, match)
    const response = await handler(request)
    
    applyResponseToKoaContext<TResponseBody>(response, ctx)
  })
}

export const post = <TPath extends object, TRequestBody, TResponseBody> (server: IServer, matcher: Match<TPath>, bodyParser: t.Type<TRequestBody>, handler: (req: TRequest<TPath, TRequestBody>) => Promise<TResponse<TResponseBody>>) => {
  return use(server, async (ctx, next) => {
    
    if(ctx.method.toUpperCase() !== "POST")
      return next()

    const pathParser = matcher.parser.map(identity)
    const match = parse(pathParser, Route.parse(ctx.request.url), null as any)

    if(isNull(match))
      return next()
    
    const decodedBody = bodyParser.decode(ctx.request.body)
    
    if(decodedBody.isLeft())
      return ctx.throw(400)

    const request = koaContextToRequest<TPath, TRequestBody>(ctx, match, decodedBody.value)

    const response = await handler(request)
    
    applyResponseToKoaContext<TResponseBody>(response, ctx)
  })
}

const koaContextToRequest = <PT, BT> (ctx: Koa.Context, path: PT, body?: BT): TRequest<PT> => {
  return {
    url: ctx.url,
    status: ctx.status,
    headers: ctx.headers,
    body: body || ctx.body,
    path
  }
}

const applyResponseToKoaContext = <TResponseBody> (response: TResponse<TResponseBody>, ctx: Koa.Context)  => {
  for(const header in response.headers)
    ctx.set(header, response.headers[header])
  ctx.status = response.status
  ctx.body = response.body
}


export const driver = (server :IServer, port: number) => {
  return new Task(() => {
    const middleware = composeMiddleware([koaBody(), ...server.middleware])
    server.platform.use(middleware)
    return new Promise(resolve => server.platform.listen(port, resolve))
  })
}