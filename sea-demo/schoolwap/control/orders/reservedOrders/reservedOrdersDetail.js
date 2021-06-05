define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./reservedOrdersDetail.css');
	
	base.init();
	base.setTitle('订单详情');	

	var	customerId = cookie.getCookie('customerId'),//获取会员id
		ordersId = base.getQueryString('ordersId'),//获取订单id
		orderIds = base.getQueryString('ordersId'),//获取订单id
		isStudent = cookie.getCookie('isStudent'),//是否是学生
		status = 0,//订单状态
		goodsId = 0,//订单当中商品id
		providerTel = 0,//商家联系电话		
		isActivity = '',//是否是活动
		identifier = '',//活动标识符
		seckillTimesId = '',//秒抢时时间段id
		startDate = '',//秒抢时开始时间
		endDate = '';//秒抢时结束时间	

	ajax.get('preorders/preordersdetail/' + customerId + '/' + ordersId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;			
		var receiveInfo = '<p>' + data.receiveInfo.receivePeople + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.receiveInfo.linkInformation + '</p><span>' + data.receiveInfo.receiveAddress + '</span>';					
		$(".receiveInfo .item-title").html(receiveInfo);		
		var htmldata = '',
			topdata = '',
			lidata = '',
			botdata = '',
			orderList = data.orderList;
		status = orderList.status;
		topdata += '<li>' + 
			'<div class="top">' + 
			'	<span class="fr red">' + setOrderStatus() + '</span>' + 
			'	<span class="l">订单号：' + orderList.ordersNo + '</span>' + 
			'</div>';
		providerTel = data.provider.providerTel;
		isActivity = orderList.isActivity;//是否是活动
		identifier = orderList.identifier;//活动标识符
		seckillTimesId = orderList.seckillTimesId;//秒抢时时间段id
		startDate = orderList.seckillStartDate;//秒抢时开始时间
		endDate = orderList.seckillEndDate;//秒抢时结束时间					
		var goodsList = orderList.goodsList,
			orderGoodsList = require('orderGoodsList');//订单商品dom
		for(var k = 0; k < goodsList.length; k ++){
			var ahref = '';
			if( isActivity == 1 ){
				if(isActivity == 1 && identifier.indexOf('MQ') > 0){
					ahref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
				}else{
					ahref = '&isActivity=1&identifier=' + identifier;
				}
			}else{
				ahref = '';
			}				
			goodsId = goodsList[k].id;
			lidata += orderGoodsList([{
				'link': SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref,
				'photoUrl': goodsList[k].photoUrl,
				'name': goodsList[k].goodsName,
				'transactionPrice': goodsList[k].transactionPrice,
				'sellPrice': goodsList[k].sellPrice,
				'normsValues': goodsList[k].normsValue,
				'buyNum': goodsList[k].buyNum
			}],'');				
		}
		var ordersSource = '';
		if(isActivity == 1){
			if(identifier == 'YY_SDDZ_001'){
				ordersSource = '<div class="orderInfo payMode">商品来源：<div class="fr">特价专区</div></div>';
			}else if(identifier == 'YY_MRXG_001'){
				ordersSource = '<div class="orderInfo payMode">商品来源：<div class="fr">每日限购</div></div>';
			}else if(identifier == 'YY_SPMQ'){
				ordersSource = '<div class="orderInfo payMode">商品来源：<div class="fr">秒抢专区</div></div>';
			}else if(identifier.indexOf('TG') > 0){
				ordersSource = '<div class="orderInfo payMode">商品来源：<div class="fr">团购专区</div></div>';
			}
		}				
		var leaveWords = '';
		if(orderList.leaveWords != '' && orderList.leaveWords != null){
			leaveWords = '<div class="orderInfo leaveWords">买家留言：' + orderList.leaveWords + '</div>';
		}
		var payMode = '';
		if(orderList.payMode != ''){						
			if(orderList.payMode == 'sayimoPay'){
				payMode = '<div class="orderInfo payMode"><div class="fr">钱包支付</div>支付方式</div>';
			}else{
				payMode = '<div class="orderInfo payMode"><div class="fr">微信支付</div>支付方式</div>';
			}
		}
		var orderPickType = '',t = '';
		if(orderList.startTime == '尽快送达'){
			t = orderList.startTime;
		}else{
			t = orderList.startTime + '-' +  orderList.endTime;
		}				
		if(orderList.orderPickType != ''){
			if(orderList.orderPickType == '1'){
				orderPickType = '<div class="orderInfo payMode"><div class="fr">专人配送</div>配送方式</div>';
				orderPickType = orderPickType + '<div class="orderInfo payMode"><div class="fr">' + orderList.orderScheduleDate + '&nbsp;&nbsp;' + t + '</div>配送时间</div>';
			}else if(orderList.orderPickType == '2'){						
				orderPickType = '<div class="orderInfo payMode"><div class="fr">上门自取</div>配送方式</div>';
				orderPickType = orderPickType + '<div class="orderInfo payMode"><div class="fr">' + orderList.orderScheduleDate + '&nbsp;&nbsp;' + t + '</div>自取时间</div>';
				orderPickType = orderPickType + '<div class="orderInfo payMode"><div class="fr">' + data.provider.providerAddress + '</div>门店地址</div>';
			}					
		}
		var failCause = '';
		if(self.status == '5'){
			failCause = '<div class="orderInfo payMode"><div class="fr">商家未在规定时间内接单</div>失败原因</div>';
		}
		botdata += 	'<div class="main tr">' + 
			'合计:<span class="arial red">￥</span><span class="n red">' + data.ordersTotalMoney.toFixed(2) + '</span>' +
			'</div>' + 
		'</li>';					
		htmldata += topdata + lidata + payMode + orderPickType + ordersSource + leaveWords + failCause + botdata;
		topdata = ''; lidata = ''; botdata = '';
		$(".ment-list").html(htmldata);
		var ewmImg = '';
		if(data.QrCodeURL != '' && data.QrCodeURL != null && data.QrCodeURL != undefined){
			ewmImg = '<div class="ewmImg"><img src="' + data.QrCodeURL +'" /></div>';
		}				
		$(".content").append(ewmImg);		
		statusBarBtn();		
	});

	function setOrderStatus(){
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
		
	function statusBarBtn(){
		switch (status){
			case 1:
				$(".bar").append('<a href="javascript:;" class="r" id="payment">立即支付</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="cancel">取消预约</a>');
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');	
				break;
			case 2:
				if(identifier.indexOf('MQ') < 0 && identifier.indexOf('TG') < 0 && identifier.indexOf('KJ') < 0){
					$(".bar").append('<a href="javascript:;" class="r" id="cancel">取消预约</a>');
				}								
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');	
				break;
			case 3:					
				$(".bar").append('<a href="javascript:;" class="r" id="receipt">预约完成</a>');
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');
				break;	
			case 6:
				$(".bar").append('<a href="javascript:;" class="r" id="evaluate">我要评价</a>');
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');	
				break;	
			case 4:
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');
				break;
			case 5:
				$(".bar").append('<a href="tel:' + providerTel + '" class="l">联系商家</a>');
				break;						
			default:
				break;
		}
		control();//控制中心	
	}
	
	function control(){
		$("#payment").on('click',function(){			
			var payHref = '';
			if(isActivity == 1 && identifier == 'YY_SPMQ'){
				payHref = '&isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
			}else if(isActivity == 1){
				payHref = '&isActivity=' + isActivity + '&identifier=' + identifier;
			}			
			window.location.href = SAYIMO.SRVPATH + 'view/pay/reservedPay.html?ordersId=' + ordersId + payHref;
		});//立即支付
		$("#cancel").on('click',function(){
			$.confirm('确认取消该订单？',
				function () {
					ajax.post('preorders/cancelpreorder',{"orderId": ordersId},'json',function(data){
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
					ajax.post('preorders/confirmrecieve',{"preOrdersId": ordersId,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('预约完成');
						setTimeout(function(){window.location.reload();},1500);
					});
				}
			);
		});//预约完成
		$("#evaluate").on('click',function(){
			window.location.href = SAYIMO.SRVPATH + 'view/comment/reservedAddComment.html?goodsId=' + goodsId + '&ordersId=' + ordersId;
		});//我要评价		
	}
	
});