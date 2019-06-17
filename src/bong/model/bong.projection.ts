
import * as mongoose from 'mongoose'

export interface BongProjection extends mongoose.Document {
  _id: string
  tokens: any[]
  created: string
}

export const BongProjectionSchema = new mongoose.Schema({
  _id: String,
  tokens: { type: [Object] },
  created: { type: Date, default: Date.now }
})

export const BongProjectionModel = mongoose.model<BongProjection>('bongprojection', BongProjectionSchema)