const express = require("express");
const router = express.Router();
const service = require("./serviceRouter");
const order = require("./orderRouter");
const UserController = require("../controllers/UserController");

router.use("/orders", order);
router.use("/services", service);
//register
router.get("/", UserController.registerGet);
router.post("/", UserController.registerPost);
//login

//TODO: MIDDLEWARE

router.get("/login", UserController.loginGet);
router.post("/login", UserController.loginPost);

// router.use("/services", service);
// router.use("/orders", order);

module.exports = router;
