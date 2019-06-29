import { end, lit, query } from 'fp-ts-routing'
import * as io from "io-ts"
import { get, driver } from ".."
import { TMiddlewareStack } from '../Middleware';
import { none } from 'fp-ts/lib/Option';
import { NumberFromString, BooleanFromString, ArrayFromString } from '../Query';


const stack: TMiddlewareStack = []

type TUsersPath = {
  filter: undefined | string
  validStatusCodes: undefined | number[]
  sortBy: undefined | string
  sortDirection: undefined | boolean
}

const usersQuery = io.type({
  filter: io.union([ io.undefined, io.string ]),
  validStatusCodes: io.union([ io.undefined, ArrayFromString<number>(NumberFromString) ]),
  sortBy: io.union([ io.undefined, io.string]),
  sortDirection: io.union([ io.undefined, BooleanFromString])
})

const users = lit("users")
const usersList = users.then(query(usersQuery))

const stack2 = [...stack, ...get<TUsersPath, null, string>(usersList.then(end), io.null, async(req) => {
  return {
    status: 200,
    headers: none,
    body: JSON.stringify(req.path) // {filter: "foo", validStatusCodes: [1, 2], sortBy: "field" sortDirection: true}
  }
})]


driver(stack2, 3000).run()
  .then(() => console.log("server running"))