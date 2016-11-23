var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../mysqlConnection');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: '実況（仮）',
  });
});

module.exports = router;
