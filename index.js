const express =require('express');
const cors =require('cors');
const body_parser =require('body-parser');
const dotenv =require('dotenv')
const userRoutes = require('./src/user/user.routes');
const imageRoute =require('./src/image/imageRoute');
const workOrderTransaction = require('./src/WorkerOrderTransaction/WorkerOrder.routes');
dotenv.config();

const app = express();

app.use(cors({
    origin:'*'
    ,credentials: true
}))

app.use(body_parser.json())





app.use('/user',userRoutes);
app.use('/img', imageRoute);
app.use('/workTransaction',workOrderTransaction);



const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})