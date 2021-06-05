define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		cookie = require('cookie');
	
	base.setTitle('登入');

	var appId = SAYIMO.APPID,
		state = base.getQueryString('state'),
		parentOpenId = base.getQueryString('parentOpenId') ? base.getQueryString('parentOpenId') : cookie.getCookie('parentOpenId'),
		redirectUrl = SAYIMO.SRVPATH + 'view/default/login.html';
	
	if(parentOpenId == ''){
		parentOpenId = 1;
	}else if(parentOpenId != 1){
		cookie.setCookie('parentOpenId',parentOpenId,24*60*60);
		cookie.setCookie('parentAlias',base.getQueryString('parentAlias'),24*60*60);
	}
		
	if(state == null){
		setTimeout(function(){
			window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(decodeURIComponent(redirectUrl)) + "&response_type=code&scope=snsapi_base&state=" + parentOpenId + "#wechat_redirect");
		},100);
	}else{
		if(state != null){
			parentOpenId = state;
		}else if(state == null){
			parentOpenId = 1;
		}
		if(parentOpenId == 1){
			ajax.get('api/getuserinfo?code=' + base.getQueryString('code'),'json',queryOpenId);
		}else{
			ajax.get('api/getuserinfo?code=' + base.getQueryString('code'),'json',queryShareUserOpenId);
		}
	}		
	
	function queryOpenId(data){
		if(data.status == 0 && data.error != 'undefined'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/login.html");},100);
			return;
		}
		if(data.status == 0 && data.subcribe != 'undefined'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/subcribeService.html");},100);
			return;
		}
		if(data.status == 0){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/login.html");},100);
			return;
		}
		cookie.setCookie("isLogin","Y",24*60*60);
		cookie.setCookie("openId",data.data.openId,24*60*60);
		cookie.setCookie("alias",data.data.alias,24*60*60);
		cookie.setCookie("customerId",data.data.id,24*60*60);
		cookie.setCookie("parentId",data.data.parentId,24*60*60);
		cookie.setCookie("isFristLogin",data.data.isFristLogin,24*60*60);
		cookie.setCookie("isStudent",data.data.isStudent,24*60*60);		
		if(data.data.isFristLogin == 0 && data.data.isStudent != 'Y'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/activeStudentReg.html");},100);
		}else{
			var addSubcribeOpt = cookie.getCookie("addSubcribeOpt"),
				addSubcribeUrl = cookie.getCookie("addSubcribeUrl"),
				requestUrlCookie = cookie.getCookie("requestUrlCookie");
			if(addSubcribeOpt != "" && addSubcribeOpt == "true"){ // 分享链接跳转
				if(addSubcribeUrl != ""){
					setTimeout(function(){
						window.location.replace(addSubcribeUrl.replace("parentOpenId", "_invalidParent_OpenId_"+(new Date()).getTime())
								.replace("parentAlias", "_invalidParent_Alias_"+(new Date()).getTime()));															
					},100);
					return;
				}
				setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/home/home.html");},100);
			}else{						
				if(requestUrlCookie != ""){
					setTimeout(function(){window.location.replace(requestUrlCookie);},100);
					cookie.setCookie('requestUrlCookie',null,-1); 
					return;
				} 
				setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/home/home.html");},100);						
			}
		}		
	}

	function queryShareUserOpenId(data){
		if(data.status == 0 && data.error != 'undefined'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/login.html");},100);
			return;
		}
		if(data.status == 0 && data.subcribe != 'undefined'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/subcribeService.html");},100);
			return;
		}
		if(data.status == 0){
			setTimeout(function(){
				window.location.replace("http://mp.weixin.qq.com/s?__biz=MzIwMjE1NjgxMA==&mid=407126597&idx=1&sn=dbabeaa70457a18f5b3db1ef232dec5b&scene=0&previewkey=o87b1lPWX4hwpm%2ByNPkMMMwqSljwj2bfCUaCyDofEow%3D#wechat_redirect");
			},100);
			return;
		}	
		cookie.setCookie("isLogin","Y",24*60*60);
		cookie.setCookie("openId",data.data.openId,24*60*60);
		cookie.setCookie("alias",data.data.alias,24*60*60);
		cookie.setCookie("customerId",data.data.id,24*60*60);
		cookie.setCookie("parentId",data.data.parentId,24*60*60);
		cookie.setCookie("isFristLogin",data.data.isFristLogin,24*60*60);
		cookie.setCookie("isStudent",data.data.isStudent,24*60*60);
		if(data.data.isFristLogin == 0 && data.data.isStudent != 'Y'){
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/default/activeStudentReg.html");},100);
		}else{
			var addSubcribeOpt = cookie.getCookie("addSubcribeOpt"),
				addSubcribeUrl = cookie.getCookie("addSubcribeUrl"),
				requestUrlCookie = cookie.getCookie("requestUrlCookie");
			if(requestUrlCookie != ""){
				setTimeout(function(){window.location.replace(requestUrlCookie);},100);
				cookie.setCookie('requestUrlCookie',null,-1); 
				return;
			} 
			setTimeout(function(){window.location.replace(SAYIMO.SRVPATH + "view/home/home.html");},100);
		}
	}

});