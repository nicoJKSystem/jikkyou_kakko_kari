var mysql = require('mysql');
var Config = require('./config');

var connection = mysql.createConnection(Config.DBConfig);
connection.connect(function(err) {
	if (err) {
		console.log('database connect err ' + err.stack);

		//データベースに接続できないのは強制終了
		process.exit();
	}
	console.log('database connected as id ' + connection.threadId);
});

module.exports = connection;
