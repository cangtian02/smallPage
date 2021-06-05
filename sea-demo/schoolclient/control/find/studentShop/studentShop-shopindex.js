define(function(require, exports, module) {
	$.init();
	var base = require('base'),
		ajax = require('ajax');
	require('./studentShop-shopindex.css');
	
	var providerId = base.getQueryString('providerId'),
		goodsName = '',
		pageSize = 10,
		pageNow = 1,
		loading = false;	
	
	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '搜索本店商品',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			pageNow = 1;
			goodsName = v;
			getGoodslist();
		}//搜索框回调
	});	
	
	ajax.get('base/getproviderinfo/' + providerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('系统繁忙，请稍后重试');
			return;
		}
		data = data.data;
		window.jsObj.setLoadUrlTitle(data.providerName);
		if(data.rotationPhotoUrls != null && data.rotationPhotoUrls != undefined && data.rotationPhotoUrls != '' && data.rotationPhotoUrls.length > 0){
			var slidedata = '';
			for(var i = 0; i < data.rotationPhotoUrls.length; i++){
				slidedata += '<li><img src="' + data.rotationPhotoUrls[i] + '" /></li>';
			}	
			slidedata = '<div class="slide-container"><ul class="slide-main">'+ slidedata + '</ul><ul class="slide-pagination"></ul></div>';
			$("#pPlayer").append(slidedata);
			var slide = require('slide'),isautoplay = false;
			data.rotationPhotoUrls.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay});
		}		
		$("#providerUrl").attr('src', data.providerUrl);
		$("#providerName").html(data.providerName);
		$(".html-content").html(data.description);
		$("#telPhone").on('click',function(){
			window.jsObj.callPhone(data.telPhone);
		});
		getGoodslist();
	});
	
	function getGoodslist(){
		loading = true;
		ajax.get('base/getprovidergoodslist/' + providerId + '/' + pageSize + '/' + pageNow + '?goodsName=' + goodsName,'json',function(data){
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}
			data = data.data.goodsList;
			var htmldata = '';				
			if(data.length > 0){
				var lazy = require('LazyLoad');
				for(var i = 0; i < data.length; i++){
					htmldata += '<li data-id="' + data[i].goodsId + '" data-normsvalueid="' + data[i].normsValueId + '">' +
								'	<div class="dis bgf"><img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
								'		<div class="tt ellipsis">' + data[i].goodsName + '</div>' +
								'		<div class="money"><font><span class="arial">￥</span>' + data[i].preferentialPrice.toFixed(2) + '</font><del><span class="arial">￥</span>' + data[i].originalPrice.toFixed(2) + '</del></div>' +
								'	</div>' +
								'</li>';	
				}			
				if(pageNow == 1){
					$(".classGoodList").html(htmldata);
				}else{
					$(".classGoodList").append(htmldata);
				}					
				if(data.length < pageSize){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
				}
				lazy.init();
				$(".classGoodList li").each(function(){
					$(this).on('click',function(){
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/class/goodsDetail.html?isStudent=1&goodsId=' + $(this).attr('data-id') + '&normsValueId=' + $(this).attr('data-normsvalueid'));
					});
				});
			}else{			
				if(pageNow == 1){
					$(".classGoodList").html(base.noList('暂无商品'));				
				}											
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();
			}
			loading = false;			
		});		
	}
	
	$(document).on('infinite', '.infinite-scroll-bottom',function() {
		if($(".tab-link.active").index() == 0){
			if (loading) return;
			pageNow++;
			getGoodslist();
			$.refreshScroller();
		}
	});
	
});