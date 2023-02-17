const mongoose = require('mongoose');
const path = require("path");
const multer = require("multer");
const AVATAR_PATH = path.join("uploads","user","avatar");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:String,
    strategy:{
        type:String,
        enum:["LOCAL","GOOGLE"]
    },
    avatar:String,
    friends:[
        {
            type:Schema.Types.ObjectId,
            ref:"friends"
        }
    ]
});

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"..",AVATAR_PATH))
    },
    filename:function(req,file,cb){

        cb(null,file.fieldname+"-"+Date.now());
    }
});

userSchema.statics.uploadAvatar = multer({storage:storage}).single("avatar");
userSchema.statics.AVATAR_PATH = AVATAR_PATH;

const User = mongoose.model("user",userSchema);

module.exports = User;
