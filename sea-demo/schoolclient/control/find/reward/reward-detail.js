define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./reward-detail.css');	
	
	var	customerId = window.jsObj.readUserData('id'),
		rewardId = base.getQueryString('id');
	
	$("#telPhone").on('click',function(){
		window.jsObj.callPhone(SAYIMO.TEL);
	});
	
	require('dateFormat');
	
	ajax.get('base/selectbaserewardlist?id=' + rewardId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;		
		
		if(data.photoIds.length > 0){
			var slideData = '';
			for(var i = 0; i < data.photoIds.length; i++){
				slideData += '<li><img src="' + data.photoIds[i].photoPath + '" /></li>';
			}	
			slideData = '<div class="slide-container"><ul class="slide-main">'+ slideData + '</ul><ul class="slide-pagination"></ul></div>';
			$("#slidePlay").append(slideData);		
			var slide = require('slide'),isautoplay = false;
			data.photoIds.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay});			
		}
		
		data = data.reward[0];

		$("#share").on('click',function(){
			window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')' + data.rewardName,'赏金猎人_' + data.rewardName,SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');			
		});
		
		var d =	new Date(),e = new Date();
		d.setTime(data.startDate);
		e.setTime(data.endDate);
		window.jsObj.setLoadUrlTitle('赏金猎人_' + data.rewardName);
		$("#rewardName").html(data.rewardName);
		$("#factPrice").html(data.factPrice.toFixed(2));
		$("#startDate").html(d.format('yyyy-MM-dd'));
		$("#endDate").html(e.format('yyyy-MM-dd'));
		$("#submitNum").html(data.submitNum);
		if(data.resume != '' && data.resume != null && data.resume != undefined){
			$("#resume").html(data.resume);
		}
		if(data.description != '' && data.description != null && data.description != undefined){
			$("#description").html(data.description);
		}
	
		if(data.status != 1){
			$("#myreward").remove();
		}else{
			$("#myreward").show();
			$(".content").css('bottom','2.5rem');
			var _Date = Math.round(new Date().getTime());
			$("#myreward").on('click',function(){
				if(_Date < data.startDate){
					$.errtoast('即将开始投标');
				}else if(_Date > data.startDate && _Date < data.endDate){
					$.showIndicator();//弹出确认取消弹出层
					ajax.get('base/selectbaserewardlist?id=' + rewardId + '&customerId=' + customerId,'json',function(data){						
						$.hideIndicator();//关闭确认取消弹出层
						if(data.data.isSubmit == 1){
							$.confirm('您已投过标，是否更新投标？',
								function () {
									ajax.get('base/myrewardsubmitlist/' + customerId + '?rewardId=' + rewardId,'json',function(data){
										if(data.status == 0){
											$.errtoast('服务器繁忙，请稍后重试');
											return;
										}										 
										window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/reward/insertReward.html?id=' + rewardId + '&isSubmit=' + data.data.myRewardSubmitList.reward[0].id);
									});										
								}
							);					
						}else{
							window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/reward/insertReward.html?id=' + rewardId + '&isSubmit=0');
						}						
					});
				}else if(_Date > data.endDate){
					$.errtoast('投标已结束');
				}
			});			
		}

	});
	
	var flag_1 = false, flag_2 = false;
	$(".tab-link").eq(1).on('click',function(){
		if(flag_1) return;
		ajax.get('base/myrewardsubmitlist/' + customerId + '?rewardId=' + rewardId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data.myRewardSubmitList;			
			if(data.reward.length > 0){
				$("#tab2 .html-content").html('<p>联系人:' + data.reward[0].linkMan + '</p><p>联系方式：' + data.reward[0].linkInfo + '</p><p>我的设计思路：' + data.reward[0].resume + '</p>');
			}
			if(data.photoIds.length > 0){
				var imgData = '';
				for(var i = 0; i < data.photoIds.length; i++){
					imgData += '<img src="' + data.photoIds[i].photoPath + '">';
				}
				$("#tab2 .html-content").append(imgData);
			}			
			flag_1 = true;
		});		
	});
	
	$(".tab-link").eq(2).on('click',function(){
		if(flag_2) return;
		ajax.get('base/otherrewardsubmitlist/' + rewardId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data.otherRewardSubmitList;
			if(data.length > 0){
				var htmldata = '';
				for(var i = 0; i < data.length; i++){
					var status = '', statusClass = '';
					if(data[i].status == 1){
						status = '待中标';
						statusClass = ' p_l_1';
					}else if(data[i].status == 2){
						status = '已中标';
						statusClass = ' p_l_2';							
					}else if(data[i].status == 3){
						status = '已完成';
						statusClass = ' p_l_3';							
					}else{
						status = '未中标';
						statusClass = ' p_l_4';						
					}
					var other_d = new Date();
					other_d.setTime(data[i].submitDate);
					htmldata += '<li>' +
								'	<div class="l">' +
								'		<img src="' + data[i].headPhoto + '" />' +
								'	</div>' +
								'	<div class="r">' +
								'		<div class="t justifyAlign"><span class="ellipsis">' + data[i].alias + '提供的设计作品</span><span class="p_l' + statusClass + '">' + status + '</span></div>' +
								'		<div class="p red">发布时间：' + other_d.format('yyyy-MM-dd') + '</div>' +									
								'		<div class="i ellipsis">他的设计思路是：' + data[i].resume.substr(0,3) + '******</div>' +	
								'	</div>' +
								'</li>'; 
				}
				$("#tab3").html('<ul class="otherList">' + htmldata + '</ul>');
			}
			flag_2 = true;
		});	
	});
	
});