import {MongoClient} from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

if (!uri) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

if (!dbName) {
    throw new Error(
        "Please define the MONGODB_DB environment variable inside .env.local"
    );
}

/**
 * Connect to the database and return a cached connection and database object
 */
export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return {client: cachedClient, db: cachedDb};
    }

    const client = await MongoClient.connect(uri);

    const db = await client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return {client, db};
}
