import { end, lit, query, str } from 'fp-ts-routing'
import * as io from "io-ts"
import { get, post, driver } from ".."
import { TMiddlewareStack } from '../Middleware';
import { none } from 'fp-ts/lib/Option';
import { NumberFromString, BooleanFromString, ArrayFromString } from '../Query';
import { UserRepository } from './fixtures';


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
      body: JSON.stringify(await UserRepository.find({ 
        type: req.path.type, 
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection
      }))
    }
  })]

type TUserMessageDto = {
  text: string
}

const userMessages = users.then(lit("messages"))
const userMessageDto = io.type({ text: io.string })

type TUserMessagesResponseBody = string

const stack3 = [
  ...stack2, 
  ...post<TUsersPath, TUsersQuery, TUserMessageDto, TUserMessagesResponseBody>(userMessages.then(end), usersQuery, userMessageDto, 
  async(req) => {

    const users = await UserRepository.find({ 
      type: req.path.type, 
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection
    })

    const result = await Promise.all(users.map(async user => UserRepository.sendMessageToUser(user, req.body)))

    return {
      status: 200,
      headers: none,
      body: JSON.stringify(result)
    }
  })]


driver(stack3, 3000).run()
  .then(() => console.log("server running"))
