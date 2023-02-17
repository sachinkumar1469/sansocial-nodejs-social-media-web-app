const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    combineUserId:{
        type:String
    },
    messages:[
        {
            from:{
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            to:{
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            message:{
                type:Schema.Types.String
            }
        }
    ]
},{
    timestamps:true
});

const Message = mongoose.model("message",msgSchema);
module.exports = Message;