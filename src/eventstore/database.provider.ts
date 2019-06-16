
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect('mongodb+srv://root:diamant1337@cluster0-kc4wf.mongodb.net/test')
    },
  },
]
