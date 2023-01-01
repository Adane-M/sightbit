
import { List, ListItem, ListItemText, Paper, ListSubheader, TextField, Box, AppBar, Toolbar } from "@mui/material";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { AppContext } from '../../App';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import Logout from "../TaskLoginProj/Logout";

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    left: 20,
    top: -20,
    width: 100,
    height: 100
});

const Chat = () => {
    const { accessToken } = useContext(AppContext)
    const [inpuval, setInpuval] = useState('')
    const [msgs, setMsgs] = useState([])
    const navigate = useNavigate();
    const params = useParams();

    const getChat = useCallback(async () => {
        console.log(params);
        const { userId, selectedUserId } = params
        const getres = await axios.get(`/updatemsg/${userId}/${selectedUserId}`, {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'x-access-token': accessToken

            }
        })
        console.log(getres.data);
        showmsgs(getres.data)

    }, [params, accessToken])

    useEffect(() => {
        getChat()
            .catch(error => {
                console.log(error);
            })
    }, [getChat])

    const showmsgs = (arr) => {
        const { userId, selectedUserId } = params
        const selectedusermsgs = [];
        const usermsgs = [];
        arr.forEach(element => {
            (element._id === userId) ? usermsgs.push(element) : selectedusermsgs.push(element);
        });
        // get all the messages ive sent to the selected user
        const messagesSentByMe = selectedusermsgs[0].sentmsgs.filter(mes => mes.from === userId);
        // get all the messages i recive by the selected user
        const messagesRecived = usermsgs[0].sentmsgs.filter(mes => mes.from === selectedUserId);
        // merge messeges and then sort then by date
        const allMessgesHistory = [...messagesSentByMe, ...messagesRecived].sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
        console.log(allMessgesHistory);
        setMsgs(allMessgesHistory);
    }
    const send = async () => {
        const { userId, selectedUserId } = params
        try {
            const res = await axios.put('/updatemsg/send/msg', {
                _id: selectedUserId,
                from: userId,
                msg: inpuval
            }, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            }
            );
            console.log('send msg response', res.data);
            setInpuval('');
            navigate('/');
        } catch (error) {
            console.log('=====', error);
        }

    }
    return (
        <>
        <Logout userId={params.userId} />
        <Fab variant="extended" style={{ alignSelf:'flex-start'}} onClick={() => navigate('/')}>
            homepage
        </Fab>
            <Paper sx={{ pb: '50px', width: '96vw' ,  backgroundColor: '#e5e5f7',
  background: 'radial-gradient(circle, transparent 20%, #e5e5f7 20%, #e5e5f7 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #e5e5f7 20%, #e5e5f7 80%, transparent 80%, transparent) 25px 25px, linear-gradient(#101011 2px, transparent 2px) 0 -1px, linear-gradient(90deg, #4e4e4e 2px, #e5e5f7 2px) -1px 0',
  backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px'
}}>
                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                </ListSubheader>
                <List sx={{ mb: 2 }} >
                    {msgs.map((elem, i) => {
                        if (elem.from === params.userId) {

                            return (

                                <ListItem button key={i} style={{ textAlign: 'center', backgroundColor: "white" , borderBottom:'8px solid green', borderRadius: "20px", left: "40vw", width: '50vw', marginTop: "5px" }}>
                                    <ListItemText primary={elem.msg} secondary={elem.date} />
                                </ListItem>
                            )
                        } else {

                            return (

                                <ListItem button key={i} style={{ textAlign: 'center',borderBottom:'6px solid purple', background: "white", borderRadius: "20px", left: "10vw", width: '50vw', marginTop: "5px" }}>
                                    <ListItemText primary={elem.msg} secondary={elem.date} />
                                </ListItem>
                            )
                        }
                    })}
                </List>
            </Paper>
            <AppBar position="fixed" color="success" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <StyledFab color="success" aria-label="add" disabled={!inpuval} onClick={send}>
                        <h2>Send</h2>
                    </StyledFab>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '80vw', backgroundColor: 'white' }
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-textarea"
                            // label="start messaeging"
                            placeholder="type your thoughts"
                            value={inpuval}
                            multiline
                            onChange={(e) => { setInpuval(e.target.value) }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}
export default Chat;