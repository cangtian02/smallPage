define(function(require, exports, module) {
	$.init();
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./studentShop-shopindex.css');
	
	base.init();
	
	var providerId = base.getQueryString('providerId'),
		goodsName = '',
		pageSize = 10,
		pageNow = 1,
		loading = false,
		laz = require('LazyLoad'),
		classGoodsList = require('classGoodsList');	
	
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
		base.setTitle(data.providerName);
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
		$("#telPhone").attr('href', 'tel:' + data.telPhone);
		$(".html-content").html(data.description);
		getGoodslist();
	});
	
	function getGoodslist(){
		loading = true;
		ajax.get('base/getprovidergoodslist/' + providerId + '/' + pageSize + '/' + pageNow + '?goodsName=' + goodsName,'json',function(data){
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}
			var moduleData = [],
				classList = data.data.goodsList;
			if(classList.length > 0){			
				for(var i = 0; i < classList.length; i++){
					moduleData.push({
						'goodsId': classList[i].goodsId,
						'normsValueId': classList[i].normsValueId,
						'photoUrl': classList[i].photoUrl,
						'goodsName': classList[i].goodsName,
						'preferentialPrice': classList[i].preferentialPrice,
						'originalPrice': classList[i].originalPrice
					});
				}
				if(pageNow == 1){
					$(".classGoodList").html(classGoodsList(moduleData,pageNow));
				}else{
					$(".classGoodList").append(classGoodsList(moduleData,pageNow));
				}					
				laz.init();//刷新图片懒加载
				if(pageNow >= 1){
					if(classList.length <= pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}
				}
				$(".classGoodList li").each(function(){
					$(this).on('click',function(){
						var goodsId = $(this).attr('id'),
							normsValueId = $(this).attr('data-normsvalueid');						
						window.location.href = SAYIMO.SRVPATH + 'view/class/goodsDetail.html?isStudent=1&goodsId=' + goodsId + '&normsValueId=' + normsValueId;
					});
				});
			}else{			
				if(pageNow == 1){
					$(".classGoodList").html(base.noList('暂无此类商品'));				
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