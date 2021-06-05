define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax'); 
		
	require('./find.css');
	require('botbar');//config.js 里有配置  没有./开头的 都在config.js里
	
	base.init();
	base.setTitle('发现');
	
	ajax.get('base/getadpositionlistbytag/find','json',function(data){
		if(data.status == 0){
			return;
		}
		var adpositionList = data.data.adpositionList,
			htmldata = '',
			i = 0;
		for(i = 0; i < adpositionList.length; i++){
			htmldata += '<li><a href="' + adpositionList[i].adLink + '"><img src="' + adpositionList[i].photoUrl + '" /></a></li>';
		}			
		htmldata = '<div class="slide-container"><ul class="slide-main">' + htmldata + '</ul><ul class="slide-pagination"></ul></div>';
		$(".content").prepend(htmldata);
		var slide = require('slide'),isautoplay = false;
		i > 1 ? isautoplay = true : isautoplay = false;
		slide = new slide({'autoplay': isautoplay});		
	});

	var customerId = cookie.getCookie('customerId');

	var findMenu_top = [
		{
			'name': '校企快讯',
			'url': SAYIMO.SRVPATH + 'view/find/information/informationList.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_express.png'			
		},
		{
			'name': '创客汇',
			'url': SAYIMO.SRVPATH + 'view/find/information/campusvisitors.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_hacker.png'			
		},		
		{
			'name': '创客大赛',
			'url': SAYIMO.SRVPATH + 'view/activity/ckds/ckds-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_competition.png'			
		},
		{
			'name': '兼职招聘',
			'url': SAYIMO.SRVPATH + 'view/find/positionDemand/positionDemandList.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_recruit.png'			
		},
		{
			'name': '创客商城',
			'url': SAYIMO.SRVPATH + 'view/class/classList.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_shop.png'			
		},		
		{
			'name': '职业课堂',
			'url': SAYIMO.SRVPATH + 'view/find/education/education-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_professional.png'			
		},
		{
			'name': '破屏险',
			'url': SAYIMO.PPX + customerId,
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_popingxian.png'			
		},
		{
			'name': '手机回收',
			'url': SAYIMO.SJHS + customerId,
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_phone.png'			
		},
		{
			'name': '顺维修',	
			'url': SAYIMO.SWX + customerId,
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_weixiu.png'			
		},
		{
			'name': '赏金猎人',
			'url': SAYIMO.SRVPATH + 'view/find/reward/reward-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_bounty hunter.png'			
		},
		{
			'name': '物品转让',
			'url': SAYIMO.SRVPATH + 'view/find/transfer/transfer-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_assignment.png'			
		},
		{
			'name': '投票评选',
			'url': SAYIMO.SRVPATH + 'view/activity/vote/vote-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_toupiao.png'			
		},
		{
			'name': '好人好报',
			'url': '',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_haoren.png'			
		},
		{
			'name': '圆梦园',
			'url': '',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_mengxiang.png'			
		}		
	];	
	
	var findMenu_bot = [
		{
			'name': '团购',
			'url': SAYIMO.SRVPATH + 'view/activity/tuangou/tuangou-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_Group purchase.png'			
		},
		{
			'name': '秒抢',
			'url': SAYIMO.SRVPATH + 'view/activity/miaoqiang/miaoqiang-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_second grab.png'			
		},
		{
			'name': '一起砍价',
			'url': SAYIMO.SRVPATH + 'view/activity/yqkj/yqkj-list.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_find_Bargain.png'			
		},
		{
			'name': '活动专区',
			'url': SAYIMO.SRVPATH + 'view/activity/activityList.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_present.png'			
		},
		{
			'name': '预定预约',
			'url': SAYIMO.SRVPATH + 'view/reserved/reservedGoodList.html',
			'img': SAYIMO.SRVPATH + 'images/find/find_icon/icon_subscribe.png'			
		}
	];	
	var hd_t = '',hd_b = '';	
	for(var i = 0; i < findMenu_top.length; i++){
		hd_t += '<div class="col-25" data-url="' + findMenu_top[i].url + '">' +
				'	<img src="' + findMenu_top[i].img + '">' +
				'	<p>' + findMenu_top[i].name + '</p>' +
				'</div>';
	}
	if(findMenu_top.length%4 != 0){
		for(var j = 0; j < 4 - findMenu_top.length%4; j++){
			hd_t += '<div class="col-25"></div>'; 
		}		
	}
	for(var i = 0; i < findMenu_bot.length; i++){
		hd_b += '<div class="col-25" data-url="' + findMenu_bot[i].url + '">' +
				'	<img src="' + findMenu_bot[i].img + '">' +
				'	<p>' + findMenu_bot[i].name + '</p>' +
				'</div>';
	}
	if(findMenu_bot.length%4 != 0){
		for(var j = 0; j < 4 - findMenu_bot.length%4; j++){
			hd_b += '<div class="col-25"></div>'; 
		}		
	}	
	$(".content").append('<div class="row no-gutter">' + hd_t + '</div><div class="row no-gutter">' + hd_b + '</div>');
	$('.no-gutter div').each(function(){
		$(this).on('click',function(){
			var u = $(this).attr('data-url');
			if(typeof(u) != 'undefined'){
				if(u != ''){
					window.location.href = u;
				}else{
					var t = $(this).find('p').text();
					$.modal({
					    title: '<div class="toast_title">' + t + '</div>',
					    text: '<div class="toast_content">栏目正在建设中，敬请期待…</div>',
					    buttons: [{text: '确定',bold: true}]
				    });
				}
			}
		});		
	});
});