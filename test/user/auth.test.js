const {
  testHelpers: {Request, Validate},
  functions: {getRandomString, deepLog},
} = require('../../src/api/v1/helpers/');
const {describe, it, beforeEach, afterEach} = require('mocha');

const request = new Request({url: '/user'});
const validate = new Validate();

let correctUserData = {
  account_data: {
    email: `${getRandomString(3)}@${getRandomString(4)}.com`,
    login: getRandomString(),
    password: getRandomString(),
  },
  user_data: {
    name: 'Test',
    test: 'Test',
  },
};
describe('User unit', function() {
  this.timeout(10000);
  describe('Authentications', function() {
    function getHeaders(token) {
      let headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return {
        headers,
      };
    }

    function removeUser(token) {
      return new Promise(((resolve, reject) => {
        if (this.token === null) return resolve({skip: true});
        request.delete({
          url: '/',
          ...getHeaders(token),
        }).then(data => resolve(data)).catch(e => reject(e));
      }));
    }

    function registerUser(userData) {
      return new Promise((resolve, reject) => {
        request.post(
          {url: '/register/', data: userData}).
          then(data => resolve(data)).
          catch(e => reject(e));
      });
    }

    function loginUser(userData) {
      return new Promise(((resolve, reject) => {
        request.post({
          url: '/login/',
          data: userData,
        }).then(data => resolve(data)).catch(e => reject(e));
      }));
    }

    function fetchProfile(token) {
      return new Promise(((resolve, reject) => {
        request.get({
          url: '/profile/',
          ...getHeaders(token),
        }).then(data => resolve(data)).catch(e => reject(e));
      }));

    }

    afterEach(function(done) {
      removeUser(this.token).then(
        ({status, data, skip}) => {
          if (skip) return done();
          validate.correct(status, data);
          this.token = null;
          return done();
        }).catch(e => done(e));
    });

    beforeEach(function(done) {
      registerUser(correctUserData).then(
        ({status, data}) => {
          deepLog(data, 'user');
          validate.correct(status, data);
          validate.token(data);
          this.token = data.result.token;
          return done();
        }).catch(e => done(e));
    });

    it('Should not register due to not unique login', function(done) {
      registerUser({
        account_data: {
          login: correctUserData.account_data.login,
          password: correctUserData.account_data.password,
        },
      }).then(
        ({status, data}) => {
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'already in use');
          return done();
        }).catch(e => done(e));
    });

    it('Should not register due to not unique email', function(done) {
      registerUser({
        account_data: {
          login: getRandomString(),
          password: correctUserData.account_data.password,
          email: correctUserData.account_data.email,
        },
      }).then(
        ({status, data}) => {
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'already in use');
          return done();
        }).catch(e => done(e));
    });

    it('Should authenticate user by login', function(done) {
      loginUser({
        login: correctUserData.account_data.login,
        password: correctUserData.account_data.password,
      }).then(({status, data}) => {
        validate.correct(status, data);
        validate.token(data);
        this.token = data.result.token;
        return done();
      }).catch(e => done(e));
    });

    it('Should authenticate user by email', function(done) {
      loginUser({
        login: correctUserData.account_data.email,
        password: correctUserData.account_data.password,
      }).then(({status, data}) => {
        validate.correct(status, data);
        validate.token(data);
        this.token = data.result.token;
        return done();
      }).catch(e => done(e));
    });

    it('Should not login due to invalid login', function(done) {
      loginUser({
        login: 'Not existing login',
        password: correctUserData.account_data.password,
        test: 'test',
      }).
        then(({status, data}) => {
          validate.status(status, 404);
          validate.incorrect(data);
          validate.message(data, 'not found');
          return done();
        }).
        catch(e => done(e));
    });

    it('Should not login due to invalid email', function(done) {
      loginUser({
        login: 'not-existing-email@email.com',
        password: correctUserData.account_data.password,
      }).
        then(({status, data}) => {
          validate.status(status, 404);
          validate.incorrect(data);
          validate.message(data, 'not found');
          return done();
        }).
        catch(e => done(e));
    });

    it('Should not login due to invalid password', function(done) {
      loginUser({
        login: correctUserData.account_data.login,
        password: 'Invalid password',
      }).
        then(({status, data}) => {
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'Invalid password');
          return done();
        }).
        catch(e => done(e));
    });

    it('Should not register due to absence of login', function(done) {
      registerUser({
        account_data: {
          password: correctUserData.account_data.password,
        },
      }).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, 'Path `login` is required');
        return done();
      }).catch(e => done(e));
    });

    it('Should not register due to absence of password', function(done) {
      registerUser({
        account_data: {
          login: correctUserData.account_data.login,
        },
      }).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, 'Path `password` is required');
        return done();
      }).catch(e => done(e));
    });

    it('Should not register due to absence of login and password',
      function(done) {
        registerUser({
          account_data: {},
        }).then(({status, data}) => {
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'Path `login` is required');
          return done();
        }).catch(e => done(e));
      });

    it('Should not register due to absence of account_data', function(done) {
      registerUser({}).then(({status, data}) => {
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, 'Path `account_data` is required');
        return done();
      }).catch(e => done(e));
    });

    it('Should not remove user due to absence of token', function(done) {
      removeUser(null).then(({status, data}) => {
        validate.unauthorized(status, data);
        return done();
      }).catch(e => done(e));
    });

    it('Should not return profile due to invalid token', function(done) {
      loginUser({
        login: correctUserData.account_data.login,
        password: correctUserData.account_data.password,
      }).then(
        ({status, data}) => {
          validate.correct(status, data);
          validate.token(data);
          fetchProfile(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzY4MDQxODcsImV4cCI6MTYzNjgwNDE5NywiYXVkIjoiNjE4ZmE2NWE5NzBkZDgwNWY3M2Q4MTM5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCJ9.R2dE6Obuktu2H20I4AQ6DnGwKi9bOXw9JAaLhnsioBk',
          ).then(
            ({status, data}) => {
              validate.unauthorized(status, data);
              return done();
            }).catch(e => done(e));
        },
      ).catch(e => done(e));
    });

    it('Should return profile data', function(done) {
      loginUser({
        login: correctUserData.account_data.login,
        password: correctUserData.account_data.password,
      }).then(
        ({status, data}) => {
          validate.correct(status, data);
          fetchProfile(this.token).then(({status, data}) => {
            validate.correct(status, data);
            console.log('data: ', data);
            return done();
          }).catch(e => done(e));
        },
      ).catch(e => done(e));
    });
  });
});
