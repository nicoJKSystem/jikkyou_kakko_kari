(function(global){
	//オプションの取得
	//形式はkey1=val1&key2=val2
	function getOption(option){
		var obj = {};

		if(option.length != 0){
			var elements = option.split('&');
			for(var i = 0; i < elements.length; i++) {
		    	var k = elements[i].split('=');
		    
		    	if(k.length == 2)
		    		obj[k[0]] = decodeURIComponent(k[1]);
		    	else
		    		obj[k[0]] = void 0;
		    }
		}

	    return obj;
	}

	//読み込まれたスクリプトファイルの一覧を取得してその中からファイル名を探してURL引数を取得
	function getJsParam( fn ) { 
	    var scripts = document.getElementsByTagName( 'script' );
	    var script; var params = {};
	    
	    for(var i=0; i<scripts.length; i++ ) {
	        var s = scripts.item( i );
	        
	        if(s.src.indexOf( fn ) != -1) { 
	            script = s;
	            break;
	        }
	    }

	    if(script) {
	        script.src.match( /(.*)(\?)(.*)/ );
	        
	        if(RegExp.$3) {   
	            return getOption(RegExp.$3);
	        }
	    }

	    return false;
	}
	
	//URL
	function getUrlParam(){
		//?の部分を取り除いた部分を調べる
		return getOption(location.search.substring(1));
	}

	function escape(ch){
		ch = ch.replace(/&/g,"＆;") ;
	    ch = ch.replace(/"/g,"”") ;
	    ch = ch.replace(/'/g,"’") ;
	    ch = ch.replace(/</g,"＜") ;
	    ch = ch.replace(/>/g,"＞") ;
	    return ch ;
	}

	function escape2(ch){
		ch = ch.replace(/&/g,"&amp;") ;
	    ch = ch.replace(/"/g,"&quot;") ;
	    ch = ch.replace(/'/g,"&#039;") ;
	    ch = ch.replace(/</g,"&lt;") ;
	    ch = ch.replace(/>/g,"&gt;") ;
	    return ch;
	}

	global.util = {
		getUrlParam : getUrlParam,
		getJsParam : getJsParam,
		escape : escape2
	};
})(window.jikkyou);