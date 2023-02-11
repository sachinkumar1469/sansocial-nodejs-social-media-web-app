const router = require('express').Router();

const {create,deleteComment} = require("../controller/comment-contoller");

router.post("/create",create);

router.get("/delete/:commentId",deleteComment)


module.exports = router;