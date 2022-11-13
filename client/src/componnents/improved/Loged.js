import React from "react";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const Loged = (props) => {
    if (!props.islogin) {
        return (
            <ListItemAvatar>
                <Avatar alt={props.name} src={props.name} sx={{ bgcolor: 'red' }} />
            </ListItemAvatar>

        )
    } else {
        return (
            <ListItemAvatar>
                <Avatar alt={props.name} src={props.name} sx={{ bgcolor: 'lightgreen' }} />
            </ListItemAvatar>

        )
    }
}

export default Loged;