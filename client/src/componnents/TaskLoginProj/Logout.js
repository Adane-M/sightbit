import React from "react";
import axios from "axios";
import Button from "@mui/material/Button"
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
            console.log(res);
            localStorage.clear();
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
        

    }
    return(
        <Button variant="contained" color="error" onClick={() => signout(props.userId)}>
        Logout
      </Button>

    )

}

export default Logout;