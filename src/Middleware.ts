import * as Koa from "koa";
import compose from "koa-compose";

export type TMiddlewareStack = Readonly<Koa.Middleware[]>

export const concat = (a: TMiddlewareStack, b: TMiddlewareStack): TMiddlewareStack => 
  Object.freeze([compose([...a, ...b])])

export const from = (middleware: Koa.Middleware): TMiddlewareStack =>
  Object.freeze([middleware])