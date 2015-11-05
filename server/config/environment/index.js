(function() {
  'use strict';
  var _, all, path, requiredProcessEnv;

  path = require('path');

  _ = require('lodash');

  requiredProcessEnv = function(name) {
    if (!process.env[name]) {
      throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
  };

  all = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '/../../..'),
    port: process.env.PORT || 9000,
    seedDB: false,
    useRedis: true,
    useLru: true,
    secrets: {
      session: 'node-dd-shortener-secret'
    },
    userRoles: ['guest', 'user', 'admin'],
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  };

  module.exports = _.merge(all, require('./' + process.env.NODE_ENV) || {});

}).call(this);

//# sourceMappingURL=index.js.map
