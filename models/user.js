const mongoose = require('mongoose');

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
    }
});

const User = mongoose.model("user",userSchema);

module.exports = User;
