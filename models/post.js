const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
        default:"",
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:"comment"
        }
    ],
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"likes"
    }]
},{
    timestamps:true
});

const Post = mongoose.model("post",postSchema);
module.exports = Post;