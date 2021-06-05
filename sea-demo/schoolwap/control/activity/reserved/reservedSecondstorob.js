define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./reservedDefault.css');
	require('./reservedSecondstorob.css');
	
	base.init();
	base.setTitle('秒抢专区');

	var goodsName = '',
		identifier = 'YY_SPMQ';
	
	var flag = false;	
	ajax.get('activity/ selectbaseseckillidentifier/' + identifier,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var hdata = data.activityExpalin.split('<p><br/></p>'),hdom = '';	
		for(i in hdata){hdom += hdata[i];}	
		$("#bottom-content").html(hdom);
		getAjax();
	});
	
	$(".bottom-close").on('click',function(){
		$(".bottom-model").hide();
	});	
	
	function getAjax(){
		ajax.get('activity/selectbaseseckilltimesidentifier/' + identifier,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			if(data.seckillTimes.length == 0){
				$(".content").html(base.noList('暂无秒杀活动'));
			}else{
				require('dateFormat');
				var n = new Date(),
					d = Math.round(new Date().getTime()),
					buttonsdata = '',
					tabsdata = '',
					t = '',
					c = '';
				flag = false;
				for(var i = 0; i < data.seckillTimes.length; i++){
					n.setTime(data.seckillTimes[i].startDate);
					c = '';
					if(d >= data.seckillTimes[i].startDate && d <= data.seckillTimes[i].endDate){
						t = '秒抢中';
						c = ' active mqz';
						flag = true;
					}else if(d >= data.seckillTimes[i].startDate && d > data.seckillTimes[i].endDate){
						t = '已结束';
						c = ' yjs';
					}else if(d < data.seckillTimes[i].startDate){
						t = '即将开始';
						c = ' jjks';
					}
					buttonsdata += '<a href="#tab' + (i + 1) + '" id="btab' + (i + 1) + '" class="tab-link button' + c + '" data-id="' + data.seckillTimes[i].id + '" data-startDate="' + data.seckillTimes[i].startDate + '" data-endDate="' + data.seckillTimes[i].endDate + '">' + n.format('HH:mm') + '<br>' + t + '</a>';
					tabsdata += '<div id="tab' + (i + 1) + '" class="tab' + c + '"><ul class="reservedGoodList"></ul></div>';
				}
				tabsdata = '<div class="tabs">' + tabsdata + '</div>';
				if(data.seckillTimes.length < 5){
					buttonsdata = '<div class="buttons-tab fixed-tab">' + buttonsdata + '</div>';			
				}else{
					buttonsdata = '<div class="buttons-tab fixed-tab"><div class="touchTab" id="touchTab"><div class="touchTab-list" id="touchTab-list"><ul>' + buttonsdata + '</ul></div></div></div>';
				}
				$(".content").html(buttonsdata + tabsdata);
				var _tab = 0;
				if(flag == true){
					_tab = $(".buttons-tab .tab-link.active").index();
				}else if($(".buttons-tab .tab-link.jjks").length > 0){
					_tab = $(".buttons-tab .tab-link.jjks:first-child").index();
					$(".buttons-tab .tab-link.jjks:first-child").addClass('active');
					$(".tab").eq(_tab).addClass('active');
				}else{
					_tab = 0;
					$(".buttons-tab .tab-link").eq(_tab).addClass('active');
					$(".tab").eq(_tab).addClass('active');
				}		
				if(data.seckillTimes.length > 4){			
					var touchTab = require('touchTab');
					touchTab(_tab);//tab拖动
				}
				renderDom(_tab);
				$(".buttons-tab .tab-link").each(function(){
					$(this).on('click',function(){
						if($(this).hasClass('y') == false){
							var ii = $(this).index();
							renderDom(ii);
						}
					});
				});
				stSetInterval();//定时器		
			}
		});
	}
	
	function stSetInterval(){
		setInterval(function(){
			var d = Math.round(new Date().getTime());//当前时间
			if($(".buttons-tab .mqz").length > 0){
				if(d > parseInt($(".tab-link.mqz").eq(0).attr('data-enddate'))){
					setTimeout(function(){window.location.reload();},500);
					return;				
				}				
			}else{
				if(d > parseInt($(".tab-link.jjks").eq(0).attr('data-startdate'))){
					setTimeout(function(){window.location.reload();},500);
					return;				
				}			
			}
		},1000);	
	}
	
	function renderDom(_tab){
		var id = $(".buttons-tab .tab-link").eq(_tab).attr('data-id'),
			startDate = $(".buttons-tab .tab-link").eq(_tab).attr('data-startDate'),
			endDate = $(".buttons-tab .tab-link").eq(_tab).attr('data-endDate');
		ajax.get('activity/ selectbaseseckillgoodsidentifier/' + identifier + '/' + id + '/0','json',function(data){		
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			if(data.seckillGoods.length == 0){
				$(".tab").eq(_tab).html(base.noList('商品正在路上'));
				return;
			}
			var htmldata = '',classList = data.seckillGoods;
			for(var i = 0; i < classList.length; i++){
				htmldata += '<li>' +
							'	<a href="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + classList[i].goodsId + '&normsValueId=' + classList[i].normsValueId + '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + id + '&startDate=' + startDate + '&endDate=' + endDate + '">' +
							'       <div class="icon_ljqg"></div>' + 
							'		<img src="' + classList[i].photoPath + '" />' +
							'		<div class="i">' +
							'			<span class="r red arial">￥<i>' + classList[i].preferentialPrice + '</i></span>' +
							'			<div class="l">' +
							'				<h1 class="red">' + classList[i].goodsName + '</h1>' +
							'				<p class="ellipsis">' + classList[i].story + '</p>' +
							'			</div>' +
							'		</div>' +
							'	</a>' +
							'</li>';				
			}		
			$(".tab").eq(_tab).find('.reservedGoodList').html(htmldata);
			$(".buttons-tab .tab-link").eq(_tab).addClass('y');
		});
	}	
	
});