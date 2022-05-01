class Server {
  constructor() {}

  init(app, port, host='localhost', protocol='http') {
    console.group('Server');
    try {
      console.log('Trying to create listening');
      app.listen(port);
      console.log(`Server link: ${protocol}://${host}:${port}/`);
    } catch (err) {
      console.log(`Error while starting listening: ${err}`);
      process.exit(1);
    } finally {
      console.groupEnd();
    }
  }
}


module.exports = Server;
