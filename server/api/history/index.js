(function() {
  'use strict';
  var controller, express, router;

  express = require('express');

  controller = require('./history.controller');

  router = express.Router();

  router.get('/', controller.list);

  router.get('/created', controller.created);

  router.get('/browser', controller.browser);

  router.get('/country', controller.country);

  router.get('/platform', controller.platform);

  router.get('/:shortenId', controller.detail);

  router.get('/:shortenId/clicks', controller.clicks);

  router.get('/:shortenId/browser', controller.detail_browser);

  router.get('/:shortenId/country', controller.detail_country);

  router.get('/:shortenId/platform', controller.detail_platform);

  router.get('/:shortenId/referrer', controller.detail_referrer);

  router.get('/:shortenId/remoteip', controller.detail_remoteip);

  module.exports = router;

}).call(this);

//# sourceMappingURL=index.js.map
