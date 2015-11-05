(function() {
  'use strict';
  var UrlModel, _, ddurl, handleError, url, validUrl;

  _ = require('lodash');

  UrlModel = require('../../api/url/url.model');

  url = require('url');

  validUrl = require('valid-url');

  ddurl = require('../../components/ddurl');

  exports.index = function(req, res) {
    return UrlModel.find(function(err, urls) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(urls);
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

    /*
    parse = url.parse req.body.longUrl
    if not parse.protocol
      longUrl = "http://#{parse.href}"
    else
      longUrl = req.body.longUrl
     */
    var hrstart, longUrl;
    longUrl = req.body.longUrl;
    if (!validUrl.isUri(longUrl)) {
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
    if (!validUrl.isUri(req.query.shortUrl)) {
      return res.status(400).send('Bad Request');
    }
    parse = url.parse(req.query.shortUrl, true);
    shortenId = parse.path.substring(1);
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