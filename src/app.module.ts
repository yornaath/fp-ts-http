import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BongModule } from './bong/bong.module';
import { EventStoreModule } from './eventstore/eventstore.module';

@Module({
  imports: [
    EventStoreModule.forRoot(),
    BongModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
