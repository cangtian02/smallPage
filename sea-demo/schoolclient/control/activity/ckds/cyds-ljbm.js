define(function(require, exports, module){
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');		
	require('./cyds-ljbm.css');	
	
	window.jsObj.setLoadUrlTitle('立即报名');
	
	var customerId = window.jsObj.readUserData('id'),
		gameId = base.getQueryString('gameId'),
		teamId = base.getQueryString('teamId'); 
	
	var flag = false;
	
	var schoolList = [], schoolIds = [], schoolId;
	
	ajax.get('base/getallschool','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data.schoolList;
		for(var i = 0; i < data.length; i++){
			schoolList.push(data[i].schoolName);
			schoolIds.push(data[i].id);
		}		
		$("#schoolId").picker({
			toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button><h1 class="title">请选择学校</h1></header>',
			cols: [
			    {
			      textAlign: 'center',
			      values: schoolList
			    }
			],
			onOpen: function(){
				$(".sayimo-mask").show();
			},
			onClose: function(){				
				var i = $(".picker-selected").index();
				schoolId = schoolIds[i];
				$(".sayimo-mask").hide();
			}
		});
		flag = true;
		$("#btn").removeClass('disabled');		
	});	


	require('uploadImg');
	$("#studentCardUrl").change(function () { 
	    var that = this;
	    lrz(that.files[0], {width: 500}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
	        	$("#studentCardBtn").append('<img class="imglist" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});

	$("#idCardFaceUrl").change(function () { 
	    var that = this;
	    lrz(that.files[0], {width: 500}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
	        	$("#idCardFaceBtn").append('<img class="imglist" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});

	$("#idCardReverseUrl").change(function () { 
	    var that = this;
	    lrz(that.files[0], {width: 500}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
	        	$("#idCardReverseBtn").append('<img class="imglist" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});

	$(document).on('click','.imglist', function () {
		var _this = $(this);
	    var buttons1 = [
	        {
	        	text: '请选择',
	        	label: true
	        },
	        {
		        text: '查看大图',
		        bold: true,
		        color: 'danger',
		        onClick: function(){
				  	var popupHTML = '<div class="popup">'+
				                    '<div class="content-block">'+
				                      '<div class="closeBtn"><a href="javascript:;" class="close-popup">关闭</a></div>'+
				                      '<div class="imgBox"><img src="' + _this.attr('src') + '" /></div>'+ 
				                    '</div>'+
				                  '</div>'
				  	$.popup(popupHTML);							  	
	            }
	        },
	        {
	        	text: '删除',
	        	bold: true,
	        	color: 'danger',
	        	onClick: function(){
	        		_this.remove();		        		
	        	}
	        }		        
	      ];
	    var buttons2 = [
	        {
	        	text: '取消',
	        	bg: 'danger'
	        }
	    ];
	    var groups = [buttons1, buttons2];
	    $.actions(groups);
	});
	
	$("#btn").on('click',function(){
		if (!flag) return;
		if($("#name").val() == ''){
			$.errtoast('真实姓名不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#name").val())){
			$.errtoast('真实姓名输入为空');
			return;
		}
		if($("#mobilePhone").val() == ''){
			$.errtoast('联系方式不能为空');
			return;			
		}			
		if(!REG.PHONE.test($("#mobilePhone").val())){
			$.errtoast('联系方式输入错误');
			return;
		}		
		if($("#schoolId").val() == ''){
			$.errtoast('请选择所在学校');
			return;			
		}			
		if($("#department").val() == ''){
			$.errtoast('所在系不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#department").val())){
			$.errtoast('所在系输入为空');
			return;
		}
		if($("#classes").val() == ''){
			$.errtoast('所在班级不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#classes").val())){
			$.errtoast('所在班级输入为空');
			return;
		}		
		if($("#studentCard").val() == ''){
			$.errtoast('学生证号不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#studentCard").val())){
			$.errtoast('学生证号输入为空');
			return;
		}
		if($("#studentCardBtn img").length == 0){
			$.errtoast('请上传学生证照');
			return;
		}		
		if($("#idCardCode").val() == ''){
			$.errtoast('身份证号不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#idCardCode").val())){
			$.errtoast('身份证号输入错误');
			return;
		}
		if($("#idCardFaceBtn img").length == 0){
			$.errtoast('请上传身份证正面照');
			return;
		}			
		if($("#idCardReverseBtn img").length == 0){
			$.errtoast('请上传身份证反面照');
			return;
		}	
		$.showIndicator();
		$("#btn").addClass('disabled');
		flag = false;		
		postImg();
	});

	var postNum = 0,
		studentCardUrl = '',
		idCardFaceUrl = '',
		idCardReverseUrl = '';

	function postImg(){		
		if(postNum == 0){
			var fileStr = $("#studentCardBtn img").attr('src'),
				fileName = $("#studentCardBtn img").attr('data-name');
			postImgAjax(fileStr,fileName);			
		}else if(postNum == 1){
			var fileStr = $("#idCardFaceBtn img").attr('src'),
				fileName = $("#idCardFaceBtn img").attr('data-name');
			postImgAjax(fileStr,fileName);				
		}else{
			var fileStr = $("#idCardReverseBtn img").attr('src'),
				fileName = $("#idCardReverseBtn img").attr('data-name');
			postImgAjax(fileStr,fileName);			
		}
	}
	
	function postImgAjax(fileStr,fileName){
		fileStr = fileStr.split(',');
		fileStr = fileStr[1];		
		ajax.post('base/uploadfilebackid',{'fileStr': fileStr,'fileName': fileName},'json',function(data){
			if(data.status == 0){
				$.errtoast('图片上传失败');
				$.hideIndicator();
				flag = true;
				$("#btn").removeClass('disabled');				
				return;
			}			
			if(postNum == 0){
				studentCardUrl = data.data[0].photoUrl;
				postNum++;
				postImg();
			}else if(postNum == 1){
				idCardFaceUrl = data.data[0].photoUrl;
				postNum++;
				postImg();
			}else{
				idCardReverseUrl = data.data[0].photoUrl;
				postAjax();
			}			
		});		
	}
	
	function postAjax(){
		ajax.post('base/addbaseteammember',{
			"gameId": gameId,
			"teamId": teamId,			
			"customerId": customerId,			
			"name": $("#name").val(),
			"mobilePhone": $("#mobilePhone").val(),
			"schoolId": schoolId,
			"department": $("#department").val(),
			"classes": $("#classes").val(),
			"studentCard": $("#studentCard").val(),
			"studentCardUrl": studentCardUrl,
			"idCardCode": $("#idCardCode").val(),
			"idCardFaceUrl": idCardFaceUrl,
			"idCardReverseUrl": idCardReverseUrl
		},'json',function(data){
			$.hideIndicator();
			$("#btn").removeClass('disabled');
			flag = true;
			if(data.status == 0 && data.errorCode == '600003'){
				$.errtoast('您已在团队');
				return;
			}
			if(data.status == 0 && data.errorCode == '600001'){
				$.errtoast('团队人数已满');
				return;
			}
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('报名成功');
			setTimeout(function(){
				window.jsObj.refreshLastPage();
    			window.jsObj.finshCurrentActivity();           			
			},1500);				
		});			
	}

});