define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./search.css');
	
	window.jsObj.setLoadUrlTitle('商品搜索');	

	var goodsName = (base.getQueryString("goodsName") == null) ? '' : base.getQueryString("goodsName");
		
	var search = require('search');
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的内容',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '1',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		searchCall: function(v){
			goodsName = v;		
			getAjax(v);
		},//搜索框回调
		searchListCall: function(v){
			goodsName = v;			
			getAjax(v);
		}//搜索内容回调
	});	

	if(goodsName != ''){$("#search").val(decodeURIComponent(goodsName));}	
	
	var lazy = require('LazyLoad');
	function getAjax(){
		$("#classGoodList").html('');
		$("#base_load").show();
		ajax.get('goods/searchgoodsbyname?goodsName=' + encodeURIComponent(encodeURIComponent(goodsName)),'json',function(data){
			$("#base_load").hide();//隐藏load
			if(data.status == 0){
				$("#classGoodList").html(base.noList('啊哦，暂无你搜索的商品哦！'));
				return;
			}	
			data = data.data;
			if(data.length > 0){
				var htmldata = '';
				for(var i = 0; i < data.length; i++){
					htmldata += '<li data-id="' + data[i].goodsId + '" data-normsvalueid="' + data[i].normsValueId + '">' +
								'	<div class="dis bgf">' +
								'		<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
								'		<div class="tt ellipsis">' + data[i].goodsName + '</div>' +
								'		<div class="money"><font><span class="arial">￥</span>' + data[i].preferentialPrice.toFixed(2) + '</font><del><span class="arial">￥</span>' + data[i].originalPrice.toFixed(2) + '</del></div>' +
								'	</div>' +
								'</li>';	
				}			
				$("#classGoodList").html(htmldata);		
				lazy.init();
				$("#classGoodList li").each(function(){
					$(this).off('click').on('click',function(){						
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + $(this).attr('data-id') + '&normsValueId=' + $(this).attr('data-normsvalueid'));
					});
				});	
			}else{
				$("#classGoodList").html(base.noList('啊哦，暂无你搜索的商品哦'));			
			}			
		});
	}
	getAjax();

});