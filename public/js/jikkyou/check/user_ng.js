(function(global) {
  global.UserNG = (function(superClass) {
    extend(UserNG, superClass);
    var jsonKey = "jikkyou.nguser";

    function UserNG() {
      UserNG.__super__.constructor.call(this);
    }

    UserNG.prototype.readUserData = function() {
      var data = localStorage.getItem(jsonKey);

      if(data != null)
        this.userNgData = JSON.parse(data);
    };

    UserNG.prototype.saveUserData = function() {
      try {
        localStorage.setItem( jsonKey, JSON.stringify(this.userNgData));
      }
      catch (e) {
        alert("データの保存に失敗しました。");
      }
    };

    UserNG.prototype.addNG = function(chat) {
      this.userNgData.push({
          "type" : "WORD",
          "source" : chat.userid,
          "is_regex" : false
        });

      this.saveUserData();
    };

    UserNG.prototype.init = function() {
      this.ready = false;
      this.userNgData = [];
      this.readUserData();
      this.ready = true;
    };

    UserNG.prototype.check = function(chat) {
      var result = this.checkComment(chat.userid, this.userNgData);
      if(!result){
        this.errorMessage = "ＮＧユーザー " + chat.userid;
      }

      return result;
    };
    
    return UserNG;
  })(global.BaseNG);
})(window.jikkyou.CommentCheck);