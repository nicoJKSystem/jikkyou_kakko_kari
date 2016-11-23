var Config = {
	Server: {
		//変更した場合はpublic\js\jikkyou\jikkyou.jsのhttp://localhost:3000の3000を変更
		port: normalizePort(process.env.PORT || '3000')
	},

	Redis: {
		host: '127.0.0.1',
		port: 6379
	},

	DBConfig: {
		host: '127.0.0.1',
		port : 3306,
		user: 'root',
		password: '',
		database: 'jikkyou_kakko_kari'
	}
}

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

module.exports = Config;
