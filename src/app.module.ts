import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventstoreModule } from './eventstore/eventstore.module';

@Module({
  imports: [EventstoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
