const Post = require("../models/post");
const Comment = require("../models/comment");

const {newComment} = require("../mailers/comment-mailer");

const emailWorker = require("../worker/email-worker");
const queue = require("../config/kue");

exports.create = (req,res,next)=>{
    // console.log(req.body);
    // req.flash("success","Comment Added");
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
                createdComment.user = req.user;
                // newComment(createdComment);
                let job = queue.create("email",createdComment).save((err)=>{
                    if(err){
                        console.log("Creating queue err");
                    }
                    console.log("JOb id",job.id);
                })
                post.save();
                if(req.xhr){
                    return res.status(200).json({
                        comment:createdComment,
                        user:req.user,
                        message:"Comment Added"
                    })
                }
                res.redirect("back");
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
    req.flash("warning","Comment Deleted")
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