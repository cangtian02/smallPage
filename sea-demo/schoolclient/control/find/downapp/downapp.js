define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./downapp.css');

	window.jsObj.setLoadUrlTitle('彩虹梦客人才app下载');
	
	var mobileSysType = '';
	var device = $.device, deviceType = 0;
	if(device.android == true){
		mobileSysType = 1;
	}else if(device.ios == true){
		mobileSysType = 2;
	}
	
	var _url = '';
	
	ajax.get('base/getnewapp/' + mobileSysType + '/1','json',function(data){
		if(data.status != 0){
			data = data.data;
		}	
		if(data.networkType == 0){
			_url = data.localUrl;
		}else{
			_url = data.networkUrl;
		}			
		$("#dow_android").on('click',function(){
			if(mobileSysType == 1){			
				if(_url != '' && _url != null && _url != undefined){
					window.jsObj.downApk(_url);
				}else{
					$.errtoast('app暂未发布');
				}
			}
		});
		$("#dow_ios").on('click',function(){
			if(mobileSysType == 2){			
				if(_url != '' && _url != null && _url != undefined){
					window.location.href = _url;
				}else{
					$.errtoast('app暂未发布');
				}
			}
		});			
	});

});