define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./purseManager.css');
		
	window.jsObj.setLoadUrlTitle('我的钱包');
	
	var customerId = window.jsObj.readUserData('id');
	
	ajax.get('user/getwalletbycustomerid/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		$("#totalIncome").text(data.accumulaMoney.toFixed(2));
		$("#remainderMoney").text(data.remainingMoney.toFixed(2));
		$("#totalConsume").text(data.accumulaCost.toFixed(2));
	});

	$("#walletInOutDetail").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/walletInOutDetail.html');
	});
	$("#forgetupPwd").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/password/findPwd.html');
	});
	
	$('#changeupPwd').on('click',function(){
		var _text = '<input type="password" class="modal-text-input" placeholder="原支付密码" id="oldMoneyPwd" maxlength="12" autocomplete="off" />' +
					'<input type="password" class="modal-text-input" placeholder="新支付密码" id="newMoneyPwd" maxlength="12" autocomplete="off" />' +
					'<input type="password" class="modal-text-input" placeholder="确认支付密码" id="confirmpassWord" maxlength="12" autocomplete="off" />';
		$.modal({
			title:  '修改钱包密码',
			text: _text,
			buttons: [
		        {
		        	text: '取消',
		        	onClick: function() {}
		        },
		        {
		        	text: '确定',
		        	close: false,
		        	onClick: function() {
						btn_password();
		          	}
		        }
			]					
		});		
	});
	
	function btn_password(){	
		var oldMoneyPwd=$('#oldMoneyPwd').val(),
			newMoneyPwd=$('#newMoneyPwd').val(),
			confirmpassWord=$('#confirmpassWord').val();	
		var reg = new RegExp("^\\d{6}$");
		if(oldMoneyPwd == ''){
			$.errtoast('请输入原支付密码');
			return;
		}		
		if(!reg.test(oldMoneyPwd)){
			$.errtoast('原支付密码由六位数字组成');
			return;
		}		
		if(newMoneyPwd == ''){
			$.errtoast('请输入新支付密码');
			return;
		}
		if(!reg.test(newMoneyPwd)){
			$.errtoast('新支付密码由六位数字组成');
			return;
		}
		if(confirmpassWord == ''){
			$.errtoast('请输入确认密码');
			return;
		}
		if(newMoneyPwd != confirmpassWord){
			$.errtoast('支付密码与确认密码不一致');
			return;
		}			
		ajax.post('user/editwalletpaypwd',{'customerId': customerId,'oldPassword': oldMoneyPwd,'newPassword': newMoneyPwd},'json',
			function(data){
				$.closeModal();
				if(data.status == 0 && data.errorCode == '300003'){
					$.errtoast('原支付密码错误');
					return;
				}
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$.errtoast('修改成功');
				setTimeout(function(){window.location.reload();},1500);				
			}
		);
	}

});