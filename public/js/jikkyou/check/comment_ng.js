(function(global) {
  global.CommentNG = (function(superClass) {
    extend(CommentNG, superClass);
    var jsonKey = "jikkyou.ngcomment";

    function CommentNG() {
      CommentNG.__super__.constructor.call(this);
    }

    CommentNG.prototype.readUserData = function() {
      var data = localStorage.getItem(jsonKey);

      if(data != null)
        this.userNgData = JSON.parse(data);
    };

    CommentNG.prototype.saveUserData = function() {
      try {
        localStorage.setItem( jsonKey, JSON.stringify(this.userNgData));
      }
      catch (e) {
        alert("データの保存に失敗しました。");
      }
    };

    CommentNG.prototype.addNG = function(chat) {
      this.userNgData.push({
          "type" : "WORD",
          "source" : chat.comment,
          "is_regex" : false
        });

      this.saveUserData();
    };

    CommentNG.prototype.init = function() {
      this.ready = false;
      this.userNgData = [];
      this.readUserData();
      this.ready = true;
    };

    CommentNG.prototype.check = function(chat) {
      var result = this.checkComment(chat.comment, this.userNgData);
      if(!result){
        this.errorMessage = "ＮＧコメント " + chat.comment;
      }

      return result;
    };

    return CommentNG;
  })(global.BaseNG);
})(window.jikkyou.CommentCheck);