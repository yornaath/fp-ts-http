
import Koa from "koa"
import { end, lit, int } from 'fp-ts-routing'
import * as t from "io-ts"
import { get, post, driver, createServer } from "./index"
import { identity } from "io-ts";

let server = createServer()

const userById = lit('users').then(int("userid"))

server = get<{userid: number}, string>(server, userById.then(end), async(req) => {
  return {
    status: 200,
    headers: {},
    body: "get success: " + req.path.userid
  }
})

const userMessages = userById.then(lit("messages"))
const bodyType = t.type({ message: t.string })

server = post<{userid: number}, {message: string}, string>(server, userMessages.then(end), bodyType, async(req) => {
  return {
    status: 200,
    headers: {},
    body: `post user[${req.path.userid}] message: ${req.body.message}`
  }
})

driver(server, 3000).run()
  .then(() => console.log("server running"))
