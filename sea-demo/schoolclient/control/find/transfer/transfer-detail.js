define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./transfer-detail.css');	
	
	window.jsObj.setLoadUrlTitle('转让商品详情');
	
	var	customerId = window.jsObj.readUserData('id'),
		transferId = base.getQueryString('id');
	
	var flag = false,
		status,
		linkInfo,
		linkMan;
	
	ajax.get('base/transfergoodsdetail/' + transferId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data.transferGoodsInfo;
		
		linkInfo = data.linkInfo;
		linkMan = data.linkMan;
		status = data.status;
		
		if(data.photoUrlList.length > 0){
			var slideData = '', photoUrls = [];
			for(var i = 0; i < data.photoUrlList.length; i++){
				slideData += '<li><img src="' + data.photoUrlList[i].descPhotoUrl + '" /></li>';
				photoUrls.push({'url': data.photoUrlList[i].descPhotoUrl});
			}	
			var cslideData = '<div class="slide-container slide-slideData"><ul class="slide-main">'+ slideData + '</ul><ul class="slide-pagination"></ul></div>';
			$(".content").append(cslideData);		
			var slide = require('slide'),isautoplay = false;
			data.photoUrlList.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay,'slideBox': '.slide-slideData'});
			$(".slide-main li").each(function(){
				$(this).on('click',function(){				
		        	var slideFixed = require('slideFixed');
		        	slideFixed(photoUrls);
				});
			});			
		}

		require('dateFormat');
		var d =	new Date();
		d.setTime(data.updateTime);
		var htmlData = '<div class="tran-item tran-item-pt5">' +
			 			'	<div class="tran-name" id="goodsName">' + data.goodsName + '</div>' +
			 			'	<div class="tran-share" id="share"><i></i></div>' +
			 			'</div>' +
			 			'<div class="tran-item">' +
			 			'	<div class="tran-price red"><span class="arial">￥</span>' + data.price + '</div>' +
			 			'	<div class="tran-updateTime">发布时间：' + d.format('yyyy-MM-dd HH:mm:ss') + '</div>' +
			 			'</div>' +
			 			'<div class="tran-item tran-span clearfix">' +
			 			'	<span>类别：' + data.className + '</span>' +
			 			'	<span>所在地：' + data.codeName + '</span>' +
			 			'	<span>有效期：' + data.expiration + '</span>' +
			 			'	<span>新旧度：' + data.depreciation + '</span>' +
			 			'</div>' + 			
			 			'<div class="tran-item tran-item-pt5">' +
			 			'	<div class="tran-warning">如遇无效、虚假、诈骗信息请举报</div>' +
			 			'	<div class="tran-warningtel"><a href="javascript:;" id="telPhone"></a></div>' +
			 			'</div>' + 						
			 			'<div class="tran-item tran-desc">' +
			 			'	<div class="tran-desc-t">详情说明：</div>' +
			 			'	<div class="html-content">' + data.description + '</div>' +
			 			'</div>';
		$(".content").append(htmlData);
		$("#telPhone").on('click',function(){
			window.jsObj.callPhone(SAYIMO.TEL);
		});
		$("#share").on('click',function(){
			window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')' + data.goodsName,'物品转让_' + data.goodsName,SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');			
		});		
		if (data.customerId == customerId) flag = true;
		addBotbar();//渲染页面底部模块
	});
	
	function addBotbar(){		
		if(flag){// 查看会员自己发布的物品
			var botbar = '';
			if(status == 1){
	    		botbar = '<div class="botbar boxflex"><div class="btn deleteBtn" id="deleteBtn">删除</div><div class="btn upordownBtn" id="upordownBtn">下架</div><div class="btn confirmBtn" id="confirmBtn">转让</div><div class="btn updateBtn" id="updateBtn">修改</div></div>';				
			}else if(status == 2){
	    		botbar = '<div class="botbar boxflex"><div class="btn deleteBtn" id="deleteBtn">删除</div><div class="btn upordownBtn" id="upordownBtn">上架</div><div class="btn confirmBtn" id="confirmBtn">转让</div><div class="btn updateBtn" id="updateBtn">修改</div></div>';					
			}else if(status == 3){
	    		botbar = '<div class="botbar boxflex"><div class="btn deleteBtn" id="deleteBtn">删除</div>';					
			}
	    	$(".page").append(botbar);
	    	control();
		}else{	
			var botbar = '<div class="botbar">' +   		
				    	'	<div class="linkInfo">' + linkMan + '：' + linkInfo.substr(0,3) + ' **** ' + linkInfo.substr(7,11) + '</div>' +
				    	'	<a href="javascript:;" class="tel tc">联系卖家</a>' +
				    	'</div>';
			$(".page").append(botbar);
			$(".tel").on('click',function(){
				window.jsObj.callPhone(linkInfo);
			});
		}
	}
	
	function control(){
		$("#deleteBtn").on('click',function(){
			$.confirm('确认删除该转让物品？',
				function () {
					ajax.post('base/deletetransfergoods',{'transferId': transferId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('删除成功');
						setTimeout(function(){
							window.jsObj.refreshLastPage();
    						window.jsObj.finshCurrentActivity();   
						},1500);
					});	
				}
			);			
		});
		$("#upordownBtn").on('click',function(){
			var t = '';
			status == 1 ? t = '下架' : t = '上架';
			$.confirm('确认' + t + '该转让物品？',
				function () {
					ajax.post('base/upordowntransfergoods',{'transferId': transferId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast(t + '成功');
						setTimeout(function(){window.location.reload();},1500);
					});	
				}
			);						
		});
		$("#confirmBtn").on('click',function(){
			$.confirm('确认转让该物品？',
				function () {
					ajax.post('base/confirmtransfer',{'transferId': transferId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('转让成功');
						setTimeout(function(){window.location.reload();},1500);
					});	
				}
			);			
		});
		$("#updateBtn").on('click',function(){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/transfer/updateTransfer.html?id=' + transferId);
		});
	}
	
});