
/**
Main application routes
 */

(function() {
  'use strict';
  var async, cache, cacheStatus, config, ddurl, errors, logger, path, redis;

  path = require('path');

  redis = require('redis');

  async = require('async');

  errors = require('./components/errors');

  ddurl = require('./components/ddurl');

  logger = require('./components/logger');

  config = require('./config/environment');

  if (config.useRedis) {
    cache = redis.createClient();
    cacheStatus = false;
    cache.on('error', function() {
      return cacheStatus = false;
    });
    cache.on('connect', function() {
      console.info('Connected redis server.');
      return cacheStatus = true;
    });
  }

  module.exports = function(app) {
    app.use('/api/1.0/url', require('./api/url'));
    app.get(/^\/([0-9a-zA-Z\+\/]{6})$/, function(req, res, next) {
      return async.waterfall([
        function(callback) {
          if (!cache || !cacheStatus) {
            return callback(null, null);
          }
          return cache.get(req.params[0], function(err, longUrl) {
            return callback(err, longUrl);
          });
        }, function(longUrl, callback) {
          if (longUrl) {
            return callback(null, longUrl);
          }
          return ddurl.expand(req.params[0], function(err, result) {
            if (!result) {
              return callback(null, null);
            }
            if (!cache || !cacheStatus) {
              return callback(err, result.longUrl);
            }
            return cache.set(req.params[0], result.longUrl, function(err) {
              return callback(err, result.longUrl);
            });
          });
        }
      ], function(err, longUrl) {
        if (err) {
          return next(err);
        }
        if (!longUrl) {
          return res.status(404).send('Not found URL');
        }
        logger.increase(req.params[0]);
        return res.redirect(301, longUrl);
      });
    });
    app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);
    return app.route('/*').get(function(req, res) {
      return res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
  };

}).call(this);

//# sourceMappingURL=routes.js.map
