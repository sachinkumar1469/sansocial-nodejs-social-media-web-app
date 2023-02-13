const path = require("path");

const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("../config/passport");

exports.getSignIn = (req,res,next)=>{
    console.log("In first signin");
    res.render(path.join(__dirname,"..","views","signin"));
};

exports.postSignIn = (req,res,next)=>{
    req.flash("success","Logged In Successfully");
    // req.flash("error","Logged In Succesfully");
    // req.flash("warning","Logged In Succesfully");
    res.redirect("/");
}

exports.postGoogle = (req,res,next)=>{
    // console.log("Here");
    res.redirect("/");
}

exports.getSignup = (req,res,next)=>{
    res.render(path.join(__dirname,"..","views","signup"));
}

exports.postSignup = (req,res,next)=>{
    console.log("here");
    console.log(req.body);
    User.uploadAvatar(req,res,(err)=>{
        
        const {email,name,username,password,confirmPassword} = req.body;
        if(password!==confirmPassword){
            return res.redirect("back");
        }

        // console.log(req.body);
        // console.log(req.file);
        let avatar = path.join(User.AVATAR_PATH,req.file.filename);

        User.findOne({email})
        .then(user=>{
            if(!!user){
                return res.redirect("/auth/signin");
            }
            bcrypt.hash(password,12)
            .then(hashedPassword=>{
                return User.create({
                    email,
                    name,
                    username,
                    password:hashedPassword,
                    avatar,
                    strategy:"LOCAL"
                })
            })
            .then(user=>{
                // console.log(user);
                return res.redirect("/auth/signin");
            })
            .catch(err=>{
                console.log("Unable to hash");
            })
        
        })
        .catch(err=>{
            console.log(err);
            res.redirect("back");
        })
    })

    // console.log(req.body);

    
}

exports.getLogout = (req,res,next)=>{
    req.logout({keepSessionInfo:false},(done)=>{
        res.redirect("/auth/signin");
    })
}

exports.resetPassword = (req,res,next)=>{
    const {password,confirmPassword} = req.body;
    if(password !== confirmPassword){
        return res.redirect("back");
    }
    console.log(req.user);
    if(req.user.strategy!=="GOOGLE"){
        // req.user.pa
        bcrypt.hash(password,12)
            .then(hashedPass=>{
                req.user.password = hashedPass;
                req.user.save()
                .then(result=>{
                    console.log('result',result);
                    res.redirect("back");
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
    } else {
        res.redirect("back");
    }
}