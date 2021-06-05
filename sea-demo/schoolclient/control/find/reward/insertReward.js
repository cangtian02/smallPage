define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./insertReward.css');	

	window.jsObj.setLoadUrlTitle('需求投标');
	
	var	customerId = window.jsObj.readUserData('id'),
		rewardId = base.getQueryString('id'),
		isSubmit = base.getQueryString('isSubmit');
	
	var photoUrls = [],
		flag = false;
	
	require('uploadImg');
	$("#file").change(function () { //点击上传图片
	    var that = this;
	    lrz(that.files[0], {
	        width: 640
	    })
	    .then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
				if($(".image-list img").length > 4){
					$.errtoast('最多上传5张图片');
				}else{        	
	        		$(".image-list").prepend('<img id="img" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
	        		photoUrls.push({'url': rst.base64});
	        		photoUrls.reverse();//将数组倒叙，删除图片时能删除数组相对应的值
	        	}
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});	
	$(document).on('click','#img', function () { //删除图片
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
			        var slideFixed = require('slideFixed');
			        slideFixed(photoUrls);	          	
	            }
	        },
	        {
	        	text: '删除',
	        	bold: true,
	        	color: 'danger',
	        	onClick: function(){		        		
	        		photoUrls.splice(_this.index(),_this.index());
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
	
	var photoIds = '';//上传图片id组合
	
	$("#btn").on('click',function(){
		if(flag) return;
		var resume = $("#resume").val(),
			linkMan = $("#linkMan").val(),
			linkInfo = $("#linkInfo").val();
		if(linkMan == ''){
			$.errtoast('联系人不能为空');
			return;			
		}			
		if(!REG.ISNULL.test(linkMan)){
			$.errtoast('联系人输入为空');
			return;
		}
		if(linkInfo == ''){
			$.errtoast('联系方式不能为空');
			return;			
		}			
		if(!REG.PHONE.test(linkInfo)){
			$.errtoast('联系方式输入错误');
			return;
		}		
		if(resume == ''){
			$.errtoast('设计简述不能为空');
			return;			
		}			
		if(!REG.ISNULL.test(resume)){
			$.errtoast('设计简述输入为空');
			return;
		}
		if(photoUrls.length == 0){
			$.errtoast('请上传图片');
			return;
		}		
		$.showIndicator();
		photoIds = '';//清空
		$("#btn").addClass('disabled');
		flag = true;
		postPhoto();
	});

	function postPhoto(){
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
					$("#btn").removeClass('disabled');
					flag = true;
					return;
				}
				if(num == 0){photoUrl = data.data[0].photoUrl;}
				photoIds += data.data[0].id + ',';
				num++;
				if(img_len == num){				
					photoIds = photoIds.substr(0,photoIds.length - 1);
					postAjax();
				}				
			});			
		});		
	}
	
	function postAjax(){
		if(isSubmit == 0){
			ajax.post('base/insertrewardsubmit',{
				'customerId': customerId,
				"rewardId": rewardId,
				"photoIds": photoIds,
				"resume": $("#resume").val(),
				"linkMan": $("#linkMan").val(),
				"linkInfo": $("#linkInfo").val()
			},'json',function(data){
				$.hideIndicator();
				$("#btn").removeClass('disabled');
				flag = false;
				if(data.status == 0 && data.errorCode == '200007'){
					$.errtoast('不可重复投标');
					return;
				}			
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$.errtoast('投标成功');
    			setTimeout(function(){
    				window.jsObj.refreshLastPage();
        			window.jsObj.finshCurrentActivity();           			
    			},1500);					
			});
		}else{
			ajax.post('base/updaterewardsubmit',{
				"id": isSubmit,
				"photoIds": photoIds,
				"resume": $("#resume").val(),
				"linkMan": $("#linkMan").val(),
				"linkInfo": $("#linkInfo").val()				
			},'json',function(data){
				$.hideIndicator();
				$("#btn").removeClass('disabled');
				flag = false;
				if(data.status == 0 && data.errorCode == '200007'){
					$.errtoast('不可重复投标');
					return;
				}			
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$.errtoast('投标更新成功');
    			setTimeout(function(){
    				window.jsObj.refreshLastPage();
        			window.jsObj.finshCurrentActivity();           			
    			},1500);					
			});			
		}
	}
	
});