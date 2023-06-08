const { User, UserDetail } = require("../models");
const bcrypt = require("bcryptjs");

class UserController {
  static home(req, res) {
    let error = "";
    res.render("home", { error });
  }

  static logout(req, res) {
    req.session.destroy(function (err) {
      // cannot access session here
      if (err) req.send(err);
      res.redirect("/");
    });
  }

  static registerGet(req, res) {
    res.render("user-register-form");
  }

  static registerPost(req, res) {
    const { username, password, role } = req.body;

    User.create({ username, password, role })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static loginGet(req, res) {
    let error = "";
    res.render("user-login-form", { error });
  }

  static loginPost(req, res) {
    const { username, password } = req.body;

    User.findOne({ where: { username } })
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);
          if (isValidPassword) {
            req.session.SessionUserId = user.id; //set session id
            req.session.SessionRole = user.role; //set session role privilages
            return res.redirect("/orders");
          }
          throw "login gagal, username atau password tidak ditemukan";
        } else {
          res.send(err);
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
}

module.exports = UserController;
