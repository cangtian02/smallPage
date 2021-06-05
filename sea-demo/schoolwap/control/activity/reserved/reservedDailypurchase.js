define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./reservedDefault.css');
	
	base.init();
	base.setTitle('每日限购');

	var goodsName = '',
		identifier = 'YY_MRXG_001';
	
	var s,e,d,flag = false;	
	ajax.get('activity/activityinfo/' + identifier,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var hdata = data.activityExpalin.split('<p><br/></p>'),hdom = '';	
		for(i in hdata){hdom += hdata[i];}	
		$("#bottom-content").html(hdom);
		s = data.startDate;
		e = data.endDate;
		d = Math.round(new Date().getTime());
		seDate(); 	
	});
	
	//计算活动开始结束时间
	function seDate(){
		if(d < s){
			$("#reservedGoodList").html(base.noList('活动即将开始'));
			flag = false;
		}else if(d > s && d < e){
			getAjax();
			flag = true;
		}else if(d > e){
			$("#reservedGoodList").html(base.noList('活动已结束'));
			flag = false;
		}
	}

	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			if(flag == true){
				goodsName = v;
				getAjax();
			}else{
				$.errtoast($(".ck-none p").text());
			}			
		}//搜索框回调
	});
		
	function getAjax(){
		ajax.get('goods/getactivitygoodslist/' + identifier + '?goodsName=' + goodsName,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			var htmldata = '',
				classList = data.goodsList;
			if(classList.length > 0){
				for(var i = 0; i < classList.length; i++){
					htmldata += '<li>' +
								'	<a href="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + classList[i].goodsId + '&normsValueId=' + classList[i].normsValueId + '&isActivity=1&identifier=' + identifier + '">' +
								'		<img class="lazy" data-lazyload="' + classList[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' +
								'		<div class="i">' +
								'			<span class="r red">￥<i>' + classList[i].preferentialPrice + '</i></span>' +
								'			<div class="l">' +
								'				<h1 class="red">' + classList[i].goodsName + '</h1>' +
								'				<p class="ellipsis">' + classList[i].story + '</p>' +
								'			</div>' +
								'		</div>' +
								'	</a>' +
								'</li>';				
				}
				$("#reservedGoodList").html(htmldata);
				var laz = require('LazyLoad');
				laz.init();//图片懒加载
			}else{
				$("#reservedGoodList").html(base.noList('商品正在路上'));
			}		
		});
	}
	
	$(".bottom-close").on('click',function(){
		$(".bottom-model").hide();
	});	
	
});