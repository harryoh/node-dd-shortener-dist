(function() {
  'use strict';
  var Schema, UrlCounterSchema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  UrlCounterSchema = new Schema({
    _id: {
      type: String,
      required: true
    },
    seq: {
      type: Number,
      "default": 0
    }
  });

  module.exports = mongoose.model('UrlCounter', UrlCounterSchema);

}).call(this);

//# sourceMappingURL=urlCounter.model.js.map
