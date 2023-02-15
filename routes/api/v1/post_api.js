const router = require("express").Router();
const post_api_cont = require("../../../controller/api/v1/post_api");

const passport = require("passport")

router.get("/",post_api_cont.getPosts);

router.delete("/:postId",(req,res,next)=>{console.log("In delete post");next()},passport.authenticate("jwt",{session:false}),post_api_cont.deletePost)

module.exports = router;