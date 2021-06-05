define(function(require, exports, module) {
	require('./groupBuying.css');
	function groupBuying(d,groupInfo,callback){
		var htmldata = '<div class="groupBuying">' +
						'<div class="groupBuying-top tc"><i></i>距离活动结束时间：<span>0</span> 天 <span>0</span> 时 <span>0</span> 分 <span>0</span> 秒</div>' +
						'<div class="groupBuying-bot boxflex">' +
						'	<dl class="tc"><dt>可团购数</dt><dt><span class="red">' + groupInfo.number + '</span>件</dt></dl>' +
						'	<dl class="tc"><dt>已团购</dt><dt><span class="red">' + groupInfo.alreadyBuy + '</span>件</dt></dl>' +
						'</div>' +
					'</div>';
		$(d).append(htmldata);

		var dDate = Math.round(new Date().getTime()),//当前时间
			s = groupInfo.startDate,
			e = groupInfo.endDate,
			t = '';
			
		if(dDate >= s && dDate <= e){
			t = '距离活动结束时间：';
			stSetInterval(true);
			callback(2);
		}else if(dDate >= s && dDate > e){
			$(".groupBuying-top").html('<i></i>活动已结束');
			callback(3);			
		}else if(dDate < s){
			t = '距离活动开始时间：';
			callback(1);
			stSetInterval(false);
		}
		
		function stSetInterval(f){
			setInterval(function(){
				var c = 0;
				dDate = Math.round(new Date().getTime());
				f == true ? c = e - dDate : c = s - dDate;
				if(c < 1000){
					setTimeout(function(){window.location.reload();},600);
					return;
				}//当时间差小于1秒时return，600ms后刷新页面进入最新抢购状态				
				var dd = Math.floor(c/1000/60/60/24),
					hh = Math.floor((c - dd*24*60*60*1000)/1000/60/60),
					mm = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000)/1000/60),
					ss = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000 - mm*60*1000)/1000);	
				$(".groupBuying-top").html('<i></i>' + t + '<span>' + dd + '</span> 天 <span>' + hh + '</span> 时 <span>' + mm + '</span> 分 <span>' + ss + '</span> 秒');													
			},1000);
		}
		
	}
	module.exports = groupBuying;
});