define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./zsghm-index.css');
	
	base.init();
	base.setTitle('赠送钢化膜');

	var customerId = cookie.getCookie('customerId'),
		identifier = (base.getQueryString("identifier") == null) ? 'CYGHMZS_01' : base.getQueryString("identifier");
	var s,e,d;
	ajax.get('activity/activityinfo/' + identifier,'json',function(data){
		if(data.status == 0){
			$(".font-color").html("<p>活动还未开始,敬请期待 </p>");
			return;
		}
		var hdata = data.data.activityExpalin.split('<p><br/></p>'),hdom = '';	
		for(i in hdata){hdom += hdata[i];}		
		$(".font-color").html(hdom);		
		s = data.data.startDate;
		e = data.data.endDate;
		d = Math.round(new Date().getTime());
		seDate(); 	
	});
	
	function seDate(){//计算活动开始结束时间
		if(d < s){
			$(".content").append('<a href="javascript:;" class="button button-fill">活动还未开始</a>');
			$(".button").css({"background":"#ccc","border":"none"});						
		}else if(d > s && d < e){
			$(".content").append('<a href="' + SAYIMO.SRVPATH + 'view/activity/zsghm/zsghm-list.html?activityId=1&identifier=' + identifier + '" class="button button-fill">立即参加</a>');	
		}else if(d > e){
			$(".content").append('<a href="javascript:;" class="button button-fill">活动已结束</a>');
			$(".button").css({"background":"#ccc","border":"none"});			
		}
	}
	
});