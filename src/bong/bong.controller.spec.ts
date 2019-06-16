import { Test, TestingModule } from '@nestjs/testing';
import { BongController } from './bong.controller';

describe('Bong Controller', () => {
  let controller: BongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BongController],
    }).compile();

    controller = module.get<BongController>(BongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
