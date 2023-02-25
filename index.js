const express = require('express');
const mongoose = require("mongoose");
const expressSession = require("express-session");
const path = require("path");
const flash = require("connect-flash");
const flashMdl = require("./middlewares/flash");

const logger = require("morgan")

const env = require("./config/environment");

const http = require("http");


// To save express session in mongodb 
const MongoDBStore = require("connect-mongodb-session")(expressSession);

// Passport is used for authentication
const passport = require("./config/passport");

const sass = require("node-sass-middleware");

// Store configuration
const store = new MongoDBStore({
    uri:`mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/${env.db_name}?retryWrites=true&w=majority`,
    collection:'authStore'
})

// Initalizing App
const app = express();
require('./config/view-helper')(app);
const chatServer = http.createServer(app);
const chatSocket = require("./config/chat")(chatServer);

// Setting Up connection to mongodb atlas server
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://sachinyadav1469:Sachin%40123@cluster0.my3twen.mongodb.net/${env.db_name}?retryWrites=true&w=majority`)
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
if(env.name == "development"){
    app.use(
        sass({
          src: __dirname + '/public/scss',
          dest: __dirname + '/public/css',
          debug: true,
          prefix:"/css",
          outputStyle: 'compressed'
        })
    );
}

// Static file routes
app.use(express.static(env.asset_path));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

// To encode req body
app.use(express.urlencoded({extended:false}));



// Initializing the express session
app.use(expressSession({
    secret:env.session_secret,
    saveUninitialized:false,
    resave:false,
    store:store,
    // cookie: {
    //     httpOnly: false,
    // }
}));

// Setting up the flash middleware
app.use(flash());

// Adding flash msg to the locals object if they exist
app.use(flashMdl);

// Initializing the passport js
app.use(passport.initialize());
app.use(passport.session());

// Adding user object to the locals
app.use((req,res,next)=>{
    res.locals.user = req.user;
    next();
});

// Auth route
app.use("/auth",require('./routes/auth'));

// Post route
app.use("/post",require("./routes/post-route"));

// Comment route
app.use("/comment",require("./routes/comment"));

// User route
app.use("/user",require("./routes/user"));

// Like route
app.use("/like",require("./routes/likes"))

// Home page route
app.use(require("./routes/index"));

// Api routes
app.use("/api",require("./routes/api"));

// Auth failure handler
app.use("/fail",(req,res,next)=>{
    res.send("Authentication Failed");
});


