const {User} = require("../models");
const bcrypt = require("bcryptjs");

class UserController {
  static registerGet(req, res) {
    res.render("user-register-form");
  }

  static registerPost(req, res) {
    const {username, password, role} = req.body;

    
    User
      .create({username, password, role})
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        res.send(err);
      })
  }

  static loginGet(req, res) {
    res.render("user-login-form");
  }

  static loginPost(req, res) {
    const {username, password} = req.body;

    User
      .findOne({where: {username}})
      .then((user) => {
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password);

          if (isValidPassword) {
            return res.send('login sukses');
          }
          throw 'login gagal';
          // const error = "Invalid password"
          // return res.redirect("/login?error=${error}")
        } else {
          throw 'username tidak ditemukan';
          // const error = "Invalid username"
          // return res.redirect("/login?error=${error}")
        }
      })
      .catch((err) => {
        res.send(err);
      })
  }
}

module.exports = UserController;
