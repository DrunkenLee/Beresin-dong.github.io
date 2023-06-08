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
    const error = `Vendor tidak dapat mengakses fitur milik customer`; 
    res.render("vendor-orders", { error });
  }
};

//TODO: ROUTES

router.get("/", OrderController.getAllOrders);

router.get("/add", cekRole, OrderController.getAddOrders);
router.post("/add", OrderController.postAddOrders);

router.get("/delete/:id", cekRole, OrderController.deleteOrder);

router.get("/update/:id", cekRole, OrderController.getUpdateOrder);
router.post("/update/:id", cekRole, OrderController.postUpdateOrder);


module.exports = router;
