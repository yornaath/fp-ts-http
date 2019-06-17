
export class ConsumeBongTokenCommand {
  constructor(
    public readonly bongId: string,
    public readonly tokenId: string
  ) {}
}
