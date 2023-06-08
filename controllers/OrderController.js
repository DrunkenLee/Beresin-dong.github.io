const { Service, User, Order, UserDetail } = require("../models");
const { Op, where } = require("sequelize");
const QRCode = require("qrcode");
class OrderController {
  static getAllOrders(req, res) {
    let error = "";
    let { SessionRole, SessionUserId } = req.session;
    var options = {
      include: {
        model: User,
        as: "Customer",
        include: { model: UserDetail },
      },
      where: {},
    };

    if (SessionRole == "vendor") {
      if (req.query.search) {
        let options = {
          include: {
            model: User,
            as: "Customer",
            include: { model: UserDetail },
          },
          where: {
            [Op.and]: [
              { VendorId: SessionUserId },
              {
                description: {
                  [Op.iLike]: `%${req.query.search}%`,
                },
              },
            ],
          },
        };

        Order.findAll(options)
          .then((result) => {
            res.render("vendor-orders", { result, error });
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        Order.findAll({
          where: { VendorId: SessionUserId },
          include: {
            model: User,
            as: "Customer",
            include: { model: UserDetail },
          },
        })
          .then((result) => {
            let error = "";
            res.render("vendor-orders", { result, error });
          })
          .catch((err) => {
            res.send(err);
          });
      }
    } else {
      if (req.query.search) {
        let options = {
          include: {
            model: User,
            as: "Customer",
            include: { model: UserDetail },
          },
          where: {
            [Op.and]: [
              { CustomerId: SessionUserId },
              {
                description: {
                  [Op.iLike]: `%${req.query.search}%`,
                },
              },
            ],
          },
        };
        Order.findAll(options)
          .then((result) => {
            let error = "";
            res.render("orders", { result, error });
          })
          .catch((err) => {
            console.log(err, SessionUserId);
            res.send(err);
          });
      } else {
        Order.findAll({ where: { CustomerId: SessionUserId } })
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
  }

  static getAddOrders(req, res) {
    let error = "";
    Service.findAll()
      .then((data) => {
        let custId = req.session.SessionUserId;
        let resQr = "";
        res.render("form-add-orders", { data, error, custId, resQr });
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
        QRCode.toDataURL("asdasd", (err, resQr) => {
          res.render("form-add-orders", { result, data, resQr });
        });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}

module.exports = OrderController;
