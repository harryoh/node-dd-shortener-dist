(function() {
  'use strict';
  var controller, express, router;

  express = require('express');

  controller = require('./history.controller');

  router = express.Router();

  router.get('/', controller.list);

  module.exports = router;

}).call(this);

//# sourceMappingURL=index.js.map
