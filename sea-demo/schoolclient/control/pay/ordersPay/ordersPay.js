define(function(require, exports, module) {
		
	var base = require('base'),
		ajax = require('ajax');
	require('./ordersPay.css');
	
	window.jsObj.setLoadUrlTitle('商品订单支付');
	
	var ordersPay = function(){
		var self = this;
		
		$.showIndicator();
		
		var customerId = window.jsObj.readUserData('id'),
			soure = base.getQueryString('soure'),//获取订单来源
			orderIds = base.getQueryString('orderIds');

		var goodsId = 0,//商品id
			normsValueId = 0,//商品规格id
			receivePeople = '',//收货地址名称
			pay_type = -1,//支付方式
			walletBalance = 0,//钱包余额
			ordersTotalMoney = 0,//支付总额
			leaveWords = '';//留言内容
		
		var isSufficient = true;
		
		ajax.get('order/orderpaydetails/' + orderIds + '/' + customerId,'json',function(data){
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
			if(data.receiveInfo.isSchool == 1){
				receiveAddress = '<em class="red">【校内地址】</em>' + data.receiveInfo.receiveAddress;				
			}else{
				receiveAddress = data.receiveInfo.receiveAddress;
			}					
			receiveInfo = '<p>' + data.receiveInfo.receivePeople + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.receiveInfo.linkInformation + '</p><span>' + receiveAddress + '</span>';	
			receivePeople = data.receiveInfo.receivePeople;						
			$(".receiveInfo .item-title").html(receiveInfo);
			$(".receiveInfo").on('click',function(){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html?orderId=' + orderIds);
			});
			
			var htmldata = '',
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
					htmldata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + htmlUrl + '?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref + '" class="cont">' + 
					'	<div class="l">' + 
					'		<img src="' + goodsList[k].photoUrl + '" />' + 
					'	</div>' + 
					'	<div class="r">' + 
					'		<h1>' + goodsList[k].goodsName + '</h1>' + 
					'		<div class="r_price">' + 
					'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + goodsList[k].transactionPrice.toFixed(2) + '</span></em>' + 
					'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + goodsList[k].sellPrice.toFixed(2) + '</span></del>' + 
					'		</div>' + 
					'		<div class="num ellipsis">' + goodsList[k].normsValues + ' x' + goodsList[k].buyNum + sendAddress + '</div>' + 
					'	</div>' + 
					'</a>';												
				}
				htmldata =  htmldata + '<div class="leaveWords"><span>订单备注：</span><input type="text" id="leaveWords" data-ordersId="' + orderList[i].ordersId + '" placeholder="留言给商家..." /></div>';
			}
			$(".ment-list").html(htmldata);
			$(".ment-list a").each(function(){
				$(this).on('click',function(){
					window.jsObj.loadContent($(this).attr('data-url'));
				});
			});						
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
				if(!$(this).hasClass('nopay')){
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
					self.wecart_pay();
				}else if(pay_type == 0){
					self.sayimo_pay();
				}else if(pay_type == 2){
					self.alipay_pay();
				}
			}
		}//confirmBuy end
		
		this.wecart_pay = function(){
			$.showIndicator();
	        ajax.post("order/payorder",{
				"orderIds": orderIds,
				"payMoney": ordersTotalMoney,
				"payType": pay_type,
				"customerId": customerId,
				"leaveWords": leaveWords	        	
	        },'json',function(data){
	        	$.hideIndicator();
	        	if(data.status == 0){
	        		var errorCode = require('errorCode');
	        		errorCode(data.errorCode);
	        		return;		        		
	        	}
	        	data = data.data;
	        	window.jsObj.weCartPay(data.prepayid,data.nonceStr,data.timeStamp,data.paySign);     
	        });	
		}//wecart_pay end
		
		this.alipay_pay = function(){
			$.showIndicator();
	        ajax.post("order/payorder",{
				"orderIds": orderIds,
				"payMoney": ordersTotalMoney,
				"payType": pay_type,
				"customerId": customerId,
				"leaveWords": leaveWords	        	
	        },'json',function(data){
	        	$.hideIndicator();
	        	if(data.status == 0){
	        		var errorCode = require('errorCode');
	        		errorCode(data.errorCode);
	        		return;		        		
	        	}
	        	data = data.data;
	        	alert(JSON.stringify(data));
	        	//window.jsObj.aliPay();     
	        });				
		}//alipay_pay end
		
		this.sayimo_pay = function(){
			$.showIndicator();	
			ajax.get('user/existwalletpaypwd/' + customerId,'json',function(data){
				$.hideIndicator();	
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				if(data.data == 0){
					$.confirm('您还未设置支付密码,是否去设置？',function (){
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/password/setPwd.html');
					});
					return;					
				}
				if(ordersTotalMoney * 1 > walletBalance * 1){
					$.errtoast('您的钱包余额不足');
					$('#confirmBuy').addClass('nopay');
					isSufficient = false;
					return;
				}
				self.showModalPassword();
			});					
		}//sayimo_pay end
		
		this.showModalPassword = function(){
		    $.modalPassword('请输入支付密码', function (value){		    			    	
		    	if(value == ''){
		    		$.errtoast("请输入支付密码");
		    		return;
		    	}
				if(!REG.ISNULL.test(value)){
					$.errtoast('支付密码为空');
					return;				
				}
		    	$.showIndicator();	    	
		    	ajax.post("order/payorder",{
					"orderIds": orderIds,
					"payMoney": ordersTotalMoney,
					"payType": pay_type,
					"customerId": customerId,
					"password": value,
					"leaveWords": leaveWords			    		
		    	},'json',function(data){
		    		$.hideIndicator();
					if(data.status == 0){
						var errorCode = require('errorCode');
			    		errorCode(data.errorCode);			    								
						return;
					}					
	    			$.errtoast('支付成功');
                    setTimeout(function(){
                    	if(soure == 'orders'){window.jsObj.refreshLastPage();}   
                    	window.jsObj.finshCurrentActivity();
                    	if(soure == null){window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=2')};
                    },1500);					
		    	});		 
		    });									
		}//showModalPassword end
		
	}//ordersPay end 
	ordersPay();
});