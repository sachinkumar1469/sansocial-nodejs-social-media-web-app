const Likes = require("../models/likes");
const Post = require("../models/post");
const Comment = require("../models/comment");


module.exports.toggleLike = async function(req,res){
    console.log("Here",req.query);
    try{
        let likeable;
        let removeLike = false;
        if(req.query.type === "post"){
            likeable = await Post.findById(req.query.id);
        } else {
            likeable = await Comment.findById(req.query.id);
        };

        let like = await Likes.findOne({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
        })

        if(like){
            removeLike = true;
            likeable.likes.pull(like._id);
            likeable.save();
            await like.remove();
        }else {
            like = await Likes.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(like._id);
            likeable.save();

        }

        return res.json({
            removeLike,
            like:like,
            likeCount:likeable.likes.length,
            message:"Hello"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}