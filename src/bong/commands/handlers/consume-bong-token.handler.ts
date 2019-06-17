import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ConsumeBongTokenCommand } from '../impl/consume-bong-token.command';
import { BongRepository } from '../../repository/bong.repository'

@CommandHandler(ConsumeBongTokenCommand)
export class ConsumeBongTokenHandler implements ICommandHandler<ConsumeBongTokenCommand> {
  
  constructor(
    private readonly repository: BongRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ConsumeBongTokenCommand) {
    const bong = this.publisher.mergeObjectContext(
      await this.repository.findById(command.bongId)
    )

    bong.consumeToken(command.tokenId)
    bong.commit()
    
    return bong
  }
}