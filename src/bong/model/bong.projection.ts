
import * as mongoose from 'mongoose'

export const BongProjectionSchema = new mongoose.Schema({
  _id: String,
  tokens: { type: [Object] },
  created: { type: Date, default: Date.now }
})

export const BongProjectionModel = mongoose.model('bongprojection', BongProjectionSchema)