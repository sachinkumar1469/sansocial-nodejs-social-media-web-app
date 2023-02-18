const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");

// const {google} = require("googleapis");
// const {OAuth2Client} = require("google-auth-library");

// const credentials = require("../client_secret.json");

// const oAuth2Client = new OAuth2Client(
//     credentials.web.client_id,
//     credentials.web.client_secret,
//     credentials.web.redirect_uris[0]
// );

const transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data,relativePath)=>{
    let mailHtml;
    ejs.renderFile(path.join(__dirname,"..","views","mailer",relativePath),
    data,
    (err,template)=>{
        if(err){console.log("Error in rendering email template"); return;}
        mailHtml = template;
    })

    return mailHtml;
}

module.exports = {
    transporter,
    renderTemplate
}