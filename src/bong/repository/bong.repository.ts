import { Injectable } from '@nestjs/common';
import { Bong } from '../model/bong.model';

@Injectable()
export class BongRepository {
  async create(id: string, tokens: any[]) {
    return Bong.create(id, tokens)
  }
}