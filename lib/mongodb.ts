import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

// Check if the URI is defined, and throw an error if it is undefined
if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so the MongoClient is not recreated
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's fine to create a new MongoClient
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
