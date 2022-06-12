const {
  testHelpers: {Request, Validate},
  functions: {getRandomString, deepLog},
} = require('../../src/api/v1/utils/');

// const {registerUser, correctUserData} = require('./../user/auth.test');

const {describe, it, before, after} = require('mocha');
const request = new Request({url: '/quiz/survey'});
const validate = new Validate();

let direction = null;
let group = null;
let subgroup = null;

function createDirection(directionData) {
  return new Promise(((resolve, reject) => {
    if (!directionData) {
      directionData = {
        title: getRandomString(),
      };
    }
    request.post({
      data: directionData,
    }).then(data => resolve(data)).catch(e => reject(e));
  }));
}

function createGroup(directionId, groupData) {
  return new Promise(((resolve, reject) => {
    if (!directionId) {
      directionId = direction._id;
    }

    if (!groupData) {
      groupData = {
        title: getRandomString(),
      };
    }

    request.post({url: `/${directionId}/group/`, data: groupData}).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

function createSubgroup(groupId, subgroupData) {
  return new Promise(((resolve, reject) => {
    if (!groupId) {
      groupId = group._id;
    }

    if (!subgroupData) {
      subgroupData = {
        title: getRandomString(),
      };
    }

    request.post({url: `/group/${groupId}/subgroup/`, data: subgroupData}).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

function removeDirection(id) {
  if (!id) {
    id = direction._id;
  }
  return new Promise((resolve, reject) => {
    request.delete({url: `/${id}/`}).
      then(data => resolve(data)).
      catch(e => reject(e));
  });
}

function removeGroup(id) {
  if (!id) {
    id = group._id;
  }

  return new Promise(((resolve, reject) => {
    request.delete({url: `/group/${id}/`}).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

function removeSubgroup(id) {
  if (!id) {
    id = subgroup._id;
  }

  return new Promise(((resolve, reject) => {
    request.delete({url: `/subgroup/${id}/`}).
      then(data => resolve(data)).
      catch(e => reject(e));
  }));
}

describe('Survey unit', function() {
  this.timeout(10000);
  describe('Directions', function() {
    before(function(done) {
      createDirection().then(({status, data}) => {
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectHavePropertyName(data.result, '_id');
        direction = data.result;
        deepLog(direction, 'direction');
        return done();
      }).catch(e => done(e));
    });

    after(function(done) {
      removeDirection().then(({status, data}) => {
        validate.correct(status, data);
        return done();
      }).catch(e => done(e));
    });

    it('Should get all survey directions', function(done) {
      request.get({}).then(({data, status}) => {
        deepLog(data);
        validate.correct(status, data);
        validate.hasResult(data);
        validate.arrayHaveObject(data.result, direction);
        return done();
      }).catch(e => done(e));
    });

    it('Should get direction by id', function(done) {
      request.get({url: `/${direction._id}`}).then(({data, status}) => {
        deepLog(data);
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectInclude(data.result, direction);
        return done();
      }).catch(e => done(e));
    });

    it('Should not create new survey direction due to absence of title',
      function(done) {
        createDirection({
          ttle: 'Misprint in prop name',
        }).then(({data, status}) => {
          deepLog(data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`ttle`');
          return done();
        }).catch(e => done(e));
      });

    it('Should not create direction due to extra body props', function(done) {
      createDirection({
        title: getRandomString(),
        extraProp: getRandomString(),
      }).then(({status, data}) => {
        deepLog(data);
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`extraProp`');
        return done();
      }).catch(e => done(e));
    });
  });

  describe('Groups', function() {
    before(function(done) {
      createDirection().then(({status, data}) => {
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectHavePropertyName(data.result, '_id');
        direction = data.result;
        deepLog(direction, 'direction');

        let groupData = {
          title: getRandomString(),
        };
        createGroup(direction._id, groupData).then(({data, status}) => {
          deepLog(data, 'group');
          validate.correct(status, data);
          validate.hasResult(data);
          validate.objectInclude(data.result, groupData);
          validate.objectHavePropertyName(data.result, '_id');
          validate.fieldEquality(data.result, 'parent', direction._id);
          group = data.result;

          return done();
        }).catch(e => done(e));
      }).catch(e => done(e));
    });

    after(function(done) {
      removeGroup().then(({status, data}) => {
        deepLog(data, 'remove group');
        validate.correct(status, data);
        removeDirection().then(({status, data}) => {
          deepLog(data, 'remove direction');
          validate.correct(status, data);
          return done();
        }).catch(e => done(e));
      }).catch(e => done(e));
    });

    it('Should get all groups in direction', function(done) {
      request.get({url: `/${direction._id}/groups/`}).
        then(({data, status}) => {
          deepLog(data);
          validate.correct(status, data);
          validate.hasResult(data);
          validate.arrayHaveObject(data.result, group);
          return done();
        }).
        catch(e => done(e));
    });

    it('Should get group by id', function(done) {
      request.get({url: `/group/${group._id}/`}).then(({status, data}) => {
        deepLog(data);
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectInclude(data.result, group);
        return done();
      });
    });

    it('Should not create new group due to absence of title',
      function(done) {
        createGroup(null, {
          ttle: 'Misprint in prop name',
        }).then(({data, status}) => {
          deepLog(data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`ttle`');
          return done();
        }).catch(e => done(e));
      });

    it('Should not create group due to extra body props', function(done) {
      createGroup(null, {
        title: getRandomString(),
        extraProp: getRandomString(),
      }).then(({status, data}) => {
        deepLog(data);
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`extraProp`');
        return done();
      }).catch(e => done(e));
    });

    it('Should not create group due to incorrect directionId', function(done) {
      createGroup(direction._id.slice(0, -4) + '0000', {
        title: getRandomString(),
      }).then(({status, data}) => {
        deepLog(data, 'data');
        validate.status(status, 404);
        validate.incorrect(data);
        validate.message(data, 'Invalid id for Direction');
        return done();
      }).catch(e => done(e));
    });

    it('Should not create group because directionId is not ObjectId',
      function(done) {
        createGroup(direction._id.slice(0, -4), {
          title: getRandomString(),
        }).then(({status, data}) => {
          deepLog(data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'Invalid id format');
          return done();
        }).catch(e => done(e));
      });
  });

  describe('Subgroups', function() {
    before(function(done) {
      createDirection().then(({status, data}) => {
        validate.correct(status, data);
        validate.hasResult(data);
        validate.objectHavePropertyName(data.result, '_id');
        direction = data.result;
        deepLog(direction, 'direction');

        let groupData = {
          title: getRandomString(),
        };
        createGroup(direction._id, groupData).then(({data, status}) => {
          deepLog(data, 'group');
          validate.correct(status, data);
          validate.hasResult(data);
          validate.objectInclude(data.result, groupData);
          validate.objectHavePropertyName(data.result, '_id');
          validate.fieldEquality(data.result, 'parent', direction._id);
          group = data.result;

          let subgroupData = {
            title: getRandomString(),
          };
          createSubgroup(group._id, subgroupData).then(({status, data}) => {
            deepLog(data, 'subgroup');
            validate.correct(status, data);
            validate.hasResult(data);
            validate.objectInclude(data.result, subgroupData);
            validate.objectHavePropertyName(data.result, '_id');
            validate.fieldEquality(data.result, 'parent', group._id);
            subgroup = data.result;

            return done();
          }).catch(e => done(e));
        }).catch(e => done(e));
      }).catch(e => done(e));
    });

    after(function(done) {
      removeSubgroup().then(({status, data}) => {
        deepLog(data, 'remove subgroup');
        validate.correct(status, data);
        removeGroup().then(({status, data}) => {
          deepLog(data, 'remove group');
          validate.correct(status, data);
          removeDirection().then(({status, data}) => {
            deepLog(data, 'remove direction');
            validate.correct(status, data);
            return done();
          }).catch(e => done(e));
        }).catch(e => done(e));
      }).catch(e => done(e));
    });

    it('Should get all subgroups in group', function(done) {
      request.get({url: `/group/${group._id}/subgroups/`}).
        then(({data, status}) => {
          deepLog(data);
          validate.correct(status, data);
          validate.hasResult(data);
          validate.arrayHaveObject(data.result, subgroup);
          return done();
        }).
        catch(e => done(e));
    });

    it('Should get subgroup by id', function(done) {
      request.get({url: `/subgroup/${subgroup._id}/`}).
        then(({status, data}) => {
          deepLog(data);
          validate.correct(status, data);
          validate.hasResult(data);
          console.log('subgroup: ', subgroup);
          console.log('data.result: ', data.result);
          validate.objectInclude(data.result, subgroup);
          return done();
        }).catch(e => done(e));
    });

    it('Should not create new subgroup due to absence of title',
      function(done) {
        createSubgroup(null, {
          ttle: 'Misprint in prop name',
        }).then(({data, status}) => {
          deepLog(data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, '`ttle`');
          return done();
        }).catch(e => done(e));
      });

    it('Should not create subgroup due to extra body props', function(done) {
      createSubgroup(null, {
        title: getRandomString(),
        extraProp: getRandomString(),
      }).then(({status, data}) => {
        deepLog(data);
        validate.status(status, 400);
        validate.incorrect(data);
        validate.message(data, '`extraProp`');
        return done();
      }).catch(e => done(e));
    });

    it('Should not create subgroup due to incorrect groupId', function(done) {
      createSubgroup(group._id.slice(0, -4) + '0000', {
        title: getRandomString(),
      }).then(({status, data}) => {
        deepLog(data);
        validate.status(status, 404);
        validate.incorrect(data);
        validate.message(data, 'Invalid id for Group');
        return done();
      }).catch(e => done(e));
    });

    it('Should not create group because groupId is not ObjectId',
      function(done) {
        createGroup(group._id.slice(0, -4), {
          title: getRandomString(),
        }).then(({status, data}) => {
          deepLog(data);
          validate.status(status, 400);
          validate.incorrect(data);
          validate.message(data, 'Invalid id');
          return done();
        }).catch(e => done(e));
      });

  });
});

module.exports = {
  createDirection,
  createGroup,
  createSubgroup,
  removeDirection,
  removeGroup,
  removeSubgroup,
};
