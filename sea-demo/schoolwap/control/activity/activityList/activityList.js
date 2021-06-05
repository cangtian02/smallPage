define(function(require, exports, module) {	
	$.init();	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./activityList.css');	
	base.init();
	base.setTitle('活动列表');	
	var isStudent = cookie.getCookie('isStudent');
	if(isStudent == 'Y'){
		$(".a-4").attr('href', SAYIMO.SRVPATH + 'view/activity/zxxszs/zxxszs-list.html');
	}else{
		$(".a-4").attr('href', SAYIMO.SRVPATH + 'view/default/activeStudentReg.html');
	}
	$(".a-1").attr('href', SAYIMO.SRVPATH + 'view/activity/zsghm/zsghm-index.html');
	$(".a-5").attr('href', SAYIMO.SRVPATH + 'view/activity/bk/bk-goodsList.html');
	$(".a-6").attr('href', SAYIMO.SRVPATH + 'view/activity/reserved/reservedDailypurchase.html');
	$(".a-7").attr('href', SAYIMO.SRVPATH + 'view/activity/reserved/reservedAthalfprice.html');
	$(".a-2").attr('href', SAYIMO.SRVPATH + 'view/activity/miaoqiang/miaoqiang-list.html');
	$(".a-3").attr('href', SAYIMO.SRVPATH + 'view/activity/tuangou/tuangou-list.html');	
});