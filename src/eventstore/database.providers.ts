import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://root:diamant1337@ds016128.mlab.com:16128/bongs'),
  },
]
