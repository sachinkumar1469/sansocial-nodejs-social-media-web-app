const router = require("express").Router();
const path = require("path");
const Posts = require("../models/post");
const passport = require("../config/passport");

router.get("/",passport.checkAuthentication,(req,res,next)=>{
    // console.log(req.user);
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
        res.render(path.join(require.main.filename,"..","views","home"),{posts});
    })
    .catch(err=>{
        console.log(err.toString());
    })
});

module.exports = router;