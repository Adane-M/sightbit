import axios from "axios";
import { useNavigate } from "react-router-dom";
const Axiosconfig =()=>{
    const navigate =useNavigate();
    axios.interceptors.request.use((config) => {
        config.headers['x-access-token'] = localStorage.getItem('token');
        config.headers['Access-Control-Allow-Origin'] = '*';
        config.headers['Content-Type'] = 'application/json';
        config.withCredentials = true;
        console.log('REQ--config -->', config);
        return config;
    }, (error) => {
        return Promise.reject(error);
    });


    axios.interceptors.response.use((config) => {
        console.log('config--->', config.status);
        if (config.status === 403) {
            localStorage.clear('token');
            navigate('/login');
        }
    }, (error) => {
        console.log('LOGINerror---->>>>' ,error);
        return Promise.reject(error);
    });

}
export default Axiosconfig;