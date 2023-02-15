const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const likeSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    likeable:{
        type:Schema.Types.ObjectId,
        refPath:"onModel"
    },
    onModel:{
        type:Schema.Types.String,
        enum:["post","comment"]
    }
},{
    timestamps:true
});

const Like = mongoose.model("likes",likeSchema);

module.exports = Like;