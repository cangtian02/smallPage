define(function(require, exports, module) {

	var base = require('base'),
		ajax = require('ajax');	
	require('./ckds-index.css');

	var customerId = window.jsObj.readUserData('id'),
		submissionId = base.getQueryString('id'),
		identifier = base.getQueryString('identifier');
		
	var submissionStatus, isFlag = false;
	
	var lazy = require('LazyLoad');
	require('dateFormat');
	
	if(identifier == 'SYDS'){
		$(".ljtpBtn").hide();
	}
	
	ajax.get('base/submissiondetail/' + submissionId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		if(data == null){
			$(".content").html(base.noList('活动筹划中...'));
			$.init();
			return;
		}		
		window.jsObj.setLoadUrlTitle(data.subName);
		
		if(data.photoUrl.length > 0){
			var slideData = '';
			for(var i = 0; i < data.photoUrl.length; i++){
				slideData += '<li><img src="' + data.photoUrl[i].photoPath + '" /></li>';//轮播图
			}	
			var cslideData = '<div class="slide-container slide-slideData"><ul class="slide-main">'+ slideData + '</ul><ul class="slide-pagination"></ul></div>';
			$(".playBox").append(cslideData);		
			var slide = require('slide'),isautoplay = false;
			data.photoUrl.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay,'slideBox': '.slide-slideData'});
		}
		
		$(".name").html(data.subName);		
		var s = new Date(), e = new Date();
		s.setTime(data.startDate);
		e.setTime(data.endDate);			
		$(".time").html('活动有效期：' + s.format('yyyy-MM-dd') + ' 至 ' +  e.format('yyyy-MM-dd'));		
		submissionStatus = data.submissionStatus;
		if(submissionStatus > 0){			
			$("#zt").addClass('r_' + data.submissionStatus);
		}		
		$("#tab1 .html-content").html(data.detail);

		ajax.get('base/submissionlist/' + submissionId + '/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data.submissionList;
			if(data.length > 0){
				var htmldata = '', d = new Date();
				if(identifier == 'WJZJYJH'){
					for(var i = 0; i < data.length; i++){
						d.setTime(data[i].createDate);	
						htmldata += '<li>'+
									'	<div class="l"><img class="lazy" data-lazyload="' + data[i].headPhoto + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></div>' +
									'	<div class="r">' +
									'		<div class="t justifyAlign">' +
									'			<div class="n ellipsis red">' + data[i].subName + '</div>' +
									'			<div class="d">' + d.format('yyyy-MM-dd') + '</div>' +
									'		</div>' +
									'		<div class="i">' + data[i].subject + '</div>' +
									'	</div>' +
									'</li>';
						if(i == 0){
							data[0].customerId == customerId ? isFlag = true : isFlag = false;
							if(isFlag == true){$(".ljtgBtn").addClass('disabled');}
						}
					}
					htmldata = '<ul class="tgList tgList_1">' + htmldata + '</ul>';
				}else if(identifier == 'SYDS'){
					for(var i = 0; i < data.length; i++){
						d.setTime(data[i].createDate);
						var img = '';
						for(var j = 0; j < data[i].photoUrl.length; j++){
							img += '<img class="lazy" data-soure="' + data[i].photoUrl[j].photoPath + '" data-lazyload="' + data[i].photoUrl[j].minPhotoPath + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png">';
						}
						htmldata += '<li>'+
									'	<div class="top">' +
									'		<div class="l"><img class="lazy" data-lazyload="' + data[i].headPhoto + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></div>' +
									'		<div class="r">' +
									'			<div class="t justifyAlign">' +
									'				<div class="n ellipsis red">' + data[i].subName + '</div>' +
									'				<div class="d">' + d.format('yyyy-MM-dd') + '</div>' +
									'			</div>' +
									'			<div class="i">' + data[i].subject + '</div>' +
									'		</div>' +
									'	</div>' +
									'	<div class="bot">' + img
									'	</div>' +
									'</li>';
						if(i == 0){
							data[0].customerId == customerId ? isFlag = true : isFlag = false;
							if(isFlag == true){$(".ljtgBtn").addClass('disabled');}
						}
					}
					htmldata = '<ul class="tgList tgList_2">' + htmldata + '</ul>';					
				}				
				$("#tab2").html(htmldata);				
				lazy.init();//刷新图片懒加载
				fun_slide();
			}
		});
		
		if(submissionStatus == 0 || submissionStatus == 2 || submissionStatus == 3 || submissionStatus == 4){
			$(".ljtgBtn").addClass('disabled');
		}

		$(".ljtgBtn").on('click',function(){
			if(submissionStatus == 0){
				$.errtoast('活动未开始');
			}else if(submissionStatus == 1){
				if(isFlag == true){
					$.errtoast('您已参加投稿');
				}else{
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/ckds/ckds-ljtg.html?id=' + data.id + '&identifier=' + identifier);
				}			
			}else if(submissionStatus == 2){
				$.errtoast('活动评选中');
			}else if(submissionStatus == 3){
				$.errtoast('活动投票中');
			}else if(submissionStatus == 4){
				$.errtoast('活动已结束');
			}			
		});

		$(".ljtpBtn").on('click',function(){
			if(submissionStatus == 0){
				$.errtoast('活动未开始');
			}else if(submissionStatus == 1){
				$.errtoast('活动投稿中');			
			}else if(submissionStatus == 2){
				$.errtoast('活动评选中');
			}else if(submissionStatus == 3){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/vote/vote-index.html?id=' + submissionId + '&identifier=' + identifier);
			}else if(submissionStatus == 4){
				$.errtoast('活动已结束');
			}			
		});
		
		$.init();
	});
	
	function fun_slide(){
		$(".tgList_2 li").each(function(){
			var _this = $(this);
			_this.find('.bot img').on('click',function(){	
				var photoUrls = [];				
				_this.find('.bot img').each(function(){
					photoUrls.push({'url': $(this).attr('data-soure')});
				});					
			    var slideFixed = require('slideFixed');
			    slideFixed(photoUrls);							
			});
		});	
	}
	
});