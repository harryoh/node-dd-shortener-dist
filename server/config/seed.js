
/**
Populate DB with sample data on server start
to disable, edit config/environment/index.js, and set `seedDB: false`
 */

(function() {
  'use strict';
  var UrlCounter, User;

  User = require('../api/user/user.model');

  UrlCounter = require('../api/url/urlCounter.model');

  User.count(function(err, length) {
    if (!length) {
      return User.find({}).remove(function() {
        return User.create({
          provider: 'local',
          name: 'Test User',
          email: 'test@test.com',
          password: 'test'
        }, {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@admin.com',
          password: 'admin'
        }, function() {
          return console.log('finished populating users');
        });
      });
    }
  });

  UrlCounter.count(function(err, length) {
    if (!length) {
      return UrlCounter.create({
        _id: "urlid"
      }, function() {
        return console.log('init url counter');
      });
    }
  });

}).call(this);

//# sourceMappingURL=seed.js.map
