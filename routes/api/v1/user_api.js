const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const env = require("../../../config/environment");

router.post("/create-session",createSession = (req,res)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(200).json({
                user:{},
                message:"User doesn't exist"
            })
        }
        // if(user.password != req.body.password){
        //     return res.status(402).json({
        //         user:{},
        //         message:"Password Mismatch"
        //     })
        // }

        return res.status(200).json({
            token:jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn: "1000000"}),
            message:"Authentication successfull"
        })
    })
});

module.exports = router;







