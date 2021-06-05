define(function(require, exports, module) {
	
	$.init();

	var base = require('base'),
		ajax = require('ajax');
	require('./modifyAccount.css');
	
	window.jsObj.setLoadUrlTitle('个人信息');
	
	var customerId = window.jsObj.readUserData('id');
	
	var flag = false, headPhoto = '', accout = '';;
	
	ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;				
		}
		data = data.accountInfo[0];
		
		flag = true;
		$("#btn").removeClass('disabled');
		
		accout = data.accout;

		if(data.headPhoto != null && data.headPhoto != undefined && data.headPhoto != ''){
			var img = new Image();
			img.src = data.headPhoto;
			img.onload = function(){
				$('#headPhoto').attr('src', data.headPhoto);
			}
		}
		$('#accout').text(data.accout);
		$('#realName').val(data.realName);
		$('#alias').val(data.alias);
		$('#sex').val(data.sex);		
		$("#mobilePhone").text(data.mobilePhone);
		
		require('dateFormat');
		var d = new Date(),e = new Date();
		d.setTime(data.birthday);		
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

		var cityPicker = require('cityPicker');		
		cityPicker($('#city-picker'),$('#baseAreaCode'),data.baseAreaCode,function(){});
		
	});
	
	var Pcorp = require('Pcorp');
	require('uploadImg');
	$("#file").change(function () { //点击上传图片
		$.showIndicator();
	    var that = this;
	    lrz(that.files[0], {}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
	        	$.hideIndicator();
				Pcorp({
					'src': rst.base64,
					'aspectRatio': [1,1],
					'quality': .6,
					'callback': function(basesrc){
						var img = new Image();
						img.src = basesrc;
						img.onload = function(){
	        				$("#headPhoto").attr('src', img.src);
	        				$("#headPhoto").attr('data-name', rst.origin.name);
						}				
					}
				});
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});	
	
	$('#btn').on('click',function(){
		if (!flag) return;
		var realName = $('#realName').val(),
			alias = $('#alias').val();
		if(realName != '' && !REG.ISNULL.test(realName)){
			$.errtoast('姓名输入错误');
			return;			
		}
		if(alias == ''){
			$.errtoast('昵称不能为空');
			return;			
		}
		if(!REG.ISNULL.test(alias)){
			$.errtoast('昵称输入错误');
			return;			
		}		
		if($("#headPhoto").attr('data-name') == undefined){
			headPhoto = $("#headPhoto").attr('src');
			$.showIndicator();
		 $("#btn").addClass('disabled');			
			postAjax();	
		}else{
			$.showIndicator();
			$("#btn").addClass('disabled');			
			var fileStr = $("#headPhoto").attr('src');
				fileStr = fileStr.split(',');
				fileStr = fileStr[1];
			var fileName = $("#headPhoto").attr('data-name');
			ajax.post('base/uploadfilebackurl',{"fileStr": fileStr,"fileName": fileName},'json',function(data){
				if(data.status == 0){
					$.errtoast('头像上传失败');
					$.hideIndicator();
					flag = true;
					$("#btn").removeClass('disabled');
					return;
				}
				headPhoto = data.data[0].photoUrl;
				postAjax();				
			});			
		}
	});
    	
	function postAjax(){
		var realName = $('#realName').val(),
			alias = $('#alias').val(),
			sex = $('#sex').val(),
			_birthday = $('#birthday').val(),
			baseAreaCode = $('#baseAreaCode').val();
		_birthday = _birthday.replace(/-/g,'/');
	    _birthday = new Date(_birthday); 
	    _birthday = _birthday.getTime().toString();	
		ajax.post('user/updateaccountinfo',{
			'accout': accout,
			'alias': alias,
			'headPhoto': headPhoto,
			'birthdayLong': _birthday,
			'baseAreaCode': baseAreaCode,
			'realName': realName,			
			'sex': sex			
		},'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return false;				
			}			
			$.errtoast('修改成功');
			setTimeout(function(){window.location.reload();},1500);
		});		
	}
	
});