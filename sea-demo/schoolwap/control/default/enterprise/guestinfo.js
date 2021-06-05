define(function(require, exports, module) {	
	$.init();	
	var base = require('base');
	require('./guestinfo.css');
	$(".content").append('<a href="' + SAYIMO.SRVPATH + 'view/enterprise/guestregister.html" class="button button-fill">立即报名</a>');	
	$("#audio_btn").click(function(){
		var music = document.getElementById("music");
		if(music.paused){
			music.play();
			$("#music_btn").attr("src", SAYIMO.SRVPATH + "images/enterprise/play.png");
		}else{
			music.pause();
			$("#music_btn").attr("src", SAYIMO.SRVPATH + "images/enterprise/pause.png");
		}
	});	
	function audioAutoPlay(id){
	    var audio = document.getElementById(id);
	    audio.play();
	    document.addEventListener("WeixinJSBridgeReady", function () {
	            audio.play();
	    }, false);
	}
	audioAutoPlay('music');	
});