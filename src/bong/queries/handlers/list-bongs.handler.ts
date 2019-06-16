
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BongRepository } from '../../repository/bong.repository';
import { ListBongsQuery } from '../impl/list-bongs.query';

@QueryHandler(ListBongsQuery)
export class ListBongsHandler implements IQueryHandler<ListBongsQuery> {
  constructor(private readonly repository: BongRepository) {}

  async execute(query: ListBongsQuery) {
    return this.repository.list()
  }
}