const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendSchema = new Schema({
    requester:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
    recipient:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    status:{
        type:Schema.Types.String,
        enum:["PENDING","ACCEPTED","REJECTED"]
    }
},{
    timestamps:true
})

const Friends = mongoose.model("friends",friendSchema);

module.exports = Friends;