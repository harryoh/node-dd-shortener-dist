(function() {
  'use strict';
  var UrlModel, _, _checkUrl, ddurl, handleError, url;

  _ = require('lodash');

  url = require('url');

  UrlModel = require('./url.model');

  ddurl = require('../../components/ddurl');

  _checkUrl = function(url) {
    var regexp;
    regexp = /[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
    return regexp.test(url);
  };

  exports.list = function(req, res) {
    return UrlModel.count(function(err, length) {
      var query, result;
      if (err) {
        return handleError(res, err);
      }
      result = {
        total: length
      };
      query = UrlModel.find().sort({
        createdAt: -1
      }).limit(20);
      return query.exec(function(err, urls) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(_.merge(result, {
          urls: urls
        }));
      });
    });
  };

  exports.show = function(req, res) {
    return UrlModel.findById(req.params.id, function(err, url) {
      if (err) {
        return handleError(res, err);
      }
      if (!url) {
        return res.status(404).send('Not Found');
      }
      return res.json(url);
    });
  };

  exports.shorten = function(req, res) {
    var hrstart, longUrl, parse;
    parse = url.parse(req.body.longUrl);
    if (!parse.protocol) {
      longUrl = "http://" + parse.href;
    } else {
      longUrl = req.body.longUrl;
    }
    if (!_checkUrl(longUrl)) {
      return res.status(400).send('Bad Request');
    }
    hrstart = process.hrtime();
    return ddurl.shorten(longUrl, function(err, result) {
      var hrend;
      if (err) {
        return handleError(res, err);
      }
      if (!result) {
        return res.status(404).send('Not found URL');
      }
      hrend = process.hrtime(hrstart);
      _.merge(result, {
        'shortUrl': "http://" + (req.get('host')) + "/" + result.shortenId,
        'executionTime': {
          'sec': hrend[0],
          'ms': hrend[1]
        }
      });
      delete result.shortenId;
      return res.status(201).json(result);
    });
  };

  exports.expand = function(req, res) {
    var hrstart, parse, shortenId;
    if (!_checkUrl.isUri(req.query.shortUrl)) {
      return res.status(400).send('Bad Request');
    }
    parse = url.parse(req.query.shortUrl, true);
    shortenId = parse.path.substr(1);
    hrstart = process.hrtime();
    return ddurl.expand(shortenId, function(err, result) {
      var hrend;
      if (err) {
        return handleError(res, err);
      }
      if (!result) {
        return res.status(404).send('Not found URL');
      }
      hrend = process.hrtime(hrstart);
      _.merge(result, {
        'executionTime': {
          'sec': hrend[0],
          'ms': hrend[1]
        }
      });
      return res.status(200).json(result);
    });
  };

  exports.update = function(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    return UrlModel.findById(req.params.id, function(err, url) {
      var updated;
      if (err) {
        return handleError(res, err);
      }
      if (!url) {
        return res.status(404).send('Not Found');
      }
      updated = _.merge(url, req.body);
      return updated.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(url);
      });
    });
  };

  exports.destroy = function(req, res) {
    return UrlModel.findById(req.params.id, function(err, url) {
      if (err) {
        return handleError(res, err);
      }
      if (!url) {
        return res.status(404).send('Not Found');
      }
      return url.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(204).send('No Content');
      });
    });
  };

  handleError = function(res, err) {
    return res.status(500).send(err);
  };

}).call(this);

//# sourceMappingURL=url.controller.js.map
