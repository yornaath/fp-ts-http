import { Controller, Post, Param, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBongCommand } from './commands/impl/create-bong.command'
import { CreateBongDto } from './interfaces/create-bong.dto';

@Controller('bong')
export class BongController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/')
  async createBong(@Body() dto: CreateBongDto) {
    return this.commandBus.execute(new CreateBongCommand(dto.tokens));
  }
}
