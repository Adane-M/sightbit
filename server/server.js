import e from "express";
import cors from 'cors';
import dotenv from 'dotenv'
import router  from './routes/users.js';
import router_msg from './routes/chats.js';

const app = e();
dotenv.config();

app.use(e.json());
app.use(e.urlencoded({ extended:true }));
app.use(cors({credentials:true,origin:'http://localhost:3000'}));

app.listen(process.env.PORT||8080,()=>{
    console.log(`Server running on port ${process.env.PORT||8080}`);
})

//enabeling users/msgs routers 
app.use('/users', router);
app.use('/updatemsg', router_msg);
