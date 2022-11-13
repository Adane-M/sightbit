import express from 'express';
// import functions from controller folder
import { _getusers ,_logout } from '../controllers/users.js';
import { signup } from '../modules/users.js'
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// router.get('/users', _getusers);
router.get('/users', verifyToken, _getusers);
router.post('/login', signup);
router.put('/logout', _logout);
router.get('/token', verifyToken, (req, res) => {
    const accessToken = req.headers['x-access-token'];
        //  req.headers.cookie||req.headers['authorization'] || req.headers['x-access-token']
    res.status(200).json({ accessToken });
});


export default router;