
import Koa, { Context } from 'koa'
import composeMiddleware from 'koa-compose'
import { Route, parse, Match } from 'fp-ts-routing'
import { Task } from 'fp-ts/lib/Task'
import * as t from "io-ts"
import { isNull } from 'util';
import koaBody from "koa-body"
import { identity } from 'fp-ts/lib/function';
import { TRequest, fromKoaContext } from './Request';
import { TResponse } from './Response';
import { TMiddlewareStack, from } from './Middleware';
import { reporter } from 'io-ts-reporters';

export type THttpMethod = "GET" | "DELETE" | "OPTIONS" | "POST" | "PUT" | "PATCH"

const withoutRequestBody = (method: THttpMethod) => 
  <TPath extends object, TRequestQuery, TResponseBody> (
    matcher: Match<TPath>,
    queryType: t.Decoder<object, TRequestQuery>,
    handler: (req: TRequest<TPath, TRequestQuery>) => Promise<TResponse<TResponseBody>>): TMiddlewareStack => {
      return from(async (ctx, next) => {
        
        if(ctx.method.toUpperCase() !== method)
          return next()

        const pathParser = matcher.parser.map(identity)
        const pathRoute = Route.parse(ctx.request.path)
        const matchPath = parse(pathParser, pathRoute, null as any)
        
        if(isNull(matchPath))
          return next()
        
        const query = queryType.decode(ctx.query)
        
        if(query.isLeft())
          return ctx.throw(400, JSON.stringify({
            errors: reporter(query)
          }, null, 4))
        
        const request = fromKoaContext<TPath, TRequestQuery>(ctx, matchPath, query.value)
        const response = await handler(request)
        
        applyResponseToKoaContext<TResponseBody>(response, ctx)
      })
    }

const withRequestBody = (method: THttpMethod) => 
  <TPath extends object, TRequestQuery, TRequestBody, TResponseBody> (
    matcher: Match<TPath>, 
    queryType: t.Decoder<object, TRequestQuery>,
    bodyParser: t.Type<TRequestBody>, 
    handler: (req: TRequest<TPath, TRequestQuery, TRequestBody>) => Promise<TResponse<TResponseBody>>): TMiddlewareStack => {
      return from(async (ctx, next) => {
        
        if(ctx.method.toUpperCase() !== method)
          return next()

        const pathParser = matcher.parser.map(identity)
        const pathRoute = Route.parse(ctx.request.path)
        const matchPath = parse(pathParser, pathRoute, null as any)
        
        if(isNull(matchPath))
          return next()

        const query = queryType.decode(ctx.query)
      
        if(query.isLeft())
          return ctx.throw(400, JSON.stringify({
            errors: reporter(query)
          }, null, 4))

        const decodedBody = bodyParser.decode(ctx.request.body)
        
        if(decodedBody.isLeft())
          return ctx.throw(400, "request body invalid")

        const request = fromKoaContext<TPath, TRequestQuery, TRequestBody>(ctx, matchPath, query.value, decodedBody.value)

        const response = await handler(request)
        
        applyResponseToKoaContext<TResponseBody>(response, ctx)
      })
    }

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

export const get = withoutRequestBody("GET")
export const options = withoutRequestBody("OPTIONS")
export const del = withoutRequestBody("DELETE")
export const post = withRequestBody("POST");
export const put = withRequestBody("PUT");
export const patch = withRequestBody("PATCH");

export const driver = (stack :TMiddlewareStack, port: number) => {
  return new Task(() => {
    const koa = new Koa()
    const middleware = composeMiddleware([
      async(ctx: Context, next) => {
        ctx.set('content-type', 'application/json')
        return next()
      },
      koaBody(), 
      ...stack
    ])
    koa.use(middleware)
    return new Promise(resolve => koa.listen(port, resolve))
  })
}