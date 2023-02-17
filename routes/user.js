const router = require("express").Router();
const {getProfile,addFriend} = require("../controller/user-controller");

router.get("/profile/:username",getProfile);

router.get("/friend/add/:userId",addFriend)


module.exports = router;