define(function(require, exports, module) {
		
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./educationPay.css');	
	
	base.init();
	base.setTitle('提交订单');
	
	var fun_eduList = function(){
		
		var self = this,
			customerId = cookie.getCookie('customerId'),//会员id
			eduOrderId = base.getQueryString('id'),//订单id
			educationId = '',//课程id
			classId = base.getQueryString('classId'),//课程classId
			pay_type = -1,//支付方式
			walletBalance = 0,//钱包余额
			ordersTotalMoney = 0,//支付总额
			isSufficient = true;
			
		
		ajax.get('base/educationorderpaydetails/' + customerId + '/' + eduOrderId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			walletBalance = data.walletBalance;
			ordersTotalMoney = data.ordersTotalMoney;
			educationId = data.eduOrder.educationList[0].educationId;
			var	htmldata = '<div class="top">' + 
						'	<span class="fr">待支付</span>' + 
						'	<span class="l">订单号：' + data.eduOrder.ordersNo + '</span>' + 
						'</div>' +
						'<div class="cont">' +
						'	<div class="l">' + 
						'		<img src="' + SAYIMO.SRVPATH + 'images/find/education/eduList-' + self.random() + '.jpg" />' + 
						'	</div>' + 
						'	<div class="r">' + 
						'		<h1>' + data.eduOrder.educationList[0].educationName + '</h1>' + 
						'		<div class="r_price">' + 
						'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + data.eduOrder.educationList[0].money.toFixed(2) + '</span></em>' + 
						'		</div>' + 
						'	</div>' + 
						'</div>';
			$(".ment-list").html(htmldata);
			main = '共1个课程&nbsp;合计:<span class="red arial">￥</span><span class="n red">' + data.ordersTotalMoney.toFixed(2) + '</span>';	
			$(".bar .main").html(main);
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
			
			$.init();//支付页面很重要，dom成功加载才能执行SUI初始化，反之不显示页面
			
			$("#confirmBuy").on('click',function(){
				if($(this).hasClass('nopay') == false){
					self.confirmBuy();
				}			
			});//提交支付			
		});		

		this.random = function(){
			var a = Math.ceil(Math.random()*5);
			a > 5 ? a = 5 : a = a;
			return a;
		}
		
		this.confirmBuy = function(){
			if(pay_type == -1){
				$.errtoast('请选择支付方式');
				return;
			}			
			if(pay_type == 1){
				self.wechat_pay();
			}else if(pay_type == 0){
				self.sayimo_pay();
			}			
		}
		
		this.wechat_pay = function(){
			var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
	        if(!wechatInfo){
	            $.errtoast("请使用微信客户端") ;
	            return;
	        }else if( wechatInfo[1] < "5.0" ){
	            $.errtoast("您的微信版本低于5.0无法使用微信支付");
	            return;
	        }
	        
	        ajax.post("base/payeducationorder",{
	    		"customerId": customerId,
	    		"payMoney": ordersTotalMoney,
	    		"payType": pay_type,
				"educationId": educationId,
				'eduOrderId': eduOrderId,
				"applyType": 'WEB'
	        },'json',function(data){
	        	if(data.status == 0){
	        		var errorCode = require('errorCode');//载入错误码
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
				        ajax.post("base/updatepaysuccess",{
							"customerId": customerId,
							"eduOrderId": eduOrderId,
							"payType": 1,
							"applyType": 'WEB'
				        },'json',function(data){
		                	if(data.status == 0){
		                		$.errtoast('支付失败');
		                		setTimeout(function(){window.location.reload();},2000);
		                		return;
		                	}
		                	$.errtoast('支付成功');
		                	window.history.back();	                    						        	
				        });	        	            				                   
	                }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
	                    $.errtoast("您已手动取消该订单支付");
	                    setTimeout(function(){window.location.reload();},2000);		                    
	                }else{
	                    $.errtoast("订单支付失败");
	                    setTimeout(function(){window.location.reload();},2000);
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
					$.confirm('您还未设置支付密码,是否去设置？',
						function () {
							window.location.href = SAYIMO.SRVPATH + 'view/me/password/setPwd.html';
						}
					);
					return;					
				}
			});
			self.showModalPassword();			
		}
		
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
		    	ajax.post("base/payeducationorder",{
		    		"customerId": customerId,
		    		"payMoney": ordersTotalMoney,
		    		"payType": pay_type,
		    		"password": _password,
					"educationId": educationId,
					'eduOrderId': eduOrderId,	
					"applyType": 'WEB'
		    	},'json',function(data){
		    		$.hideIndicator();
					if(data.status == 0){
						var errorCode = require('errorCode');//载入错误码
			    		errorCode(data.errorCode);			    								
						return;
					}	
	    			$.errtoast('支付成功');
	    			window.history.back();				
		    	});		 
		    });			
		}
		
	}//fun_eduList end
	fun_eduList();	
});