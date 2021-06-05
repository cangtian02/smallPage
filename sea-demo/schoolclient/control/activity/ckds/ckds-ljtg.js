define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');	
	require('./ckds-ljtg.css');
	
	window.jsObj.setLoadUrlTitle('立即投稿');
	
	var customerId = window.jsObj.readUserData('id'),
		submissionId = base.getQueryString('id'),
		identifier = base.getQueryString('identifier');
	
	var flag = false;
	
	var schoolList = [], schoolIds = [], schoolId;
	
	var photoIds = '', _photoIds = '';
	
	if(identifier == 'WJZJYJH'){
		$(".subject").show();
		$(".subject_2").remove();
		$(".description").show();
	}else if(identifier == 'SYDS'){
		$(".subject").remove();
		$(".subject_2, .photoIds, .image-list").show();
	}
	
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
		flag = true;
		$("#btn").removeClass('disabled');		
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
	});	

	require('uploadImg');
	$("#file").change(function () { //点击上传图片
	    var that = this;
	    lrz(that.files[0], {}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
				if($(".image-list img").length > 3){
					$.errtoast('最多上传4张图片');
				}else{        	
	        		$(".image-list").prepend('<img class="idCard_img" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
	        	}
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});

	$(document).on('click','.idCard_img', function () {
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
					var photoUrls = [];				
					$(".image-list img").each(function(){
						photoUrls.push({'url': $(this).attr('src')});
					});					
				    var slideFixed = require('slideFixed');
				    slideFixed(photoUrls);						
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
		if(!flag) return;

		if($("#subName").val() == ''){
			$.errtoast('姓名不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#subName").val())){
			$.errtoast('姓名输入为空');
			return;
		}
		if($("#telPhone").val() == ''){
			$.errtoast('联系方式不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#telPhone").val())){
			$.errtoast('联系方式输入为空');
			return;
		}
		if(!REG.PHONE.test($("#telPhone").val())){
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
		if($("#class").val() == ''){
			$.errtoast('所在班级不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#class").val())){
			$.errtoast('所在班级输入为空');
			return;
		}		
		if(identifier == 'WJZJYJH'){
			if($("#subject").val() == ''){
				$.errtoast('投稿口号不能为空');
				return;			
			}			
			if(!REG.ISNULL.test($("#subject").val())){
				$.errtoast('投稿口号输入为空');
				return;
			}
			if($("#subject").val().length < 5){
				$.errtoast('投稿口号最少输入5个字');
				return;
			}
			if($("#description").val() == ''){
				$.errtoast('投稿思路不能为空');
				return;			
			}			
			if(!REG.ISNULL.test($("#description").val())){
				$.errtoast('投稿思路输入为空');
				return;
			}			
			$.showIndicator();
			$("#btn").addClass('disabled');
			flag = false;
			postAjax();
		}else if(identifier == 'SYDS'){
			if($("#subject").val() == ''){
				$.errtoast('照片简述不能为空');
				return;			
			}			
			if(!REG.ISNULL.test($("#subject").val())){
				$.errtoast('照片简述输入为空');
				return;
			}
			if($("#subject").val().length < 5){
				$.errtoast('照片简述最少输入5个字');
				return;
			}		
			if($(".image-list img").length == 0){
				$.errtoast('请至少上传一张照片');
				return;
			}
			$("#description").val($("#subject").val());
			$.showIndicator();
			$("#btn").addClass('disabled');
			flag = false;
			postImg();
		}		
	});
	
	function postImg(){
		photoIds = '';
		var img_len = $(".image-list img").length,
			num = 0;
		$(".image-list img").each(function(){
			var fileStr = $(this).attr('src');
				fileStr = fileStr.split(',');
				fileStr = fileStr[1];
			var fileName = $(this).attr('data-name');
			ajax.post('base/uploadfilebackid',{"fileStr": fileStr,"fileName": fileName},'json',function(data){
				if(data.status == 0){
					$.errtoast('图片上传失败');
					$.hideIndicator();
					flag = true;
					$("#btn").removeClass('disabled');
					return;
				}
				photoIds += data.data[0].id + ',';
				num++;
				if(img_len == num){				
					photoIds = photoIds.substr(0,photoIds.length-1);
					postAjax();
				}				
			});			
		});			
	}
	
	function postAjax(){
		ajax.post('base/addsubmission',{
			"customerId": customerId,
			"subName": $("#subName").val(),
			"telPhone": $("#telPhone").val(),
			"schoolId": schoolId,
			"department": $("#department").val(),
			"classGrade": $("#class").val(),
			"subject": $("#subject").val(),
			"description": $("#description").val(),
			"submissionId": submissionId,
			"photoIds": photoIds
		},'json',function(data){
			$.hideIndicator();
			$("#btn").removeClass('disabled');
			flag = true;
			if(data.status == 0 && data.errorCode == '900002'){
				$.errtoast('您已投过稿了');
				return;
			}			
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('投稿成功');
			setTimeout(function(){
				window.jsObj.refreshLastPage();
    			window.jsObj.finshCurrentActivity();           			
			},1500);
		});			
	}
	
});