import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BongModule } from './bong/bong.module';

@Module({
  imports: [BongModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
