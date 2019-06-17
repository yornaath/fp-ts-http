import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BongTokenConsumedEvent } from '../impl/bong-token-consumed.event';
import { BongRepository } from '../../repository/bong.repository'
import { BongProjectionModel } from '../../model/bong.projection'

@EventsHandler(BongTokenConsumedEvent)
export class BongTokenConsumedHandler implements IEventHandler<BongTokenConsumedEvent> {

  constructor(
    private readonly repository: BongRepository
  ) {}

  async handle(event: BongTokenConsumedEvent) {
    const bongTokenProjection = await BongProjectionModel.findById(event.bongId)
    bongTokenProjection.tokens = event.tokens
    await bongTokenProjection.save()
  }
}