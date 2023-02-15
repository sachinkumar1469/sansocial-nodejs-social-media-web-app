const router = require("express").Router();
const likeCont = require("../controller/like-controller");
router.get("/toggle",likeCont.toggleLike)

module.exports = router;