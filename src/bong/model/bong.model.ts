import { AggregateRoot } from '@nestjs/cqrs';
import { BongCreatedEvent } from '../events/impl/bong-created-event'
import { BongTokenConsumedEvent } from '../events/impl/bong-token-consumed.event'

export class Bong extends AggregateRoot {
  
  constructor(private id: string, private tokens: any[]) {
    super();
  }

  static create(id: string, tokens: any[]) {
    const bong = new Bong(id, tokens);
    bong.apply(new BongCreatedEvent(id, tokens))
    return bong
  }

  consumeToken(tokenId: string) {
    this.tokens = this.tokens.filter(token => token.id !== tokenId)
    this.apply(new BongTokenConsumedEvent(this.id, this.tokens));
  }

}