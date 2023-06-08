const OrderController = require("../controllers/OrderController");
const router = require("express").Router();

//TODO: MIDDLEWARES
router.use((req, res, next) => {
  let { SessionUsername, SessionUserId } = req.session;
  if (SessionUserId) {
    next();
  } else {
    const error = `Kamu Belum Login, Login Dulu gasih ??`;
    res.render("user-login-form", { error });
  }
});

const cekRole = function (req, res, next) {
  if (req.session.SessionRole == "customer") {
    next();
  } else {
    const error = `Kamu Tidak Bisa Membuat Order`;
    res.render("vendor-orders", { error });
  }
};

//TODO: ROUTES

router.get("/", OrderController.getAllOrders);
router.get("/add", cekRole, OrderController.getAddOrders);
router.post("/add", OrderController.postAddOrders);

module.exports = router;
