define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./findPwd.css');
		
	window.jsObj.setLoadUrlTitle('找回密码');
	
	var customerId = window.jsObj.readUserData('id');
	
	//获取绑定的电话号码
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		if(data.accountInfo.length == 0){$.errtoast('未能获取到用户手机号');}
		$("#mobilePhone").val(data.accountInfo[0].mobilePhone);
		$("#btn_1").removeClass('disabled');
	});

	//发送验证码
	$('#btnSendCode').on('click',function(){		
		ajax.post('user/sendsms',{'phoneNum': $('#mobilePhone').val(),'busCode': '002'},'json',function(data){
			if(data.status == 0){
				$.errtoast('短信发送失败，请稍后重试');
				return;					
			}
			settime();				
		});		
	});
	
	//提交验证
	$('#btn_1').on('click',function(){
		if($("#btn_1").hasClass('disabled')) return;
		var mobilePhone = $('#mobilePhone').val(),
			codeinput = $('#validate-code-input').val();		
		if(codeinput == ''){
			$.errtoast('请输入短信验证码');
			return;
		}
		if(!REG.ISNULL.test(codeinput)){
			$.errtoast('请输入正确的短信验证码');
			return;
		}		
		//提交验证post
		ajax.post('user/checksms',{'mobilePhone': mobilePhone,'smsCode': codeinput,'busCode': '002'},'json',function(data){
			if(data.status == 0 && data.errorCode == '200001'){
				$.errtoast('没有发送或为空,点击重新发送');
				return;					
			}
			if(data.status == 0 && data.errorCode == '200002'){
				$.errtoast('验证码过期');
				return;					
			}
			if(data.status == 0 && data.errorCode == '200004'){
				$.errtoast('验证码不正确');
				return;					
			}
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;					
			}
			$("#passwordBox_1").addClass('din');
			$("#passwordBox_2").removeClass('din');
		});
	});

	//点击发送验证码后按钮显示倒计时
	var countdown = 120; 
	function settime() { 	
		if (countdown == 0) { 
			$("#btnSendCode").removeClass('disabled');
			$("#btnSendCode").text("免费获取验证码");
			countdown = 120; 
			return;
		} else {
			$("#btnSendCode").addClass('disabled');
			$("#btnSendCode").text("重新发送(" + countdown + ")");
			countdown--; 
		} 
		setTimeout(function() { 
			settime() 
		},1000); 
	}

	//设置支付密码提交
	$('#btn_2').on('click',function(e){
		var paypassword = $('#password_1').val(),
			validate = $('#password_2').val(),
			reg = new RegExp("^\\d{6}$");	
		if(paypassword == ''){
			$.errtoast('请输入支付密码');
			return;
		}
		if( !reg.test(paypassword) ){
			$.errtoast('支付密码由六位数字组成');
			return;
		}		
		if(validate == ''){
			$.errtoast('请确认支付密码');
			return;
		}
		if( !reg.test(validate) ){
			$.errtoast('确认密码由六位数字组成');
			return;
		}
		if(paypassword != validate){
			$.errtoast('两次密码不一致');
			return;
		}		
		ajax.post('user/setwalletpaypwd',{'customerId': customerId,'password': paypassword},'json',function(data){
			if(data.status == 0){
				$.errtoast('设置失败,请稍后重试');
				return;
			}
			$.errtoast('支付密码设置成功');
			setTimeout(function(){window.jsObj.finshCurrentActivity();},1500);			
		});
	});
	
});