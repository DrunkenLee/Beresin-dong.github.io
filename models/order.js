"use strict";
const QRCode = require("qrcode");
var bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
const { formatRupiah, formatDate } = require("../helpers/formatter");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        as: "Customer",
        foreignKey: "CustomerId",
      });
      Order.belongsTo(models.User, { as: "Vendor", foreignKey: "CustomerId" });
      Order.belongsToMany(models.Service, { through: models.OrderService });
    }

    get formattedDate() {
      return formatDate(this.updatedAt);
    }

    get formattedRupiah() {
      return formatRupiah(this.totalPrice);
    }
  }
  Order.init(
    {
      CustomerId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      totalPrice: DataTypes.INTEGER,
      status: DataTypes.STRING,
      VendorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  Order.addHook("beforeCreate", (order, options) => {
    order.status = "Pending";
    order.VendorId = 2;
  });

  return Order;
};
