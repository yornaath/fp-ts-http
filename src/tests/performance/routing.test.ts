import { end, lit, int, query, str } from 'fp-ts-routing'

import  chunk from "lodash.chunk"
import * as request from "request-promise"
import { flatten } from 'fp-ts/lib/ArraY'
import * as io from "io-ts"
import { get, post, driver } from "../.."
import { TMiddlewareStack } from '../../Middleware';
import { none } from 'fp-ts/lib/Option';
import { all, delay } from 'bluebird';


let stack: TMiddlewareStack = [
  async function(ctx, next) {
    try {
      await next()
    }
    catch(error) {
      console.error(error)
    }
  }
]

const range = (n: number) => Array.from(Array(n).keys())

for(const i in range(1000)) {
  stack = stack.concat(...get<any, any, string>(lit("users").then(int(`${i}`)), io.any, 
  async(req) => {
    return {
      status: 200,
      headers: none,
      body: "foo"
    }
  }))
  stack = stack.concat(...post<any, any, any, string>(lit("users").then(int(`${i}`)), io.type({ filter: io.string }), io.type({ text: io.string }), 
    async(req) => {
      return {
        status: 200,
        headers: none,
        body: "foo"
      }
    }))
}

const testBatch = async (range: number[], batched: number, requester: (key: number | string) => Promise<any>) => 
  await all(chunk(range, batched).map(async (c, ci) => {
    console.time(`test:get:${ci}`)
    try {
      await all(c.map(requester))
    } catch(error) {
      console.error(error.message)
    }
    console.timeEnd(`test:get:${ci}`)
    
  }))

driver(stack, 3000).run()
  .then(async () => {
    setTimeout(async() => {

      await testBatch(range(1000), 200, i => request.get(`http://localhost:3000/users/${i}`) as any)

    }, 300)

    // for(const i in range) {
    //   console.time(`test:post:${i}`)
    //   await request.post(`http://localhost:3000/users/${i}?filter=foo`, {
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ text: "1" })
    //   })
    //   console.timeEnd(`test:post:${i}`)
    // }
  })
