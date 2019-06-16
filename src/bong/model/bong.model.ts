import { AggregateRoot } from '@nestjs/cqrs';
import { BongCreatedEvent } from '../events/impl/bong-created-event';

export class Bong extends AggregateRoot {
  constructor(private readonly id: string, private readonly tokens: any[]) {
    super();
  }

  static create(id: string, tokens: any[]) {
    const bong = new Bong(id, tokens);
    bong.apply(new BongCreatedEvent(id, tokens))
    return bong
  }
}