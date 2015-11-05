(function() {
  'use strict';
  var UrlModel;

  UrlModel = require('../../api/url/url.model');

  (function() {
    var logger;
    logger = {};
    logger.increase = function(shortenId, callback) {
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
    if (typeof module !== 'undefined' && module.exports) {
      return module.exports = logger;
    }
  })();

}).call(this);

//# sourceMappingURL=index.js.map
