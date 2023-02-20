const credentials = require("../client_secret.json");
const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log', {
    interval: '1d',
    path: logDirectory
});


const development = {
    name : "development",
    asset_path : "./public",
    session_secret : "MySecretKey",
    db_name : "sansocial",
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'ny72161100@gmail.com',
          clientId: credentials.web.client_id,
          clientSecret: credentials.web.client_secret,
          refreshToken: credentials.web.REFRESH_TOKEN,
          accessToken: credentials.web.ACCESS_TOKEN
        }
    },
    authClientId:"861353967699-kio538nlg8mve7pursnk53h84h99o118.apps.googleusercontent.com",
    authClientSecret:"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",
    authCallbackURL:"http://localhost:8000/auth/google/redirect",
    jwt_secret:"mysecretkey",
    morgan: {
      mode: 'dev',
      options: {stream: accessLogStream}
  }
}

const production = {
    name : "production",
    asset_path : "./public/hashed",
    session_secret : process.env.social_session_secret,
    db_name : "sansocial",
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'ny72161100@gmail.com',
          clientId: credentials.web.client_id,
          clientSecret: credentials.web.client_secret,
          refreshToken: credentials.web.REFRESH_TOKEN,
          accessToken: credentials.web.ACCESS_TOKEN
        }
    },
    authClientId:process.env.social_client_id,
    authClientSecret:process.env.social_client_secret,
    authCallbackURL:"http://localhost:8000/auth/google/redirect",
    jwt_secret:"mysecretkey",
    morgan: {
      mode: 'combined',
      options: {stream: accessLogStream}
  }
}

module.exports = production;