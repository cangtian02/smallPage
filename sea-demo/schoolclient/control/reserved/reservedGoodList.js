define(function(require, exports) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./reservedGoodList.css');
	
	window.jsObj.setLoadUrlTitle('预定预约');
	
	$('#tj').on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/reserved/reservedAthalfprice.html');
	});
	$('#mq').on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/reserved/reservedSecondstorob.html');
	});
	$('#mrxg').on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/reserved/reservedDailypurchase.html');
	});

	var pageSize = 10,
		pageNow = 1,
		loading = true,
		goodsName = '';

	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			pageNow = 1;
			goodsName = v;		
			getAjax();
		}//搜索框回调
	});
				
	var lazy = require('LazyLoad');
	
	function getAjax(){
		loading = true;	
		ajax.get('pregoods/getgoodslist/' + pageSize + '/' + pageNow + '?goodsName=' + goodsName,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			var htmldata = '',
				classList = data.data.goodsList;
			if(classList.length > 0){
				for(var i = 0; i < classList.length; i++){
					htmldata += '<li>' +
								'	<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + classList[i].preGoodsId + '&normsValueId=' + classList[i].normsValueId + '">' +
								'		<img class="lazy" data-lazyload="' + classList[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
								'		<div class="i">' +
								'			<span class="arial r red">￥<i>' + classList[i].preferentialPrice + '</i></span>' +
								'			<div class="l">' +
								'				<h1 class="red">' + classList[i].goodsName + '</h1>' +
								'				<p class="ellipsis">' + classList[i].story + '</p>' +
								'			</div>' +
								'		</div>' +
								'	</a>' +
								'</li>';				
				}
				if(pageNow == 1){
					$("#reservedGoodList").html(htmldata);
				}else{
					$("#reservedGoodList").append(htmldata);
				}
				lazy.init();//刷新图片懒加载
				if(classList.length < pageSize){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
				}				
				$("#reservedGoodList li").each(function(){
					$(this).find('a').off('click').on('click',function(){
						window.jsObj.loadContent($(this).attr('data-url'));
					});
				});				
			}else{
				if(pageNow == 1){
					$("#reservedGoodList").html(base.noList('商品正在路上'));			
				}
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();									
			}	
			loading = false;
		});		
	}
	
	getAjax();
	
	$(document).on('infinite', '.infinite-scroll-bottom',function() {
		if (loading) return;
		pageNow++;
		getAjax();
		$.refreshScroller();
	});
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		pageNow = 1;
		getAjax();
		$.pullToRefreshDone('.pull-to-refresh-content');
	});
	
});