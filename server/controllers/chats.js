import {getmsgs, update, insertMsg , insertMsgs} from '../modules/chats.js';


export const _getmsgs = (req, res) => {
    const { userId , selectedUserI } = req.params;
    let getthat = userId.split(' ')
    console.log('getmsgs +++++++++++++', req.params);
    console.log('getmsgs +++++++++++++', userId , selectedUserI);
    getmsgs(userId , selectedUserI)
        .then(data => {
            console.log('user getmsgs' , data);
            res.json(data)
        })
        .catch(err => {
            console.log('getmsgs ===Err  ============', err);
            res.json({ msg: err.message })
        })
}
export const _update = (req, res) => {
    // console.log('UPDATE+++++++++++++', req.body);
    const { fillterddata, updateddata } = req.body;
    update(fillterddata, updateddata)
        .then(data => {
            console.log(data);
            res.json(data)
        })
        .catch(err => {
            console.log('update ===Err  ============', err);
            res.json({ msg: err.message })
        })
}

export const _insertMsg = (req, res) => {
    const { _id, from, msg } = req.body
 console.log('from ==== ' , from);
    insertMsg(_id, from, msg)
        .then(data => {
            console.log('++++++++++ insert msg ++++++++',data);
            res.json(data)
        })
        .catch(err => {
            console.log('======= insert msg Err ============', err);
            res.json({ msg: err.message })
        })
}

export const _insertMsgs = (req , res) => {
    const { _ids, from, msg} = req.body;
    
    console.log('++++++++++ insert msgs ++++++++',_ids, from, msg);
    insertMsgs( _ids, from, msg)
    .then(data => {
        console.log('++++++++++ insert msgs ++++++++',data);
        res.json(data)
    })
    .catch(err => {
        console.log('======= insert msgs Err ============', err);
        res.json({ msg: err.message })
    })
}
