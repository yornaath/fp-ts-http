
import * as Koa from "koa"
import { IncomingMessage } from "http";

export type TRequest<PT, QT = {}, BT = any> = Readonly<{
  status: number
  headers: Record<string, string>
  url: string
  path: PT
  body: BT
  stream: IncomingMessage
  query: QT
}>

export const fromKoaContext = <PT, QT = {}, BT = any> (ctx: Koa.Context, path: PT, query:QT, body?: BT): TRequest<PT, QT, BT> => {
  return Object.freeze({
    url: ctx.url,
    status: ctx.status,
    headers: ctx.headers,
    body: body || ctx.body,
    path,
    stream: ctx.req,
    query
  })
}