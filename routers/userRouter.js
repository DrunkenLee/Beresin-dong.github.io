const router = require("express").Router();
const UserController = require("../controllers/UserController");
//

//TODO: MIDDLEWARES
router.use("/", (req, res, next) => {
  console.log("Request Type:", req.method);
  next();
});

//TODO: ROUTES
router.get("/", UserController.registerGet);
router.get("/login", UserController.loginGet);

module.exports = router;
