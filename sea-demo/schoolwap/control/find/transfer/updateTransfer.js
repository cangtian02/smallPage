define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./insertTransfer.css');	
	
	base.init();
	base.setTitle('修改转让商品');
	
	var customerId = cookie.getCookie('customerId'),
		transferId = base.getQueryString('id');

	var classIdData = [],
		classIds = [],
		classId,
		mask,
		flag = false,
		areaCode = '',
		expiration = '',
		photoUrl,//商品主图地址
		photoIds = [];//上传图片id数组
		
	ajax.get('base/transfergoodsdetail/' + transferId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data.transferGoodsInfo;		
		for(var i in data){
			$("#" + i).val(data[i]);			
		}
		areaCode = data.areaCode;
		expiration = data.expiration;		
		for(var p = 0; p < data.photoUrlList.length; p++){
			$(".image-list").prepend('<img id="img" data-update="no" data-id="' + data.photoUrlList[p].descPhotoId +'" src="' + data.photoUrlList[p].descPhotoUrl + '" />');			
			photoIds.push(String(data.photoUrlList[p].descPhotoId));
			if(p == 0){
				photoUrl = data.photoUrlList[p].descPhotoUrl;
			}
		}
		photoIds.reverse();// 数组反转
		ajax.get('base/transfergoodsclasslist','json',function(classdata){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			classdata = classdata.data.classList;
			for(var j = 0; j < classdata.length; j++){
				classIdData.push(classdata[j].className);
				classIds.push(classdata[j].id);
				if(data.classId == classdata[j].id){
					$("#classId").val(classdata[j].className);
					classId = classdata[j].id;
				}
			}
			flag = true;
			$("#btn").removeClass('disabled');
			fun_picker();
		});		
	});
	
	function fun_picker(){
		var cityPicker = require('cityPicker');
		cityPicker($('#areaCode'),$('#baseAreaCode'),areaCode,function(){});
		
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
		    value: [expiration],
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
		        		$(".image-list").prepend('<img id="img" data-update="yes" data-name="' + rst.origin.name +'" src="' + rst.base64 + '" />');		        		
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
						var photoUrls = [];
						$("#image-list img").each(function(){
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
		        		if(_this.attr('data-id') != undefined){
		        			var item = $.inArray(_this.attr('data-id'),photoIds),
		        				itemS;
		        			item > 0 ? itemS = item : itemS = item + 1;	
		        			photoIds.splice(item,itemS);
		        		}
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
		if($("#image-list img").length == 0){
			$.errtoast('上传图片更利于卖出');
			return;			
		}
		var isUploadImgArr = '';
		$("#image-list img").each(function(){
			if($(this).attr('data-update') == 'yes'){
				isUploadImgArr += '0,';
			}else{
				isUploadImgArr += '1,';
			}
		});
		$.showIndicator();
		$("#btn").addClass('disabled');
		flag = false;		
		if(isUploadImgArr.indexOf('0') < 0){
			postAjax();
		}else{
			postPhoto();
		}
	}
		
	function postPhoto(){		
		var img_len = $(".image-list img").length,
			num = 0;
		$(".image-list img").each(function(){
			if($(this).attr('data-update') == 'yes'){
				var fileStr = $(this).attr('src'),
					fileStr = fileStr.split(','),
					fileStr = fileStr[1];
				var fileName = $(this).attr('data-name');
				ajax.post('base/uploadfilebackid',{"fileStr": fileStr,"fileName": fileName,"type": '2'},'json',function(data){
					if(data.status == 0){
						$.errtoast('图片上传失败');
						$.hideIndicator();
						$("#btn").removeClass('disabled');
						flag = true;
						return;
					}
					if($(".image-list img").eq(img_len).attr('data-update') == 'yes'){
						if(num == 0){photoUrl = data.data[0].photoUrl;}
					}
					photoIds.push(data.data[0].id);
					num++;
					if(img_len == num){postAjax();}				
				});
			}else{
				num++;
				if(img_len == num){postAjax();}
			}
		});		
	}
	
	function postAjax(){		
		var expiration = $("#expiration").val(),
			expiration = expiration.replace(/-/g,'/'),
			expiration = new Date(expiration),
			expiration = expiration.getTime(),
			postphotoIds = '';	
		for(var i in photoIds){
			postphotoIds += photoIds[i] + ',';
		}
		postphotoIds = postphotoIds.substr(0,postphotoIds.length - 1);
		ajax.post('base/updatetransfergoods',{
			'id': transferId,
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
			"photoIds": postphotoIds
		},'json',function(data){
			$.hideIndicator();
			$("#btn").removeClass('disabled');
			flag = true;
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('修改成功');
			setTimeout(function(){window.history.back();},1500);					
		});		
	}
	
});