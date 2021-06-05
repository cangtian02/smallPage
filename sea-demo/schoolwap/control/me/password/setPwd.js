define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./setPwd.css');
	
	base.init();
	base.setTitle('设置密码');		
	
	var customerId = cookie.getCookie('customerId');
	
	//获取绑定的电话号码
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}		
		if(data.data.mobilePhone == '' || data.data.mobilePhone == null){
			$.errtoast('您还未绑定手机号');
			setTimeout(function(){
				window.location.href = SAYIMO.SRVPATH + 'view/me/accountMobile/boundMobile.html';
			},1500);
		}
	});
	
	//设置支付密码提交
	$('#btn').on('click',function(e){
		var paypassword = $('#password').val(),
			validate = $('#validate-code-input').val(),
			reg = new RegExp("^\\d{6}$");	
		if(paypassword == ''){
			$.toast('请输入支付密码');
			return;
		}
		if( !reg.test(paypassword) ){
			$.errtoast('支付密码由六位数字组成');
			return;
		}		
		if(validate == ''){
			$.toast('请确认支付密码');
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
			setTimeout(function(){window.history.back();},1500);			
		});
	});

});