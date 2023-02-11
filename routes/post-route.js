const router = require('express').Router();
const {createPost} = require("../controller/post-controller");

router.post("/create",createPost);

module.exports = router;