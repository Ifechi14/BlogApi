const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes=  require('./routes/auth');
const userRoutes= require('./routes/user');
const postRoutes= require('./routes/post');
const categoryRoutes= require('./routes/category');
const multer= require('multer');


const app= express();

//middleware
dotenv.config();
app.use(express.json());


///MongoDB connection
const db = process.env.MONGO_URI;

mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));


//Storage 
const storage= multer.diskStorage({
    destination: (req,file,cd)=>{
        cb(null, "images")
    },
    filename: (req, file, cb)=>{
        cb (null, "hello.jpeg");
    }
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single("file"), (req,res)=>{
    res.status(200).json("File has been uploaded");
});


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/category', categoryRoutes);

//Server
const port= 5600
app.listen(port, ()=>{
    console.log(`Server running on ${port}...`);
});