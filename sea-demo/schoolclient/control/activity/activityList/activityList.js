define(function(require, exports, module) {	
	$.init();	
	var base = require('base'),
		ajax = require('ajax');
	require('./activityList.css');	
	window.jsObj.setLoadUrlTitle('活动列表');	
	$(".a-1").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/zsghm/zsghm-index.html');
	});
	$(".a-2").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/miaoqiang/miaoqiang-list.html');
	});
	$(".a-3").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/tuangou/tuangou-list.html');
	});
	$(".a-5").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/bk/bk-goodsList.html');
	});
	$(".a-6").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/reserved/reservedDailypurchase.html');
	});
	$(".a-7").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/reserved/reservedAthalfprice.html');
	});
});