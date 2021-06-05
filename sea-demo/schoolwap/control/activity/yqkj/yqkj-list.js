define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./yqkj-list.css');
	
	base.init();
	base.setTitle('一起砍价');

	ajax.get('activity/selectbasecutbyidentifier/PT_KJ','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		if(data.length == 0){
			$(".content").html(base.noList('暂无砍价活动'));
		}else{
			var htmldata = '';
			for(var i = 0; i < data.length; i++){
				htmldata += '<li data-startdate="' + data[i].startDate + '" data-enddate="' + data[i].endDate + '">' +
							'<a href="' + SAYIMO.SRVPATH + 'view/activity/yqkj/yqkjDetail.html?goodsId=' + data[i].goodsId + '&normsValueId=' + data[i].normsValueId + '&isActivity=1&identifier=' + data[i].identifier + '">' +
							'	<div class="top">' +
							'		<div class="l">' +
							'			<img src="' + data[i].photoPath + '">' +
							'		</div>' +
							'		<div class="r">' +
							'			<div class="name clamp_2">' + data[i].goodsName + '</div>	' +
							'			<div class="price">' +
							'				<div><del>原价：' + data[i].preferentialPrice.toFixed(2) + '</del></div>' +
							'				<span class="red">最低价：' + data[i].minPrice.toFixed(2) + '</span>' +
							'				<i></i>' +
							'			</div>' +
							'			<div class="num ellipsis">' + data[i].normsValue + '</div>' +
							'		</div>' +
							'	</div>' +
							'	<div class="time">' +
							'		<i></i>距离活动时间：<span>0</span>&nbsp;天&nbsp;<span>0</span>&nbsp;时&nbsp;<span>0</span>&nbsp;分&nbsp;<span>0</span>&nbsp;秒' +
							'	</div>' +
							'</a>' +
						'</li> ';
			}
			$("#yqkjList").html(htmldata);
			$("#base_load").hide();
			setIntervalTime();
		}
	});

	function setIntervalTime(){
		setInterval(function(){
			var d = Math.round(new Date().getTime());
			$(".yqkjList li").each(function(){
				var s = $(this).attr('data-startDate'),
					e = $(this).attr('data-endDate'),
					c = 0,
					w = '';
				d > s ? c = e - d : c = s - d;
				d > e ? c = d - e : d = d; 
				d > s ? w = '距离结束时间' : w = '距离开始时间';
				d > e ? w = '活动已结束' : w = w;
				if(c < 1000){
					setTimeout(function(){window.location.reload();},600);
					return;
				}//当时间差小于1秒时return，600ms后刷新页面进入最新砍价状态
				var dd = Math.floor(c/1000/60/60/24),
					hh = Math.floor((c - dd*24*60*60*1000)/1000/60/60),
					mm = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000)/1000/60),
					ss = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000 - mm*60*1000)/1000);
				dd < 10 ? dd = '0' + dd : dd = String(dd);
				hh < 10 ? hh = '0' + hh : hh = String(hh);
				mm < 10 ? mm = '0' + mm : mm = String(mm);
				ss < 10 ? ss = '0' + ss : ss = String(ss);				
				var t = '<i></i>' + w + '：<span>' + dd + '</span>&nbsp;天&nbsp;<span>' + hh + '</span>&nbsp;时&nbsp;<span>' + mm + '</span>&nbsp;分&nbsp;<span>' + ss + '</span>&nbsp;秒';
				$(this).find('.time').html(t);				
			});
		},1000);		
	}
 
});