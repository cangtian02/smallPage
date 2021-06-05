define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./unbindMobile.css');
	
	base.init();
	base.setTitle('手机绑定');		
	
	var customerId = cookie.getCookie('customerId');

	//发送验证码
	$('#btnSendCode').on('click',function(){
		if($(this).hasClass('disabled') == false){
			var mobilePhone=$('#mobilePhone').val();
			if(mobilePhone == ''){
				$.errtoast('请输入手机号码');
				return;
			}
			if( !REG.PHONE.test(mobilePhone) ){
				$.errtoast('手机号码输入不正确');
				return;
			}	
			ajax.post('user/sendsms/',{'phoneNum': mobilePhone,'busCode': '002'},'json',function(data){
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
		var mobilePhone = $('#mobilePhone').val();
			codeinput = $('#validate-code-input').val();		
		if(codeinput == ''){
			$.errtoast('请输入验证码');
			return;
		}
		if( REG.ISNULL.test(codeinput) == false ){
			$.errtoast('请输入正确的验证码');
			return;
		}		
		//提交验证post
		var errorCode = require('errorCode');//载入错误码
		
		//提交绑定手机
		ajax.post('user/bindphonenum',{'mobilePhone': mobilePhone,'smsCode': codeinput,'customerId': customerId},'json',function(data){
			if(data.status == 0){
				errorCode(data.errorCode);
				return;					
			}
			$.errtoast('绑定成功');
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