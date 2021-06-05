define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./myTransfer-List.css');	
	
	base.init();
	base.setTitle('我的转让');
	
	var fun_transferList = function(){
		var self = this;
		
		var	customerId = cookie.getCookie('customerId'),
			pageNow = 1,
			pageSize = 10,
			loading = false,
			transferList = $("#transferList");
		
		var laz = require('LazyLoad');
		
		this.getMytransferList = function(){
			ajax.get('base/mytransfergoods/' + customerId + '/' + pageNow + '/' + pageNow,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data.goodsList;
				if(data.length == 0){
					if(pageNow == 1){
						transferList.html(base.noList('暂无转让商品'));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					var htmlData = '';
					for(var i = 0; i < data.length; i++){
						htmlData += '<li>' +
									'<a href="' + SAYIMO.SRVPATH + 'view/find/transfer/transfer-detail.html?id=' + data[i].id + '">' +
						    		'	<div class="l"><img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></div>' +
						    		'	<div class="r">' +
						    		'		<div class="t clamp_2">' + data[i].goodsName + '</div>' +
						    		'		<div class="p red"><span class="arial">￥</span>' + data[i].price.toFixed(2) + '</div>' +
						    		'		<div class="i justifyAlign"><span>' + data[i].className + '</span><span>' + data[i].codeName + '</span></div>' +
						    		'	</div>' +
						    		'</a>' +
						    		'</li>';
					}
					if(pageNow == 1){
						transferList.html(htmlData);
					}else{
						transferList.append(htmlData);
					}
					laz.init();
					if(data.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();
					}
				}
				loading = false;
			});
		}
		
		self.getMytransferList();
		
		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			loading = true;
			pageNow++;
			self.getMytransferList();
			$.refreshScroller();
		});
		
		$("#insertTransfer").on('click',function(){
			window.location.href = SAYIMO.SRVPATH + 'view/find/transfer/insertTransfer.html';
		});
		
	}
	fun_transferList();	
});