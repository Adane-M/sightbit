import express from 'express';
import  { _update, _insertMsg , _insertMsgs, _getmsgs} from '../controllers/chats.js';
//import functions from controller

const router_msg = express.Router();
router_msg.get('/:userId/:selectedUserI' , _getmsgs);
router_msg.put('/update' , _update);
router_msg.put('/send/msg' , _insertMsg);
router_msg.put('/send/multiple' , _insertMsgs);

export default router_msg; 