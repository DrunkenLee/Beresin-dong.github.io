const { Service, User, Order, UserDetail, OrderService} = require("../models");

class OrderController {
  static filterGetOrder(options, req, res) {
    Order.findAll({
      where: {
        options,
      },
      include: {
        model: User,
        as: "Customer",
        include: { model: UserDetail },
      },
    });
  }

  static getAllOrders(req, res) {
    let { SessionRole, SessionUserId } = req.session;
    let { search, sort } = req.query;
    if (SessionRole == "vendor") {
      let error = "";
      Order.findAll({
        where: {
          VendorId: SessionUserId,
        },
        include: {
          model: User,
          as: "Customer",
          include: { model: UserDetail },
        },
      })
        .then((result) => {
          console.log(result);
          let error = "";
          res.render("vendor-orders", { result, error });
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    } else {
      Order.findAll({
        where: {
          CustomerId: SessionUserId,
        },
        include: {
          model: User,
          as: "Customer",
          include: { model: UserDetail },
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
    let orderServicesData = [];

    console.log(req.body);

    if (!Array.isArray(req.body.services)) {
      let output = req.body.services.split("|")[1];
      totalPrice = output * 1;

      let ServiceId = req.body.services.split("|")[0];
      let newData = {OrderId: 0, ServiceId};
      orderServicesData.push(newData);

    } else {
      const output = req.body.services.map((service) => service.split("|")[1]);
      for (let i in output) {
        totalPrice += output[i] * 1;
      }

      const ServiceIds = req.body.services.map((service) => service.split("|")[0]);
      for (let ServiceId of ServiceIds) {
        let newData = {OrderId: 0, ServiceId};
        orderServicesData.push(newData);
      }
    }

    console.log(orderServicesData);

    let data;
    let result;
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
      .then((order) => {
        result = order;
        orderServicesData.forEach(e => {
          e.OrderId = order.id
        })
        console.log(orderServicesData, "<<< ini orderServicedata");
        return OrderService.bulkCreate(orderServicesData)
      })
      .then(() => {
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
        include: Service
      })
      .then((data) => {
        targetOrder = data;
        return Service.findAll()    
      })
      .then((services) => {
        res.render('form-edit-orders.ejs', {targetOrder, services, error});
        // res.send([targetOrder, services])
      })
      .catch((err) => {
        console.log(err)
        res.send(err)
      })

  }

  static postUpdateOrder(req, res) {
    const CustomerId = req.session.SessionUserId;
    const { description } = req.body;
    let totalPrice = 0;
    let orderServicesData = []

    if (!Array.isArray(req.body.services)) {
      let output = req.body.services.split("|")[1];
      totalPrice = output * 1;

      let ServiceId = req.body.services.split("|")[0];
      let newData = {OrderId: req.params.id, ServiceId};
      orderServicesData.push(newData);

    } else {
      const output = req.body.services.map((service) => service.split("|")[1]);
      for (let i in output) {
        totalPrice += output[i] * 1;
      }

      const ServiceIds = req.body.services.map((service) => service.split("|")[0]);
      for (let ServiceId of ServiceIds) {
        let newData = {OrderId: req.params.id, ServiceId};
        orderServicesData.push(newData);
      }
    }

    Order
      .update({
        description,
        totalPrice,
      }, {
        where: {
          id: req.params.id
        }
      })
      .then((result) => {
        return OrderService.destroy({where: {OrderId: req.params.id}})
      })
      .then(() => {
        return OrderService.bulkCreate(orderServicesData);
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });

  }
}

module.exports = OrderController;
