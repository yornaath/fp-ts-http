
import { end, lit, int } from 'fp-ts-routing'
import * as t from "io-ts"
import { get, post, put, driver } from "./index"
import { TMiddlewareStack, concat } from './Middleware';

let stack: TMiddlewareStack = []

const userById = lit('users').then(int("userid"))

const stack2 = concat(stack, get<{userid: number}, string>(userById.then(end), async(req) => {
  return {
    status: 200,
    headers: {},
    body: "get success: " + req.path.userid
  }
}))

const userMessages = userById.then(lit("messages"))
const userMessage = t.type({ message: t.string })

const stack3 = concat(stack2, post<{userid: number}, {message: string}, string>(userMessages.then(end), userMessage, async(req) => {
  return {
    status: 200,
    headers: {},
    body: `post message "${req.body.message}" to user ${req.path.userid}`
  }
}))


driver(stack3, 3000).run()
  .then(() => console.log("server running"))
