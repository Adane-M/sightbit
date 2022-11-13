import { logout, getusers } from '../modules/users.js';

// export const _signup = signup();
// export const _signup = (req, res) => {
//     const {name, phone , sentmsgs, frommsgs , islogin} = req.body
//     signup(name, phone , sentmsgs, frommsgs , islogin)
//         .then(data => {
//             console.log('+++++++++++++++++++++++++++++++++++++++insert', data)
//             res.json(data)
//         })
//         .catch(err => {
//             console.log('===== err signup =====================', err)
//             res.json({ msg: 'try again please'})
//         })
// }
export const _getusers = (req, res) => {
        getusers()
        .then(data => {
            console.log('++++++++++++++++++++ getusers +++++++++++++++++++', data.length)
            res.json(data)
        })
        .catch(err => {
            console.log('=====  err getusers  =====================', err)
            res.json({ msg: err.message })
        })
    }
    
    export const _logout =(req , res)=>{
        const {userId} = req.body;
        logout(userId)
        .then(data => {
            console.log('++++++++++++++++++++ logout +++++++++++++++++++', data)
            res.json(data)
        })
        .catch(err => {
            console.log('=====  err logout  =====================', err)
            res.json({ msg: err.message })
        })

}

