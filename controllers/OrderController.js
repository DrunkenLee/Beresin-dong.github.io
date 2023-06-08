const { Service, User, Order, UserDetail, OrderService} = require("../models");

class OrderController {
  //
  static getAllOrders(req, res) {
    let { SessionRole, SessionUserId } = req.session;
    if (SessionRole == "vendor") {
      let error = "";
      Order.findAll({
        where: {
          VendorId: SessionUserId,
        },
      })
        .then((result) => {
          let error = "";
          res.render("vendor-orders", { result, error });
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      Order.findAll({
        where: {
          CustomerId: SessionUserId,
        },
      })
        .then((result) => {
          let error = "";
          res.render("orders", { result, error });
        })
        .catch((err) => {
          console.log(err, SessionUserId);
          res.send(err);
        });
    }
  }

  static getAddOrders(req, res) {
    let error = "";
    Service.findAll()
      .then((data) => {
        let custId = req.session.SessionUserId;
        res.render("form-add-orders", { data, error, custId });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static postAddOrders(req, res) {
    const CustomerId = req.session.SessionUserId;
    const { description } = req.body;
    let totalPrice = 0;

    if (!Array.isArray(req.body.services)) {
      let output = req.body.services.split("|")[1];
      totalPrice = output * 1;
    } else {
      const output = req.body.services.map((service) => service.split("|")[1]);
      for (let i in output) {
        totalPrice += output[i] * 1;
      }
    }

    let data;
    Service.findAll()
      .then((services) => {
        data = services;
        let custId = req.session.SessionUserId;
        return Order.create({
          CustomerId,
          description,
          totalPrice,
        });
      })
      .then((result) => {
        res.render("form-add-orders", { result, data });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static deleteOrder(req, res) {
    OrderService
      .destroy({where: {
        OrderId: req.params.id
        }
      })
      .then(() => {
        return Order.destroy({
          where: {
            id: req.params.id
          }
        })
      })
      .then(() => {
        res.redirect(`/orders`)
      })
      .catch((err) => {
        res.send(err);
      })
  }

  static getUpdateOrder(req, res) {
    let targetOrder;
    let error = "";

    Order
      .findByPk(req.params.id, {
        include: OrderService
      })
      .then((data) => {
        targetOrder = data;
        return Service.findAll()    
      })
      .then((services) => {
        // res.render('form-edit-orders.ejs', {targetOrder, services, error});
        res.send([targetOrder, services])
      })
      .catch((err) => {
        console.log(err)
        res.send(err)
      })

  }

  static postUpdateOrder(req, res) {}
}

module.exports = OrderController;
