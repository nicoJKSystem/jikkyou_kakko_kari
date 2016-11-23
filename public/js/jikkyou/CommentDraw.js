(function(global){
	global.CommentDraw = (function(){
		var commentData = [];
		var self;

		function CommentDraw(){
			self = this;
		}

		CommentDraw.prototype.init = function(canvas){
			self.canvas = canvas;

	    	console.log(canvas.width + " " + canvas.height);
	    	setTimeout(function(){
				self.draw();
			},16);
		}

		CommentDraw.prototype.canvas = null;
		CommentDraw.prototype.addCount = 0;
		CommentDraw.prototype.fontSize = 40;
		var commentHeightMax = 10;	//10段

		CommentDraw.prototype.addComment = function(date, comment, no){
			var ctx = self.canvas.getContext('2d');
			var y = (self.addCount / (commentHeightMax + 0.0) * self.canvas.height + self.fontSize);
			self.addCount = (self.addCount + 1) % commentHeightMax;

			var index = -1;
			for (var i in commentData) {
				if(!commentData[i].flag){
					index = i;
					break;
				}
			}

			var commentInfo = {
				"x" : self.canvas.width,
				"y" : y,
				"end" : -ctx.measureText(comment).width,	//消すx座標
				"comment" : comment,
				"speed" : (self.canvas.width + ctx.measureText(comment).width) / (60.0*2), //2秒で消す
				"flag"	: true
			};

			if(index == -1){
				commentData.push(commentInfo);
			}else
				commentData[index] = commentInfo;

			return true;
		}

		function convert2keta(val) {
			return val >= 10? val : ("0" + val);
		}

		CommentDraw.prototype.drawTime = function(canvas, ctx){
			var objDate = new Date();
			var time = {};
			time["year"] = objDate.getFullYear();
			time["month"] = objDate.getMonth()+1;
			time["date"] = objDate.getDate();
			time["hour"] = objDate.getHours();
			time["min"] = objDate.getMinutes();
			time["sec"] = objDate.getSeconds();

			ctx.clearRect(0, 0, canvas.width, canvas.height);
	    	ctx.font= 'bold 50px sans-serif';
			ctx.fillStyle = "rgb(128, 128, 128)";
			ctx.strokeStyle = ctx.fillStyle;

			var dateText = time["month"] + "/" + convert2keta(time["date"]);
			var hourText = convert2keta(time["hour"]) + "　:　" + convert2keta(time["min"]) + "　:　" + convert2keta(time["sec"]);

			ctx.fillText(dateText, canvas.width/2 - ctx.measureText(dateText).width/2, (canvas.height - 50) / 2 + 50);

			ctx.font= 'bold 18px sans-serif';
			ctx.fillText(hourText, canvas.width/2 - ctx.measureText(hourText).width/2,  (canvas.height + 50) / 2 + 18 );
		}

		CommentDraw.prototype.draw = function(){
			self.fontSize = Math.floor(self.canvas.height / commentHeightMax);

			// if ( ! canvas || ! canvas.getContext ) { return false; }
			var ctx = self.canvas.getContext('2d');

			self.drawTime(self.canvas, ctx);

			ctx.font= 'bold ' + self.fontSize + 'px sans-serif';
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.strokeStyle = ctx.fillStyle;

			for (var i in commentData) {
				var comment = commentData[i];
				if(comment.flag){
					ctx.fillText(comment.comment, comment.x, comment.y);

					comment.x -= comment.speed;
					if(comment.x < comment.end) comment.flag = false;
				}
			}

			setTimeout(function(){
				self.draw();
			},16);

		}
		return CommentDraw;
	})();
})(window.jikkyou);