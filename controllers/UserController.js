const {User} = require("../models");

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
    res.send(req.body)
  }
}

module.exports = UserController;
