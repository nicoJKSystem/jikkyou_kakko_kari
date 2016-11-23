(function(jikkyou){
	var params = jikkyou.util.getJsParam("jikkyou.js");
	var reqId = parseInt(params.channel_id, 10);
    
    var ioSocket = null;
    var chatData = [];
    var commentDraw;
    var systemStart = false;
    var userid = null;
    var previewComment = null;

    //idが不正な値なら初期化しない
    if(!Number.isFinite(reqId)){
		alert("idが入力されていません。");
		return;
	}

	var NG = new jikkyou.CommentCheck.NG();
	NG.init();
    
	var postComment = function(comment) {
	    if(comment == "" || ioSocket === null || previewComment === comment) return false;

	    $.getJSON("/getwritekey", { uniqkey: params.uniq_id }, function(postInfo){
		    if(postInfo.writeKey === '-1') return;

	        // クライアントからサーバーへ送信
        	ioSocket.emit( "chat", { userid : userid, value : comment, writeKey : postInfo.writeKey } );
        	previewComment = comment;
    	});

    	return true;
  	};

	var addCommentTable = function(date, comment, no){
		// $('#commentTable tbody > tr:last').after('<tr><td>山下</td><td>' + data + '</td></tr>')
		$("#commentTable").append(
    		$("<tr></tr>")
        		.append($("<td></td>").text(date))
        		.append($("<td></td>").text(comment))
        		.append($("<td></td>").text(no))
		);

    	$('#commentTable').scrollTop($('#commentTable')[0].scrollHeight);
		    	// $('#commentTable2').animate({scrollTop: $('#commentTable2')[0].scrollHeight}, 'fast');
		// $('#commentTable').scrollTop($('#commentTable').scrollTop() + $('#commentTable').height());
		//

		$('#commentTable td').off('click');
		$("#commentTable td").on('click', function() {
		    //var td = $(this)[0];
		  	//var tr = $(this).parent()[0];

		  	var index = $(this).closest('tr').index();

		  	$("#comment-dialog p:eq(0)").text("ユーザー名:" + chatData[index].userid);
		  	$("#comment-dialog p:eq(1)").text("コメント:" + chatData[index].comment);

		    $("#comment-dialog").dialog({
		    	resizable: false,
		    	width:"30%",
		    	height:350,
		    	modal: true,
		    	buttons: {
			        "ＮＧユーザーに追加": function() {
			        	NG.addUserNg(chatData[index]);
			          	$( this ).dialog( "close" );
			        },
			        "ＮＧコメントに追加": function() {
			        	NG.addUserCommentNg(chatData[index]);
			          	$( this ).dialog( "close" );
			        },
			        Cancel: function() {
			          $( this ).dialog( "close" );
			        }
		      	}
		    });
		});
	}

	function parseComment(chat){
		if(NG.check(chat)){
			var time = chat.date.substr(0,2) + ":" + chat.date.substr(2,2);

			chatData.push(chat);
			addCommentTable(time, chat.comment, chat.no);
			commentDraw.addComment(time, chat.comment, chat.no);
		}else
			console.log(NG.getErrorMessage());
		
	}

	function initSocket(){
		ioSocket = io.connect('http://localhost:3000'); // チャットサーバーに接続

    	// サーバーからのデータ受け取り処理
	    ioSocket.on( "connect", function() {
    
	        //サーバーに2度接続しようとしたら、再起動する
	        if(systemStart){
	            window.location.href = unescape(window.location.pathname);
	        }

	        console.log( "connect" );

	        // クライアントからサーバーへ送信
	        ioSocket.emit( "login", { 
	            reqId : reqId,
	            uniq_id : params.uniq_id
	        } );

	        ioSocket.on( "disconnect", function() {
	            console.log( "disconnect" );
	    
	            //接続を切る
	            ioSocket.disconnect();

	            alert("サーバーとの接続がきれました。　リロードしてください")
	        });

	        // サーバーからクライアントへの送り返し
	        ioSocket.on( "chat", function( data ) { 
	            parseComment( data );
	        });

	        // サーバーからクライアントへの送り返し
	        ioSocket.on( "system msg", function( data ) { 
	            if(data.userid !== void 0){
	                userid = data.userid;
	                systemStart = true;
	                console.log("ユーザーID受信 " + userid);
	                
	                var recentComment = (function(target){
	                	let tmp = [];
	                	for (var i = 0; i < target.length; i++) {
		                    if(target[i] !== null)
		                        tmp[tmp.length] = target[i];
	                    }

	                    tmp.sort(function(a,b){
					        if( a.no < b.no ) return -1;
					        if( a.no > b.no ) return 1;
					        return 0;
	                	});

	                	return tmp;
	                })(JSON.parse(data.recent));

	                for (var i = 0; i < recentComment.length; i++) {
                       	parseComment(recentComment[i]);
	                }
	            }
	        });
	    });
	}

	function systemReadyCheck(){
		if(NG.isReady()){
			initSocket();
		}else{
			console.log("not ready");
			setTimeout(function(){
				systemReadyCheck();
			},100);
		}
	}
	
	var init = function(){
    	setTimeout(function(){
			systemReadyCheck();
		},100);

		commentDraw = new jikkyou.CommentDraw();
		commentDraw.init($("#commentView")[0]);
	}

	$.extend(true, jikkyou, {
		"postComment" : postComment,
		"init" : init,
	});
})(window.jikkyou);