const router = require("express").Router();

//TODO: MIDDLEWARES
const mdTest = function (req, res, next) {
  console.log("Request Type:", req.method);
  next();
};

//TODO: ROUTES

module.exports = router;
