//スコープというかネームスペース　初期化用
//最初に実行

extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

window.jikkyou = (function(){
	var jikkyou = new Object();

	//複数のファイルで初期化するならここで初期化
	jikkyou.CommentCheck = new Object();
	return jikkyou;
})();