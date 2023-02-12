const express = require('express');
const mongoose = require("mongoose");
const expressSession = require("express-session");
const path = require("path");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const flashMdl = require("./middlewares/flash");

// To save express session in mongodb 
const MongoDBStore = require("connect-mongodb-session")(expressSession);

// Passport is used for authentication
const passport = require("./config/passport");
const nodeSassMiddleware = require('node-sass-middleware');

// Store configuration
const store = new MongoDBStore({
    uri:'mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/sansocial?retryWrites=true&w=majority',
    collection:'authStore'
})

// Initalizing App
const app = express();

// Setting Up connection to mongodb atlas server
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/sansocial?retryWrites=true&w=majority')
        .then(result=>{
            app.listen(8000);
        })
        .catch(err=>{
            console.log("Unable to connect to db");
        })


// Template engine
app.set('view engine','ejs');
app.set('views','views');

// Node Sass middleware
app.use(nodeSassMiddleware({
    src:path.join(__dirname,"public","scss"),
    dest:path.join(__dirname,"public","css"),
    prefix:"/css",
    // debug:true,
    outputStyle:"expanded"
}))

// Statid file routes
app.use(express.static('public'));

// To encode req body
app.use(express.urlencoded({extended:false}));


// Initializing the express session
app.use(expressSession({
    secret:"MySecretKey",
    saveUninitialized:false,
    resave:false,
    store:store
}));

app.use(flash());
app.use(flashMdl);

// Initializing the passport js
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    // console.log(req.user);
    res.locals.user = req.user;
    next();
})

// Auth route
app.use("/auth",require('./routes/auth'));

app.use("/post",require("./routes/post-route"));

app.use("/comment",require("./routes/comment"));

app.use("/user",require("./routes/user"));

app.use(require("./routes/index"));

// Auth failure handler
app.use("/fail",(req,res,next)=>{
    res.send("Authentication Failed");
})

// Home page route


