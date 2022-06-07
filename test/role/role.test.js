const {
  testHelpers: {Request, Validate},
  functions: {getRandomString, deepLog},
} = require('../../src/api/v1/helpers/');

const {describe, it, before, after} = require('mocha');
const request = new Request({url: '/role'});
const validate = new Validate();

let role = {
  title: 'test',
  access: {
    User: {
      create: true,
      read: {
        nested: {
          account_data: true,
        }
      },
      update: false,
      delete: false,
    }
  }
};
describe('Role', function() {
  describe('Admin', function() {
    it('Should create new role', function(done) {
      request.post({
        data: role
      }).then(({status, data}) => {
        console.log('status: ', status);
        console.log('data: ', data);
        return done();
      }).catch(e => done(e));
    });
  });
});
