const Posts = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.getPosts = (req,res)=>{
    console.log("here");
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
    .then(result=>{
        res.status(200).json({
            "data":{
                posts:result
            },
            "message":"All posts with comment"
        })
    })
    .catch(err=>{
        console.log(err);
        res.json({
            "message":"Error in getting all posts"
        })
    })
}

module.exports.deletePost = (req,res)=>{
    console.log("Here in post delete controller");
    Posts.findById(req.params.postId)
    .then(post=>{
        if(post.user.toString() == req.user._id.toString()){
            post.remove();
            Comment.deleteMany({post:post._id})
            .then(deleted=>{
                return res.status(200).json({postId:req.params.postId,"message":"Post Deleted"});
            })
            .catch(err=>{
                console.log(err);
                return res.status(302).json({postId:req.params.postId,"message":"Unable To Delete Post Comments"});
            })
        } else {
            return res.status(402).json({
                message:"Unauthorized access to delete the post"
            })
        }
    })
    .catch(err=>{
        console.log(err);
            return res.status(302).json({postId:req.params.postId,"message":"Unable To Delete Post"});
    })
}