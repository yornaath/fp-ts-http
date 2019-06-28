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
    errors = [...errors, new ValidationError(":tokens of TCreateBongDto cannot be undefined", none)]
  }
  else if(!isArray(tokens)) {
    errors = [...errors, new ValidationError(":tokens of TCreateBongDto must be an array", none)]
  }
  else {
    for(const validation of tokens.map(validateTokenDto)) {
      if(validation.isFailure()) {
        errors = [...errors, ...validation.value]
      }
    }
  }

  if(errors.length)
    return failure(errors)

  return success(createBongDto)
}

export type TCreateBongDtoValidation = Validation<ValidationError[], TCreateBongDto>;

export const fromIO = (input: IO<string>): TCreateBongDtoValidation => {
  const parsed = tryCatch2v<ValidationError, Record<string, unknown>>(() => JSON.parse(input.run()), 
    (reason: Error) => new ValidationError("TCreateBongDto input not valid JSON", some(reason)))
  if(parsed.isLeft()) {
    return failure([parsed.value])
  } else {
    return validateSchema(parsed.value)
  }
}