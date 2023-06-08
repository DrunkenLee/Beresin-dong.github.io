class OrderController {
  //

  static getAllOrders(req, res) {
    let { SessionRole } = req.session;
    if (SessionRole == "vendor") {
      let error = "";
      res.render("vendor-orders", { error });
    } else {
      let error = "";
      res.render("orders", { error });
    }
  }

  static getAddOrders(req, res) {
    let error = "";
    res.render("form-add-orders", { error });
  }
}

module.exports = OrderController;
