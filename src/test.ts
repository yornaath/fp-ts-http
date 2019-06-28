
import { end, lit, int } from 'fp-ts-routing'
import * as t from "io-ts"
import { get, post, driver, createServer } from "./index"

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
const userMessage = t.type({ message: t.string })

server = post<{userid: number}, {message: string}, string>(server, userMessages.then(end), userMessage, async(req) => {
  return {
    status: 200,
    headers: {},
    body: `post message "${req.body.message}" to user ${req.path.userid}`
  }
})

driver(server, 3000).run()
  .then(() => console.log("server running"))
