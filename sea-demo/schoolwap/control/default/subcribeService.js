define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		cookie = require('cookie');
	
	base.setTitle('登入');

	var appId = SAYIMO.APPID,
		state = base.getQueryString('state'),
		parentOpenId = cookie.getCookie('parentOpenId'),
		code = base.getQueryString('code'),
		redirectUrl = SAYIMO.SRVPATH + 'view/default/subcribeService.html';
	
	if(state == null){
		setTimeout(function(){
			window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(redirectUrl) + "&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect");
		},100);
	}else{
		// 传入code 与 parentOpenId 插入用户基础数据
		ajax.post('api/addsharecusotmer',{'code': code,'parentOpenId': parentOpenId},'json',function(data){
			if(data.status == 0){
				// 接口错误无法登入跳转微信素材页面
				setTimeout(function(){
					window.location.replace("http://mp.weixin.qq.com/s?__biz=MzIwMjE1NjgxMA==&mid=407126597&idx=1&sn=dbabeaa70457a18f5b3db1ef232dec5b&scene=0&previewkey=o87b1lPWX4hwpm%2ByNPkMMMwqSljwj2bfCUaCyDofEow%3D#wechat_redirect");
				},100);
				return;
			}
			queryOpenId(data);
		});
	}

	function queryOpenId(data){
		if(data.status == 0){
			// 接口错误无法登入跳转微信素材页面
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
		var requestUrlCookie = cookie.getCookie("requestUrlCookie");
		if(data.data.isFristLogin == 0 && data.data.isStudent != 'Y' && requestUrlCookie == ""){
			setTimeout(function(){location.replace(SAYIMO.SRVPATH + "view/default/activeStudentReg.html");},100);
		}else if(requestUrlCookie != ""){				
			window.location.replace(requestUrlCookie);
			cookie.setCookie('requestUrlCookie',null,-1);
		}else{	
			window.location.replace(SAYIMO.SRVPATH + "view/home/home.html");
		}
	}

});