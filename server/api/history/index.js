(function() {
  'use strict';
  var controller, express, router;

  express = require('express');

  controller = require('./history.controller');

  router = express.Router();

  router.get('/', controller.list);

  router.get('/created', controller.created);

  router.get('/:shortenId', controller.detail);

  router.get('/:shortenId/clicks', controller.clicks);

  module.exports = router;

}).call(this);

//# sourceMappingURL=index.js.map
