const passport = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const env = require("./environment");

const User = require("../models/user");

// console.log("Executing Passport.js");

const options = {
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey:"mysecretkey"
}

passport.use(new JWTStrategy({
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:env.jwt_secret,
},function(payload,done){
    console.log("In passport jwt strategy")
    User.findById(payload._id)
    .then(user=>{
        // console.log("In payload",payload)
        if(!user){
           return done(null,false);
        }
        done(null,user);
    })
    .catch(err=>{
        done(err);
    })
}))

passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
},(req,username,password,done)=>{
    let user = null;
    User.findOne({email:username})
        .then(result=>{
            user = result;
            if(!!!user){
                req.flash("error","User Doesn't Exist")
                return done(null,false);
            }
            return bcrypt.compare(password,user.password); 
        })
        .then(isPasswordMatched=>{
            if(typeof isPasswordMatched != "boolean"){
                return null;
            }
            if(!isPasswordMatched){
                req.flash("warning","Password Mismatch")
                return done(null,false);
            }
            return done(null,user);
        })
        .catch(err=>{
            console.log(err);
            req.flash("error","Internal Server Error");
            return done(err);
        })
}));



passport.use(new GoogleStrategy({
    clientID:env.authClientId,
    clientSecret:env.authClientSecret,
    callbackURL:env.authCallbackURL,
},(accessToken,refreshToken,profile,done)=>{
    const {name,email} = profile._json;
    User.findOne({email})
        .then(user=>{
            if(user){
                return done(null,user);
            }
            User.create({
                email,
                strategy:"GOOGLE"
            })
            .then(newUser=>{
                // console.log(newUser);
                done(null,newUser);
            })
            .catch(err=>{
                console.log(err);
                done(err);
            })
        }) 
        .catch(err=>{
            console.log(err);
            done(err);
        })
    // console.log("Profile of user",profile._json,"\n\n\n");
}))

passport.serializeUser((user,done)=>{
    // console.log("In serializeUser");
    // console.log(user);
    // console.log("____________");
    done(null,user._id);
})

passport.deserializeUser((userId,done)=>{
    // console.log("In deserialized user");
    User.findById(userId)
        .then(user=>{
            if(!user){
                done(null,false);
            }
            done(null,user);
        })
        .catch(err=>{
            done(err);
        })
});

passport.checkAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/auth/signin");
    }
}

module.exports = passport;