
# fp-ts-http

```typescript
import { end, lit, int } from 'fp-ts-routing'
import * as t from "io-ts"
import { get, post, driver } from "./src"
import { TMiddlewareStack } from './src/Middleware';
import { none } from 'fp-ts/lib/Option';

const stack: TMiddlewareStack = []

const userById = lit('users').then(int("userid"))

const stack2 = [...stack, ...get<{userid: number}, string>(userById.then(end), async(req) => {
  return {
    status: 200,
    headers: none,
    body: "get success: " + req.path.userid
  }
})]

const userMessages = userById.then(lit("messages"))
const userMessageDto = t.type({ message: t.string })

const stack3 = [...stack2, ...post<{userid: number}, {message: string}, string>(userMessages.then(end), userMessageDto, async(req) => {
  return {
    status: 200,
    headers: none,
    body: `post message "${req.body.message}" to user ${req.path.userid}`
  }
})]


driver(stack3, 3000).run()
  .then(() => console.log("server running"))

```