
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
import { get, post, driver } from "./"
import { TMiddlewareStack } from './Middleware';
import { none } from 'fp-ts/lib/Option';

const stack: TMiddlewareStack = []

const userById = lit('users').then(int("userid"))

const stack2 = [
  ...stack, 
  ...get<{userid: number}, {}, string>(userById.then(end), io.strict({}), 
  async(req) => {
    return {
      status: 200,
      headers: none,
      body: JSON.stringify(req.path)
    }
  })]

const userMessages = userById.then(lit("messages"))
const userMessageDto = io.type({ message: io.string })

const stack3 = [
  ...stack2, 
  ...post<{userid: number}, {}, {message: string}, string>(userMessages.then(end), io.strict({}), userMessageDto, async(req) => {
    return {
      status: 200,
      headers: none,
      body: JSON.stringify(req.path)
    }
  })]


driver(stack3, 3000).run()
  .then(() => console.log("server running"))
```

## Advanced query parsing example
```typescript

import { end, lit, query, str } from 'fp-ts-routing'
import * as io from "io-ts"
import { get, post, driver } from "."
import { TMiddlewareStack } from './Middleware';
import { none } from 'fp-ts/lib/Option';
import { NumberFromString, BooleanFromString, ArrayFromString } from './Query';


const stack: TMiddlewareStack = []

type TUsersPath = {
  type: string;
}

const usersQuery = io.strict({
  filter: io.union([ io.undefined, io.string ]),
  validStatusCodes: io.union([ io.undefined, ArrayFromString<number>(NumberFromString) ]),
  sortBy: io.union([ io.undefined, io.string]),
  sortDirection: io.union([ io.undefined, BooleanFromString])
})

type TUsersQuery = io.TypeOf<typeof usersQuery>

type TUsersResponseBody = string

const users = lit("users").then(str("type"))

const stack2 = [
  ...stack, 
  ...get<TUsersPath, TUsersQuery, TUsersResponseBody>(users.then(end), usersQuery, 
  async(req) => {
    return {
      status: 200,
      headers: none,
      body: await UserRepository.find({ 
        type: req.path.type, 
        sortBy: req.path.sortBy,
        sortDirection: req.path.sortDirection
      })
    }
  })]

type TUserMessageDto = {
  message: string
}

const userMessages = users.then(lit("messages"))
const userMessageDto = io.type({ message: io.string })

type TUserMessagesResponseBody = string

const stack3 = [
  ...stack2, 
  ...post<TUsersPath, TUsersQuery, TUserMessageDto, TUserMessagesResponseBody>(userMessages.then(end), usersQuery, userMessageDto, 
  async(req) => {

    const users = await UserRepository.find({ 
      type: req.path.type, 
      sortBy: req.path.sortBy,
      sortDirection: req.path.sortDirection
    })

    await Promise.all(users.map(async user => sendMessageToUser(user, req.body)))

    return {
      status: 200,
      headers: none,
      body: JSON.stringify(req.path)
    }
  })]


driver(stack3, 3000).run()
  .then(() => console.log("server running"))

```
