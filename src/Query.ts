    
import { string, Type, number, boolean, Array, failure, success } from 'io-ts'
import { reporter } from "io-ts-reporters"
import { either } from 'fp-ts/lib/Either'
import { array } from 'fp-ts/lib/Array'
import { isNumber } from 'util';

export const NumberFromString = new Type<number, string, unknown>(
  'NumberFromString',
  (u): u is number => number.is(u),
  (u, c) =>
    either.chain(string.validate(u, c), s => {
      const n = +s
      return isNaN(n) || !isNumber(n) ? failure(s, c) : success(n)
    }),
  String
)

export const BooleanFromString = new Type<boolean, string, unknown>(
  'BooleanFromString',
  (u): u is boolean => boolean.is(u),
  (u, c) =>
    either.chain(string.validate(u, c), s => {
      const bool = `${s}`.toLowerCase()
      if(bool === "true" || bool === "false")
        return success(bool === "true" ? true : false)
      return failure(s, c)
    }),
  String
)

export const ArrayFromString = <A> (fa: Type<A, string>) => new Type<Array<A>, string, unknown>(
  'ArrayFromString',
  (u): u is Array<A> => Array.is(u),
  (u, c) =>
    either.chain(string.validate(u, c), s => {
      const split = s.split(",")
      let out: Array<A> = []
      for(const part of split) {
        const decoded = fa.decode(part)
        if(decoded.isLeft())
          return failure(s, c, reporter(decoded).join(","))
        out.push(decoded.value)
      }
      return success(out)
      // return success(split)
      // // const bool = `${s}`.toLowerCase()
      // // if(bool === "true" || bool === "false")
      // //   return success(bool === "true" ? true : false)
      // // return failure(s, c)
    }),
  String
)