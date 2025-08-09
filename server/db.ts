import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://aax:3744@cluster0.e7l0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db('drishti');
}

export { clientPromise };