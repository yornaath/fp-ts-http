export class BongTokenConsumedEvent {
  constructor(
    public readonly bongId: string,
    public readonly tokens: any[]
  ) {}
}