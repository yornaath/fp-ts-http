import { Global, Module, DynamicModule, } from '@nestjs/common';
import { EventStore, EventStoreConfiguration } from './eventstore';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  providers: [
    ...databaseProviders
  ],
  exports: [
    ...databaseProviders
  ]
})
export class EventStoreModule {

  static forRoot(): DynamicModule {
    return {
      module: EventStoreModule
    }
  }

  static forFeature(options: EventStoreConfiguration): DynamicModule {

    const EventStoreOptionsProvider = {
      name: 'EVENT_STORE_OPTIONS',
      provide: 'EVENT_STORE_OPTIONS',
      useValue: options
    }

    return {
      module: EventStoreModule,
      providers: [
        EventStoreOptionsProvider, 
        EventStore,
      ],
      exports: [
        EventStore,
      ],
    };
  }
}
