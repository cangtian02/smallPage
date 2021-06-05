define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./goodsOrdersDetail.css');
	
	base.init();
	base.setTitle('订单详情');	

	var	customerId = cookie.getCookie('customerId'),//获取会员id
		orderIds = base.getQueryString('ordersId'),//获取订单id
		isStudent = cookie.getCookie('isStudent'),//是否是学生
		identifier = '',
		status = 0,//订单状态
		ordersId = 0,//订单ID
		goodsId = [];//订单当中商品id组合数组		

	ajax.get('order/orderdetails/' + orderIds + '/' +  customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var receiveInfo = '';			
		if(data.receiveInfo.isSchool == 1){
			if(isStudent == 'Y'){
				receiveAddress = '<font class="red">【校内地址】</font>' + data.receiveInfo.receiveAddress;
			}else{
				receiveAddress = data.receiveInfo.receiveAddress;
			}					
		}else{
			receiveAddress = data.receiveInfo.receiveAddress;
		}				
		receiveInfo = '<p>' + data.receiveInfo.receivePeople + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.receiveInfo.linkInformation + '</p><span>' + receiveAddress + '</span>';					
		$(".receiveInfo .item-title").html(receiveInfo);				
		var htmldata = '',
			topdata = '',
			lidata = '',
			botdata = '',
			logistcsCost = '',
			ahref = '',
			orderList = data.orderList;
		for(var i = 0; i < orderList.length; i++){
			ordersId = orderList[i].ordersId;
			status = orderList[i].status;
			topdata += '<li>' + 
				'<div class="top">' + 
				'	<span class="fr red">' + setOrderStatus(orderList[i].status) + '</span>' + 
				'	<span class="l">订单号：' + orderList[i].ordersNo + '</span>' + 
				'</div>';
			var goodsList = orderList[i].goodsList;
			var orderGoodsList = require('orderGoodsList');//订单商品dom
			for(var k = 0; k < goodsList.length; k ++){
				var htmlUrl = 'view/class/goodsDetail.html';
				if(orderList[i].isActivity == 1 && orderList[i].identifier.indexOf('KJ') > 0){
					htmlUrl = 'view/activity/yqkj/yqkjDetail.html';
				}				
				if( orderList[i].isActivity == 1 ){
					if(orderList[i].isActivity == 1 && orderList[i].identifier.indexOf('MQ') > 0){
						ahref = '&isActivity=1&identifier=' + orderList[i].identifier + '&seckillTimesId=' + orderList[i].seckillTimesId;
					}else{
						ahref = '&isActivity=1&identifier=' + orderList[i].identifier;
					}
				}else{
					ahref = '';
				}
				identifier = orderList[i].identifier;
				goodsId.push({
					'id': goodsList[k].id,
					'name': goodsList[k].goodsName,
					'isactivity': orderList[i].isActivity,
					'isturnback': goodsList[k].isTurnBack,
					'status': goodsList[k].status,
					'canComment': goodsList[k].canComment
				});
				lidata += orderGoodsList([{
					'link': SAYIMO.SRVPATH + htmlUrl + '?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref,
					'photoUrl': goodsList[k].photoUrl,
					'name': goodsList[k].goodsName,
					'transactionPrice': goodsList[k].transactionPrice,
					'sellPrice': goodsList[k].sellPrice,
					'normsValues': goodsList[k].normsValues,
					'buyNum': goodsList[k].buyNum
				}],'');															
			}
			var leaveWords = '';
			if(orderList[i].leaveWords != '' && orderList[i].leaveWords != null){
				leaveWords = '<div class="orderInfo leaveWords">买家留言：' + orderList[i].leaveWords + '</div>';
			}
			var payMode = '';
			if(orderList[i].payMode != ''){						
				if(orderList[i].payMode == 'sayimoPay'){
					payMode = '<div class="orderInfo payMode"><div class="fr">钱包支付</div>支付方式</div>';
				}else{
					payMode = '<div class="orderInfo payMode"><div class="fr">微信支付</div>支付方式</div>';
				}
			}
			if(data.logisticsCostTotal > 0){
				logistcsCost = '(含运费' + data.logisticsCostTotal + '元)'; 
			}else{
				logistcsCost = '(免运费)';
			}						
			botdata += 	'<div class="main tr">' + 
				'	共' + goodsList.length + '件商品 合计:<span class="arial red">￥</span><span class="n red">' + data.ordersTotalMoney.toFixed(2) + '</span>' + logistcsCost +
				'</div>' + 
			'</li>';
			var goodsSource = '';
			if(orderList[i].isActivity == 1 && orderList[i].identifier.indexOf('MQ') > 0){
				var goodsSource = '<div class="orderInfo payMode"><div class="fr">秒抢专区</div>商品来源</div>';			
			}else if(orderList[i].isActivity == 1 && orderList[i].identifier.indexOf('TG') > 0){
				var goodsSource = '<div class="orderInfo payMode"><div class="fr">团购专区</div>商品来源</div>';				
			}
			htmldata += topdata + lidata + leaveWords + payMode + goodsSource + botdata;
			$(".ment-list").html(htmldata);
			topdata = ''; lidata = ''; botdata = '';			
		}		
		statusBarBtn();
	});

	function setOrderStatus(status){
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
		
	function statusBarBtn(){
		switch (status){
			case 1:
				$(".bar").append('<a href="javascript:;" class="r" id="payment">立即支付</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="cancel">取消订单</a>');
				$(".bar").append('<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>');	
				break;
			case 2:
				if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
					$(".bar").append('<a href="javascript:;" class="r" id="cancel">取消订单</a>');
				}							
				$(".bar").append('<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>');	
				break;
			case 3:					
				$(".bar").append('<a href="javascript:;" class="r" id="receipt">确认收货</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="exit">申请售后</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="logistics">查看物流</a>');
				$(".bar").append('<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>');
				break;	
			case 6:
				$(".bar").append('<a href="javascript:;" class="r" id="evaluate">我要评价</a>');
				$(".bar").append('<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>');	
				break;	
			case 7:
				$(".bar").append('<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>');
				break;					
			default:
				break;
		}
		control();//控制中心
	}
	
	function control(){
		$("#payment").on('click',function(){
			window.location.href = SAYIMO.SRVPATH + 'view/pay/ordersPay.html?ordersId=[' + ordersId + ']';
		});//立即支付
		$("#logistics").on('click',function(){
			window.location.href = SAYIMO.SRVPATH + 'view/orders/orderEmsTrack/orderEmsTrack.html?orderId=' + ordersId;			
		});//查看物流		
		$("#cancel").on('click',function(){
			$.confirm('确认取消该订单？',
				function () {
					ajax.post('order/cancelorder',{"orderId": ordersId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('取消成功');
						setTimeout(function(){window.history.back();},1500);
					});
				}
			);
		});//取消订单
		$("#receipt").on('click',function(){
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('order/confirmreceive',{"orderId": ordersId,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}						
						$.errtoast('收货成功');
						setTimeout(function(){window.location.reload();},1500);
					});
				}
			);
		});//确认收货
		$("#exit").on('click',function(){
			exit();
		});//申请售后
		$("#evaluate").on('click',function(){
			evaluate();
		});//我要评价			
	}
	
	function exit(){
		if(goodsId.length == 1){
			if(goodsId[0].status == 1){
				if(goodsId[0].isActivity == 1 || goodsId[0].isturnback == 'Y'){
					$.errtoast('该商品不支持退换货');
					return;
				}
				window.location.href = SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + goodsId[0].id + '&ordersId=[' + ordersId + ']';
			}else{
				$.errtoast('该商品已在退换货中');
			}
			return;
		}
		var _text = '';
		for(var i = 0; i < goodsId.length; i++){
			var b_data = '';
			if(goodsId[i].status == 1){
				if(goodsId[i].isturnback == 'Y'){
					b_data = ' data-id="' + goodsId[i].id + '" data-isturnback="' + goodsId[i].isturnback + '"';
				}else{
					b_data = ' class="noback"';
				}
			}else{
				b_data = ' class="nostatus"';
			}
			_text += '<li' + b_data + '><em></em>' + goodsId[i].name + '</li>';
		}
		_text = '<ul class="back-list">' + _text + '</ul>';
		$.modal({
			title:  '选择商品进行退换货',
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
						if(_Id == undefined){
							$.errtoast('请选择商品');
						}else{
							window.location.href = SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsform.html?goodsId=' + _Id + '&ordersId=[' + ordersId + ']';
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
	
	function evaluate(){
		if(goodsId.length == 1){
			window.location.href = SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + goodsId[0].id + '&ordersId=' + ordersId;
			return;
		}	
		var _text = '';
		for(var i = 0; i < goodsId.length; i++){
			var b_data = '';
			if(goodsId[i].canComment == 0){
				b_data = ' class="nostatus"';
			}				
			_text += '<li' + b_data + ' data-id="' + goodsId[i].id + '"><em></em>' + goodsId[i].name + '</li>';
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
		        	onClick: function(){
						var _Id = $(".back-list li.active").attr('data-id');
						if(typeof(_Id) === 'undefined'){
							$.errtoast('请选择商品');
						}else{
							window.location.href = SAYIMO.SRVPATH + 'view/comment/goodsAddComment.html?goodsId=' + _Id + '&ordersId=' + ordersId;
						}
		          	}
		        }
			]					
		});
		$(".back-list li").each(function(){
			$(this).on('click',function(){
				if($(this).hasClass('nostatus')){
					$.errtoast('该商品暂不能评论');
					return;
				}					
				$(this).addClass('active').siblings('li').removeClass('active');
			});
		});			
	}
	
});