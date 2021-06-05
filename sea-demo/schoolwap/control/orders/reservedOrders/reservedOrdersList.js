define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./reservedOrdersList.css');
	
	base.init();
	base.setTitle('预定预约订单');
	
	var ordersFun = function(){
		var self = this;
		//处理tab切换
		var _tab = base.getQueryString('tab');		
		if(_tab != null){base.getActiveTab(_tab);}
		var touchTab = require('touchTab');
		touchTab(_tab);//tab拖动

		//获取数据
		var customerId = cookie.getCookie('customerId'),
			orderId = base.getQueryString('ordersId'),
			ajax_data,
			status = [1,2,3,6,4,5],//状态数组
			_status = '',
			pageNow = 1,//分页页数
			pageSize = 5,//一页数量
			loading = false;//加载状态
				
		this.getAjax = function(I){
			loading = true;
			ajax.get('preorders/getpreorderslist/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + _status,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$(".tab-link.active").addClass('y');
				data = data.data;
				var orderList = data.ordersList;
				if(orderList.length == 0){					
					if(pageNow == 1){
						$(".tab").eq(I).find('.ment-list').html(base.noMent('您还没有相关订单'));
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
						lidata += '<a href="' + SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersDetail.html?ordersId=' + orderList[i].preOrdersId + '" class="cont alist">' + 
						'	<div class="l">' + 
						'		<img class="lazy" data-lazyload="' + goodsList[0].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' + 
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
					$(".tab.active").find('.ment-list').append(htmldata);
					var laz = require('LazyLoad');
					laz.init();//刷新图片懒加载											
					if(orderList.length <= pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}										
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
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					var canBtn = '';
					if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
						canBtn = '	<a href="javascript:;" class="r" id="cancel">取消预约</a>';
					}				
					btn = '<div class="btn">' + canBtn + 
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">预约完成</a>' + 
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="evaluate">我要评价</a>' + 
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 
						'</div>';					
					return btn;
					break;
				case 4:
					btn = '<div class="btn">' + 
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 
						'</div>';				
					return btn;
					break;
				case 5:
					btn = '<div class="btn">' + 
						'	<a href="tel:' + providerPhone + '" class="l">联系商家</a>' + 
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
				$(this).find('#cancel').on('click',function(){
					var _this = $(this);
					if(_this.hasClass('one') == false){
						var ordersId = _this.parents('li').attr('data-ordersId');
						self.cancel(ordersId,_this);
						_this.addClass('one');
					}					
				});//取消订单
				$(this).find('#receipt').on('click',function(){
					var _this = $(this);
					if(_this.hasClass('one') == false){
						var ordersId = _this.parents('li').attr('data-ordersId');
						self.receipt(ordersId,_this);
						_this.addClass('one');
					}	
				});//预约完成
				$(this).find('#payment').on('click',function(){
					var ordersId = $(this).parents('li').attr('data-ordersId'),
						isActivity = $(this).parents('li').attr('data-isActivity'),
						identifier = $(this).parents('li').attr('data-identifier'),
						seckillTimesId = $(this).parents('li').attr('data-seckillTimesId');
					self.payment(ordersId,isActivity,identifier,seckillTimesId);
				});//立即支付
				$(this).find('#evaluate').on('click',function(){
					var _this = $(this).parents('li');
					var ordersId = _this.attr('data-ordersId');
					self.evaluate(ordersId,_this);
				});//我要评价				
			});	
		}

		this.cancel = function(orderId,_this){//取消订单
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
				},
				function () {
					_this.removeClass('one');
				}
			);				
		}

		this.receipt = function(orderId,_this){//确认收货
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('preorders/confirmrecieve',{"preOrdersId": orderId,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('预约完成');
						setTimeout(function(){window.location.reload();},1500);
					});
				},
				function () {
					_this.removeClass('one');
				}
			);				
		}
		
		this.payment = function(orderId,isActivity,identifier,seckillTimesId,startDate,endDate){//立即支付
			var payHref = '';
			if(isActivity == 1 && identifier == 'YY_SPMQ'){
				payHref = '&isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
			}else if(isActivity == 1){
				payHref = '&isActivity=' + isActivity + '&identifier=' + identifier;
			}				
			window.location.href = SAYIMO.SRVPATH + 'view/pay/reservedPay.html?ordersId=' + orderId + payHref;
		}
		
		this.evaluate = function(ordersId,_this){//我要评价
			var orderId = _this.attr('data-ordersid'),
				_goodsid = _this.attr("data-goodsId");
			window.location.href = SAYIMO.SRVPATH + 'view/comment/reservedAddComment.html?goodsId=' + _goodsid + '&ordersId=' + ordersId;
		}
		
		//初始化		
		if(_tab != null){
			_status = status[_tab - 2];
			self.getAjax(_tab - 1);
		}else{
			_status = '';	
			self.getAjax(0);				
		}
		$(".tab-link").each(function(){
			$(this).on('click',function(){
				var tab_i = $(this).index();
				window.history.replaceState({title: "",url: ""}, "预定预约订单", SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=' + (tab_i + 1));				
				if($(this).hasClass('y')){return;}
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();									
				if(tab_i == 0){
					_status = '';	
					self.getAjax(0);
				}else{
					_status = status[tab_i - 1];
					self.getAjax(tab_i);	
				}							
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;
			_tab = $(".tab-link.active").index() + 1;
			if(_tab != 0){
				_status = status[_tab - 2];
				self.getAjax(_tab - 1);				
			}else{
				_status = '';
				self.getAjax(0);
			}
			$.refreshScroller();
		});
		
	}
	ordersFun();
});