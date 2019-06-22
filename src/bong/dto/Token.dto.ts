
import { Validation, failure, success } from 'fp-ts/lib/Validation'
import { none } from 'fp-ts/lib/Option'
import ValidationError from '../../lib/ValidationError';

export type TTokenDto = {
  id?: string;
}

export const validate = (tokenDto: TTokenDto): Validation<ValidationError[], TTokenDto> => {
  const { id } = tokenDto;
  if(!id)
    return failure([ new ValidationError("id must be a non empty string", none) ])
  return success(tokenDto)
}