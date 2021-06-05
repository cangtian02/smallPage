define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./resumedeliverydetail.css');
	
	window.jsObj.setLoadUrlTitle('简历投递详情');
	
	ajax.get('base/resumedeliverydetail/' + base.getQueryString('id'),'json',function(data){
		if(data.status == 0){
			$.errtoast('系统繁忙，请稍后重试');
			return;
		}
		var deliverydetail = data.data;
		require('dateFormat');
		var d = new Date();d.setTime(deliverydetail.deliveryTime);		
		$(".b-top img").attr('src', deliverydetail.headPhotoUrl);
		$(".b-top h3").html(deliverydetail.customerName);
		$(".b-top p").html(d.format('yyyy-MM-dd HH:mm:ss') + ' 投递');
		for(var i in deliverydetail){
			if(deliverydetail[i] != '' && deliverydetail[i] != null && deliverydetail[i] != undefined){
				$("#" + i).find('.c').text(deliverydetail[i]);
			}else{
				$("#" + i).hide();
			}
		}
	});
	
});