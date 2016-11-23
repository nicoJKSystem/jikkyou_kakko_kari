(function(global) {
  global.NG = (function() {

    var OfficialIndex = 0;
    var UserIndex = 1;
    var CommentIndex = 2;
    var errorIndex = -1;

    function NG() {
      this.ngInstance = [
        new global.OfficialCommentNG(),
        new global.UserNG(),
        new global.CommentNG()
      ]
    }

    NG.prototype.addUserCommentNg = function(chat) {
      this.ngInstance[CommentIndex].addNG(chat);
    };

    NG.prototype.addUserNg = function(chat) {
      this.ngInstance[UserIndex].addNG(chat);
    };

    NG.prototype.init = function() {
      for (var i in this.ngInstance) {
        var ins = this.ngInstance[i];
        ins.init();
      }
    };

    NG.prototype.check = function(chat) {
      errorIndex = -1;
      for (var i in this.ngInstance) {
        var ins = this.ngInstance[i];

        if(!ins.check(chat)){
          errorIndex = i;
          return false;
        }
      }
      return true;
    };

    NG.prototype.getErrorMessage = function() {
      if(errorIndex != -1){
        return this.ngInstance[errorIndex].getErrorMessage();
      }

      return "";
    };

    NG.prototype.isReady = function() {
      for (var i in this.ngInstance) {
        var ins = this.ngInstance[i];

        if(!ins.isReady) return false;
      }
      return true;
    };

    return NG;
  })();
})(window.jikkyou.CommentCheck);