import * as uuid from 'uuid'
import { Injectable } from '@nestjs/common';
import { Bong } from '../model/bong.model';
import { BongProjectionModel } from '../model/bong.projection'

export const bongs = {}

@Injectable()
export class BongRepository {

  async create(tokens: any[]) {
    const id = uuid.v4()
    return Bong.create(id, tokens)
  }

  async findById(id: string) {
    return BongProjectionModel.findById(id)
  }

  async list() {
    return BongProjectionModel.find()
  }

}