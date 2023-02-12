const Post = require("../models/post");
const Comment = require("../models/comment");

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

exports.deletePost = (req,res,next)=>{
    req.flash("warning","Post Deleted!")
    Post.findById(req.params.postId)
    .then(post=>{
        if(post.user.toString() == req.user._id.toString()){
            post.remove();
            Comment.deleteMany({post:post._id})
            .then(deleted=>{
                res.redirect("back");
            })
            .catch(err=>{
                next(err);
            })
        } else {
            console.log("not equal");
            res.redirect("back");
        }
    })
    .catch(err=>{
        next(err);
    })
}