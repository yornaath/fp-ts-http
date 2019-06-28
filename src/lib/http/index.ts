
import * as Koa from 'koa'
import { Route, zero, parse, lit, end, Parser, Match, int } from 'fp-ts-routing'
import { Task } from 'fp-ts/lib/Task'
import { identity } from 'fp-ts/lib/function';
import { IO } from 'fp-ts/lib/IO';
import { Applicative } from 'fp-ts/lib/Applicative';


export type TResponse = Partial<Koa.Response>

export type TRequest = Partial<Koa.Request>;

export interface IRoute {
  handler: (request: TRequest) => Task<TResponse>
}

export interface IServer {
  platform: Koa
  defaultLocation: IRoute
}

export type TMethod = "GET" | "PUT" | "POST" | "DELETE" | "PATCH" | "OPTIONS"

export const route = <TRoute extends IRoute> (server: IServer, method: TMethod, router: Parser<TRoute>): IServer => {
  server.platform.use(async(ctx, next) => {

    if(ctx.method.toUpperCase() !== method)
      return next()

    const location = parse<TRoute | IRoute>(router, Route.parse(ctx.request.url), server.defaultLocation)
    const handle = location.handler(ctx.request)
    const response = await handle.run()

    for(const header in response.headers)
      ctx.set(header, response.headers[header])

    ctx.status = response.status
    ctx.body = response.body

    if(next)
      return next()
  })
  return server
}

export const run = (server :IServer, port: number): IServer => {
  server.platform.listen(port)
  return server
}