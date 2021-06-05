define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./goodsOrdersList.css');
	
	window.jsObj.setLoadUrlTitle('商品订单');
	
	var ordersFun = function(){
		var self = this;
		
		var _tab = base.getQueryString('tab') == null ? 0 : base.getQueryString('tab');		
		if(_tab > 0){base.getActiveTab(Number(_tab) + 1);}
		var touchTab = require('touchTab');
		touchTab(_tab);

		//获取数据
		var customerId = window.jsObj.readUserData('id'),
			ajax_data,
			status = [1,2,3,6,7],//状态数组
			pageNow = 1,
			pageSize = 5,
			loading = true;		
				
		this.getAjax = function(I,_data){
			loading = true;
			if(pageNow == 1){$(".tab.active .ment-list").html('');}	
			ajax.get('order/getorderslist' + _data,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				var orderList = data.orderList;
				if(orderList.length == 0){					
					if(pageNow == 1){
						$(".tab").eq(I).find('.ment-list').html(base.noMent('您还没有相关订单'));
						$('#btab' + (I + 1) + ' em').remove();
					}					
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();								
				}else{
					var htmldata = '',
						topdata = '',
						lidata = '',
						botdata = '',
						logistcsCost = '';											
					for(var i = 0; i < orderList.length; i++){
						topdata += '<li data-ordersId = "' + orderList[i].ordersId + '">' + 
							'<div class="top">' + 
							'	<span class="fr">' + self.setOrderStatus(orderList[i].status) + '</span>' + 
							'	<span class="l">订单号：' + orderList[i].ordersNo + '</span>' + 
							'</div>';
						var goodsList = orderList[i].goodsList;
						if(goodsList.length > 2){
							for(var k = 0; k < goodsList.length; k ++){	
								lidata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersDetail.html?ordersId=[' + orderList[i].ordersId + ']" class="alist" data-isactivity="' + orderList[i].isActivity + '" data-name="' + goodsList[k].goodsName + '" data-goodsId="' + goodsList[k].id + '" data-isTurnBack="' + goodsList[k].isTurnBack + '" data-status="' + goodsList[k].status + '" data-canComment="' + goodsList[k].canComment + '">' + 
								'		<img class="lazy" data-lazyload="' + goodsList[k].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></a>';
							}
							lidata = '<div class="h">' + lidata + '</div>';
						}else{
							for(var k = 0; k < goodsList.length; k ++){	
								lidata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersDetail.html?ordersId=[' + orderList[i].ordersId + ']" class="cont alist" data-isactivity="' + orderList[i].isActivity + '" data-name="' + goodsList[k].goodsName + '" data-goodsId="' + goodsList[k].id + '" data-isTurnBack="' + goodsList[k].isTurnBack + '" data-status="' + goodsList[k].status + '" data-canComment="' + goodsList[k].canComment + '">' + 
								'	<div class="l">' + 
								'		<img class="lazy" data-lazyload="' + goodsList[k].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' + 
								'	</div>' + 
								'	<div class="r">' + 
								'		<h1>' + goodsList[k].goodsName + '</h1>' + 
								'		<div class="r_price">' + 
								'			<em class="r_price_o"><span class="arial">￥</span><span class="n">' + goodsList[k].transactionPrice.toFixed(2) + '</span></em>' + 
								'			<del class="r_price_p"><span class="arial">￥</span>	<span class="n">' + goodsList[k].sellPrice.toFixed(2) + '</span></del>' + 
								'		</div>' + 
								'		<div class="num ellipsis">' + goodsList[k].normsValue + ' x' + goodsList[k].buyNum + '</div>' + 
								'	</div>' + 
								'</a>';
							}
						}						
						if(orderList[i].logistcsCost > 0){
							logistcsCost = '(含运费' + orderList[i].logistcsCost + '元)'; 
						}else{
							logistcsCost = '(免运费)';
						}						
						botdata += 	'<div class="main">' + 
							'<span class="l">共' + goodsList.length + '件商品' + logistcsCost + '</span>' +
							'<div class="fr"><span class="red arial">合计: ￥</span><span class="n red">' + orderList[i].totalAmount.toFixed(2) + '</span></div>' +
							'</div>' + self.setOrderBtn(orderList[i].status,orderList[i].identifier) + 
						'</li>';
						htmldata += topdata + lidata + botdata;
						topdata = ''; lidata = ''; botdata = '';
					}	
					if(orderList.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}					
					if(pageNow == 1){
						$(".tab.active").find('.ment-list').html(htmldata);
					}else{
						$(".tab.active").find('.ment-list').append(htmldata);
					}					
					var lazy = require('LazyLoad');
					lazy.init();//刷新图片懒加载
					self.control();//控制中心																		
				}
				loading = false;
			});			
		}
				
		this.setOrderStatus = function(status){
			switch(status){
				case 1:
					return '待付款';
					break;
				case 2:
					return '待发货';
					break;
				case 3:
					return '待收货';
					break;
				case 6:
					return '待评价';
					break;
				case 7:
					return '已完成';
					break;					
				default:
					return '';
					break;
			}			
		}
		
		this.setOrderBtn = function(status,identifier){
			var btn = '';
			switch (status){
				case 1:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r active" id="payment">立即支付</a>' + 
						'	<a href="javascript:;" class="l" id="cancel">取消订单</a>' + 	
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					var canBtn = '';
					if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
						canBtn = '<a href="javascript:;" class="r" id="cancel">取消订单</a>';
					}
					btn = '<div class="btn">' + canBtn +
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:		
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">确认收货</a>' + 
						'	<a href="javascript:;" class="l" id="logistics">查看物流</a>' + 
						'	<a href="javascript:;" class="l" id="exit">申请售后</a>' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="evaluate">我要评价</a>' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 	
						'</div>';					
					return btn;
					break;
				case 7:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;					
				default:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
			}			
		}				
		
		this.control = function(){
			$(".tab.active li").each(function(){
				$(this).find('a').off('click').on('click',function(){
					window.jsObj.loadContent($(this).attr('data-url'));
				});//进入详情
				$(this).find('#tel').off('click').on('click',function(){				
					window.jsObj.loadContent(SAYIMO.KFURL);										
				});//联系客服				
				$(this).find('#cancel').off('click').on('click',function(){
					self.cancel($(this).parents('li').attr('data-ordersId'));				
				});//取消订单
				$(this).find('#receipt').off('click').on('click',function(){
					self.receipt($(this).parents('li').attr('data-ordersId'));
				});//确认收货				
				$(this).find('#payment').off('click').on('click',function(){
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/ordersPay.html?orderIds=[' + $(this).parents('li').attr('data-ordersId') + ']&soure=orders');
				});//立即支付
				$(this).find('#logistics').off('click').on('click',function(){
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/orderEmsTrack/orderEmsTrack.html?orderId=' + $(this).parents('li').attr('data-ordersId'));	
				});//查询物流
				$(this).find('#exit').off('click').on('click',function(){
					self.exit($(this).parents('li'));
				});//申请售后				
				$(this).find('#evaluate').off('click').on('click',function(){
					self.evaluate($(this).parents('li'));
				});//我要评价			
			});		
		}
		
		this.cancel = function(orderId){//取消订单
			$.confirm('确认取消该订单？',
				function () {
					ajax.post('order/cancelorder',{"orderId": orderId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('取消成功');
						setTimeout(function(){window.location.reload();},1500);
					});
				}
			);				
		}

		this.receipt = function(orderId){//确认收货
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('order/confirmreceive',{"customerId": customerId,"orderId": orderId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}						
						$.errtoast('收货成功');
						setTimeout(function(){window.location.reload();},1500);
					});
				}
			);				
		}

		this.exit = function(_this){//申请售后
			var orderId = _this.attr('data-ordersid'),
				_goodsId = [];
			_this.find("a.alist").each(function(){
				var _id = $(this).attr("data-goodsId"),
					name = $(this).attr("data-name"),
					isturnback = $(this).attr("data-isTurnBack"),
					_status = $(this).attr("data-status"),
					_isActivity = $(this).attr("data-isactivity");
				_goodsId.push({'id': _id,'name': name,'isturnback': isturnback,"status": _status,"isActivity": _isActivity});
			});
			if(_goodsId.length == 1){
				if(_goodsId[0].status == 1){
					if(_goodsId[0].isActivity == 1 || _goodsId[0].isturnback == 'N'){
						$.errtoast('该商品不支持退换货');
						return;
					}
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + _goodsId[0].id + '&ordersId=[' + orderId + ']');
				}else{
					$.errtoast('该商品已在退换货中');
				}
				return;
			}
			var _text = '';
			for(var i = 0; i < _goodsId.length; i++){
				var b_data = '';
				if(_goodsId[i].status == 1){
					if(_goodsId[i].isturnback == 'Y'){
						b_data = ' data-id="' + _goodsId[i].id + '" data-isturnback="' + _goodsId[i].isturnback + '"';
					}else{
						b_data = ' class="noback"';
					}
				}else{
					b_data = ' class="nostatus"';
				}
				_text += '<li' + b_data + '><em></em>' + _goodsId[i].name + '</li>';
			}
			_text = '<ul class="back-list">' + _text + '</ul>';
			$.modal({
				title: '选择商品进行退换货',
				text: _text,
				buttons: [
			        {
			        	text: '取消',
			        	onClick: function() {}
			        },
			        {
			        	text: '确定',
			        	close: false,
			        	onClick: function() {
							var _Id = $(".back-list li.active").attr('data-id');
							if( typeof(_Id) === 'undefined'){
								$.errtoast('请选择商品');
							}else{
								window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + _Id + '&ordersId=[' + orderId + ']');
							}
			          	}
			        }
				]					
			});																				
			$(".back-list li").each(function(){
				$(this).on('click',function(){
					if($(this).hasClass('noback')){
						$.errtoast('该商品不支持退换货');
					}else if($(this).hasClass('nostatus')){
						$.errtoast('该商品已在退换货中');
					}else{
						$(this).addClass('active').siblings('li').removeClass('active');
					}
				});
			});			
		}

		this.evaluate = function(_this){//我要评价
			var orderId = _this.attr('data-ordersid'),
				_goodsId = [];
			_this.find("a.alist").each(function(){
				var _id = $(this).attr("data-goodsId"),
					canComment = $(this).attr("data-canComment"),
					name = $(this).attr("data-name");
				_goodsId.push({'id': _id,'name': name,'canComment': canComment});
			});
			if(_goodsId.length == 1){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + _goodsId[0].id + '&ordersId=' + orderId);
				return;
			}		
			var _text = '';
			for(var i = 0; i < _goodsId.length; i++){
				var b_data = '';
				if(_goodsId[i].canComment == 0){
					b_data = ' class="nostatus"';
				}				
				_text += '<li' + b_data + ' data-id="' + _goodsId[i].id + '"><em></em>' + _goodsId[i].name + '</li>';
			}
			_text = '<ul class="back-list">' + _text + '</ul>';						
			$.modal({
				title: '选择商品进行评论',
				text: _text,
				buttons: [
			        {
			        	text: '取消',
			        	onClick: function() {}
			        },
			        {
			        	text: '确定',
			        	close: false,
			        	onClick: function() {
							var _Id = $(".back-list li.active").attr('data-id');
							if(typeof(_Id) === 'undefined'){
								$.errtoast('请选择商品');
							}else{
								window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + _Id + '&ordersId=' + orderId);
							}
			          	}
			        }
				]					
			});
			$(".back-list li").each(function(){
				$(this).on('click',function(){
					if($(this).hasClass('nostatus')){
						$.errtoast('该商品您已评论');
						return;
					}					
					$(this).addClass('active').siblings('li').removeClass('active');
				});
			});				
		}
		
		//初始化		
		if(_tab > 0){
			ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + status[_tab - 1];
			self.getAjax(_tab,ajax_data);
		}else{
			ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=';		
			self.getAjax(0,ajax_data);				
		}

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				if (loading) return;
				var tab_i = $(this).index();
				window.history.replaceState({title: "",url: ""}, "商品订单", SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=' + tab_i);				
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();									
				if(tab_i > 0){
					ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + status[tab_i - 1];
					self.getAjax(tab_i,ajax_data);	
				}else{
					ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=';
					self.getAjax(0,ajax_data);					
				}							
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;
			var in_tab = $(".tab-link.active").index();
			if(in_tab > 0){
				ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + status[in_tab - 1];		
			}else{
				ajax_data = '/' + customerId + '/' + pageSize + '/' + pageNow + '?status=';							
			}
			self.getAjax(in_tab,ajax_data);
			$.refreshScroller();
		});
		
	}
	ordersFun();
});