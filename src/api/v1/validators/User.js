class UserValidator {

  login({body}, res, next) {
    console.log('body: ', body);
    return next();
  }

}

module.exports = new UserValidator();
