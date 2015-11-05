(function() {
  'use strict';
  var Hashids, Schema, UrlCounter, UrlSchema, config, hashids, mongoose;

  mongoose = require('mongoose');

  UrlCounter = require('./urlCounter.model');

  config = require('../../config/environment');

  Schema = mongoose.Schema;

  UrlSchema = new Schema({
    longUrl: String,
    shortenId: String,
    clicked: {
      type: Number,
      "default": 0
    },
    createdAt: {
      type: Date,
      "default": Date.now
    }
  });

  UrlSchema.index({
    'shortenId': 1
  }, {
    unique: true
  });

  UrlSchema.index({
    'createdAt': -1
  });

  Hashids = require('hashids');

  hashids = new Hashids(config.secrets.session, 6);

  UrlSchema.pre('save', function(next) {
    var _this;
    _this = this;
    return UrlCounter.findByIdAndUpdate({
      _id: 'urlid'
    }, {
      $inc: {
        seq: 1
      }
    }, function(err, counter) {
      if (err) {
        return next(err);
      }
      _this.shortenId = hashids.encode(counter.seq);
      return next();
    });
  });

  module.exports = mongoose.model('Url', UrlSchema);

}).call(this);

//# sourceMappingURL=url.model.js.map
