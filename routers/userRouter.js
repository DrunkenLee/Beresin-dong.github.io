const router = require("express").Router();
const UserController = require("../controllers/UserController");
//

router.get("/", UserController.registerGet);
router.get("/login", UserController.loginGet);

module.exports = router;
