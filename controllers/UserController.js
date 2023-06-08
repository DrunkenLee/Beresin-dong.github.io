const { User } = require("../models");
const bcrypt = require("bcryptjs");

class UserController {
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
            req.session.SessionUsername = user.username; //set session username
            return res.redirect("/orders");
          }
          throw "login gagal, username atau password tidak ditemukan";
        } else {
          console.log(err);
          res.send(err);
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}

module.exports = UserController;
