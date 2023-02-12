const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createPost = (req,res,next)=>{
    // console.log(req.cookies);
    // console.log(req.user);
    

    Post.create({...req.body,user:req.user._id})
    .then(result=>{
        // console.log(result);

        if(req.xhr){
            console.log(req.xhr);
            return res.json({
                "post":result,
                "user":req.user,
                message:"Post Created"
            });
        }
        
        res.redirect("back");
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.deletePost = (req,res,next)=>{
    // req.flash("warning","Post Deleted!")
    Post.findById(req.params.postId)
    .then(post=>{
        if(post.user.toString() == req.user._id.toString()){
            post.remove();
            Comment.deleteMany({post:post._id})
            .then(deleted=>{
                if(req.xhr){
                    return res.status(200).json({postId:req.params.postId,"message":"Post Deleted"});
                }
                res.redirect("back");
            })
            .catch(err=>{
                if(req.xhr){
                    return res.status(302).json({postId:req.params.postId,"message":"Unable To Delete"});
                }
                next(err);
            })
        } else {
            console.log("not equal");
            if(req.xhr){
                return res.status(302).json({postId:req.params.postId,"message":"Unable To Delete"});
            }
            res.redirect("back");
        }
    })
    .catch(err=>{
        if(req.xhr){
            return res.status(302).json({postId:req.params.postId,"message":"Unable To Delete"});
        }
        next(err);
    })
}