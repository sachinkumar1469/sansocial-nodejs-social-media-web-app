const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"post"
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"likes"
    }]
},{
    timestamps:true
});

const Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;