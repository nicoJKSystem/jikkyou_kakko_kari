var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash = require('connect-flash');

router.get('/', function(req, res, next) {
  if (req.user) {
    res.redirect('/boards');
  } else {
    res.render('login', {
      title: 'ログイン',
      login_error: req.flash('login_error'),
      input_email: req.flash('input_email'),
    });
  }
});

router.post('/', function(req, res, next) {
  passport.authenticate('local', {
        successRedirect: '/boards',
        failureRedirect: '/login',
        failureFlash: true
  })(req, res, next);
});

module.exports = router;