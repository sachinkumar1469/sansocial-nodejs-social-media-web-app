const router = require("express").Router();
const path = require("path");
const Posts = require("../models/post");

router.get("/",(req,res,next)=>{
    console.log(req.user);
    Posts.find({})
    .populate("user")
    .sort({
        createdAt:-1
    })
    .then(posts=>{
        console.log(posts);
        res.render(path.join(require.main.filename,"..","views","home"),{posts});
    })
    .catch(err=>{
        console.log(err.toString());
    })
});

module.exports = router;