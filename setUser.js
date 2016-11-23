var connection = require('./mysqlConnection');

module.exports = function(req, res, next) {
  if (req.user) {
    var userId = req.user.userId;
    var query = 'SELECT user_id, user_name FROM users WHERE user_id = ?';
    connection.query(query, [userId], function(err, rows) {
      if (!err) {
        res.locals.user = rows.length ? rows[0] : false;
      }
    });
  }
  next();
};
