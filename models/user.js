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
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username is required"
        },
        notNull: {
          msg: "Username is required"
        },
        len: {
          args: [3, 20],
          msg: "Please make your username between 3 to 20 characters"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required"
        },
        notNull: {
          msg: "Password is required"
        },
        len: {
          args: [3, 28],
          msg: "Please make your password between 3 to 28 characters"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Role is required"
        },
        notNull: {
          msg: "Role is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook("beforeCreate", (user, options) => {
    var salt = bcrypt.genSaltSync(13);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  });

  return User;
};
