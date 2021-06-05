define(function(require, exports, module) {
	require('./seckillTimes.css');
	function seckillTimes(d,s,e,callback){
		var htmldata = '<div class="list-block seckillTimes"><ul><li id="seckillTimes"><div class="fr state"></div><div class="fl red"><cite></cite>' +
						'			<div class="time"><span id="se_1">0</span>&nbsp;<span id="se_2">0</span><strong>&nbsp;:&nbsp;</strong><span id="se_3">0</span>&nbsp;<span id="se_4">0</span><strong>&nbsp;:&nbsp;</strong><span id="se_5">0</span>&nbsp;<span id="se_6">0</span></div>' +
						'</div></li></ul></div>';
		$(d).append(htmldata);

		var dDate = Math.round(new Date().getTime());//当前时间
		
		if(dDate >= s && dDate <= e){
			$("#seckillTimes .state").text('秒抢中');
			$("#seckillTimes .state").addClass('active');
			$("#seckillTimes cite").text('距离活动结束时间：');
			stSetInterval(true);
			callback(2);
		}else if(dDate >= s && dDate > e){
			$("#seckillTimes .state").text('已结束');
			$("#seckillTimes cite").text('活动已结束：');
			$("#seckillTimes .time").hide();
			callback(3);			
		}else if(dDate < s){
			$("#seckillTimes .state").text('即将开始');
			$("#seckillTimes cite").text('距离活动开始时间：');
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
				var hh = Math.floor(c/1000/60/60),
					mm = Math.floor((c - hh*60*60*1000)/1000/60),
					ss = Math.floor((c - hh*60*60*1000 - mm*60*1000)/1000);
				hh < 10 ? hh = '0' + hh : hh = String(hh);
				mm < 10 ? mm = '0' + mm : mm = String(mm);
				ss < 10 ? ss = '0' + ss : ss = String(ss);		
				$("#se_1").text(hh.substr(0,1));
				$("#se_2").text(hh.substr(1,2));													
				$("#se_3").text(mm.substr(0,1));
				$("#se_4").text(mm.substr(1,2));													
				$("#se_5").text(ss.substr(0,1));
				$("#se_6").text(ss.substr(1,2));														
			},1000);
		}
		
	}
	module.exports = seckillTimes;
});