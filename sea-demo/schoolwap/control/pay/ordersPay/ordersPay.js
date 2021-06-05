define(function(require, exports, module) {
		
	var base = require('base'),
		ajax = require('ajax'),
		cookie = require('cookie');
	require('./ordersPay.css');
	
	base.init();
	base.setTitle('订单支付');
	
	var ordersPay = function(){
		var self = this;
		
		$.hideIndicator();
		
		var customerId = cookie.getCookie('customerId'),//获取会员id
			isStudent = cookie.getCookie('isStudent'),//是否是学生
			orderIds = base.getQueryString('ordersId');//获取订单id

		var goodsId = 0,//商品id
			normsValueId = 0,//商品规格id
			receivePeople = '',//收货地址名称
			pay_type = -1,//支付方式
			walletBalance = 0,//钱包余额
			ordersTotalMoney = 0,//支付总额
			leaveWords = '';//留言内容
		
		var isSufficient = true;
		
		ajax.get('order/orderpaydetails/' + orderIds +'/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			self.renderDom(data.data);//渲染dom
		});		
		
		this.renderDom = function(data){			
			walletBalance = data.walletBalance;//钱包余额
			ordersTotalMoney = data.ordersTotalMoney;//支付总额
			var receiveInfo = '';//收货地址
			if(data.receiveInfo.receivePeople == ''){
				receiveInfo = '<font class="red">请选择收货地址</font>';
			}else{
				if(data.receiveInfo.isSchool == 1){
					if(isStudent == 'Y'){
						receiveAddress = '<em class="red">【校内地址】</em>' + data.receiveInfo.receiveAddress;
					}else{
						receiveAddress = data.receiveInfo.receiveAddress;
					}					
				}else{
					receiveAddress = data.receiveInfo.receiveAddress;
				}					
				receiveInfo = '<p>' + data.receiveInfo.receivePeople + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.receiveInfo.linkInformation + '</p><span>' + receiveAddress + '</span>';	
				receivePeople = data.receiveInfo.receivePeople;					
			}			
			$(".receiveInfo .item-title").html(receiveInfo);
			$(".receiveInfo a.item-link").attr('href',SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html?orderId=' +orderIds);
			var orderGoodsListdata = [],//订单商品数组
				htmldata = '',
				ahref = '',
				main = '',
				logisticsCostTotal = '',
				orderList = data.orderList;			
			
			if(orderList[0].isActivity == 1 && orderList[0].identifier.indexOf('MQ') > 0){//秒抢
				var seckillTimes = require('seckillTimes');
				seckillTimes('#activityBox',orderList[0].seckillStartDate,orderList[0].seckillEndDate,function(f){});
			}else if(orderList[0].isActivity == 1 && orderList[0].identifier.indexOf('TG') > 0 ){//团购			
				var groupBuying = require('groupBuying');
				var groupInfo = {
					startDate : orderList[0].startDate,
					endDate : orderList[0].endDate,
					number : orderList[0].number,
					alreadyBuy : orderList[0].alreadyBuy
				}				
				groupBuying('#activityBox',groupInfo,function(f){});				
			}
			
			var orderGoodsList = require('orderGoodsList');//订单商品dom
			for(var i = 0; i < orderList.length; i++){
				var goodsList = orderList[i].goodsList;	
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
					var sendAddress = '';
					if(goodsList[k].sendAddress != '' && goodsList[k].sendAddress != null){
						sendAddress = '&nbsp;&nbsp;发货地：' + goodsList[k].sendAddress;
					}
					goodsId = goodsList[k].id;
					normsValueId = goodsList[k].normsValueId;					
					htmldata += orderGoodsList([{
						'link': SAYIMO.SRVPATH + htmlUrl + '?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref,
						'photoUrl': goodsList[k].photoUrl,
						'name': goodsList[k].goodsName,
						'transactionPrice': goodsList[k].transactionPrice,
						'sellPrice': goodsList[k].sellPrice,
						'normsValues': goodsList[k].normsValues,
						'buyNum': goodsList[k].buyNum
					}],sendAddress);
				}
				htmldata =  htmldata + '<div class="leaveWords"><span>订单备注：</span><input type="text" id="leaveWords" data-ordersId="' + orderList[i].ordersId + '" placeholder="留言给商家..." /></div>';
			}
			$(".ment-list").html(htmldata);
			if(ordersTotalMoney == 0){
				pay_type = 0;
			}else{	
				var payManner = require('payManner');//加载支付方式dom			
				payManner('.content',function(f){
					pay_type = f;
					if(pay_type == 1){
						if($("#confirmBuy").hasClass('nopay') != false){
							$("#confirmBuy").removeClass('nopay');
						}
					}else{
						if(isSufficient == false){//当钱包余额不足订单总额时屏蔽支付按钮
							$("#confirmBuy").addClass('nopay');
						}
					}
				});
			}
			if(data.logisticsCostTotal == 0){
				logisticsCostTotal = '(免运费)';
			}else{
				logisticsCostTotal = '(含运费<span class="arial">￥</span>' + data.logisticsCostTotal.toFixed(2) + '元)';
			}
			main = '共' + data.orderNum + '件&nbsp;合计:<span class="red arial">￥</span><span class="n red">' + data.ordersTotalMoney.toFixed(2) + '</span>' + logisticsCostTotal;	
			$(".bar .main").html(main);
			
			$.init();//支付页面很重要，dom成功加载才能执行SUI初始化，反之不显示页面
			$.hideIndicator();

			$("#confirmBuy").on('click',function(){
				if($(this).hasClass('nopay') == false){
					self.confirmBuy();
				}			
			});//提交支付		
		}//renderDom end
		
		this.confirmBuy = function(){
			var fl = [];
			if(receivePeople == ''){
				$.errtoast('请选择收货地址');
				return;
			}
			if(pay_type == -1){
				$.errtoast('请选择支付方式');
				return;
			}
			$("#leaveWords").each(function(){
				var val = $(this).val();
				if(val != ''){
					if(REG.ISNULL.test(val) == false ){
						$.errtoast('请正确输入留言内容');
						$(this).val('');
						fl.push(0);		
					}
					leaveWords += $(this).attr('data-ordersId') + ':' + $(this).val() + ',';
				}
			});
			if(leaveWords != ''){
				leaveWords = '{' + leaveWords.substr(0,leaveWords.length - 1) + '}';
			}			
			if(fl.indexOf(0,0) < 0){				
				if(pay_type == 1){
					self.wechat_pay();
				}else if(pay_type == 0){
					self.sayimo_pay();
				}
			}
		}//confirmBuy end
		
		this.wechat_pay = function(){
			var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
	        if(!wechatInfo){
	            $.errtoast("请使用微信客户端") ;
	            return;
	        }else if( wechatInfo[1] < "5.0" ){
	            $.errtoast("您的微信版本低于5.0无法使用微信支付");
	            return;
	        }
	        ajax.post("order/payorder",{
				"orderIds": orderIds,
				"payMoney": ordersTotalMoney,
				"payType": pay_type,
				"customerId": customerId,
				"leaveWords": leaveWords,
				"applyType": 'WEB'
	        },'json',function(data){
	        	if(data.status == 0){
	        		var errorCode = require('errorCode');
	        		errorCode(data.errorCode);
	        		return;		        		
	        	}
	        	data = data.data;
	            WeixinJSBridge.invoke('getBrandWCPayRequest',{
	                "appId" : data.appId, //公众号名称，由商户传入  
	                "timeStamp" : data.timeStamp, //时间戳，自 1970 年以来的秒数  
	                "nonceStr" : data.nonceStr, //随机串  
	                "package" : data.packageValue, //商品包信息
	                "signType" : data.signType, //微信签名方式:  
	                "paySign" : data.paySign //微信签名  
	            },function(res){
	                /* 对于支付结果，res对象的err_msg值主要有3种，含义如下：(当然，err_msg的值不只这3种)
	                1、get_brand_wcpay_request:ok   支付成功后，微信服务器返回的值
	                2、get_brand_wcpay_request:cancel   用户手动关闭支付控件，取消支付，微信服务器返回的值
	                3、get_brand_wcpay_request:fail   支付失败，微信服务器返回的值	
	                -可以根据返回的值，来判断支付的结果。
	                -注意：res对象的err_msg属性名称，是有下划线的，与chooseWXPay支付里面的errMsg是不一样的。而且，值也是不同的。*/
	                if(res.err_msg == 'get_brand_wcpay_request:ok'){
				        ajax.post("order/updatepaysuccess",{
							"customerId": customerId,
							"orderIds": orderIds,
							"payType": 1,
							"applyType": 'WEB'
				        },'json',function(data){
		                	if(data.status == 0){
		                		$.errtoast('支付失败');
		                		setTimeout(function(){location.reload();},2000);
		                	}else{
		                		$.errtoast('支付成功');
			                    setTimeout(function(){
			                    	if(base.getQueryString('shopcart') == 1){
			                    		window.history.replaceState({title: "我的订单",url: SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3'}, "购物车", SAYIMO.SRVPATH + 'view/shoppingcart/shoppingcart.html');
			                    	}else{
			                    		window.history.replaceState({title: "我的订单",url: SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3'}, "商品详情", SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId);
			                    	}                   	
			                    },500);
			                    setTimeout(function(){	                    	
			                    	window.location.href = SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3';
			                    },1000);		                    		
			                }				        	
				        });	        	            				                   
	                }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
	                    $.errtoast("您已手动取消该订单支付");
	                    setTimeout(function(){location.reload();},2000);		                    
	                }else{
	                    $.errtoast("订单支付失败");
	                    setTimeout(function(){location.reload();},2000);
	                }
	            });	        	
	        });		
		}//wechat_pay end
		
		this.sayimo_pay = function(){
			if(ordersTotalMoney * 1 > walletBalance * 1){
				$.errtoast('您的钱包余额不足');
				$('#confirmBuy').addClass('nopay');
				isSufficient = false;
				return;
			}
			ajax.get("user/existwalletpaypwd/" + customerId,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}												
				if(data.data.msg == 0){
					$.confirm('您还未设置支付密码,是否去设置？',function (){window.location.href = SAYIMO.SRVPATH + 'view/me/password/setPwd.html';});
					return;					
				}
			});
			self.showModalPassword();
		}//sayimo_pay end
		
		this.showModalPassword = function(){
		    $.modalPassword('请输入支付密码', function (value){		    			    	
		    	if(value == ''){
		    		$.errtoast("请输入支付密码");
		    		return;
		    	}
				if( !REG.ISNULL.test(value) ){
					$.errtoast('支付密码为空');
					return;				
				}
		    	$.showIndicator();	    	
		    	var _password = value;
		    	ajax.post("order/payorder",{
					"orderIds": orderIds,
					"payMoney": ordersTotalMoney,
					"payType": pay_type,
					"customerId": customerId,
					"password": _password,
					"leaveWords": leaveWords,
					"applyType": 'WEB'
		    	},'json',function(data){
		    		$.hideIndicator();
					if(data.status == 0){
						var errorCode = require('errorCode');
			    		errorCode(data.errorCode);			    								
						return;
					}					
	    			$.errtoast('支付成功');
                    setTimeout(function(){
                    	if(base.getQueryString('shopcart') == 1){
                    		window.history.replaceState({title: "我的订单",url: SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3'}, "购物车", SAYIMO.SRVPATH + 'view/shoppingcart/shoppingcart.html');
                    	}else{
                    		window.history.replaceState({title: "我的订单",url: SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3'}, "商品详情", SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId);
                    	}                   	
                    },500);
                    setTimeout(function(){	                    	
                    	window.location.href = SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3';
                    },1000);					
		    	});		 
		    });									
		}//showModalPassword end
		
	}//ordersPay end 
	ordersPay();
});