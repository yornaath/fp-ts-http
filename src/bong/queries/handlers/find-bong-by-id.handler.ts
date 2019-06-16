
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BongRepository } from '../../repository/bong.repository';
import { FindBongByIdQuery } from '../impl/find-bong-by-id.query';

@QueryHandler(FindBongByIdQuery)
export class FindBongByIdHandler implements IQueryHandler<FindBongByIdQuery> {
  constructor(private readonly repository: BongRepository) {}

  async execute(query: FindBongByIdQuery) {
    return this.repository.findById(query.id)
  }
}