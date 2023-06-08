class UserController {
  //
  //

  static registerGet(req, res) {
    //
    res.render("user-register-form");
  }

  static registerPost(req, res) {
    //
  }

  static loginGet(req, res) {
    //
    res.render("user-login-form");
  }
}

module.exports = UserController;
