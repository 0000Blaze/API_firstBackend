const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//MiddleWares

app.use(cors());
app.use(bodyParser.json());

//Import Routes
const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute);


//ROUTES
app.get('/',(req,res) =>{
    res.send('We are on home');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true } ,() => console.log('connected to db!'));


//How to start listening to server
app.listen(3000);