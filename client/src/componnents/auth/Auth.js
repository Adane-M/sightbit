import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../App';

const Auth = (props) => {
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const { accessToken, setAccessToken } = useContext(AppContext);

    const verify = useCallback(async () => {
        const response = await axios.get('/users/token', {
            withCredentials: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'x-access-token': accessToken
            }
        });
        setRedirect(true);
        setAccessToken(response.data.accessToken);

    }, [setAccessToken, accessToken])

    useEffect(() => {
        verify()
            .catch((err) => {
                console.log(err.response.data);
                setRedirect(false)
                navigate('/login');
            })
    }, [verify, navigate])
//if accesstoken is not verify in server jwt.verify then user wont see nothing "null" , else he have an access to his data "props.children".
    return (
        (!redirect) ? null : props.children
    )
}


export default Auth;