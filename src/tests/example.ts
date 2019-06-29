import { end, lit, int } from 'fp-ts-routing'
import * as io from "io-ts"
import { get, post, driver } from "../"
import { TMiddlewareStack } from '..//Middleware';
import { none } from 'fp-ts/lib/Option';

const stack: TMiddlewareStack = []

const userById = lit('users').then(int("userid"))

const stack2 = [...stack, ...get<{userid: number}, null, string>(userById.then(end), io.null, async(req) => {
  return {
    status: 200,
    headers: none,
    body: `fetched user ${req.path.userid}`
  }
})]

const userMessages = userById.then(lit("messages"))
const userMessageDto = io.type({ message: io.string })

const stack3 = [...stack2, ...post<{userid: number}, null, {message: string}, string>(userMessages.then(end), io.null, userMessageDto, async(req) => {
  return {
    status: 200,
    headers: none,
    body: `post message "${req.body.message}" to user ${req.path.userid}`
  }
})]


driver(stack3, 3000).run()
  .then(() => console.log("server running"))