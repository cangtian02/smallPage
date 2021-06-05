define(function(require, exports, module) {	
	$.init();	
	var base = require('base'),
		ajax = require('ajax');
	require('./suggest.css');

	window.jsObj.setLoadUrlTitle('意见反馈');
	
	var customerId = window.jsObj.readUserData('id');
	
	require('uploadImg');
	$("#file").change(function () { //点击上传图片
	    var that = this;
	    lrz(that.files[0], {
	        width: 200
	    })
	    .then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
				if($(".image-list img").length > 2){
					$.errtoast('最多上传3张图片');
				}else{        	
	        		$(".image-list").prepend('<img id="img" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');
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
	          text: '删除',
	          bold: true,
	          color: 'danger',
	          onClick: function(){_this.remove();}
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
		if($("#suggestContent").val() == '' || $("#suggestContent").val().match(/^\s+$/g)){
			$.errtoast('请输入反馈内容');
			return;
		}
		if($("#linkInfo").val() == ''){
			$.errtoast('请输入联系方式');
			return;			
		}
		if(!REG.PHONE.test($("#linkInfo").val())){
			$.errtoast('联系方式输入错误');
			return;			
		}		
		$.showIndicator();
		photoIds = '';//清空
		if($(".image-list img").length > 0){
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
						return;
					}
					photoIds += data.data[0].id + ',';
					num++;
					if(img_len == num){				
						photoIds = photoIds.substr(0,photoIds.length-1);
						postAdd();
					}				
				});
				
			});					
		}else{
			postAdd();
		}		
	});
	
	function postAdd(){	
		ajax.post('base/insertfaceback',{
			'customerId': customerId,
			"content": $("#suggestContent").val(),
			"contentType": $("#contentType").val(),
			"photoIds": photoIds,
			"linkInfo": $("#linkInfo").val()
		},'json',function(data){
			$.hideIndicator();
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('非常感谢您的反馈');
			setTimeout(function(){window.jsObj.finshCurrentActivity();},1500);					
		});	
	}
	
});