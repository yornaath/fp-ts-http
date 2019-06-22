
import { Validation, failure, success } from 'fp-ts/lib/Validation'
import { IO } from 'fp-ts/lib/IO'
import { TTokenDto, validate as validateTokenDto } from './Token.dto';
import ValidationError from '../../lib/ValidationError';
import { none, some } from 'fp-ts/lib/Option';
import { tryCatch2v } from 'fp-ts/lib/Either';
import { isArray } from 'util';

export type TInputType = string;

export type TCreateBongDto = {
  tokens?: TTokenDto[]
}

export const validateSchema = (createBongDto: Record<string, unknown>): Validation<ValidationError[], TCreateBongDto> => {
  let errors:ValidationError[] = []
  const { tokens } = createBongDto;

  if(!tokens) {
    errors = [...errors, new ValidationError(":tokens cannot be undefined", none)]
  }
  else if(!isArray(tokens)) {
    errors = [...errors, new ValidationError(":tokens must be an array", none)]
  }
  else {
    const tokenDtoValidation = tokens.map(validateTokenDto)

    for(const validation of tokenDtoValidation) {
      if(validation.isFailure()) {
        errors = [...errors, ...validation.value]
      }
    }
  }

  if(errors.length)
    return failure(errors)

  return success(createBongDto)
}

export const fromIO = (input: IO<string>): Validation<ValidationError[], TCreateBongDto> => {
  const parsed = tryCatch2v<ValidationError, Record<string, unknown>>(
    () => JSON.parse(input.run()), (reason: Error) => new ValidationError("input not valid json", some(reason)))

  if(parsed.isLeft()) {
    return failure([parsed.value])
  }

  return validateSchema(parsed.value)
}

// const valid = fromIO(new IO(() => `{
//   "tokens": [
//     {
//       "id": "123"
//     }
//   ]
// }`));

// console.log(valid);