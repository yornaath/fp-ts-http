import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateBongCommand } from '../impl/create-bong.command';
import { BongRepository } from '../../repository/bong.repository'

@CommandHandler(CreateBongCommand)
export class CreateBongHandler implements ICommandHandler<CreateBongCommand> {
  constructor(
    private readonly repository: BongRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateBongCommand) {
    const bong = this.publisher.mergeObjectContext(
      await this.repository.create('1', command.tokens)
    )
    bong.commit()
  }
}