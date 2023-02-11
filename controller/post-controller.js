const Post = require("../models/post");

exports.createPost = (req,res,next)=>{
    console.log(req.body);
    Post.create({...req.body,user:req.user._id})
    .then(result=>{
        console.log(result);
        res.redirect("back");
    })
    .catch(err=>{
        console.log(err);
    })
}