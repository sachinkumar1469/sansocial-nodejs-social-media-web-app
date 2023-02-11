const router = require('express').Router();
const {createPost,deletePost} = require("../controller/post-controller");

const passport = require("../config/passport");

router.post("/create",passport.checkAuthentication,createPost);

router.get("/delete/:postId",passport.checkAuthentication,deletePost);

module.exports = router;