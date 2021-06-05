define(function(require, exports, module) {

	var base = require('base'),
		ajax = require('ajax'),
		cookie = require('cookie');
		
	var servletPath = window.location.href,
		sharePage_index = -1,
		sharePage = [
			"home.html",
			"goodsDetail.html",
			"transfer-detail.html",
			"reservedDetail.html",
			"yqkjDetail.html",
			"find.html",
			"education.html",
			"informationDetail.html",
			"downapp.html",
			"down_chmkkj_app.html",
			"positionDemandDetail.html",			
			"sharePage.html",
			"aboutWe.html",
			"reward-detail.html",
			"vote-detail.html",
			"mkkj.html",
			"guestad.html",
			"guestinfo.html",
			"guestregister.html",
			"ckds-index.html",
			"ckds-cyds.html"
		];
	
	for(var sharePage_index_i = 0; sharePage_index_i < sharePage.length; sharePage_index_i++){	
		if(servletPath.indexOf(sharePage[sharePage_index_i]) > 0){
			sharePage_index = 1;
			break;
		}
	}	
	
	setTimeout(function(){
		if(sharePage_index > 0){
			var isLogin = cookie.getCookie('isLogin');
			if((typeof isLogin != "" && isLogin == "Y") || servletPath.indexOf("mkkj.html") > 0 || servletPath.indexOf("downapp.html") > 0 || servletPath.indexOf("down_chmkkj_app.html") > 0){
				jsSdkShare();
			}else{
				onBridgeReady();
			}
		}else{
			onBridgeReady();
		}
	},100);

	function onBridgeReady(){
		if (typeof WeixinJSBridge == "undefined"){
		    if( document.addEventListener ){
		        document.addEventListener('WeixinJSBridgeReady', hideOptionMenu, false);
		    }else if (document.attachEvent){
		        document.attachEvent('WeixinJSBridgeReady', hideOptionMenu); 
		        document.attachEvent('onWeixinJSBridgeReady', hideOptionMenu);
		    }
		}else{
		    hideOptionMenu();
		}
	}
	
	function hideOptionMenu(){
		WeixinJSBridge.call('hideOptionMenu');//隐藏右上角菜单接口
	}  
			
	function jsSdkShare(){			
		ajax.get('api/signature','json',function(data){		
			if(data.status == 0){return;}	
			wx.config({
			    debug: false, //是否开启调试模式，仅在pc端时才会打印。
			    appId: SAYIMO.APPID, //公众号的唯一标识
			    timestamp: data.data.timestamp, //生成签名的时间戳
			    nonceStr: data.data.nonceStr, //生成签名的随机串
			    signature: data.data.signature, //签名
			    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'showMenuItems', 'showOptionMenu', 
			    'showAllNonBaseMenuItem'] //需要使用的JS接口列表
			});	
			wx.ready(function(){
				wx.showAllNonBaseMenuItem();       		//显示所有功能按钮接口
				wx.showOptionMenu();					//显示右上角菜单接口
				wx.showMenuItems({						//批量显示功能按钮接口
			    	menuList: [
			    		"menuItem:share:appMessage",    //发送给朋友
			    		"menuItem:share:timeline",      //分享到朋友圈:
			    		"menuItem:share:qq",            //分享到QQ
			    		"menuItem:share:weiboApp",		//分享到Weibo
			    		"menuItem:favorite",			//收藏
			    		"menuItem:share:QZone",			//分享到QQ空间
			    		"menuItem:copyUrl",				//复制链接
			    		"menuItem:openWithQQBrowser",	//在QQ浏览器中打开
			    		"menuItem:openWithSafari"		//在Safari中打开
			    	]
				});
				wx.onMenuShareAppMessage(shareData());
				wx.onMenuShareTimeline(shareData());
				wx.onMenuShareQQ(shareData());												
				wx.onMenuShareQZone(shareData());
			});			
		});
	}
	
	function shareData(){
		var imgUrl = SAYIMO.SRVPATH + 'images/default/shareimgs.png',
			_link = SAYIMO.SRVPATH + 'view/default/login.html',
			title = '彩虹梦客空间校企联盟，让大学生有“位”来',
			desc = '彩虹梦客空间创客公益服务平台，全面落实李克强总理"大众创业，万众创新"指示，帮助大学生实现实训、实习、创业、就业，助推民企品牌，点击立即关注...',
			_linkPath = window.location.protocol + "//" + window.location.hostname + window.location.pathname,
			queryString = base.getAllQueryString(),
			openId = cookie.getCookie('openId'),
			parentAlias = cookie.getCookie('alias');
		
		// 商品详情
		if(servletPath.indexOf("goodsDetail.html") > 0 || servletPath.indexOf("reservedDetail.html") > 0 || servletPath.indexOf("transfer-detail.html") > 0){
			title = $("#goodsName").text();
			_link = _linkPath + window.location.search;				
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}				
			imgUrl = $(".slide-main li:first-child img").attr('src');
		}
		// 尚一快讯
		else if(servletPath.indexOf("informationDetail.html") > 0){
			title = $(".news-title").text();
			_link = _linkPath + window.location.search;
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}
		}		
		// 主页、发现
		else if(servletPath.indexOf("home.html") > 0 || servletPath.indexOf("find.html") > 0){
			_link = _linkPath;
			if(queryString.indexOf("parentOpenId") < 0){
				_link += "?parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
			}	
		}
		// 分享页面	
		else if(servletPath.indexOf("sharePage.html") > 0){
			_link += "?parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
		}
		// 活动列表	
		else if(servletPath.indexOf("activityList.html") > 0){
			title = SAYIMO.TITLE + '活动专区等你来！';
			_link = _linkPath + window.location.search;
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}
		}
		// 下载彩虹梦客人才APP	
		else if(servletPath.indexOf("downapp.html") > 0){
			title = '彩虹梦客人才APP';
			_link = _linkPath;
			desc = '彩虹梦客人才App，帮助企业免费招聘大学、中专人才，助推民企品牌';
		}
		// 下载彩虹梦客空间APP	
		else if(servletPath.indexOf("down_chmkkj_app.html") > 0){
			title = '彩虹梦客空间APP';
			_link = _linkPath;
			desc = '彩虹梦客空间App，彩虹梦客空间为大学生提供创业就业、实习实训的平台，让大学生有“位”来';
		}

		// 企业家创客汇	
		else if(servletPath.indexOf("guestad.html") > 0 || servletPath.indexOf("guestinfo.html") > 0 || servletPath.indexOf("guestregister.html") > 0){
			title = '尚一校企联盟-企业家创客汇';
			desc = '尚一企业家创客汇对接全国2845所高校资源，点击进入...';
			_link = SAYIMO.SRVPATH + 'view/default/enterprise/guestinfo.html';
		}
		
		//一起砍价
		else if(servletPath.indexOf("yqkjDetail.html") > 0){
			title = '一起来砍价';
			imgUrl = $(".slide-main li:first-child img").attr('src');			
			desc = $("#shareText").html();
			_link = decodeURIComponent($("#shareUrl").html());
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}			
		}
		
		//赏金猎人
		else if(servletPath.indexOf("reward-detail.html") > 0){
			title = '【赏金猎人】' + $("#rewardName").text();
			_link = _linkPath + window.location.search;				
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}				
			imgUrl = $(".slide-main li:first-child img").attr('src');			
		}

		//邀请投票
		else if(servletPath.indexOf("vote-detail.html") > 0){
			title = '邀请好友来一票';
			imgUrl = $(".headPhoto img").attr('src');			
			desc = $(".name").text() + '正在参加彩虹梦客空间《万金征集一句话》活动，帮TA投一票，助TA领取大奖！';
			_link = _linkPath + window.location.search;
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}			
		}
		//梦客空间宣传片
		else if(servletPath.indexOf("mkkj.html") > 0){
			title = '大学生找兼职找工作，企业找人才，就上[彩虹梦客人才]！';
			_link = _linkPath;
		}
		//万金征集一句话|立德育人，摄影大赛
		else if(servletPath.indexOf("ckds-index.html") > 0){
			var identifier = base.getQueryString('identifier');
			if(identifier == 'WJZJYJH'){
				title = '万金征集一句话';
				desc = '彩虹梦客空间，《万金征集一句话》活动，快来参加吧';
				imgUrl = $(".slide-main li:first-child img").attr('src');
			}
			if(identifier == 'SYDS'){
				title = '【立德育人 感动瞬间】摄影大赛';
				desc = '彩虹梦客空间，【立德育人 感动瞬间】摄影大赛，快来参加吧';
				imgUrl = $(".slide-main li:first-child img").attr('src');
			}
			_link = _linkPath + window.location.search;
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}
		}
		//2017第一季彩虹杯创业大赛
		else if(servletPath.indexOf("ckds-cyds.html") > 0){
			title = '2017第一季彩虹杯创业大赛';
			desc = '【2017第一季彩虹杯创业大赛】由彩虹梦客空间发起，多家企业、产品爱心支持，提供五款家庭生活用品、办公学习用品、健康食品为更广大同学们时间创业、营销比赛，学生的就业创业活动与宣传';
			_link = _linkPath + window.location.search;
			if(typeof queryString != 'undefined' && queryString != ""){
				if(queryString.indexOf("parentOpenId") < 0){
					_link += "&parentOpenId=" + openId + "&parentAlias=" + encodeURIComponent(parentAlias);
				}
			}
		}
		
		return	{
			title: title, 	// 分享标题
		    desc: desc, 	// 分享描述
		    link: _link, 	// 分享链接
		    imgUrl: imgUrl, // 分享图标
		    success: function (res) { 
		        $.errtoast("分享成功");
		    },
		    cancel: function (res) {
		        $.errtoast("取消分享");
		    }
		};	
	}
	
});