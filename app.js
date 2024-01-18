require("dotenv").config();
const express = require("express");
const connectDB = require("./Connection/ConnectDB");
const app = express();
const port = process.env.port || 9000
const passport = require("passport")
const session = require("express-session");
const router = require("./Router/Handler");


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:'loyalty',
    resave:false,
    saveUninitialized:true,
    cookie: {maxAge: 24*64000}
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/", router)



const start = ()=>{
    try {
        connectDB()
        app.listen(port, ()=>{
            console.log("DB connected Successfully")
            console.log(`This app is running on Port ${port}`)
        })    
    } catch (error) {
        console.log(error)
    }
}

start();
