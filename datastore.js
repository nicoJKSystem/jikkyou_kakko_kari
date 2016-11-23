var client = require('redis').createClient();
var crypto = require('crypto');

const redisPattern = "userHash";
const errorWritekey = "-1";

function RedisJikkyouManager(uniqKey) {
	this.uniqKey = uniqKey;
}

RedisJikkyouManager.prototype.errorWritekey = errorWritekey;

//redisで検索できるように頭を統一
RedisJikkyouManager.prototype.getRedisKey = function() {
	return redisPattern + this.uniqKey;
}

//初期化
RedisJikkyouManager.prototype.initData = function(data) {
	client.set(this.getRedisKey(), JSON.stringify(data), function() {});
}

//書き込みキーを更新 更新できた場合は書き込みキーを　失敗した場合は不正なキーを返す
RedisJikkyouManager.prototype.newWritekey = function(dataStore, ins) {
	return new Promise(function(resolve, reject) {
		var redisKey = ins.getRedisKey();

		client.get(redisKey, function(err, json) {
			if (err || !json) return resolve(ins.errorWritekey);
			var data = JSON.parse(json);
			data.writeKey = dataStore.getHash('' + Math.random());

			client.set(redisKey, JSON.stringify(data), function() {
				resolve(data.writeKey);
			});
		});
	});
}

//コメントが書き込み可能か
//書き込めるなら true
//書き込めないなら false
RedisJikkyouManager.prototype.isWrite = function(writeKey, ins) {
	return new Promise(function(resolve, reject) {
		var errorResult = { result: false };
		if (writeKey === ins.errorWritekey || writeKey === void 0) resolve(errorResult);

		var redisKey = ins.getRedisKey();
		client.get(redisKey, function(err, json) {
			console.log(err, json);
			if (err || !json) return resolve(errorResult);
			var data = JSON.parse(json);

			if (data.writeKey === writeKey) {
				resolve({
					userId: data.userId,
					result: true
				});
			}

			resolve(errorResult);
		});
	});
}

//Redisからデータを削除
RedisJikkyouManager.prototype.deletUserData = function() {
	client.del(this.getRedisKey());
}

var dataStoreManager = {
	//userIdとroomIdとランダムな数字を使い一時的な一意なキーを作成
	createFromUserRoomId: function(userId, roomId) {
		var key = userId + "room" + roomId + Math.random();
		var ins = new RedisJikkyouManager(dataStoreManager.getHash(key));

		ins.initData({
			userId: userId,
			writeKey: errorWritekey
		});

		return ins;
	},

	createFromUniqkey: function(uniqKey) {
		var ins = new RedisJikkyouManager(uniqKey);
		return ins;
	},

	//ユーザーの情報を削除
	resetSessionData: function() {
		client.keys(redisPattern + "*", function(err, delList) {
			if (delList.length > 0) client.del(delList);
		});
	},

	errorWritekey: errorWritekey,

	//ハッシュ値を取得
	getHash: function(s) {
		let sha1sum = crypto.createHash('sha256');
		sha1sum.update(s);
		return sha1sum.digest('hex');
	}
}

module.exports = dataStoreManager;
