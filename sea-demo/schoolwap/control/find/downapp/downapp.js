define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./downapp.css');
	
	base.setTitle('彩虹梦客人才app下载');

	var mobileSysType = '';
	var device = $.device, deviceType = 0;
	if(device.android == true){
		mobileSysType = 1;
	}else if(device.ios == true){
		mobileSysType = 2;
	}
	
	var _url = '';

	function is_weixn(){  
	    var ua = navigator.userAgent.toLowerCase();		    
	    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
	        return true;  
	    } else {  
	        return false;  
	    }  
	}
	var flag = is_weixn();
	
	ajax.get('base/getnewapp/' + mobileSysType + '/1','json',function(data){
		if(data.status == 0){
			$.errtoast('app暂未发布');
			return;
		}
		data = data.data;
		if(data.networkType == 0){
			_url = data.localUrl;
		}else{
			_url = data.networkUrl;
		}
		if(flag == false){
			if(_url != '' && _url != null && _url != undefined){
				window.location.href = _url;
			}else{
				$.errtoast('app暂未发布');
			}
		}
		if(mobileSysType == 1){
			$("#dow_android").on('click',function(){
				if(_url == '' && _url == null && _url == undefined){
					$.errtoast('app暂未发布');
					return;
				}
				if(!flag) return;
				$("#JweixinTip").show();
			});			
		}else if(mobileSysType == 2){
			$("#dow_ios").on('click',function(){
				if(_url == '' && _url == null && _url == undefined){
					$.errtoast('app暂未发布');
					return;
				}
				if(!flag) return;
				$("#JweixinTip").show();
			});			
		}		
		$("#JweixinTip").on('click',function(){
			$(this).hide();
		});		
	});	

});