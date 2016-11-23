(function(global) {
  global.BaseNG = (function() {
    function BaseNG() {
      this.ready = false;
      this.errorMessage = null;
    }

    BaseNG.prototype.isReady = function() {
      return this.ready;
    };

    BaseNG.prototype.init = function() {
      this.ready = true;
    };

    BaseNG.prototype.check = function(chat) {
      return true;
    };

    BaseNG.prototype.addNG = function(chat) {};
    BaseNG.prototype.save = function() {};
    
    BaseNG.prototype.getErrorMessage = function() {
      return this.errorMessage;
    };

    //comment　調べるコメント
    //arr     調べるための情報
    BaseNG.prototype.checkComment = function(comment, arr) {
      for (var i = 0; i < arr.length; i++) {
        var data　= arr[i];

        //正規表現の場合はマッチしたらアウト
        if(data.is_regex){
          var RegularExp = new RegExp(data.source, "g" );
          var res = comment.match( RegularExp );
          if(res != null) return false;
        }else{
          //禁止文字列は含まれていたらアウト
          if ( comment.indexOf(data.source) != -1) { return false; }
        }
      }

      return true;
    }

    return BaseNG;
  })();
})(window.jikkyou.CommentCheck);