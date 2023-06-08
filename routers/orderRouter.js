const OrderController = require("../controllers/OrderController");

const router = require("express").Router();

//TODO: MIDDLEWARES
const mdTest = function (req, res, next) {
  console.log("Request Type:", req.method);
  next();
};

//TODO: ROUTES

router.get("/", OrderController.getAllOrders);

module.exports = router;
