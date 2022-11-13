import { ObjectID } from "bson";
import client from "../mongo_db/mongodb.js";

export async function getmsgs(userId, selectedUserId) {
  try {
    await client.connect()
    // perform actions on the collection object
    const database = client.db("insertDB");
    const users = database.collection("users");
    // Query for multipal users
    const query = { _id: { $in: [ObjectID(`${userId}`), ObjectID(`${selectedUserId}`)] } };
    const options = {
      // sort matched documents in descending order by id
      sort: { _id: -1 },
      // Include only the `sentmsgs` fields in the returned document
      projection: { name: 1, sentmsgs: 1 },
    };
    const cursor = users.find(query, options);
    // const cursor = users.find({_id: ObjectID(`${selectedUserId}`)});
    const getselectedusermsgs = []
    for await (const doc of cursor) {
      getselectedusermsgs.push(doc)
    }
    return getselectedusermsgs;

  } finally {
    await client.close();
  }
}

export async function update(fillterddata, updateddata) {
  console.log('fillterddata ,updateddata', fillterddata, updateddata)
  try {
    await client.connect()
    const database = client.db("insertDB");
    const users = database.collection("users");
    // create a filter for a movie to update
    const filter = { name: fillterddata };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        name: `${updateddata}`
      },
    };
    const result = await users.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

  } finally {
    await client.close();
  }

}
// Fetch documents from collection based on a criteria
// db.userdetails.find({"education":"M.C.A."}).pretty();

export async function insertMsg(_id, from, msg) {
  try {
    console.log('insert datat +++++ ', _id, from, msg);
    await client.connect();
    const database = client.db("insertDB");
    const users = database.collection("users");
    // create a document to push to msgs
    const result = await users.updateOne({ "_id": ObjectID(_id) }, {
      $push: {
        sentmsgs: { from, msg, date: new Date().toLocaleString() }
      },
    });
    console.log(`-----msg sent!---------- `, result.modifiedCount);
  } finally {
    await client.close();
  }
}

export async function insertMsgs(_ids, from, msg) {
  try {
    console.log('insert datat +++++ ', _ids, from, msg);
    await client.connect();
    const database = client.db("insertDB");
    const users = database.collection("users");
    const matchedUsers = await users.updateMany({ "_id": { "$in": _ids.map(id => ObjectID(id)) } }, {
      $push: {
        sentmsgs: { from, msg, date: new Date().toLocaleString() }
      },
    })
    console.log(`documents were inserted +++++++++`, matchedUsers.modifiedCount);
  } finally {
    await client.close();
  }
}
