define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./modifyphone.css');
			
	window.jsObj.setLoadUrlTitle('修改捆绑手机');
	
	var customerId = window.jsObj.readUserData('id'),
		accout = window.jsObj.readUserData('accout');
	
	//获取绑定的电话号码
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
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
			$(".box_1").addClass('din');
			$(".box_2").removeClass('din');
		});
	});
	
	$("#btn_2").on('click',function(){
		var mobilePhone_2 = $('#mobilePhone_2').val();
		if(mobilePhone_2 == ''){
			$.errtoast('请输入手机号码');
			return;
		}
		if(!REG.PHONE.test(mobilePhone_2)){
			$.errtoast('手机号码输入错误');
			return;
		}
		ajax.post('user/modifyphone',{'accout': accout,'mobilePhone': mobilePhone_2},'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;					
			}		
			$.errtoast('修改成功');
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