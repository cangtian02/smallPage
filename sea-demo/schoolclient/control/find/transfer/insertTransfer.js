define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./insertTransfer.css');	
	
	window.jsObj.setLoadUrlTitle('发布转让商品');
	
	var customerId = window.jsObj.readUserData('id');
	
	var mask;
	
	var classIdData = [],
		classIds = [],
		classId,
		photoUrls = [];
	
	var flag = false;
	
	ajax.get('base/transfergoodsclasslist','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data.classList;
		for(var i = 0; i < data.length; i++){
			classIdData.push(data[i].className);
			classIds.push(data[i].id);
		}
		flag = true;
		$("#btn").removeClass('disabled');
		fun_picker();
	});	
		
	function fun_picker(){
		var cityPicker = require('cityPicker');
		cityPicker($('#areaCode'),$('#baseAreaCode'),'',function(){});
		
		mask = $(".sayimo-mask");
		
		$("#classId").picker({
			toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button><h1 class="title">请选择商品分类</h1></header>',
			cols: [
			    {
			      textAlign: 'center',
			      values: classIdData
			    }
			],
			onOpen: function(){
				mask.show();
			},
			onClose: function(){				
				var i = $(".picker-selected").index();
				classId = classIds[i];
				mask.hide();
			}
		});
		$("#depreciation").picker({
			toolbarTemplate: '<header class="bar bar-nav"><button class="button button-link pull-right close-picker">确定</button><h1 class="title">请选择商品新旧程度</h1></header>',
			cols: [
			    {
			      textAlign: 'center',
			      values: ['全新','九成新','八成新','七成新','六成新','五成新','五成新以下']
			    }
			],
			onOpen: function(){
				mask.show();
			},
			onClose: function(){				
				mask.hide();
			}
		});	
		
		require('dateFormat');
		var d = new Date();
		d.setTime(d);
		d = d.format('yyyy-MM-dd');//当前日期		
		$("#expiration").calendar({
		    value: [d],
		    minDate: [d],
			onOpen: function(){
				mask.show();
			},
			onClose: function(){				
				mask.hide();
			}		    
		});
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
	}	
	
	$("#btn").on('click',function(){
		if(!flag) return;
		postTry();		
	});
	
	function postTry(){		
		if($("#goodsName").val() == ''){
			$.errtoast('商品名称不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#goodsName").val())){
			$.errtoast('商品名称输入为空');
			return;
		}
		if($("#classId").val() == ''){
			$.errtoast('商品分类不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#classId").val())){
			$.errtoast('商品分类输入为空');
			return;
		}
		if($("#depreciation").val() == ''){
			$.errtoast('新旧程度不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#depreciation").val())){
			$.errtoast('新旧程度输入为空');
			return;
		}
		if($("#linkMan").val() == ''){
			$.errtoast('联系人不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#linkMan").val())){
			$.errtoast('联系人输入为空');
			return;
		}
		if($("#linkInfo").val() == ''){
			$.errtoast('联系方式不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#linkInfo").val())){
			$.errtoast('联系方式输入为空');
			return;
		}
		if(!REG.PHONE.test($("#linkInfo").val())){
			$.errtoast('联系方式输入错误');
			return;
		}
		if($("#price").val() == ''){
			$.errtoast('转让金额不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#price").val())){
			$.errtoast('转让金额输入为空');
			return;
		}
		if(!(/^(([0-9]\d{0,9}))(\.\d{1,2})?$/.test($("#price").val()))){
			$.errtoast('转让金额输入错误');
			return;
		}		
		if($("#areaCode").val() == ''){
			$.errtoast('转让区域不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#areaCode").val())){
			$.errtoast('转让区域输入为空');
			return;
		}
		if($("#expiration").val() == ''){
			$.errtoast('有效时间不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#expiration").val())){
			$.errtoast('有效时间输入为空');
			return;
		}
		if($("#description").val() == ''){
			$.errtoast('详情说明不能为空');
			return;			
		}			
		if(!REG.ISNULL.test($("#description").val())){
			$.errtoast('详情说明输入为空');
			return;
		}
		if(photoUrls.length == 0){
			$.errtoast('上传图片更利于卖出');
			return;			
		}
		postPhoto();
	}
	
	var photoUrl,//商品主图地址
		photoIds = '';//上传图片id组合
	
	function postPhoto(){
		$.showIndicator();
		photoIds = '';//清空
		$("#btn").addClass('disabled');
		flag = false;
		var img_len = $(".image-list img").length,
			num = 0;
		$(".image-list img").each(function(){
			var fileStr = $(this).attr('src'),
				fileStr = fileStr.split(','),
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
		var expiration = $("#expiration").val(),
			expiration = expiration.replace(/-/g,'/'),
			expiration = new Date(expiration),
			expiration = expiration.getTime();		
		ajax.post('base/inserttransfergoods',{
			'customerId': customerId,
			"classId": classId,
			"goodsName": $("#goodsName").val(),
			"depreciation": $("#depreciation").val(),
			"linkMan": $("#linkMan").val(),
			"linkInfo": $("#linkInfo").val(),
			"price": $("#price").val(),
			"areaCode": $("#baseAreaCode").val(),
			"expirationStr": expiration,
			"description": $("#description").val(),
			"status": $("#status").val(),
			"photoUrl": photoUrl,
			"photoIds": photoIds
		},'json',function(data){
			$.hideIndicator();
			$("#btn").removeClass('disabled');
			flag = true;
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('发布成功');
			setTimeout(function(){
				window.jsObj.refreshLastPage();
    			window.jsObj.finshCurrentActivity();           			
			},1500);								
		});		
	}
	
});