var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection = require('../mysqlConnection');
var client = require('redis').createClient();
var dataStore = require('../datastore');

function loginChek(req, res) {
  // console.log("user loginChek", req.user);
  if (!req.user) {
    return false;
  }

  return true;
}

router.post('/', function(req, res, next) {
  if (!loginChek(req, res)) {
    res.redirect('/login');
    return;
  }

  var title = req.body.title;
  var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  if (title === void 0 || title.length == 0) {
    res.redirect('/boards/');
    return;
  }

  var query = 'INSERT INTO channel (title, created_at, user_id) VALUES (?, ?, ?)';
  connection.query(query, [title, createdAt, req.user.userId], function(err, rows) {
    res.redirect('/boards/');
  });
});

router.get('/', function(req, res, next) {
  if (!loginChek(req, res)) {
    res.redirect('/login');
    return;
  }

  var query = 'SELECT *, DATE_FORMAT(created_at, \'%Y年%m月%d日 %k時%i分%s秒\') AS created_at FROM channel';
  connection.query(query, function(err, rows) {
    res.render('boards', {
      title: '実況リスト',
      boardList: rows
    });
  });
});

router.get('/:board_id', function(req, res, next) {
  var boardId = req.params.board_id;
  if (!loginChek(req, res)) {
    res.redirect('/login');
    return;
  }

  connection.query('SELECT * FROM channel WHERE channel_id = ?', [boardId], function(err, board) {
    if (board.length != 0) {
      res.render('board', {
        title: board[0].title,
        channel_id: board[0].channel_id,
        uniq_id: dataStore.createFromUserRoomId(req.user.userId, boardId).uniqKey
      });
    } else {
      res.render('board_error', {
        title: "指定された掲示板は存在しません",
        message: "指定された掲示板は存在しません"
      });
    }
  });
});

module.exports = router;
