
import * as Koa from "koa"
import { IncomingMessage } from "http";

export type TRequest<PT, BT = any> = Readonly<{
  status: number
  headers: Record<string, string>
  url: string
  path: PT
  body: BT
  stream: IncomingMessage
}>

export const fromKoaContext = <PT, BT = any> (ctx: Koa.Context, path: PT, body?: BT): TRequest<PT, BT> => {
  return Object.freeze({
    url: ctx.url,
    status: ctx.status,
    headers: ctx.headers,
    body: body || ctx.body,
    path,
    stream: ctx.req,
  })
}