const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const noteRouter = require('./routes/noteRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const mongoose = require('mongoose');

// Middleware to parse incoming JSON payloads
app.use(express.json());

app.use(cors());           //Also middleware (add headers to the response from server)

// app.use((req,res,next)=>{
//     console.log("HTTP Method - " + req.method + ", URL  - "+ req.url);
//     next();
// });

app.use('/users', userRouter);
app.use('/notes', noteRouter); 

app.get("/", (req,res)=>{
    res.send("Notes API from Sahil");
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server is running on port "+ PORT);
    });
})
.catch((err)=>{
    mongoose.disconnect();
    console.log(err+ " mongodb error");
})




