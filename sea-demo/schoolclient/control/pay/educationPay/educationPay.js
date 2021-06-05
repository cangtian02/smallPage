define(function(require, exports, module) {
		
	var base = require('base'),
		ajax = require('ajax');
	require('./educationPay.css');	
	
	window.jsObj.setLoadUrlTitle('职业课堂订单支付');
	window.jsObj.refreshLastPage();
	
	var fun_eduList = function(){
		
		var self = this,
			customerId = window.jsObj.readUserData('id'),
			eduOrderId = base.getQueryString('id')
			educationId = '',
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
			$.toast('微信支付开通中...');	
		}//wechat_pay end
		
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
		}
		
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
		    	ajax.post("base/payeducationorder",{
		    		"customerId": customerId,
		    		"payMoney": ordersTotalMoney,
		    		"payType": pay_type,
		    		"password": value,
					"educationId": educationId,
					'eduOrderId': eduOrderId			    		
		    	},'json',function(data){
		    		$.hideIndicator();
					if(data.status == 0){
						var errorCode = require('errorCode');//载入错误码
			    		errorCode(data.errorCode);			    								
						return;
					}	
	    			$.errtoast('支付成功');
	    			setTimeout(function(){
	    				window.jsObj.finshCurrentActivity();
	    			},1500);
		    	});		 
		    });			
		}
		
	}//fun_eduList end
	fun_eduList();	
});