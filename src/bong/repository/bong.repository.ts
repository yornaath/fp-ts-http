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
    const projection = await BongProjectionModel.findById(id)
    const bong = new Bong(projection.id, projection.tokens)
    return bong
  }

  async list() {
    const projections = await BongProjectionModel.find()
    return projections.map(projection => 
      new Bong(projection.id, projection.tokens))
  }

}