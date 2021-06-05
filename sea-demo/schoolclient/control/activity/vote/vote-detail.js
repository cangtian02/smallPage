define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');	
	require('./vote-detail.css');
	
	window.jsObj.setLoadUrlTitle('个人投票');
	
	var customerId = window.jsObj.readUserData('id'),
		submissionId = base.getQueryString('submissionId'),
		voteSubmissionId = base.getQueryString('voteSubmissionId'),
		identifier = base.getQueryString('identifier'),
		subName,
		voteName,
		voteStatus;

	ajax.get('base/commonvotedetail/' + voteSubmissionId,'json',function(sdata){
		if(sdata.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		voteName = sdata.data.voteName;
		var s = sdata.data.startDate, e = sdata.data.endDate, d = Math.round(new Date().getTime());	
		if(d < s){
			voteStatus = 0;			
		}else if(d > s && d < e){
			voteStatus = 3;
		}else if(d > e){
			voteStatus = 4;
		}
		fun_dom();
	});
	
	function fun_dom(){	
		ajax.get('base/listcommonvoterecords/' + voteSubmissionId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;		
			if(data.length > 0){
				var htmldata = '';
				for(var i = 0; i < data.length; i++){
					if(data[i].submissionId == submissionId){
						var alias = '';
						if(data[i].alias != '' && data[i].alias != undefined && data[i].alias != null){
							alias = '<span>(' + data[i].alias + ')</span>';
						}	
						subName = data[i].subName;					
						var records = '';
						if(data[i].rank < 4){
							records = '<img src="/schoolclient/images/activity/vote/icon_ranking_' + data[i].rank + '.png" class="topThree" />';
						}else{
							records = '<div class="records tc">' + data[i].rank + '</div>';
						}	
						
						if(identifier == 'WJZJYJH'){
							htmldata = '<div class="topBanner">' +			
										'	<img src="/schoolclient/images/activity/vote/voteBanBg.png" class="bg" />' +
										'	<div class="headPhoto"><img src="' + data[i].headPhoto + '" /><span>' + data[i].code + '号</span></div>' +
										'	<div class="info tc">' +
										'		<div class="name red">' + data[i].subName + alias + '</div>' +
										'		<p class="voteCnt"><span>' + data[i].voteCnt + '</span>票</p>' +
										'	</div>' +
										'</div>' +
										'<section>' +
										'	<div class="voteCntBox">' + records + '</div>' +
										'	<div class="goHome tr red">点击进入彩虹梦客更精彩>></div>' +
										'	<div class="subject">' + data[i].subject + '</div>' +
										'	<div class="btn tc" id="vote">我来一票</div>' +
										'	<div class="btn tc shareVote" id="shareVote">邀请好友来一票</div>' +
										'</section>' + 
										'<p class="tc">活动最终解释权归广东尚一股份有限公司</p>';
							$(".content").html(htmldata);
							insertcommonvote();									
						}else{	
							var slideData = '',photoUrls = [];
							for(var j = 0; j < data[i].photoUrl.length; j++){
								slideData += '<li><img src="' + data[i].photoUrl[j].photoPath + '" /></li>';
								photoUrls.push({'url': data[i].photoUrl[j].photoPath});
							}	
							var cslideData = '<div class="slide-container slide-slideData"><ul class="slide-main">'+ slideData + '</ul><ul class="slide-pagination"></ul></div>';																										
							htmldata = '<div class="topBanner_2">' +
										'	<div class="l"><img src="' + data[i].headPhoto + '" /><span>' + data[i].code + '号</span></div>' +
										'	<div class="r">' +
										'		<div class="t">' + data[i].subName + alias + ' 参加了<span></span>' + voteName + '</div>' +
										'		<p class="voteCnt"><span>' + data[i].voteCnt + '</span>票</p>' +
										'	</div>' +
										'</div>' +
										'<div class="playBox">' + cslideData + '</div>' +
										'<hr>' +
										'<section class="section">' +
										'	<div class="subject">' + data[i].subject + '</div>' +
										'	<div class="goHome tr red">点击进入彩虹梦客更精彩>></div>' +	
										'	<div class="voteCntBox">' + records + '</div>' +
										'	<div class="btn tc" id="vote">我来一票</div>' +
										'	<div class="btn tc shareVote" id="shareVote">邀请好友来一票</div>' +
										'</section>' + 
										'<p class="tc">活动最终解释权归广东尚一股份有限公司</p>';
							$(".content").html(htmldata);
							var slide = require('slide'),isautoplay = false;
							data[i].photoUrl.length > 1 ? isautoplay = true : isautoplay = false;
							slide = new slide({'autoplay': isautoplay,'slideBox': '.slide-slideData'});

							$(".slide-main li").each(function(){
								$(this).on('click',function(){				
								    var slideFixed = require('slideFixed');
								    slideFixed(photoUrls);									
								});
							});						
														
							insertcommonvote();													
						}
						$(".goHome").on('click',function(){
							window.jsObj.goHome();
						});					
						return;						
					}			
				}
			}		
		});			
	}

	function insertcommonvote(){
		var issubmit = false;// 是否投过票
		$('#vote').on('click',function(){
			if(!issubmit){
				$.showIndicator();
				if(voteStatus == 0){
					$.hideIndicator();
					$.errtoast('投票未开始');
					return;
				}
				if(voteStatus == 4){
					$.hideIndicator();
					$.errtoast('投票已结束');
					return;
				}							
				ajax.post('base/insertcommonvote',{'customerId': customerId,'submissionId': submissionId,'voteSubmissionId': voteSubmissionId},'json',function(data){
					$.hideIndicator();
					if(data.status == 0 && data.errorCode == '900003'){
						$.errtoast('您已参与投票');
						$('#vote').addClass('disabled');
						issubmit = true;
						return;
					}
					if(data.status == 0 && data.errorCode == '900004'){
						$.errtoast('您今天已投过票了');
						$('#vote').addClass('disabled');
						issubmit = true;
						return;
					}						
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}
					$.errtoast('投票成功');
					$("#vote").addClass('disabled');
					issubmit = true;
					$(".voteCnt span").text(Number($(".voteCnt span").text()) + 1);										
				});						
			}					
		});
		// 邀请好友投票 使用 suo.im 的api使网址变为短网址
		$("#shareVote").on('click',function(){
			window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')' + '邀请好友来一票',subName + '正在参加彩虹梦客空间投票评选活动，帮TA投一票，助TA领取大奖！',SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');							
		});
	}
	
});