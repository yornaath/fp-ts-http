import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BongCreatedEvent } from '../impl/bong-created-event';
import { BongRepository } from '../../repository/bong.repository'
import { BongProjectionModel } from '../../model/bong.projection'

@EventsHandler(BongCreatedEvent)
export class BongCreatedHandler implements IEventHandler<BongCreatedEvent> {

  constructor(
    private readonly repository: BongRepository
  ) {}

  async handle(event: BongCreatedEvent) {
    await BongProjectionModel.create({
      _id: event.id,
      tokens: event.tokens
    })
  }
}