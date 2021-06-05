define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
		require('./me.css');
		require('botbar');
		purseManager
		base.init();
		base.setTitle('我');		
	
	var customerId = cookie.getCookie('customerId'),
		isStudent = cookie.getCookie('isStudent');

	$('#goodsorderManagement').attr('href', SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html');
	$('#g-waitPayCount').attr('href', SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=2');
	$('#g-waitSendCount').attr('href', SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=3');
	$('#g-hasbeenSendCount').attr('href', SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=4');
	$('#g-waitCommentsCount').attr('href', SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=5');
	$('#returngoodsList').attr('href', SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsOrdersList.html');
	
	$('#reservedorderManagement').attr('href', SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html');
	$('#r-waitPayCount').attr('href', SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=2');
	$('#r-waitAcceptCount').attr('href', SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=3');
	$('#r-waitConfirmCount').attr('href', SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=4');
	$('#r-waitCommentsCount').attr('href', SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=5');
	
	$('#memberList').attr('href', SAYIMO.SRVPATH + 'view/me/memberList.html');
	$("#meresume").attr('href', SAYIMO.SRVPATH + 'view/me/resume/myresume.html');
	$("#mecollect").attr('href', SAYIMO.SRVPATH + 'view/me/mecollect/mecollectList.html');
	
	$('#listReceivingAddress').attr('href',SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html');
	$('#set').attr('href', SAYIMO.SRVPATH + 'view/me/set/set.html');
		
	$(".modifyAccount").on('click',function(){
		window.location.href = SAYIMO.SRVPATH + 'view/me/modifyAccount.html';
	});
	$("#nativeShare").on('click',function(){
		window.location.href = SAYIMO.SRVPATH + 'view/me/sharePage.html';
	});
	
	if(isStudent == 'Y'){
		$('#purseManager').text('公益钱包');
		$("#identity span").text('在校学生');
	}else{
		$('#purseManager').text('我的钱包');
		$("#identity span").text('普通会员');
	}

	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.accountInfo[0];
		$('#alias').text(data.alias);
		$('#headPhoto').attr('src', data.headPhoto);
		if(data.mobilePhone == '' || data.mobilePhone == null){
			$('#purseManager').attr('href', SAYIMO.SRVPATH + 'view/me/accountMobile/boundMobile.html');
		}else{
			ajax.get('user/existwalletpaypwd/' + customerId,'json',function(data){
				if(data.data == 1){
					$('#purseManager').attr('href', SAYIMO.SRVPATH + 'view/me/purseManager.html');
				}else{
					$('#purseManager').attr('href', SAYIMO.SRVPATH + 'view/me/password/setPwd.html');
				}	
			});			
		}	
	});
	
	ajax.get('user/getpersonalcentercount/' + customerId,'json',function(data){
		if(data.status == 0){
			return;
		}
		data = data.data;			
		if(data.waitPayCount > 0){
			if(data.waitPayCount > 99){
				$('#g-waitPayCount div').html('<div class="shu">···</div>');
			}else{
				$('#g-waitPayCount div').html('<div class="shu">' + data.waitPayCount + '</div>');
			}
		}
		if(data.waitSendCount > 0){
			if(data.waitSendCount>99){
				$('#g-waitSendCount div').html('<div class="shu">···</div>');
			}else{
				$('#g-waitSendCount div').html('<div class="shu">' + data.waitSendCount + '</div>');
			}
		}
		if(data.hasbeenSendCount > 0){
			if(data.hasbeenSendCount > 99){
				$('#g-hasbeenSendCount div').html('<div class="shu">···</div>');
			}else{
				$('#g-hasbeenSendCount div').html('<div class="shu">' + data.hasbeenSendCount + '</div>');
			}
		}		
		if(data.waitCommentsCount > 0){
			if(data.waitCommentsCount > 99){
				$('#g-waitCommentsCount div').html('<div class="shu">···</div>');
			}else{
				$('#g-waitCommentsCount div').html('<div class="shu">' + data.waitCommentsCount + '</div>');
			}
		}						
	});
	
	ajax.get('user/getpreordersum/' + customerId,'json',function(data){
		if(data.status == 0){
			return;
		}
		data = data.data;	
		if(data.waitPayCount > 0){
			if(data.waitPayCount > 99){
				$('#r-waitPayCount div').html('<div class="shu">···</div>');
			}else{
				$('#r-waitPayCount div').html('<div class="shu">' + data.waitPayCount + '</div>');
			}
		}
		if(data.waitAcceptCount > 0){
			if(data.waitAcceptCount>99){
				$('#r-waitAcceptCount div').html('<div class="shu">···</div>');
			}else{
				$('#r-waitAcceptCount div').html('<div class="shu">' + data.waitAcceptCount + '</div>');
			}
		}
		if(data.waitConfirmCount > 0){
			if(data.waitConfirmCount > 99){
				$('#r-waitConfirmCount div').html('<div class="shu">···</div>');
			}else{
				$('#r-waitConfirmCount div').html('<div class="shu">' + data.waitConfirmCount + '</div>');
			}
		}		
		if(data.waitCommentsCount > 0){
			if(data.waitCommentsCount > 99){
				$('#r-waitCommentsCount div').html('<div class="shu">···</div>');
			}else{
				$('#r-waitCommentsCount div').html('<div class="shu">' + data.waitCommentsCount + '</div>');
			}
		}						
	});	
	
});