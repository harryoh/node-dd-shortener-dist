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

  exports.browser = function(req, res) {
    return Logger.count(function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $group: {
            _id: {
              browser: '$browser',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.browser',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            browser: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'browser': row.browser,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.country = function(req, res) {
    return Logger.count(function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $group: {
            _id: {
              country: '$geoIp.country',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.country',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            country: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'country': row.country,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.platform = function(req, res) {
    return Logger.count(function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $group: {
            _id: {
              platform: '$platform',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.platform',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            platform: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'platform': row.platform,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

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

  exports.detail_browser = function(req, res) {
    return Logger.count({
      shortenId: req.params.shortenId
    }, function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $match: {
            shortenId: req.params.shortenId
          }
        }, {
          $group: {
            _id: {
              browser: '$browser',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.browser',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            browser: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'browser': row.browser,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.detail_country = function(req, res) {
    return Logger.count({
      shortenId: req.params.shortenId
    }, function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $match: {
            shortenId: req.params.shortenId
          }
        }, {
          $group: {
            _id: {
              country: '$geoIp.country',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.country',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            country: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'country': row.country,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.detail_platform = function(req, res) {
    return Logger.count({
      shortenId: req.params.shortenId
    }, function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $match: {
            shortenId: req.params.shortenId
          }
        }, {
          $group: {
            _id: {
              platform: '$platform',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.platform',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            platform: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'platform': row.platform,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.detail_referrer = function(req, res) {
    return Logger.count({
      shortenId: req.params.shortenId
    }, function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $match: {
            shortenId: req.params.shortenId
          }
        }, {
          $group: {
            _id: {
              referrerHost: '$referrerHost',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.referrerHost',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            referrerHost: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'referrerHost': row.referrerHost,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  exports.detail_remoteip = function(req, res) {
    return Logger.count({
      shortenId: req.params.shortenId
    }, function(err, length) {
      if (err) {
        return handleError(res, err);
      }
      if (!length) {
        return res.status(200).end();
      }
      return Logger.aggregate([
        {
          $match: {
            shortenId: req.params.shortenId
          }
        }, {
          $group: {
            _id: {
              remoteIp: '$remoteIp',
              id: '$_id'
            }
          }
        }, {
          $group: {
            _id: '$_id.remoteIp',
            count: {
              $sum: 1
            }
          }
        }, {
          $project: {
            _id: 0,
            remoteIp: '$_id',
            count: 1
          }
        }
      ], function(err, result) {
        var data;
        if (err) {
          return handleError(res, err);
        }
        data = [];
        _.forEach(result, function(row, idx) {
          return data.push({
            'remoteIp': row.remoteIp,
            'percentage': (row.count / length * 100).toFixed(2)
          });
        });
        return res.status(200).json(data);
      });
    });
  };

  handleError = function(res, err) {
    return res.status(500).send(err);
  };

}).call(this);

//# sourceMappingURL=history.controller.js.map
