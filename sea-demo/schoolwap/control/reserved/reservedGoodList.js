define(function(require, exports) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./reservedGoodList.css');
	
	base.init();
	base.setTitle('预定预约');	
	
	$("#tj").attr('href', SAYIMO.SRVPATH + 'view/activity/reserved/reservedAthalfprice.html');
	$("#mq").attr('href', SAYIMO.SRVPATH + 'view/activity/reserved/reservedSecondstorob.html');
	$("#mrxg").attr('href', SAYIMO.SRVPATH + 'view/activity/reserved/reservedDailypurchase.html');
	
	var pageSize = 10,
		pageNow = 1,
		loading = false,
		goodsName = '',
		calsssId = base.getQueryString("id"),//分类id
		isSearch = false;
				
	var laz = require('LazyLoad');
	
	function getAjax(){
		loading = true;	
		ajax.get('pregoods/getgoodslist/' + pageSize + '/' + pageNow + '?calsssId=' + calsssId + '&goodsName=' + goodsName,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			var htmldata = '',
				classList = data.data.goodsList;
			if(classList.length > 0){
				for(var i = 0; i < classList.length; i++){
					htmldata += '<li>' +
								'	<a href="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + classList[i].preGoodsId + '&normsValueId=' + classList[i].normsValueId + '">' +
								'		<img class="lazy" data-lazyload="' + classList[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' +
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
				$("#reservedGoodList").append(htmldata);				
				laz.init();//刷新图片懒加载
				if(pageNow >= 1){
					if(classList.length < pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}
				}
				loading = false;
			}else{
				if(pageNow == 1){
					$("#reservedGoodList").html(base.noList('商品正在路上'));
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();				
				}else{
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
				}
				loading = false;
			}
			if(!isSearch){
				var search = require('search');	
				search({
					searchId: 'search',//搜索框id
					placeholder: '请输入您要找的商品名称',
					searchType: 'p',//搜索dom格式 p：公共格式
					isOpensugges: false,//不开启模糊搜索提示
					searchCall: function(v){
						pageNow = 1;
						loading = false;
						goodsName = v;
						$("#reservedGoodList").html('');
						$.attachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').show();			
						getAjax();
					}//搜索框回调
				});
				isSearch = true;
			}			
		});		
	}
	
	setTimeout(function(){
		getAjax();
	},200);
	
	$(document).on('infinite', '.infinite-scroll-bottom',function() {
		if (loading) return;
		pageNow++;
		getAjax();
		$.refreshScroller();
	});

});