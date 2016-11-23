(function(global) {
  global.OfficialCommentNG = (function(superClass) {
    extend(OfficialCommentNG, superClass);

    function OfficialCommentNG() {
      OfficialCommentNG.__super__.constructor.call(this);
    }

    OfficialCommentNG.prototype.decodeJson = function(json) {
      for (var i in json) {
        this.ngData.push({
          "type" : json[i].type,
          "source" : json[i].source,
          "is_regex" : json[i].is_regex == "true"
        });
      }
    };

    OfficialCommentNG.prototype.init = function() {
      this.ready = false;
      this.ngData = [];

      var self = this;
      $.getJSON("/info/ng.word.json", function(data,status){
        self.decodeJson(data);        
        self.ready = true;
        self = null;
      });
    };

    OfficialCommentNG.prototype.check = function(chat) {
      var result = this.checkComment(chat.comment, this.ngData);
      if(!result){
        this.errorMessage = "ＮＧコメント " + chat.comment;
      }

      return result;
    };
    
    return OfficialCommentNG;
  })(global.BaseNG);
})(window.jikkyou.CommentCheck);