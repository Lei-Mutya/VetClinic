const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

//tell dotenve where is the file 
dotenv.config({ path: './.env'}); //backslash means we are putting the path at same level of the app.js


const app = express();

//start the database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//create a public directory
const publicDirectory = path.join(__dirname, './public');

//make sure that express is using the public directory
app.use(express.static(publicDirectory)); 

//Parse URL encoded bodies as sent by HTML forms
app.use(express.urlencoded({ extended: false}));

//Parse JSON bodies as sent by API Clients
app.use(express.json());


//create the homepage

app.set('view engine', 'hbs');
 
//connect it
db.connect( (error)=>{
    if(error)
    {
        console.log(error);
    }
    else
    {
        console.log("MySQL Connected");
    }
});

//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));



app.listen(5000, ()=>{
    console.log('Server started on P ort 5000');
})