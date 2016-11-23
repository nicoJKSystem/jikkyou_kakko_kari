module.exports = makeServer;

const moment = require('moment');
const http = require('http');
const debug = require('debug')('node-test:server');
const socketIO = require('socket.io');
const RecentCommentManager = require('./recent_comment');
const dataStore = require('./datastore');

const RECENT_COMMENT_MAX = 10;

var channelsInfo = {};

function makeServer(app, port) {
  const server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  var io = socketIO.listen(server);
  var socketData = {};

  //socketは接続してきたクライアントのもの
  var chat = io.sockets.on('connection', function(socket) {
    socketData[socket.id] = {};

    socket.on('login', function(data) {
      var room = "room" + data.reqId;
      var arr = room in channelsInfo ? channelsInfo[room] : {
        userNum: 0,
        commentNo: 1,
        recent: new RecentCommentManager(RECENT_COMMENT_MAX)
      };

      arr.userNum++;
      channelsInfo[room] = arr;

      //ソケットを部屋から入室させる
      socket.join(room);

      socketData[socket.id].room = room;
      socketData[socket.id].saveIdKey = data.uniq_id;

      io.to(socket.id).emit('system msg', {
        userid: socket.id,
        value: "receive userid",
        recent: channelsInfo[room].recent.exportJson()
      });

      console.log("user connect " + channelsInfo[room].userNum);
    });

    // クライアントからサーバーへ メッセージ送信ハンドラ（自分以外の全員宛に送る）
    socket.on('chat', function(data) {
      let ins = dataStore.createFromUniqkey(socketData[socket.id].saveIdKey);

      var writeKey = data.writeKey;
      ins.isWrite(writeKey, ins).then(function onFulfilled(value) {
        console.log("value " + value.result);
        if (!value.result) return;

        let userId = value.userId;
        var room = socketData[socket.id].room;

        let jsonObj = {
          date: moment().format('HHmm'),
          userid: dataStore.getHash('' + userId),
          comment: data.value,
          no: channelsInfo[room].commentNo
        }

        channelsInfo[room].commentNo++;

        (function() {
          let ins = channelsInfo[room].recent;
          var cursol = ins.next();
          ins.set(cursol, jsonObj);
        })();

        io.to(room).emit('chat', jsonObj);
      }).catch(function onRejected(error) {
        console.error(error);
      });
    });

    //切断を検知したら所属していたルーム全員に通知とルームから削除
    socket.on('disconnect', function() {
      var room = socketData[socket.id].room;

      //ソケットを部屋から退室させる
      socket.leave(room);

      //redisデータを消去
      let ins = dataStore
.createFromUniqkey(socketData[socket.id].saveIdKey);
      ins.deletUserData();

      delete socketData[socket.id];

      channelsInfo[room].userNum--;
      console.log("user disconnect " + channelsInfo[room].userNum);
    });

  });

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  return server;
}
