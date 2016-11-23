var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var boards = require('./routes/boards');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var writeKey = require('./routes/writekey');

var Config = require('./config');
var setUser = require('./setUser');
var RedisStore = require('connect-redis')(session);
var connection = require('./mysqlConnection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  store: new RedisStore({
    host: Config.Redis.host,
    port: Config.Redis.port
  }),
  secret: 'jikkyou kakkokari public',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', setUser, routes);
app.use('/boards', setUser, boards);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/getwritekey', writeKey);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function md5hex(src) {
  var md5hash = crypto.createHash('md5');
  md5hash.update(src, 'binary');
  return md5hash.digest('hex');
};

// 認証
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      var query = 'SELECT user_id FROM users WHERE email = ? AND password = ? LIMIT 1';
      connection.query(query, [email, md5hex(password)], function(err, rows) {
        var userId = rows.length ? rows[0].user_id : false;
        if (!userId) {
          req.flash('login_error', 'ユーザーが見つかりませんでした。');
          req.flash('input_email', email);
          return done(null, false);
        }

        return done(null, { userId: userId });
      });
    })
  }
));

// 暗号化
var getHash = function(value) {
  var sha = crypto.createHmac('sha256', 'secretKey');
  sha.update(value);
  return sha.digest('hex');
};

passport.serializeUser(function(account, done) {
  done(null, account.userId);
});

passport.deserializeUser(function(serializedAccount, done) {
  var query = 'SELECT user_name,user_id,email FROM users WHERE user_id = ?';
  connection.query(query, [serializedAccount], function(err, rows) {
    var userId = rows.length ? rows[0].user_id : false;
    var email = rows.length ? rows[0].email : false;
    var userName = rows.length ? rows[0].user_name : false;
    var user = { userId: userId, email: email, userName: userName };
    return done(null, user);
  });
});

module.exports = app;
