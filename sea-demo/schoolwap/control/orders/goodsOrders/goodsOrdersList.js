define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./goodsOrdersList.css');
	
	base.init();
	base.setTitle('商品订单');
	
	var ordersFun = function(){
		var self = this;
		//处理tab切换
		var _tab = base.getQueryString('tab');		
		if(_tab != null){base.getActiveTab(_tab);}
		var touchTab = require('touchTab');
		touchTab(_tab);//tab拖动

		//获取数据
		var customerId = cookie.getCookie('customerId'),
			ajax_data,
			status = [1,2,3,6,7],//状态数组
			pageNow = 1,//分页页数
			pageSize = 5,//一页数量
			loading = false;//加载状态
			
		//获取订单各个状态是否有数据
		ajax.get('user/getpersonalcentercount/' + customerId,'json',function(data){
			if(data.status == 0){return;}
			if(data.data.payTotalCount > 0){
				$('#btab1').append('<em></em>');											
			}
			if(data.data.waitPayCount > 0){
				$('#btab2').append('<em></em>');												
			}
			if(data.data.waitSendCount > 0){
				$('#btab3').append('<em></em>');												
			}
			if(data.data.hasbeenSendCount > 0){
				$('#btab4').append('<em></em>');												
			}
			if(data.data.waitCommentsCount > 0){
				$('#btab5').append('<em></em>');												
			}
			var ywc = data.data.payTotalCount - data.data.waitPayCount - data.data.waitSendCount - data.data.waitCommentsCount - data.data.hasbeenReturnedCount;
			if(ywc > 0){
				$('#btab6').append('<em></em>');												
			}			
		});		
				
		this.getAjax = function(I,_data){
			loading = true;
			ajax.get('order/getorderslist/' + customerId +'/' + pageSize+ '/' + pageNow + '?[1,2,3,6,7]','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$(".tab-link.active").addClass('y');
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
						if(goodsList.length > 1){
							for(var k = 0; k < goodsList.length; k ++){	
								lidata += '<a href="' + SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersDetail.html?ordersId=[' + orderList[i].ordersId + ']" class="alist" data-isactivity="' + orderList[i].isActivity + '" data-name="' + goodsList[k].goodsName + '" data-goodsId="' + goodsList[k].id + '" data-isTurnBack="' + goodsList[k].isTurnBack + '" data-status="' + goodsList[k].status + '" data-canComment="' + goodsList[k].canComment + '">' + 
								'		<img class="lazy" data-lazyload="' + goodsList[k].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></a>';
							}
							lidata = '<div class="h">' + lidata + '</div>';
						}else{						
							lidata += '<a href="' + SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersDetail.html?ordersId=[' + orderList[i].ordersId + ']" class="cont alist" data-isactivity="' + orderList[i].isActivity + '" data-name="' + goodsList[0].goodsName + '" data-goodsId="' + goodsList[0].id + '" data-isTurnBack="' + goodsList[0].isTurnBack + '" data-status="' + goodsList[0].status + '" data-canComment="' + goodsList[0].canComment + '">' + 
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
					if($('#btab' + (I + 1) + ' em').length < 0){
						$('#btab' + (I + 1) ).append('<em></em>');
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
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					var canBtn = '';
					if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
						canBtn = '	<a href="javascript:;" class="r" id="cancel">取消订单</a>';
					}
					btn = '<div class="btn">' + canBtn +
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:		
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">确认收货</a>' + 
						'	<a href="javascript:;" class="l" id="logistics">查看物流</a>' + 
						'	<a href="javascript:;" class="l" id="exit">申请售后</a>' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="evaluate">我要评价</a>' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 	
						'</div>';					
					return btn;
					break;
				case 7:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;					
				default:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
			}			
		}				
		
		this.control = function(){
			$(".tab.active li").each(function(){											
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
				});//确认收货				
				$(this).find('#payment').on('click',function(){
					window.location.href = SAYIMO.SRVPATH + 'view/pay/ordersPay.html?ordersId=[' + $(this).parents('li').attr('data-ordersId') + ']';
				});//立即支付
				$(this).find('#logistics').on('click',function(){
					window.location.href = SAYIMO.SRVPATH + 'view/orders/orderEmsTrack/orderEmsTrack.html?orderId=' + $(this).parents('li').attr('data-ordersId');	
				});//查询物流
				$(this).find('#exit').on('click',function(){
					var _this = $(this).parents('li');
					self.exit(_this);
				});//申请售后				
				$(this).find('#evaluate').on('click',function(){
					var _this = $(this).parents('li');
					self.evaluate(_this);
				});//我要评价			
			});		
		}
		
		this.cancel = function(orderId,_this){//取消订单
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
				},
				function () {
					_this.removeClass('one');
				}
			);				
		}

		this.receipt = function(orderId,_this){//确认收货
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('order/confirmreceive',{"orderId": orderId,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}						
						$.errtoast('收货成功');
						setTimeout(function(){window.location.reload();},1500);
					});
				},
				function () {
					_this.removeClass('one');
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
					window.location.href = SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + _goodsId[0].id + '&ordersId=[' + orderId + ']';
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
								window.location.href = SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + _Id + '&ordersId=[' + orderId + ']';
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
				window.location.href = SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + _goodsId[0].id + '&ordersId=' + orderId;
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
								window.location.href = SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + _Id + '&ordersId=' + orderId;
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
		if(_tab != null){
			ajax_data = {'customerId': customerId,"status": status[_tab - 2],"pageSize": pageSize,"pageNow": pageNow};
			self.getAjax(_tab - 1,ajax_data);
		}else{
			ajax_data = {'customerId': customerId,"pageSize": pageSize,"pageNow": pageNow};		
			self.getAjax(0,ajax_data);				
		}

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				var tab_i = $(this).index();
				window.history.replaceState({title: "",url: ""}, "商品订单", SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=' + (tab_i + 1));
				if($(this).hasClass('y')){return;}
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();									
				if(tab_i == 0){
					ajax_data = {'customerId': customerId,"pageSize": pageSize,"pageNow": pageNow};
					self.getAjax(0,ajax_data);
				}else{
					ajax_data = {'customerId': customerId,"status": status[tab_i - 1],"pageSize": pageSize,"pageNow": pageNow};
					self.getAjax(tab_i,ajax_data);	
				}							
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;
			_tab = $(".tab-link.active").index() + 1;
			if(_tab != 0){
				ajax_data = {'customerId': customerId,"status": status[_tab - 2],"pageSize": pageSize,"pageNow": pageNow};
				self.getAjax(_tab - 1,ajax_data);			
			}else{
				ajax_data = {'customerId': customerId,"pageSize": pageSize,"pageNow": pageNow};
				self.getAjax(0,ajax_data);			
			}
			$.refreshScroller();
		});
		
	}
	ordersFun();
});