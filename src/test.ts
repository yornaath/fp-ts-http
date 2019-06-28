
import Koa from "koa"
import { end, lit, int } from 'fp-ts-routing'
import * as t from "io-ts"
import { get, post, driver, IServer } from "./index"
import { identity } from "io-ts";

let server: IServer = {
  platform: new Koa()
}

const userById = lit('users').then(int("userid"))
const userByIdParser = userById.parser.map(identity)

server = get<{userid: number}, string>(server, userById.then(end), userByIdParser, async(req) => {
  return {
    status: 200,
    headers: {},
    body: "get success: " + req.path.userid
  }
})

const userMessages = userById.then(lit("messages")).then(end)
const bodyType = t.type({ message: t.string })

server = post<{userid: number}, {message: string}, string>(server, userMessages, userByIdParser, bodyType, async(req) => {
  return {
    status: 200,
    headers: {},
    body: `post user[${req.path.userid}] message: ${req.body.message}`
  }
})

driver(server, 3000).run()
  .then(() => console.log("server running"))
