define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./reservedOrdersList.css');
	
	window.jsObj.setLoadUrlTitle('预定预约订单');
	
	var ordersFun = function(){
		var self = this;

		var _tab = base.getQueryString('tab') == null ? 0 : base.getQueryString('tab');		
		if(_tab > 0){base.getActiveTab(Number(_tab) + 1);}
		var touchTab = require('touchTab');
		touchTab(_tab);

		//获取数据
		var customerId = window.jsObj.readUserData('id'),
			ajax_data,
			status = [1,2,3,6,4,5],//状态数组
			pageNow = 1,
			pageSize = 5,
			loading = false;
		
		var lazy = require('LazyLoad');
		
		this.getAjax = function(I,_data){
			loading = true;
			if(pageNow == 1){$(".tab.active .ment-list").html('');}			
			ajax.get('preorders/getpreorderslist' + _data,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}				
				data = data.data;
				var orderList = data.ordersList;
				if(orderList.length == 0){					
					if(pageNow == 1){
						$(".tab.active .ment-list").html(base.noMent('您还没有相关订单'));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();								
				}else{
					var htmldata = '',
						topdata = '',
						lidata = '',
						botdata = '';	
					for(var i = 0; i < orderList.length; i++){
						var goodsList = orderList[i].goodsList;
						topdata += '<li data-goodsid="' + goodsList[0].id + '" data-ordersId = "' + orderList[i].preOrdersId + '" data-isActivity = "' + orderList[i].isActivity + '" data-identifier = "' + orderList[i].identifier + '" data-seckillTimesId = "' + orderList[i].seckillTimesId + '" data-startDate = "' + orderList[i].seckillStartDate + '" data-endDate = "' + orderList[i].seckillEndDate + '">' +  
							'<div class="top">' + 
							'	<span class="fr">' + self.setOrderStatus(orderList[i].status) + '</span>' + 
							'	<span class="l">订单号：' + orderList[i].ordersNo + '</span>' + 
							'</div>';											
						lidata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersDetail.html?ordersId=' + orderList[i].preOrdersId + '" class="cont alist">' + 
						'	<div class="l">' + 
						'		<img class="lazy" data-lazyload="' + goodsList[0].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' + 
						'	</div>' + 
						'	<div class="r">' + 
						'		<h1>' + goodsList[0].goodsName + '</h1>' + 
						'		<div class="r_price">' + 
						'			<em class="r_price_o"><span class="arial">￥</span><span class="n">' + goodsList[0].transactionPrice.toFixed(2) + '</span></em>' + 
						'			<del class="r_price_p"><span class="arial">￥</span>	<span class="n">' + goodsList[0].sellPrice.toFixed(2) + '</span></del>' + 
						'		</div>' + 
						'		<div class="num ellipsis">' + goodsList[0].normsValue + ' x' + goodsList[0].buyNum + '</div>' + 
						'	</div>' + 
						'</a>';
						providerPhone = goodsList[0].providerPhone;						
						botdata += 	'<div class="main clearfix">' + 
							'<div class="fr"><span class="red arial">合计: ￥</span><span class="n red">' + orderList[i].sumMoney.toFixed(2) + '</span></div>' +
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
					lazy.init();										
					self.control();//控制中心																		
				}
				loading = false;
			});			
		}
				
		this.setOrderStatus = function(status){
			switch(status){
				case 1:
					return '待支付';
					break;
				case 2:
					return '待受理';
					break;
				case 3:
					return '待确认';
					break;
				case 6:
					return '待评价';
					break;
				case 4:
					return '已完成';
					break;
				case 5:
					return '已失败';
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
						'	<a href="javascript:;" class="l" id="cancel">取消预约</a>' + 	
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					var canBtn = '';
					if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
						canBtn = '	<a href="javascript:;" class="r" id="cancel">取消预约</a>';
					}				
					btn = '<div class="btn">' + canBtn + 
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">预约完成</a>' + 
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="evaluate">我要评价</a>' + 
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 
						'</div>';					
					return btn;
					break;
				case 4:
					btn = '<div class="btn">' + 
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 
						'</div>';				
					return btn;
					break;
				case 5:
					btn = '<div class="btn">' + 
						'	<a data-tel="' + providerPhone + '" href="javascript:;" class="l" id="tel">联系商家</a>' + 
						'</div>';				
					return btn;
					break;						
				default:
					btn = '';	
					return btn;
					break;
			}			
		}
	
		this.control = function(){
			$(".tab li").each(function(){
				$(this).find('a').off('click').on('click',function(){
					window.jsObj.loadContent($(this).attr('data-url'));
				});//进入详情
				$(this).find('#tel').off('click').on('click',function(){				
					window.jsObj.callPhone($(this).attr('data-tel'));										
				});//联系商家				
				$(this).find('#cancel').off('click').on('click',function(){
					self.cancel($(this).parents('li').attr('data-ordersId'));										
				});//取消订单
				$(this).find('#receipt').off('click').on('click',function(){
					self.receipt($(this).parents('li').attr('data-ordersId'));						
				});//预约完成
				$(this).find('#payment').off('click').on('click',function(){
					var ordersId = $(this).parents('li').attr('data-ordersId'),
						isActivity = $(this).parents('li').attr('data-isActivity'),
						identifier = $(this).parents('li').attr('data-identifier'),
						seckillTimesId = $(this).parents('li').attr('data-seckillTimesId');				
					var payHref = '';
					if(isActivity == 1 && identifier == 'YY_SPMQ'){
						payHref = '&isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
					}else if(isActivity == 1){
						payHref = '&isActivity=' + isActivity + '&identifier=' + identifier;
					}				
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/reservedPay.html?ordersId=' + ordersId + payHref + '&soure=orders');			
				});//立即支付
				$(this).find('#evaluate').off('click').on('click',function(){
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/comment/reservedAddComment.html?goodsId=' + $(this).parents('li').attr('data-goodsId') + '&ordersId=' + $(this).parents('li').attr('data-ordersId') + '&soure=orders');
				});//我要评价				
			});	
		}

		this.cancel = function(orderId){//取消订单
			$.confirm('确认取消该订单？',
				function () {
					ajax.post('preorders/cancelpreorder',{"orderId": orderId},'json',function(data){
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
				function (){
					ajax.post('preorders/confirmrecieve',{"preOrdersId": orderId,"customerId": customerId},'json',function(data){
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
				window.history.replaceState({title: "",url: ""}, "预定预约订单", SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=' + tab_i);
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