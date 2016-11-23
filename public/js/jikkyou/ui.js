$(function(){
	function postComment(){
		var comment = $("#comment").val();
		jikkyou.postComment(comment);
		$("#comment").val("");
	}

	$('#comment').keypress(function(e){
		//Enterキー
		if(e.which == 13){
			postComment();
			return false;
		}
	});

	$("#postButton").click(function () {
		postComment();
	});

	$('#ui-tab').tabs();

	//キャンバスのサイズを設定
	function refreshCanvaseSize(){
		var w = $('.wrapper').width();
		var h = $('.wrapper').height();
		$('#commentView').attr('width', w);
		$('#commentView').attr('height', h);
	}
	
	var w = $('.wrapper').width();
	var h = $('.wrapper').height();
	$('#commentView').attr('width', w);
	$('#commentView').attr('height', h);

	(function(){
		var widthRate = 0.6;
		var baseWidth = $("#mainWindow").width();
		$("#mainWindow").width(baseWidth);
		$("#leftWindow").width(parseInt(baseWidth * widthRate));
		$("#ui-tab").width(baseWidth - parseInt(baseWidth * widthRate));
		$("#ui-tab").css('margin-left', $("#leftWindow").width());

		var baseHeight = $("#mainWindow").height();
		$("#mainWindow").height(baseHeight);
		$("#leftWindow").height(baseHeight);
		$("#ui-tab").height(baseHeight);

		var uiHeight = $("#ui-tab ul").height();
		var paddingSpace = parseInt($('#fragment-comment').css('padding-top'), 10) + parseInt($('#fragment-comment').css('padding-bottom'), 10);

		$("#commentTable").height(baseHeight - uiHeight - paddingSpace);
		$("#fragment-comment").height(baseHeight - uiHeight - paddingSpace);
		$("#fragment-system").height(baseHeight - uiHeight - paddingSpace);

		refreshCanvaseSize();
	})();
	$("#ui-tab a[href='#fragment-comment']").trigger("click");
	jikkyou.init();
});