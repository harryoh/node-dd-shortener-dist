(function() {
  'use strict';
  var Logger, Url, _, config, handleError;

  _ = require('lodash');

  Logger = require('../../components/logger/logger.model');

  Url = require('../url/url.model');

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

  exports.created = function(req, res) {
    return Url.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            },
            dayOfMonth: {
              $dayOfMonth: "$createdAt"
            }
          },
          count: {
            $sum: 1
          }
        }
      }
    ], function(err, result) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(result);
    });
  };


  /*  MONGO Query
  db.getCollection('urls').aggregate([
      {
          $match: {
              createdAt: {
                  $gte: ISODate("2015-11-01T00:00:00.000Z"),
                  $lt: ISODate("2015-11-16T00:00:00.000Z")
              }
          }
      },
      {
          $group: {
          _id: {
              year: {$year: "$createdAt"},
              month: {$month: "$createdAt"},
              dayOfMonth: {$dayOfMonth: "$createdAt"}
          },
          count: {$sum: 1}
      }
  }])
   */

  exports.detail = function(req, res) {
    return Logger.count(function(err, length) {
      var query, result;
      if (err) {
        return handleError(res, err);
      }
      result = {
        total: length
      };
      query = Logger.find({
        shortenId: req.params.shortenId
      }).sort({
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

  exports.clicks = function(req, res) {
    return Logger.aggregate([
      {
        $match: {
          shortenId: req.params.shortenId
        }
      }, {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            },
            dayOfMonth: {
              $dayOfMonth: "$createdAt"
            }
          },
          count: {
            $sum: 1
          }
        }
      }
    ], function(err, result) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(result);
    });
  };

  handleError = function(res, err) {
    return res.status(500).send(err);
  };

}).call(this);

//# sourceMappingURL=history.controller.js.map
