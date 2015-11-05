(function() {
  'use strict';
  var LoggerMobel, UrlModel, geoip, ipaddr, url;

  ipaddr = require('ipaddr.js');

  geoip = require('geoip-lite');

  url = require('url');

  LoggerMobel = require('./logger.model');

  UrlModel = require('../../api/url/url.model');

  (function() {
    var logger;
    logger = function(req, callback) {
      var increase, log, referrer, remoteIp, shortenId;
      shortenId = req.originalUrl.substr(1);
      increase = function(callback) {
        return UrlModel.findOneAndUpdate({
          shortenId: shortenId
        }, {
          $inc: {
            clicked: 1
          }
        }, function(err, result) {
          return typeof callback === "function" ? callback(err, null) : void 0;
        });
      };
      remoteIp = ipaddr.process(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString();
      referrer = req.headers['referer'] || '';
      log = {
        shortenId: shortenId,
        browser: req.useragent['browser'],
        browserVersion: req.useragent['version'],
        os: req.useragent['os'],
        platform: req.useragent['platform'],
        geoIp: geoip.lookup(remoteIp),
        usrerAgent: req.useragent['source'],
        referrer: referrer,
        referrerHost: url.parse(referrer).host,
        remoteIp: remoteIp
      };
      increase();
      return LoggerMobel.create(log, function(err, data) {
        return typeof callback === "function" ? callback(err, data) : void 0;
      });
    };
    if (typeof module !== 'undefined' && module.exports) {
      return module.exports = logger;
    }
  })();

}).call(this);

//# sourceMappingURL=index.js.map
