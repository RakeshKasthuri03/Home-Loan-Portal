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

// Fix for malformed absolute URLs accidentally stored with a leading slash
// Example: "/http://localhost:5000/api/file/.." — the browser will request
// "/http://localhost:5000/..." which the server treats as a path and returns
// 404. This middleware will detect such requests and redirect the client to
// the corrected URL without the leading slash.
app.use((req, res, next) => {
    try {
        const orig = req.originalUrl || req.url || '';
        if (typeof orig === 'string' && orig.startsWith('/http')) {
            const target = orig.slice(1);
            console.warn('Redirecting malformed absolute URL request', orig, '->', target);
            return res.redirect(302, target);
        }
    } catch (e) {
        // ignore and continue
    }
    return next();
});

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});

//agent routes
app.use('/api/admin',adminRoute);
//loan application routes
app.use('/api/loan', loanRoute);
app.use('/api/agent',agentRoute);
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