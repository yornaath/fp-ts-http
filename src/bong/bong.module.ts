import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventstoreModule } from '../eventstore/eventstore.module';
import { BongController } from './bong.controller';
import { BongRepository } from './repository/bong.repository';
import commandHandlers from './commands/handlers'
import eventHandlers from './events/handlers'

@Module({
  imports: [CqrsModule, EventstoreModule],
  controllers: [BongController],
  providers: [
    BongRepository,
    ...eventHandlers,
    ...commandHandlers
  ]
})
export class BongModule {}
