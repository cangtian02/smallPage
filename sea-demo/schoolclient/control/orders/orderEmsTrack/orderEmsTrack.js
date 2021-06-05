define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./orderEmsTrack.css');
	
	window.jsObj.setLoadUrlTitle('物流详情');
	
	var	customerId = window.jsObj.readUserData('id'),
		orderId = base.getQueryString('orderId');//获取订单id

	var emsinfo_htmldata = '',
		track_htmldata ='';

	ajax.get('order/getlogisticinfo/' + orderId + '/' + customerId,'json',function(data){
		if(data.status == 0){
			$(".content").html(base.noMent('暂无物流信息'));
			return;
		}
		data = data.data;		
		if(data.emsNo==''){
			emsinfo_htmldata += '<div>订单号：' + data.ordersNo + '</div>';
			$(".emsinfo").html(emsinfo_htmldata);
			track_htmldata += '<ul><li><span class="icon on"></span><span  class="new-track">暂无物流信息</span></li></ul>';
			$(".new-order-track").html(track_htmldata);
		}else{
			emsinfo_htmldata += '<div>快递单号：' + data.emsNo + '</div>' +
								'<div>承运人：' + data.emsName + '</div>' +
								'<div>订单号：' + data.ordersNo + '</div>';
			$(".emsinfo").html(emsinfo_htmldata); 
			var data = data.traces;
			track_htmldata += '<ul>';
			if(data.length>0){
				for(var i = 0; i < data.length; i++){
					var cl = '';
					if(i == 0){cl = ' on';}
					track_htmldata += '<li><span class="icon' + cl + '"></span><span>' + data[i].AcceptStation + '</span><span>' + data[i].AcceptTime + '</span></li>';
				}				
			}else{
				track_htmldata += '<li><span class="icon on"></span><span  class="new-track">暂无物流信息</span></li>';
			}
			track_htmldata += '</ul>';
			$(".new-order-track").html(track_htmldata);
		}			
	});
	
});