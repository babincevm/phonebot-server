class UserFilter {

  /**
   * Фильтр для роута логина
   * @param req
   * @param res
   * @param next
   * @return {*}
   */
  login(req, res, next) {
    req.body = {
      login: req.body.login,
      password: req.body.password,
      email: req.body.email,
    };

    return next();
  }


}


module.exports = new UserFilter();
