
import * as Koa from "koa"
import {end, lit, int, zero, Route, Parser, parse} from 'fp-ts-routing'
import { IRoute, route, run } from "./index"
import { Task } from "fp-ts/lib/Task";

interface Home extends IRoute {
  
}

interface NotFound extends IRoute {
  
}

export type AppRoute = Home | NotFound

const index: AppRoute = { handler: (req) => new Task(async() => {
  return {
    status: 200,
    body: "home site"
  }
})}

const user: (userid: number) => AppRoute = (userid: number) => 
  ({ handler: (req) => new Task(async() => {
    return {
      status: 200,
      body: "user: " + userid
    }
  })})

const notFound: AppRoute = { handler: (req) => new Task(async() => {
  return {
    status: 404,
    body: "not found"
  }
})}

const defaults = end
const userMatch = lit('users').then(int("userid")).then(end)

const router = zero<IRoute>()
  .alt(defaults.parser.map(() => index))
  .alt(userMatch.parser.map(({userid}) => user(userid)))


let server = {
  platform: new Koa(),
  defaultLocation: notFound
}

server = route(server, "GET", router)

run(server, 3000)