define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie');		
	require('./sf-interchange.css');
	
	base.init();
	base.setTitle('是否是学生');
	
	var customerId = cookie.getCookie('customerId'),
		_url = null;
		
	$(".btn").each(function(){
		$(this).click(function(){
			var source = $(this).attr('id');
			if(source == 'ppx'){
				_url = SAYIMO.PPX + customerId;
			}else if(source == 'sjhs'){
				_url = SAYIMO.SJHS + customerId;
			}else if(source == 'swx'){
				_url = SAYIMO.SWX + customerId;
			}else{
				_url = null;
			}
			setTimeout(function(){
				if(_url == null){
					$.errtoast('地址错误，请重新进入');
					window.history.back();
				}else{
					window.location.href = _url;
				}
			},100);			
		});
	});

});