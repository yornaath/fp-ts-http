
# fp-ts-http

### Install

Includes `fp-ts` `fp-ts-routing` and `io-ts`

```bash
npm i fp-ts-http
```

## Example
```typescript
import { end, lit, int } from 'fp-ts-routing'
import * as io from "io-ts"
import { get, post, driver } from "fp-ts-http"
import { TMiddlewareStack } from 'fp-ts-http/lib/Middleware';
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
const userMessageDto = io.type({ message: io.string })

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
