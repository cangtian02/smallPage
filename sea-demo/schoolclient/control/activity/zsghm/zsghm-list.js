define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./zsghm-list.css');
	
	window.jsObj.setLoadUrlTitle('免费赠送钢化膜');
	
	var activityId = base.getQueryString("activityId"),
		identifier = base.getQueryString("identifier"),
		goodsName = '';

	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '2',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		searchCall: function(v){
			goodsName = v;
			getAjax();
		},//搜索框回调
		searchListCall: function(v){
			goodsName = v;
			getAjax();	
		}//搜索内容回调
	});

	var lazy = require('LazyLoad');
	function getAjax(v){
		$("#classGoodList").html('');
		$("#base_load").show();
		ajax.get('goods/getactivitygoodslist/' + identifier + '?goodsName=' + goodsName,'json',function(data){
			$("#base_load").hide();//隐藏load
			if(data.status == 0){
				$("#classGoodList").html(base.noList('商品正在路上'));
				return;
			}
			data = data.data.goodsList;
			var htmldata = '';				
			if(data.length > 0){
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
				lazy.init();//刷新图片懒加载			
				$("#classGoodList li").each(function(){
					$(this).on('click',function(){
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + $(this).attr('data-id') + '&normsValueId=' + $(this).attr('data-normsvalueid') + '&isActivity=1&identifier=' + identifier);
					});
				});		
			}else{
				$("#classGoodList").html(base.noList('商品正在路上'));
			}			
		});
	}
	
	getAjax();
	
});