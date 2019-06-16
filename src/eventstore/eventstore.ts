import { Injectable, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { IEventPublisher } from '@nestjs/cqrs/dist/interfaces/events/event-publisher.interface';
import { IMessageSource } from '@nestjs/cqrs/dist/interfaces/events/message-source.interface';
import { IEvent } from '@nestjs/cqrs/dist/interfaces/events/event.interface';
import { Subject, fromEvent } from 'rxjs';
import * as mongoose from 'mongoose';

export type EventStoreConfiguration = {
  events: string
}

export const EventSchema = new mongoose.Schema({
  type: String,
  data: Object,
  created: { type: Date, default: Date.now }
})

@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {

  private readonly eventsCollection: mongoose.Model<any>

  private eventHandlers: { [index: string]: any }

  constructor(@Inject('DATABASE_CONNECTION') private db: typeof mongoose, @Inject('EVENT_STORE_OPTIONS') private config: EventStoreConfiguration) {
    this.eventsCollection = this.db.model(this.config.events, EventSchema)
  }

  async publish<T extends IEvent>(event: T) {
    await this.eventsCollection.create({
      type: event.constructor.name,
      data: event
    })
  }

  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    this.eventsCollection.watch().on('change', change => {
      const event = this.eventHandlers[change.fullDocument.type](change.fullDocument.data)
      subject.next(event)
    })
  }

  async replay<T extends IEvent>(subject: Subject<T>) {
    for await(const eventDoc of await this.eventsCollection.find()) {
      const event = this.eventHandlers[eventDoc.type](eventDoc.data)
      subject.next(event)
    }
  }

  setEventHandlers(handlers: any) {
    this.eventHandlers = handlers
  }
}

