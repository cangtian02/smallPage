define(function(require, exports, module) {

	var cookie = require('cookie');
	require('./base.css');//导入公共css
	if(window.location.host == '127.0.0.1:8020'){
		cookie.setCookie('alias','苍天',60*60);
		cookie.setCookie('customerId','4320',60*60);
		cookie.setCookie('openId','oCgndvieb1AnHUXH6AqaKgXyuSE8',60*60);
		cookie.setCookie('isStudent','Y',60*60);
		cookie.setCookie('isFristLogin','1',60*60);
		cookie.setCookie('isLogin','Y',60*60);
	}
	
	function base(){
		this.init = function(){
			var cur_url = SAYIMO.SERVLETPATH,
				parentOpenId = base.getQueryString('parentOpenId'),
				isLogin = cookie.getCookie('isLogin'),
				isFristLogin = cookie.getCookie('isFristLogin'),
				isStudent = cookie.getCookie('isStudent'),
				customerId = cookie.getCookie('customerId');
			cookie.setCookie('requestUrlCookie',cur_url,24*60*60);	
			if((isLogin != 'Y' && parentOpenId == null)){
				window.location.href = SAYIMO.SRVPATH + 'view/default/login.html';
			}else if(isLogin != 'Y' && parentOpenId != null){
				$(".content").on('click',function(e){e.preventDefault();});
				var parentAlias = base.getQueryString('parentAlias'),
					addSubcribeOpt = 'true';
				cookie.setCookie('parentOpenId',parentOpenId,24*60*60);
				cookie.setCookie('parentAlias',parentAlias,24*60*60);
				cookie.setCookie('addSubcribeOpt',addSubcribeOpt,24*60*60);
				var subcribeLoginHtml = '<header style="font-size: .7rem;position: fixed;z-index: 159999;background: rgba(34,40,44,.8);top: 0;right: 0;left: 0;height: 2.2rem;">'+
				'	<div id="login" style="margin-top: .25rem;color: #FF0000;margin-right: .5rem;border: .05rem solid #FF0000;float: right;padding: .15rem .5rem;border-radius: .25rem;">立即登录</div>'+
				'	<div style="padding-left: .5rem;color:#FFFFFF;line-height: 2.2rem;">由你的好友<font color="red">' + decodeURIComponent(parentAlias) + '</font>推荐...</div>'+
				'</header>';
				$('body').prepend(subcribeLoginHtml);
				$("#login").on('click',function(){
					window.location.href = SAYIMO.SRVPATH + 'view/default/subcribeService.html';
				});
			}else if(customerId == '' || customerId == 'undefined' || customerId == null){
				window.location.href = SAYIMO.SRVPATH + 'view/default/login.html';
			}
		}//是否初始化验证登入
		this.setTitle = function(name){
			document.title = name + "_" + SAYIMO.TITLE;
		    var $body = $('body');
		    var $iframe = $("<iframe style='display:none;' src=" + SAYIMO.SRVPATH + "images/default/star.png></iframe>");
		    $iframe.on('load',function() {
		        setTimeout(function() {
		            $iframe.off('load').remove();
		        }, 0);
		    }).appendTo($body);			
		}//写入浏览器title				
		this.setCss = function(t){
		    var s = document.createElement('style');
		    s.innerText = t;
		    document.body.appendChild(s);			
		}//向页面写入css		
		this.getQueryString = function(name){ 		
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
		    	r = window.location.search.substr(1).match(reg);
		    if(r != null) return decodeURIComponent(r[2]); return null;
		}//获取页面参数值 有值传值无值传null
		this.getAllQueryString = function(){
		    var result = window.location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g")); 
		    if(result == null){return "";}
		    for(var i = 0; i < result.length; i++){result[i] = result[i].substring(1);}		    
			if(result.length > 1){
		    	var resultData = '';
				for(var i = 0; i < result.length; i++){
					resultData += result[i]+ '&';
				}
				return resultData;
			}else{
				return result;
			}		    		 	    
		}//获取QueryString的数组		
		this.noList = function(t){
			return '<div style="margin-top: 4.5rem;text-align:center;"><img src="' + SAYIMO.SRVPATH + 'images/default/ck-none.png" style="display:inline-block;width: 6rem;" /><p style="margin: .7rem 0;color: #817f7f;">' + t + '</p></div>';			
		}//无数据返回无数据dom
		this.noMent = function(t){
			return '<div class="no-list tc" style="margin-top: 4.5rem;"><i style="display: inline-block;width: 5rem;height: 5rem;border-radius: 50%;background: #C5C4C4;"><em style="display: inline-block;width: 2.4rem;height: 2.4rem;background: url(' + SAYIMO.SRVPATH + 'images/default/icon-noMentlist.png) center no-repeat;background-size: contain;margin-top: 1.3rem;"></em></i><p style="color: #817f7f;margin: .7rem 0;">' + t + '</p></div>';			
		}//无内容返回无内容dom
		this.baseLoad = function(){
			return '<div class="base_load" id="base_load"><span class="icon icon-refresh"></span></div>';
		}//加载dom
		this.getActiveTab = function(n){
			$(".buttons-tab a").removeClass("active");
			$(".buttons-tab #btab" + n).addClass("active");
			$(".tabs .tab").removeClass("active");
			$(".tabs #tab" + n).addClass("active");			
		}//处理tab切换		
	}//base end	
	var base = new base();	
	module.exports = base;
	require('wxcofing');// 导入微信配置
});