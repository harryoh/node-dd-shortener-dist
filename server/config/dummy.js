(function() {
  'use strict';
  var Url, async;

  async = require('async');

  Url = require('../api/url/url.model');

  Url.count(function(err, length) {
    var j, results;
    if (!length) {
      console.log('>>>>> Start Input URL dummy data');
      return async.eachSeries((function() {
        results = [];
        for (j = 0; j <= 100000; j++){ results.push(j); }
        return results;
      }).apply(this), function(i, callback) {
        return Url.create({
          'longUrl': "http://5004.pe.kr/" + i
        }, function(err, url) {
          if (err) {
            console.error('Failed to insert url default data');
            return callback(err);
          }
          return callback(null);
        });
      }, function(err) {
        if (err) {
          return console.error(err);
        }
        return console.log('<<<<< Complete dummy url data');
      });
    }
  });

}).call(this);

//# sourceMappingURL=dummy.js.map
