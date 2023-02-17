const User = require("../models/user");
const Post = require("../models/post");
const Friends = require("../models/friends");
const Message = require("../models/messages");

const path = require("path");


exports.getProfile = async (req,res,next)=>{
    // console.log(req.params);

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
        .then(async (posts)=>{
            // console.log(user);
            const combinedChatId = [user._id.toString(),req.user._id.toString()].sort().join("");

            let messages = await Message.findOne({
                combineUserId:combinedChatId
            })

            if(!messages){
                messages = {
                    messages:[]
                }
            }

            res.render(path.join(__dirname,"..","views","user-profile"),{profile_user:user,posts,messages:messages.messages});
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

exports.addFriend = async (req,res)=>{
    
    const requesterId = req.user._id;
    const recipientId = req.params.userId;
    console.log(requesterId,recipientId);
    
    let friendRequest = await Friends.findOne({
        requester:requesterId,
        recipient:recipientId
    })
    console.log(friendRequest);
    if(friendRequest){
        return res.status(400).json({
            message:"Friend Already Exist"
        })
    }
    else{
        friendRequest = new Friends({
            requester:requesterId,
            recipient:recipientId,
            status:"ACCEPTED"
        });
        console.log("New Friend Request",friendRequest);
        const senderUser = await User.findById(requesterId);
        const recipientUser = await User.findById(recipientId);
        senderUser.friends.push(recipientUser);
        recipientUser.friends.push(senderUser);
        senderUser.save();
        recipientUser.save();
        await friendRequest.save();
        return res.status(200).json({
            message:"Friend Added",
            request:friendRequest
        })
    }
}