(function() {
  'use strict';
  var UrlModel;

  UrlModel = require('../../api/url/url.model');

  (function() {
    var ddurl;
    ddurl = {};
    ddurl.shorten = function(longUrl, callback) {
      return UrlModel.create({
        'longUrl': longUrl
      }, function(err, url) {
        var result;
        if (err) {
          return callback(err);
        }
        if (!url) {
          return callback(null);
        }
        result = {
          'longUrl': url.longUrl,
          'shortenId': url.shortenId,
          'createdAt': url.createdAt
        };
        return callback(null, result);
      });
    };
    ddurl.expand = function(shortenId, callback) {
      return UrlModel.findOne({
        'shortenId': shortenId
      }, function(err, url) {
        var result;
        if (err) {
          return callback(err);
        }
        if (!url) {
          return callback(null);
        }
        result = {
          'longUrl': url.longUrl,
          'shortenId': url.shortenId,
          'createdAt': url.createdAt,
          'clicked': url.clicked
        };
        return callback(null, result);
      });
    };
    if (typeof module !== 'undefined' && module.exports) {
      return module.exports = ddurl;
    }
  })();

}).call(this);

//# sourceMappingURL=index.js.map
