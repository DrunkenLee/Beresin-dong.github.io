const express = require("express");
const router = express.Router();
const service = require("./serviceRouter");
const order = require("./orderRouter");
const UserController = require("../controllers/UserController");

router.use("/orders", order);
router.use("/services", service);
//register
router.get("/", UserController.home);
router.get("/register", UserController.registerGet);
router.post("/register", UserController.registerPost);
//login

//TODO: MIDDLEWARE

router.get("/login", UserController.loginGet);
router.post("/login", UserController.loginPost);
router.get("/logout", UserController.logout);

// router.use("/services", service);
// router.use("/orders", order);

module.exports = router;
