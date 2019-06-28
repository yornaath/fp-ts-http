
import { Validation, failure, success } from 'fp-ts/lib/Validation'
import { none } from 'fp-ts/lib/Option'
import ValidationError from '../../lib/ValidationError';

export type TTokenDto = {
  id?: string;
}

export const validate = (tokenDto: Record<string, any>): Validation<ValidationError[], TTokenDto> => {
  const { id } = tokenDto;
  if(!id)
    return failure([ new ValidationError(":id of TokenDto must be a non empty string", none) ])
  return success(tokenDto)
}