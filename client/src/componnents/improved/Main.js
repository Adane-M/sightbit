import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { AppContext } from '../../App';
import Loged from './Loged';
import { Loading } from './Loading';
import Logout from '../TaskLoginProj/Logout';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    left: 20,
    top: -20,
    width: 100,
    height: 100
});


export default function Main() {
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=k5oZLRzjZAXakdbQXAo5CqyXCcjX1rFL&q=deadpool&limit=1&offset=0&rating=g&lang=en')

    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [count, setCount] = useState('')
    const [inpuval, setInpuval] = useState('')
    const [userId, setUserId] = useState('');
    const [exp, setExp] = useState();
    const [isLoading, setIsLoading] = useState(false);


    const { accessToken } = useContext(AppContext)
    const navigate = useNavigate();
    //checking if user connected.
    useEffect(() => {
        const userConnected = async () => {
            try {
                const decode = await jwt_decode(accessToken);
                setUserId(decode.userId);
                const expire = decode.exp
                setExp(new Date(expire * 1000).toString())
                if (exp * 1000 < new Date().getTime()) {
                    console.log('sgdfgnhm expiure ', exp);
                    navigate('/login')
                }
            } catch (error) {
                console.log(error);
            }
        }
        userConnected();
    })


    const getUsersmsgs = useCallback(async () => {
        setIsLoading(true);
        const res = await axios.get('/users/users', {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            }
        });
        setIsLoading(false);
         setUsers(res.data.filter(elem => elem._id !== userId).sort(elem => !elem.islogin ? 1 : -1));
        const found = await res.data.filter(element =>
            element.islogin === false
        )
        setCount(found.length)
    }, [setUsers,accessToken])

    useEffect(() => {
        getUsersmsgs()
            .catch(e => {
                console.log(e);
                setIsLoading(false);
            })

    }, [getUsersmsgs])

    const handleToggle = (value) => {
        const colnedSelectedUsers = [...selectedUsers];

        const currentIndex = colnedSelectedUsers.indexOf(value);


        if (currentIndex === -1) {
            colnedSelectedUsers.push(value);
        } else {
            colnedSelectedUsers.splice(currentIndex, 1);
        }

        setSelectedUsers(colnedSelectedUsers);
    };

    const openMessages = (selectedUserId) => {
        navigate(`/${userId}/${selectedUserId}`)
    };

    const sendmsgs = async () => {
        try {
            const res = await axios.put('/updatemsg/send/multiple', {
                _ids: selectedUsers,
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
            // setSelectedUsers([]);
        } catch (error) {
            console.log('=====', error);
        }

    }
    const senToAll = async () => {

        const allconnectedId = []
        users.forEach(elem => {
            if (elem.islogin === true) {
                allconnectedId.push(elem._id)
            }
        })
        try {
            const res = await axios.put('/updatemsg/send/multiple', {
                _ids: allconnectedId,
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
        } catch (error) {
            console.log('=====', error);
        }

    }

    const lastmsg = (msgs) => {
        let msg = 'no msgs yet';
        msgs.forEach(element => {
            if (element.from === userId) {
                msg = element.msg;
            }
        });
        return msg;
    }


    return (
        <div className='App-header'>
            <Logout userId={userId} />
            {/* <Button variant="contained" onClick={clickk}>contained</Button> */}

            <CssBaseline />
            <Paper sx={{width:'90vw' , height:'90vh', pb: '90px'}}>
                <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                    {count}/ {users.length} is Disconnected
                </ListSubheader>
                <List sx={{ mb: 2 }} >
                    {isLoading ? <Loading /> :
                        (!users) ? <h1>NO USERS YET</h1> : users.map((user) => {
                            return (
                                <div key={user._id} style={{display: 'flex', flexDirection: 'row' }}>
                                    <ListItem button sx={{fs:'1.5rem'}} onClick={() => openMessages(user._id)}>
                                        <Loged islogin={user.islogin} name={user.name} />
                                        <ListItemText primary={lastmsg(user.sentmsgs)} secondary={(!user.sentmsgs[0]) ? " " : user.sentmsgs[0].date} />
                                    </ListItem>
                                    <div style={{ margin: '5px' }}>
                                        <Checkbox onChange={() => handleToggle(user._id)} disabled={!user.islogin} />
                                    </div>
                                </div>
                            )
                        })}
                </List>
            </Paper>
            <AppBar position="fixed" color="success" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <StyledFab color="success" aria-label="add" disabled={!inpuval || selectedUsers.length === 0} onClick={sendmsgs}>
                        <h2>Send</h2>
                    </StyledFab>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '70vw', backgroundColor: 'white' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            id="outlined-textarea"
                            label="start messaeging"
                            placeholder="type your thoughts"
                            value={inpuval}
                            multiline
                            onChange={(e) => { setInpuval(e.target.value) }}
                        />
                    </Box>
                    <Button sx={{ backgroundColor: 'lightblue', height: "10vh", color: 'black' }} variant="outlined" onClick={senToAll}>Send to all</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}