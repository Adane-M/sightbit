import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv'
dotenv.config();
//made a connection to mongodb collections.Connect to MongoDB using a url
// const uri = "mongodb+srv://adane:<passward>@cluster0.qgzvt57.mongodb.net/?retryWrites=true&w=majority";
const uri = `${process.env.MONGOSDB_URI}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1})

export default client;