define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./modifyAccount.css');
	
	base.init();
	base.setTitle('我');		
	
	var customerId = cookie.getCookie('customerId');

	//获取我的账户信息
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;				
		}
		
		$('#headPhoto').attr('src',data.accountInfo[0].headPhoto);
		$('#accout').text(data.accountInfo[0].accout);
		$('#realName').val(data.accountInfo[0].realName);
		$('#birthday').val(data.accountInfo[0].birthday);
		$('#alias').text(data.accountInfo[0].alias);
		$('#sex').val(data.accountInfo[0].sex);
		if(data.accountInfo[0].mobilePhone == '' || data.accountInfo[0].mobilePhone == null){
			$('#mobilePhone').text('未绑定');
			$('#mobilePhonejump').attr('href', SAYIMO.SRVPATH + 'view/me/accountMobile/boundMobile.html');
		}else{
			$('#mobilePhone').text(data.accountInfo[0].mobilePhone);
			$('#mobilePhonejump').attr('href', SAYIMO.SRVPATH + 'view/me/accountMobile/unbindMobile.html');
		}

		var cityPicker = require('cityPicker');		
		cityPicker($('#city-picker'),$('#baseAreaCode'),data.accountInfo[0].baseAreaCode,function(){});
		
		require('dateFormat');
		var d = new Date(),e = new Date();
		d.setTime(data.accountInfo[0].birthday);		
		var d_date = Math.round(new Date().getTime());
		e.setTime(d_date);
		$("#birthday").val(d.format('yyyy-MM-dd'));
		$("#birthday").calendar({
		    value: [d.format('yyyy-MM-dd')],
		    maxDate: [e.format('yyyy-MM-dd')],
		    onOpen : function(p){
		    	$(".sayimo-mask").show();
		    },
		    onClose : function(p){
		    	$(".sayimo-mask").hide();
		    }
		});	
	});
	
	$('#btn').on('click',function(){
		var realName = $('#realName').val(),
			headPhoto = $('#headPhoto').attr('src'),
			accout = $('#accout').text(),
			alias = $('#alias').text(),
			sex = $('#sex').val(),
			birthdayLong = $('#birthday').val(),
			baseAreaCode = $('#baseAreaCode').val();
		if(realName != '' && !REG.ISNULL.test(realName)){
			$.errtoast('姓名输入错误');
			return;			
		}	
		var _birthdayLong = Date.parse(new Date(birthdayLong));
			_birthday = _birthdayLong / 1000;
		ajax.post('user/updateaccountinfo',{'accout': accout,'alias': alias,'headPhoto': headPhoto,'birthdayLong': _birthday,'baseAreaCode': baseAreaCode,'realName': realName,'sex': sex,},'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return false;				
			}			
			$.errtoast('修改成功');
			setTimeout(function(){window.location.reload();},1500);
		});
	});
		
});