import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BongCreatedEvent } from '../impl/bong-created-event';

@EventsHandler(BongCreatedEvent)
export class BongCreatedHandler implements IEventHandler<BongCreatedEvent> {
  handle(event: BongCreatedEvent) {
    console.log(BongCreatedEvent, event)
  }
}