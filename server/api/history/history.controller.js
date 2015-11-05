(function() {
  'use strict';
  var Logger, _, config, handleError;

  _ = require('lodash');

  Logger = require('../../components/logger/logger.model');

  config = require('../../config/environment');

  exports.list = function(req, res) {
    return Logger.count(function(err, length) {
      var query, result;
      if (err) {
        return handleError(res, err);
      }
      result = {
        total: length
      };
      query = Logger.find().sort({
        createdAt: -1
      }).limit(20);
      return query.exec(function(err, history) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(_.merge(result, {
          history: history
        }));
      });
    });
  };

  handleError = function(res, err) {
    return res.status(500).send(err);
  };

}).call(this);

//# sourceMappingURL=history.controller.js.map
