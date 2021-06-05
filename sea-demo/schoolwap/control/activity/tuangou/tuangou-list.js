define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./tuangou-list.css');
	
	base.init();
	base.setTitle('团购专区');

	var _tab = base.getQueryString('tab') == null ? _tab = 0 : _tab = base.getQueryString('tab');
	_tab = Number(_tab);
	if(_tab != 0){base.getActiveTab(_tab + 1);}

	getAjax(_tab);
	
	$(".buttons-tab .button").each(function(){
		$(this).on('click',function(){
			var i = $(this).index();
			window.history.replaceState({title: "",url: ""}, "团购专区", SAYIMO.SRVPATH + 'view/activity/tuangou/tuangou-list.html?tab=' + i);
			if($(this).hasClass('flag') == false){
				getAjax(i);
			}
		});
	});
	
	function getAjax(i){
		if(i == 0){
			ajax.get('activity/getgroupbuygoodslist/0','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				
				if(data.length > 0){
					var htmldata = '';
					for(var i = 0; i < data.length; i++){
						htmldata += '<li data-startDate="' + data[i].startDate + '" data-endDate="' + data[i].endDate + '">' +
							'<a href="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + data[i].goodsId + '&normsValueId=' + data[i].normsValueId + '&isActivity=1&identifier=' + data[i].identifier + '">' +
							'	<em></em>' +
							'	<img src="' + data[i].photoPath + '">' +
							'	<div class="bot">' +
							'		<span class="arial r red">￥<i>' + data[i].preferentialPrice + '</i></span>' +
							'		<div class="l"><div class="name red ellipsis">' + data[i].goodsName + '</div><p class="ellipsis">' + data[i].story + '</p></div>' +
							'	</div><div class="time red"><div class="time red"><i></i>距离活动时间：<span>00</span>&nbsp;天&nbsp;<span>00</span>&nbsp;时&nbsp;<span>00</span>&nbsp;分&nbsp;<span>00</span>&nbsp;秒</div></div></a></li>';
					}
					$(".reservedList").html(htmldata);
					$("#btab1").addClass('flag');
					setIntervalTime(0);
				}else{
					$(".reservedList").html(base.noList('暂无预约商品团购'));
				}
			});			
		}else{
			ajax.get('activity/getgroupbuygoodslist/1','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				if(data.length > 0){
					var htmldata = '';
					for(var i = 0; i < data.length; i++){
						htmldata += '<li data-startDate="' + data[i].startDate + '" data-endDate="' + data[i].endDate + '">' +
							'<a href="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + data[i].goodsId + '&normsValueId=' + data[i].normsValueId + '&isActivity=1&identifier=' + data[i].identifier + '">' +
							'<div class="top">' +
							'	<div class="l"><img src="' + data[i].photoPath + '"></div>' +
							'	<div class="r">' +
							'		<div class="name clamp_2">' + data[i].goodsName + '</div>' +
							'		<div class="price"><span class="arial">￥</span><span class="n">' + data[i].preferentialPrice + '</span><i></i></div>' +
							'	<div class="num ellipsis">购买数量在' + data[i].stockNum + '件可享受团购价格</div>' +
							'	</div></div><div class="time"><i></i>距离活动时间：<span>00</span>&nbsp;天&nbsp;<span>00</span>&nbsp;时&nbsp;<span>00</span>&nbsp;分&nbsp;<span>00</span>&nbsp;秒</div></a></li>';
					}
					$(".goodsList").html(htmldata);
					$("#btab2").addClass('flag');
					setIntervalTime(1);
				}else{
					$(".goodsList").html(base.noList('暂无普通商品团购'));
				}
			});				
		}
	}
	
	function setIntervalTime(i){
		setInterval(function(){
			var d = Math.round(new Date().getTime());
			$(".tab").eq(i).find('li').each(function(){
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
				}//当时间差小于1秒时return，600ms后刷新页面进入最新团购状态
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