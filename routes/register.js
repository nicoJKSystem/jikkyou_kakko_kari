var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../mysqlConnection');
var crypto = require('crypto');

function md5hex(src){
  var md5hash = crypto.createHash('md5');
  md5hash.update(src, 'binary');
  return md5hash.digest('hex');
};

router.get('/', function(req, res, next) {
  res.render('register', {
    title: '新規会員登録'
  });
});

router.post('/', function(req, res, next) {
  var userName = req.body.user_name;
  var email = req.body.email;
  var password = md5hex(req.body.password);
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  var emailExistsQuery = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  var registerQuery = 'INSERT INTO users (user_name, email, password, created_at) VALUES (?,?,?,?)';

  connection.query(emailExistsQuery, [email], function(err, rows) {
    var emailExists = rows.length === 1;
    if (emailExists) {
      res.render('register', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです'
      });
    } else {
      connection.query(registerQuery, [userName, email, password, createdAt], function(err, rows) {
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;