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
    }
},{
    timestamps:true
});

const Post = mongoose.model("Post",postSchema);
module.exports = Post;