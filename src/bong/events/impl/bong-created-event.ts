export class BongCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly tokens: any[]
  ) {}
}