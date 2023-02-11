const Post = require("../models/post");
const Comment = require("../models/comment");

exports.create = (req,res,next)=>{
    console.log(req.body);
    Post.findById(req.body.post)
    .then(post=>{
        if(!!post){
            console.log(req.user._id);
            Comment.create({
                content:req.body.content,
                post:post._id,
                user:req.user._id
            })
            .then(createdComment=>{
                post.comments.push(createdComment._id);
                return post.save();
            })
            .then(savedPost=>{
                console.log(savedPost.comments);
                return res.redirect("back");
            })
            .catch(err=>{
                console.log(err.toString());
                res.redirect("back");
            })
        } else {
            return res.redirect("back");
        }
    })
    .catch(err=>{
        console.log(err.toString());
        res.redirect("back");
    })
};

exports.deleteComment = (req,res,next)=>{
    // console.log(req.params);
    Comment.findById(req.params.commentId)
    .then(comment=>{
        if(comment.user.toString() === req.user._id.toString()){
            console.log("Equal");
            Post.updateOne({_id:comment.post},{
                $pull:{
                    comments:comment._id
                }
            })
            .then(updatedPost=>{
                comment.remove()
                .then(removedComment=>{
                    res.redirect("back")
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
        } else {
            res.redirect("back");
        }
    })
}