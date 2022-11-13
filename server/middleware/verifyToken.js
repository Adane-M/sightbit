import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import client from '../mongo_db/mongodb.js';

dotenv.config();

export const verifyToken = async (req, res, next) => {

    const token = req.headers['x-access-token'];
    // req.headers.cookie || req.headers['x-access-token'] || req.headers['authorization'];
    if (token === null) return res.status(403).json({ msg: 'unauthorized' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
        if (err) {
            console.log('vaerigfy error ---------> ', err);
            return res.status(403).json({ msg: 'not verified token' });
        }


        try {
            await client.connect();
            const database = client.db("insertDB");
            const users = database.collection("users");

            const user = await users.findOne({
                name: decode.userName
            },
                {
                    sort: { "users.name": -1 },
                    projection: { _id: 0, name: 1 }
                })

            await next(); // go to next stage of our middleware
        } catch (e) {
            return res.status(403).json({ msg: 'name not verified' })
        }


    })
}
