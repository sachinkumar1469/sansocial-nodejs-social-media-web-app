const router = require("express").Router();
const path = require("path");
const Posts = require("../models/post");
const User = require("../models/user");
const passport = require("../config/passport");


router.get("/",passport.checkAuthentication,(req,res,next)=>{
    // console.log(req.user);
    const message = [];
    console.log(res.locals);
    Posts.find({})
    .populate("user")
    .sort({
        createdAt:-1
    })
    .populate({
        path:"comments",
        model:"comment",
        populate:{
            path:"user",
            model:"user"
        },
        options:{
            sort:{
                createdAt:-1
            }
        }
    })
    .then(posts=>{
        // console.log(posts[0].comments);
        User.find({
            _id:{
                $ne:req.user._id
            }
        })
        .then(users=>{
            // console.log(users);
            res.render(path.join(require.main.filename,"..","views","home"),{posts,users,message});
        })
        .catch(err=>{
            next(err);
            res.redirect("back")
        })
    })
    .catch(err=>{
        console.log(err.toString());
    })
});

module.exports = router;