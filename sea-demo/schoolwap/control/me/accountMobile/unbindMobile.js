define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./unbindMobile.css');
		
	base.init();	
	base.setTitle('手机解绑');		
	
	var customerId = cookie.getCookie('customerId');
	var flag = false;
	
	//获取绑定的电话号码
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		$("#mobilePhone").val(data.accountInfo[0].mobilePhone);
		flag = true;
	});	

	//发送验证码
	$('#btnSendCode').on('click',function(){
		if(flag == false) return;
		if($(this).hasClass('disabled') == false){
			var phoneNum = $('#mobilePhone').val();
			ajax.post('user/sendsms',{'phoneNum': phoneNum,'busCode': '003'},'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器错误(-2)，短信发送失败');
					return;					
				}
				settime();				
			});
		}
	});
	
	//提交验证
	$('#btn').on('click',function(){
		if(flag == false) return;
		var mobilePhone = $('#mobilePhone').val();
			smsCode = $('#validate-code-input').val();		
		if(smsCode == ''){
			$.errtoast('请输入验证码');
			return;
		}
		if( REG.ISNULL.test(smsCode) == false ){
			$.errtoast('请输入正确的验证码');
			return;
		}		
		//提交验证post
		var errorCode = require('errorCode');//载入错误码
		ajax.post('user/unbindphonenum',{'mobilePhone': mobilePhone,'smsCode': smsCode,'customerId': customerId},'json',function(data){
			if(data.status == 0){
				errorCode(data.errorCode);
				return;					
			}
			$.errtoast('解绑成功');
			setTimeout(function(){window.history.back();},1500);
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

});