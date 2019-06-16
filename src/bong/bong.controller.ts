import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBongCommand } from './commands/impl/create-bong.command'
import { CreateBongDto } from './interfaces/create-bong.dto';
import { FindBongByIdQuery } from './queries/impl/find-bong-by-id.query';
import { ListBongsQuery } from './queries/impl/list-bongs.query';
import { Bong } from './model/bong.model';

@Controller('bong')
export class BongController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('/')
  async list(): Promise<Bong[]> {
    return this.queryBus.execute(new ListBongsQuery());
  }

  @Get('/:id')
  async findAll(@Param('id') id: string): Promise<Bong> {
    return this.queryBus.execute(new FindBongByIdQuery(id));
  }

  @Post('/')
  async createBong(@Body() dto: CreateBongDto) {
    return this.commandBus.execute(new CreateBongCommand(dto.tokens));
  }

}
