'use strict'

var express = require('express');
var PagesController = require('../controllers/pages');

var router = express.Router();

router.get('/', PagesController.getIndex);

module.exports = router;