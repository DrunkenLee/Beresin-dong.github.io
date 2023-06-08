"use strict";
const bcrypt = require("bcryptjs");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserDetail);
      User.hasMany(models.Order, { as: "Customer", foreignKey: "CustomerId" });
      User.hasMany(models.Order, { as: "Vendor", foreignKey: "VendorId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.addHook("beforeCreate", (user, options) => {
    var salt = bcrypt.genSaltSync(13);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  });

  return User;
};
