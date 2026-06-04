const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
require('dotenv').config();  // Load .env FIRST before using env variables

const app=express();
app.use(express.json());
app.use(cors());


const path = require('path');
const fs = require('fs');
const userRoute=require('./routes/user.route');
const uploadRoute=require('./routes/upload.route');
const agentRoute=require('./routes/agent.route');
const loanRoute=require('./routes/loan.route');
const adminRoute=require('./routes/admin.route');

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});

//agent routes
app.use('/api/agent',agentRoute);
app.use('/api/admin',adminRoute);
//loan application routes
app.use('/api/loan', loanRoute);
// serve api routes under /api
app.use('/', userRoute);
app.use('/api', uploadRoute);

// ensure uploads directory exists and serve it statically
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));


const PORT = process.env.PORT ;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});