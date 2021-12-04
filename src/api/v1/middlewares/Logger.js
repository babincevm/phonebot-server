class Logger {
  constructor() {}

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {CallableFunction} next
   */
  bodyLog(req, res, next) {
    console.groupCollapsed(new Date());
    console.log(`
    url: ${req.url}
    headers: ${req.rawHeaders}
    method: ${req.method}`);
    console.log('body:');
    console.log(req.body);
    console.groupEnd();
    return next();
  }
}


module.exports = new Logger();
