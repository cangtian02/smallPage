define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./me.css');
	
	var customerId = window.jsObj.readUserData('id'),
		loading = true;

	$(".modifyAccount").on('click',function(){
		window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/modifyAccount.html');
	});
	$("#nativeShare").on('click',function(){
		window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')我要发展会员','我要发展会员',SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');
	});
	
	$("#inviteCode").text(window.jsObj.readUserData('inviteCode'));
	
	function getAjax(){
		loading = true;
		ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.accountInfo[0];		
			if(data.alias == null){
				$('#alias').text(data.accout);
			}else{
				$('#alias').text(data.alias);
			}		
			if(data.headPhoto != null && data.headPhoto != undefined && data.headPhoto != ''){				
				var img = new Image();
				img.src = data.headPhoto;
				img.onload = function(){
					$('#headPhoto').attr('src', data.headPhoto);
				}	
			}				
			if(data.isStudent == 'Y'){
				$('#purseManager').text('公益钱包');
				$("#identity span").text('在校学生');
			}else{
				$('#purseManager').text('我的钱包');
				$("#identity span").text('普通会员');
			}
			$('#purseManager').off('click').on('click',function(){
				ajax.get('user/existwalletpaypwd/' + customerId,'json',function(data){
					var _url = '';
					data.data == 1 ? _url = "view/me/purseManager.html" : _url = "view/me/password/setPwd.html";				
					window.jsObj.loadContent(SAYIMO.SRVPATH + _url);				
				});
			});
			ajax.get('user/getpersonalcentercount/' + customerId,'json',function(data){		
				if(data.status == 0){return;}
				data = data.data;		
				if(data.waitPayCount > 0 && data.waitPayCount > 99){
					$('#g-waitPayCount div').html('<div class="shu">···</div>');
				}else if(data.waitPayCount > 0 && data.waitPayCount < 99){
					$('#g-waitPayCount div').html('<div class="shu">' + data.waitPayCount + '</div>');
				}		
				if(data.waitSendCount > 0 && data.waitSendCount>99){
					$('#g-waitSendCount div').html('<div class="shu">···</div>');
				}else if(data.waitSendCount > 0 && data.waitSendCount < 99){
					$('#g-waitSendCount div').html('<div class="shu">' + data.waitSendCount + '</div>');
				}		
				if(data.hasbeenSendCount > 0 && data.hasbeenSendCount > 99){
					$('#g-hasbeenSendCount div').html('<div class="shu">···</div>');
				}else if(data.hasbeenSendCount > 0 && data.hasbeenSendCount < 99){
					$('#g-hasbeenSendCount div').html('<div class="shu">' + data.hasbeenSendCount + '</div>');
				}		
				if(data.waitCommentsCount > 0 && data.waitCommentsCount > 99){
					$('#g-waitCommentsCount div').html('<div class="shu">···</div>');
				}else if(data.waitCommentsCount > 0 && data.waitCommentsCount < 99){
					$('#g-waitCommentsCount div').html('<div class="shu">' + data.waitCommentsCount + '</div>');
				}								
			});
			
			ajax.get('user/getpreordersum/' + customerId,'json',function(data){
				if(data.status == 0){return;}
				data = data.data;						
				if(data.waitPayCount > 0 && data.waitPayCount > 99){
					$('#r-waitPayCount div').html('<div class="shu">···</div>');
				}else if(data.waitPayCount > 0 && data.waitPayCount < 99){
					$('#r-waitPayCount div').html('<div class="shu">' + data.waitPayCount + '</div>');
				}		
				if(data.waitAcceptCount > 0 && data.waitAcceptCount > 99){
					$('#r-waitAcceptCount div').html('<div class="shu">···</div>');
				}else if(data.waitAcceptCount > 0 && data.waitAcceptCount < 99){
					$('#r-waitAcceptCount div').html('<div class="shu">' + data.waitAcceptCount + '</div>');
				}				
				if(data.waitConfirmCount > 0 && data.waitConfirmCount > 99){
					$('#r-waitConfirmCount div').html('<div class="shu">···</div>');
				}else if(data.waitConfirmCount > 0 && data.waitConfirmCount < 99){
					$('#r-waitConfirmCount div').html('<div class="shu">' + data.waitConfirmCount + '</div>');
				}				
				if(data.waitCommentsCount > 0 && data.waitCommentsCount > 99){
					$('#r-waitCommentsCount div').html('<div class="shu">···</div>');
				}else if(data.waitCommentsCount > 0 && data.waitCommentsCount < 99){
					$('#r-waitCommentsCount div').html('<div class="shu">' + data.waitCommentsCount + '</div>');
				}					
			});				
			loading = false;
		});
	}
	getAjax();
	
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		getAjax();
		$.pullToRefreshDone('.pull-to-refresh-content');
	});

	$(document).on('click','a',function(){
		if($(this).attr('data-url') != undefined){
			window.jsObj.loadContent(SAYIMO.SRVPATH + $(this).attr('data-url'));
		}
	});
	
});