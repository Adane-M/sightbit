import React from "react";
import axios from "axios";
import Fab from "@mui/material/Fab"
import { useNavigate } from "react-router-dom";
const Logout = (props) => {
    const navigate = useNavigate();
    const signout = async (userId) => {
        try {
            const res = axios.put('users/logout', {
                userId
            }, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }

            })
            localStorage.clear();
            navigate('/login')
        } catch (error) {
            console.log(error);
        }


    }
    return (
        <Fab variant="extended" size='medium' color="error" style={{alignSelf:'flex-end' ,letterSpacing:'2px'}} onClick={() => signout(props.userId)}>
                Logout
        </Fab>

    )

}

export default Logout;