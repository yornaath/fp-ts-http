
import * as Koa from "koa"
import { Stream } from "stream";

export type TRequest<PT, BT = any> = Readonly<{
  status: number
  headers: Record<string, string>
  url: string
  path: PT
  body: BT
  stream: Stream
}>

export const koaContextToRequest = <PT, BT> (ctx: Koa.Context, path: PT, body?: BT): TRequest<PT> => {
  return Object.freeze({
    url: ctx.url,
    status: ctx.status,
    headers: ctx.headers,
    body: body || ctx.body,
    path,
    stream: ctx.req
  })
}