define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./positionDemandDetail.css');
	
	var demandId = base.getQueryString('id'),
		customerId = window.jsObj.readUserData('id');

	ajax.get('base/getpositiondemanddetails/' + demandId,'json',function(data){
		if(data.status == 0){
			$.errtoast('系统繁忙，请稍后重试');
			return;
		}
		var newsDetail = data.data.positionDemandDetails;
		window.jsObj.setLoadUrlTitle('职位详情_' + newsDetail.name);
		for(var i in newsDetail){
			if(newsDetail[i] != '' && newsDetail[i] != null && newsDetail[i] != undefined){
				var t = '';
				i == 'positionNum' ? t = '人' : t = '';
				$("#" + i).find('.c').text(newsDetail[i] + t);
			}else{
				$("#" + i).hide();
			}
		}
		var getDateDiff = require('dateDiff');
		var demandDate = getDateDiff(newsDetail.updateTime);
		$("#updateTime .c").text(demandDate);		
		if(newsDetail.describe != '' && newsDetail.describe != null && newsDetail.describe != undefined){
			var hdata = newsDetail.describe.split('<p><br/></p>'),hdom = '';
			for(i in hdata){hdom += hdata[i];}				
			$("#describe .c").html(hdom);
		}
		if($("#hrPhone .c").text() != ''){
			$("#hrPhone .c").text($("#hrPhone .c").text().substr(0,3) + ' **** ****');
		}
		$(".table").each(function(){
			if($(this).find('.c').text() == '' || $(this).find('.c').text() == 'null' || $(this).find('.c').text() == 'undefined'){
				$(this).find('.c').html('<span style="color: #C0C0C0;">暂无信息</span>');
			}
		});		
	});
	
	$("#deliver_btn").on('click',function(){
	    $.confirm('确认投递该职位？',
	        function () {
	        	$.showIndicator();
				ajax.get('base/getresumeid/' + customerId,'json',function(data){	
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}
					if(data.data == 0){
						$.hideIndicator();
					    $.confirm('您还未创建简历哦，去创建吧',
					        function(){
					        	window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/resume/addresume.html');
							}			        
					    );					        	
					}else{
						ajax.post('base/resumedeliveryadd',{'customerId': customerId,'demandId': demandId},'json',function(data){
							$.hideIndicator();
							if(data.status == 0 && data.errorCode == '900001'){
								$.errtoast('你已投递过该职位');
								return;
							}
							if(data.status == 0){
								$.errtoast('系统繁忙，请稍后重试');
								return;
							}					
							$.errtoast('投递成功');
						});
					}
				});	        	
			}			        
	    );		
	});
	
});