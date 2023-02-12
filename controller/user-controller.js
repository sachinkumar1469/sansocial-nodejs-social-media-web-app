const User = require("../models/user");
const Post = require("../models/post");

const path = require("path");


exports.getProfile = (req,res,next)=>{
    console.log(req.params);

    User.findOne({username:req.params.username})
    .then(user=>{
        Post.find({user:user._id})
        .populate("user")
        .sort({
            createdAt:-1
        })
        .populate({
            path:"comments",
            model:"comment",
            options:{
                sort:{
                    createdAt:-1
                }
            },
            populate:{
                path:"user",
                model:"user"
            }
        })
        .then(posts=>{
            res.render(path.join(__dirname,"..","views","user-profile"),{profile_user:user,posts});
        })
        .catch(err=>{
            next(err);
            res.redirect("back");
        })
    })
    .catch(err=>{
        next(err);
        res.redirect("back");
    })
}