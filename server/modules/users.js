import client from "../mongo_db/mongodb.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectID } from "bson";


export const signup = async (req, res) => {
    const { name, phone, sentmsgs, islogin } = req.body

    if (!(name && phone)) {
        return res.status(400).json({ msg: 'please insert data properly!' })
    }

    await client.connect()
    // perform actions on the collection object
    const database = client.db("insertDB");
    const users = database.collection("users");

    // search if user exist
    const user = await users.findOne({
        name
    },
        {
            sort: { "users.name": -1 },
            projection: { _id: 1, name: 1, phone: 1 },
        })
    console.log('sign in user', user);
    if (user === null) {
        const salt = await bcrypt.genSalt();
        const hashPhone = await bcrypt.hash(phone, salt);
        const doc = { name, phone: hashPhone, sentmsgs, islogin }

        const result = await users.insertOne(doc);
        console.log('login user result', result)
        const accessToken = jwt.sign({ userId: result.insertedId, userName: name }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 86400
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000
        });
        res.json({ accessToken });
    } else {
        const match = await bcrypt.compare(phone, user.phone);
        if (!match) {
            return res.status(400).json({ msg: 'Wrong phone number' });
        }
        //creat access-token when login match successeded!
        const accessToken = jwt.sign({ userId: user._id, userName: user.name }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: 86400
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000
        });
        res.json({ accessToken });

    }
}


export async function getusers() {
    const allusers = []
    await client.connect();
    // perform actions on the collection object
    const database = client.db("insertDB");
    const users = database.collection("users");
    // using find methode to get all users
    const cursor = users.find();
    for await (const doc of cursor) {
        allusers.push(doc)
    }
    await client.close();
    return allusers
}

export async function logout(userId) {
    await client.connect();
    const database = client.db("insertDB");
    const users = database.collection("users");
    const result = await users.updateOne(
        { "_id": ObjectID(userId) },
        {
            $set: { 'islogin': 'false' },
            $currentDate: { lastModified: true }
        }
    )
    console.log('result' , result);
    await client.close();
    return { msg: 'user logedout' }

}
