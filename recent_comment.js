function RecentCommentManager(recentNum) {
	if (!Number.isFinite(recentNum) || recentNum <= 0) {
		throw new Error('Whoops!');
	}

	this.recentNum = recentNum;
	this.data = [];
	this.cursol = 0;

	for (var i = 0; i < recentNum; i++) {
		this.data[i] = null;
	}
}

//カーソルを一つ進め、進める前の添字を返す
RecentCommentManager.prototype.next = function() {
	var previewCursol = this.cursol;
	this.cursol = this.cursol == (this.recentNum - 1) ? 0 : this.cursol + 1;
	return previewCursol;
}

//nextの結果を入れるのでチェックなし
//cursolの位置にvalueを入れる
RecentCommentManager.prototype.set = function(cursol, value) {
	this.data[cursol] = value;
}

//json形式でエキスポート
//新しく接続した人に最新情報を送るときに使用
RecentCommentManager.prototype.exportJson = function() {
	return JSON.stringify(this.data);
}

module.exports = RecentCommentManager;
