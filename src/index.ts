
import Koa from 'koa'
import composeMiddleware from 'koa-compose'
import { Route, parse, Match } from 'fp-ts-routing'
import { Task } from 'fp-ts/lib/Task'
import * as t from "io-ts"
import { isNull } from 'util';
import koaBody from "koa-body"
import { identity } from 'fp-ts/lib/function';
import { TRequest, koaContextToRequest } from './Request';
import { TResponse } from './Response';
import { TMiddlewareStack, from } from './Middleware';

export const withoutRequestBody = (method: "GET" | "DELETE" | "OPTIONS") => 
  <TPath extends object, TResponseBody> (
    matcher: Match<TPath>, 
    handler: (req: TRequest<TPath>) => Promise<TResponse<TResponseBody>>): TMiddlewareStack => {
      return from(async (ctx, next) => {
        
        if(ctx.method.toUpperCase() !== method)
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

export const get = withoutRequestBody("GET")
export const options = withoutRequestBody("OPTIONS")
export const del = withoutRequestBody("DELETE")

const withRequestBody = (method: "POST" | "PUT" | "PATCH") => 
  <TPath extends object, TRequestBody, TResponseBody> (
    matcher: Match<TPath>, 
    bodyParser: t.Type<TRequestBody>, 
    handler: (req: TRequest<TPath, TRequestBody>) => Promise<TResponse<TResponseBody>>): TMiddlewareStack => {
      return from(async (ctx, next) => {
        
        if(ctx.method.toUpperCase() !== method)
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

export const post = withRequestBody("POST");
export const put = withRequestBody("PUT");
export const patch = withRequestBody("PATCH");

const applyResponseToKoaContext = <TResponseBody> (response: TResponse<TResponseBody>, ctx: Koa.Context)  => {
  if(response.headers.isSome()) {
    const headers = response.headers.value
    for(const header in headers) {
      ctx.set(header, headers[header])
    }
  }
  ctx.status = response.status
  ctx.body = response.body
}

export const driver = (stack :TMiddlewareStack, port: number) => {
  return new Task(() => {
    const koa = new Koa()
    const middleware = composeMiddleware([koaBody(), ...stack])
    koa.use(middleware)
    return new Promise(resolve => koa.listen(port, resolve))
  })
}