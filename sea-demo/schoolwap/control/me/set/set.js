define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./set.css');
	
	base.init();
	base.setTitle('设置');		
	
	var customerId = cookie.getCookie('customerId');
		
	$('#mustRead').attr('href', SAYIMO.SRVPATH + 'view/me/set/mustRead.html?mark=Members_read');
	$('#aboutWe').attr('href', SAYIMO.SRVPATH + 'view/me/set/aboutWe.html');
	$('#suggest').attr('href', SAYIMO.SRVPATH + 'view/me/set/suggest.html');

	//获取绑定的电话号码
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;					
		}
		data = data.accountInfo[0];
		if(data.mobilePhone == '' || data.mobilePhone == null){
			$('#mobilePhonejump').attr('href', SAYIMO.SRVPATH + 'view/me/accountMobile/boundMobile.html');
			$("#mobilePhonejump .t").text('捆绑手机');
			$(".list-block:first-child ul").append('<li>' + 
	        '  <a href="' + SAYIMO.SRVPATH + 'view/me/accountMobile/boundMobile.html" class="item-link item-content" id="setOutMoneyPassWord_1">' + 
	        '   <div class="item-inner">' + 
	        '      	<div class="item-title t">设置钱包支付密码</div>' + 
	        '      	<div class="item-title sayimo-modify-fontcolor" id="setPassWord_1">请先绑定手机号</div>' + 
	        '    </div>' + 
	        '  </a>' + 
	       	'</li>');
		}else{
			$("#mobilePhonejump .t").text('解绑手机');
			$('#mobilePhonejump').attr('href',SAYIMO.SRVPATH + 'view/me/accountMobile/unbindMobile.html');
			$("#mobilePhone").text(data.mobilePhone);
			//查询是否设置了支付密码
			ajax.get('user/existwalletpaypwd/' + customerId,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;					
				}				
				if(data.data == 1){
					$(".list-block:first-child ul").append('<li>' + 
			        '  <a href="javascript:;" class="item-link item-content" id="setOutMoneyPassWord_1">' + 
			        '   <div class="item-inner">' + 
			        '      	<div class="item-title t">修改钱包密码</div>' + 
			        '    </div>' + 
			        '  </a>' + 
			       	'</li>' +
					'<li>' + 
			        '  <a href="' + SAYIMO.SRVPATH + 'view/me/password/findPwd.html" class="item-link item-content" id="setOutMoneyPassWord_1">' + 
			        '   <div class="item-inner">' + 
			        '      	<div class="item-title t">忘记钱包密码</div>' + 
			        '    </div>' + 
			        '  </a>' + 
			       	'</li>');
			       	changeupPwd();
				}else{
					$(".list-block:first-child ul").append('<li>' + 
			        '  <a href="' + SAYIMO.SRVPATH + 'view/me/password/setPwd.html" class="item-link item-content" >' + 
			        '   <div class="item-inner">' + 
			        '      	<div class="item-title t">设置钱包支付密码</div>' + 
			        '    </div>' + 
			        '  </a>' + 
			       	'</li>');
				}	
			});			
		}	
	});
	function changeupPwd(){
		$('#setOutMoneyPassWord_1').on('click',function(){
			var _text = '<input type="password" class="modal-text-input" placeholder="原支付密码" id="oldMoneyPwd" maxlength="12" autocomplete="off" />' +
						'<input type="password" class="modal-text-input" placeholder="新支付密码" id="newMoneyPwd" maxlength="12" autocomplete="off" />' +
						'<input type="password" class="modal-text-input" placeholder="确认支付密码" id="confirmpassWord" maxlength="12" autocomplete="off" />';
			$.modal({
				title:  '修改钱包密码',
				text: _text,
				buttons: [
			        {
			        	text: '取消',
			        	onClick: function() {	        		
			        	}
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
	}
	function btn_password(){	
		var oldMoneyPwd=$('#oldMoneyPwd').val(),
			newMoneyPwd=$('#newMoneyPwd').val(),
			confirmpassWord=$('#confirmpassWord').val();	
		var reg = new RegExp("^\\d{6}$");
		if(oldMoneyPwd==''){
			$.errtoast('请输入原支付密码');
			return;
		}		
		if(!reg.test(oldMoneyPwd)){
			$.errtoast('原支付密码由六位数字组成');
			return;
		}		
		if(newMoneyPwd==''){
			$.errtoast('请输入新支付密码');
			return;
		}
		if(!reg.test(newMoneyPwd)){
			$.errtoast('新支付密码由六位数字组成');
			return;
		}
		if(confirmpassWord==''){
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