// 

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables')
}

const globalForMongoose = globalThis as unknown as {
  mongoose: typeof mongoose | undefined
}

export async function connectDB() {
  if (globalForMongoose.mongoose) {
    return globalForMongoose.mongoose
  }

  const connection = await mongoose.connect(MONGODB_URI as string)

  globalForMongoose.mongoose = connection

  return connection
}