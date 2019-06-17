import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreModule } from '../eventstore/eventstore.module';
import { EventStore } from '../eventstore/eventstore';
import { BongController } from './bong.controller';
import { BongRepository } from './repository/bong.repository';
import commandHandlers from './commands/handlers'
import eventHandlers from './events/handlers'
import queryHandlers from './queries/handlers';
import { BongCreatedEvent } from './events/impl/bong-created-event'
import { BongTokenConsumedEvent } from './events/impl/bong-token-consumed.event'

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.forFeature({
      events: 'bongs'
    })
  ],
  controllers: [BongController],
  providers: [
    BongRepository,
    ...eventHandlers,
    ...commandHandlers,
    ...queryHandlers
  ]
})
export class BongModule implements OnModuleInit {

  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore
  ) {}

  async onModuleInit() {
    const subject$ = (this.event$ as any).subject$
    this.eventStore.setEventHandlers(this.eventHandlers)
    this.eventStore.bridgeEventsTo(subject$);
    this.event$.publisher = this.eventStore;
  }

  eventHandlers = {
    BongCreatedEvent: (data) => new BongCreatedEvent(data.id, data.tokens),
    BongTokenConsumedEvent: (data) => new BongTokenConsumedEvent(data.bongId, data.tokens)
  }

}
