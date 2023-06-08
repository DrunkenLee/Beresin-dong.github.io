const OrderController = require("../controllers/OrderController");

const router = require("express").Router();

//TODO: MIDDLEWARES
const mdTest = function (req, res, next) {
  let { SessionUsername, SessionUserId } = req.session;
  if (SessionUserId) {
    next();
  } else {
    const error = `Kamu Belum Login, Login Dulu gasih ??`;
    res.render("user-login-form", { error });
  }
};

//TODO: ROUTES

router.get("/", mdTest, OrderController.getAllOrders);

module.exports = router;
