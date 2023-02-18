const nodemailer = require("../config/nodemailer");

exports.newComment = (comment)=>{
    // console.log("Inside new comment mailer",comment);
    nodemailer.transporter.sendMail({
            from:"ny72161100@gmail.com",
            to:comment.user.email,
            subject:"New Comment",
            html:`<h1>You'r Comment is Published</h1>`
    
        },(err,info)=>{
            if(err){console.log("ERror in sending mail",err); return;}
            console.log("Message Sent",info)
        })
    
}