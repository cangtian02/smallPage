define(function(require, exports, module){
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');		
	require('./ckds-cyds.css');
	
	var customerId = window.jsObj.readUserData('id'),
		id = base.getQueryString('id'),
		identifier = base.getQueryString('identifier'),
		status,
		ifMemberAlreadyJoinTeam;
	
	require('dateFormat');
	
	ajax.get('base/selectbasestartupgamebyid/' + id + '/' + customerId,'json',function(data){
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
		
		window.jsObj.setLoadUrlTitle(data.baseStartupGame.activityName);
		
		if(data.photoList.length > 0){
		var htmldata = '';
			for(i = 0; i < data.photoList.length; i++){
				htmldata += '<li><img src="' + data.photoList[i].photoPath + '" /></a>';
			}			
			htmldata = '<div class="slide-container"><ul class="slide-main">' + htmldata + '</ul><ul class="slide-pagination"></ul></div>';
			$(".playBox").html(htmldata);
			var slide = require('slide'),isautoplay = false;
			i > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay});		
		}
		
		$(".name").html(data.baseStartupGame.activityName);		
		var s = new Date(),
			e = new Date(),
			as = new Date(),
			ae = new Date(),
			d = Math.round(new Date().getTime());
		s.setTime(data.baseStartupGame.applyStartDate);
		e.setTime(data.baseStartupGame.applyEndDate);
		as.setTime(data.baseStartupGame.startDate);
		ae.setTime(data.baseStartupGame.endDate);			
		$(".time").html('活动有效期：' + as.format('yyyy-MM-dd') + ' 至 ' +  ae.format('yyyy-MM-dd'));
		$(".list-block .item-title:last-child").html('报名有效期：' + e.format('yyyy-MM-dd'));
		if(d > as && d < ae){
			$("#zt").addClass('r_1');
		}else if(d > ae){
			$("#zt").addClass('r_2');
		}
		
		if(d < s){
			status = 0;// 报名未开始
		}else if(d > s && d < e){
			status = 1;// 报名进行中
		}else if(d > e){
			status = 2;// 报名已结束
		}

		var description = data.baseStartupGame.description;
		$(".item-link").on('click',function(){
			popupHTML(description);
		});
		
		var teamdata = '',
			teamdescription= [],
			ifMemberAlreadyJoinTeam = data.ifMemberAlreadyJoinTeam, // 0没参加 1已参加
			teamLibm_class = '';
		ifMemberAlreadyJoinTeam == 0 ? teamLibm_class = 'libm' : teamLibm_class = 'libm disabled';	
		for(var j = 0; j < data.teamList.length; j++){			
			teamdata += '<li data-status="' + data.teamList[j].status + '" data-id="' + data.teamList[j].id + '" data-gameId="' + data.teamList[j].gameId + '">' +
			       		'	<div class="t">' +
			       		'		<img src="' + data.teamList[j].photoUrl + '">' +
			       		'		<div class="r">' +
			       		'			<p>' + data.teamList[j].teamName + '</p>' +
			       		'			<p class="ellipsis">' + data.teamList[j].brief + '</p>' +
			       		'		</div>' +
			       		'	</div>' +
			       		'	<div class="b"><span class="' + teamLibm_class + '">立即报名</span><span class="cktdqd">查看团队清单</span></div>' +
			       		'</li>';
			teamdescription.push(data.teamList[j].description);       		
		}
		$(".teamList").html(teamdata);
		$(".teamList li").each(function(i){
			var _this = $(this);
			_this.find('.t').on('click',function(){
				popupHTML(teamdescription[i]);
			});
			_this.find('.libm').on('click',function(){
				if(status == 0){
					$.errtoast('报名未开始');
					return;
				}
				if(status == 2){
					$.errtoast('报名已结束');
					return;
				}
				if(_this.attr('data-status') == 0){
					$.errtoast('团队已解散');
					return;					
				}
				if(ifMemberAlreadyJoinTeam == 1){
					$.errtoast('您已参加团队');
					return;					
				}
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/ckds/cyds-ljbm.html?gameId='+ _this.attr('data-gameId') + '&teamId=' + _this.attr('data-id'));
			});
			_this.find('.cktdqd').on('click',function(){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/activity/ckds/cyds-list.html?teamId='+ _this.attr('data-id'));
			});	
		});
	});

	function popupHTML(s){
	  	var popupHTML = '<div class="popup">'+
	                    '<div class="content-block">'+
	                      '<div class="closeBtn"><a href="javascript:;" class="close-popup">关闭</a></div>'+
	                      '<div class="html-content">' + s + '</div>'+ 
	                    '</div>'+
	                  '</div>';
	    $.popup(popupHTML);	
	}	

});