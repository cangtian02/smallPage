define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./miaoqiang-list.css');
	
	window.jsObj.setLoadUrlTitle('秒抢专区');
	
	$(".bottom-close").on('click',function(){
		$(".bottom-model").hide();
	});
	
	var identifier = ['YY_SPMQ','PT_SPMQ'],
		activityInfo = [],
	    flag = false;
		
	getAcinfo(0);
	getAjax(identifier[0],0);
	
	$(".buttons-tab .button").each(function(){
		$(this).on('click',function(){
			var i = $(this).index();		
			getAcinfo(i);
			if(!$(this).hasClass('flag')){
				getAjax(identifier[i],i);
			}
		});
	});
	
	function getAcinfo(i){
		if(typeof(activityInfo[i]) === 'undefined'){
			ajax.get('activity/selectbaseseckillidentifier/' + identifier[i],'json',function(data){
				if(data.status == 0){
					$(".bottom-model").hide();
					return;
				}
				data = data.data;
				var hdata = data.activityExpalin.split('<p><br/></p>'),hdom = '';	
				for(i in hdata){hdom += hdata[i];}
				activityInfo.push(hdom);
				$("#bottom-content").html(hdom);
				$(".bottom-model").show();
		    });			
		}else{
			$("#bottom-content").html(activityInfo[i]);
			$(".bottom-model").show();			
		}		
	}
	
	function getAjax(_identifier,j){	    
		ajax.get('activity/selectbaseseckilltimesidentifier/' + _identifier,'json',function(data){
			if(data.status == 0){
				$.errtoast('暂无秒杀活动');
				$("#tab" + (j + 1) ).html(base.noList('暂无秒杀活动'));
				return;
			}
			data = data.data;
			var ulClassName = '';
			j == 0 ? ulClassName = 'reservedGoodList' : ulClassName = 'ment-list';
			if(data.seckillTimes.length == 0){
				$("#tab" + (j + 1) ).html(base.noList('暂无秒杀活动'));
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
					buttonsdata += '<a href="javascript:;" class="btn' + c + '" data-id="' + data.seckillTimes[i].id + '" data-startDate="' + data.seckillTimes[i].startDate + '" data-endDate="' + data.seckillTimes[i].endDate + '">' + n.format('HH:mm') + '<br>' + t + '</a>';
					tabsdata += '<ul class="' + ulClassName + '"></ul>';
				}
				tabsdata = '<div class="lists">' + tabsdata + '</div>';
				if(data.seckillTimes.length < 5){
					buttonsdata = '<div class="btn-tab">' + buttonsdata + '</div>';			
				}else{
					buttonsdata = '<div class="btn-tab"><div class="touchTab" id="touchTab"><div class="touchTab-list" id="touchTab-list"><ul>' + buttonsdata + '</ul></div></div></div>';
				}			
				$("#tab" + (j + 1) ).html(buttonsdata + tabsdata);
				var _list = 0;
				if(flag == true){
					_list =$("#tab" + (j + 1) ).find(".btn-tab .btn.active").index();
				}else if($("#tab" + (j + 1) ).find(".btn-tab .btn.jjks").length > 0){
					_list = $("#tab" + (j + 1) ).find(".btn-tab .btn.jjks").eq(0).index();
					$("#tab" + (j + 1) ).find(".btn-tab .btn.jjks").eq(0).addClass('active');
					$("#tab" + (j + 1) ).find(".lists ul").eq(_list).addClass('active');
				}else{
					_list = 0;
					$("#tab" + (j + 1) ).find(".btn-tab .btn").eq(_list).addClass('active');
					$("#tab" + (j + 1) ).find(".lists ul").eq(_list).addClass('active');
				}
				if(data.seckillTimes.length > 4){			
					var touchTab = require('touchTab');
					touchTab(_list);//tab拖动
				}				
				renderDom(_list,j);
				$("#tab" + (j + 1) ).find(".btn-tab .btn").each(function(){
					$(this).on('click',function(){
						var ii = $(this).index();				        
				        $(this).addClass("active").siblings('a').removeClass("active");
				        $("#tab" + (j + 1) ).find(".lists ul").eq(ii).show().siblings("ul").hide();
						if($(this).hasClass('flag') == false){
							renderDom(ii,j);
						}						
					});
				});
				$('.tab-link.active').addClass('flag');
				stSetInterval(j);//定时器		
			}
		});
	}
		
	function renderDom(_list,j){
		var id = $("#tab" + (j + 1) ).find(".btn-tab .btn.active").attr('data-id'),
			startDate = $("#tab" + (j + 1) ).find(".btn-tab .btn.active").attr('data-startDate'),
			endDate = $("#tab" + (j + 1) ).find(".btn-tab .btn.active").attr('data-endDate');
		ajax.get('activity/selectbaseseckillgoodsidentifier/' + identifier[j] + '/' + id + '/' + j,'json',function(data){		
			if(data.status == 0){
				$.errtoast('商品正在路上');
				$("#tab" + (j + 1) ).find(".lists ul").eq(_list).html(base.noList('商品正在路上'));
				return;
			}
			data = data.data;
			if(data.seckillGoods.length == 0){
				$("#tab" + (j + 1) ).find(".lists ul").eq(_list).html(base.noList('商品正在路上'));
				return;
			}
			var htmldata = '',classList = data.seckillGoods;
			if(j == 0){
				for(var i = 0; i < classList.length; i++){
					htmldata += '<li>' +
							'	<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + classList[i].goodsId + '&normsValueId=' + classList[i].normsValueId + '&isActivity=1&identifier=' + identifier[j] + '&seckillTimesId=' + id + '">' +
							'       <div class="icon_ljqg"></div>' + 
							'		<img src="' + classList[i].photoPath + '" />' +
							'		<div class="i">' +
							'			<span class="r red arial">￥<i>' + classList[i].preferentialPrice + '</i></span>' +
							'			<div class="l">' +
							'				<h1 class="red">' + classList[i].goodsName + '</h1>' +
							'				<p class="ellipsis">' + classList[i].story + '</p>' +
							'</div></div></a></li>';
				}
			}else{
				for(var i = 0; i < classList.length; i++){
					htmldata += '<li>' +
							'<a class="cont" href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + classList[i].goodsId + '&normsValueId=' + classList[i].normsValueId + '&isActivity=1&identifier=' + identifier[j] + '&seckillTimesId=' + id + '">' +
							'    <div class="l"><img src="' + classList[i].photoPath + '" /></div>' + 
							'		 <div class="c">' +
							'			<div class="name clamp_2">' + classList[i].goodsName + '</div>' +
							'			<div class="price">最低价格:<span class="arial">￥</span>' + classList[i].preferentialPrice + '</div>' +
							'	<div class="r">' +
							'<span>'+classList[i].normsValue+'</span><div>立即开抢</div></div></div></a></li>';
				}			
			}	      
			$("#tab" + (j + 1) ).find(".lists ul").eq(_list).html(htmldata);
			$("#tab" + (j + 1) ).find(".lists ul").eq(_list).find('li').each(function(){
				$(this).find('a').on('click',function(){
					window.jsObj.loadContent($(this).attr('data-url'));
				});				
			});
			$("#tab" + (j + 1) ).find(".btn-tab .btn").eq(_list).addClass('flag');
		});
	}
	
	function stSetInterval(j){
		setInterval(function(){
			var d = Math.round(new Date().getTime());//当前时间
			if($("#tab" + (j + 1) ).find(".btn-tab .mqz").length > 0){
				if(d > parseInt($("#tab" + (j + 1) ).find(".btn.mqz").eq(0).attr('data-enddate'))){
					setTimeout(function(){window.location.reload();},500);
					return;				
				}				
			}else{
				if(d > parseInt($("#tab" + (j + 1) ).find(".btn.jjks").eq(0).attr('data-startdate'))){
					setTimeout(function(){window.location.reload();},500);
					return;				
				}			
			}
		},1000);	
	}
	
});