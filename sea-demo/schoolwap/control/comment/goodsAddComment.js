define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./addComment.css');
	
	base.init();
	base.setTitle('商品评论');	

	var customerId = cookie.getCookie('customerId'),//获取会员id
		goodsId = base.getQueryString('goodsId'),//获取商品id
	    ordersId = base.getQueryString('ordersId'),//获取订单id
		flag = false;//是否可以评论
		
	ajax.get('order/orderdetails/' + ordersId + '/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			flag = false;
			return;
		}		
		var orderList = data.data.orderList,				
			goodsList = orderList[0].goodsList,
			htmldata = '',
			orderGoodsList = require('orderGoodsList');//订单商品dom
		for(var k = 0; k < goodsList.length; k ++){
			if(goodsList[k].id == goodsId){
				if( orderList[0].isActivity == 1){
					ahref = '&isActivity=' + orderList[0].isActivity + '&identifier=' + orderList[0].identifier;
				}else{
					ahref = '';
				}
				var sendAddress = '';
				if(goodsList[k].sendAddress != '' && goodsList[k].sendAddress != null){
					sendAddress = '&nbsp;&nbsp;发货地：' + goodsList[k].sendAddress;
				}
				normsValueId = goodsList[k].normsValueId;					
				htmldata += orderGoodsList([{
					'link': SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref,
					'photoUrl': goodsList[k].photoUrl,
					'name': goodsList[k].goodsName,
					'transactionPrice': goodsList[k].transactionPrice,
					'sellPrice': goodsList[k].sellPrice,
					'normsValues': goodsList[k].normsValues,
					'buyNum': goodsList[k].buyNum
				}],sendAddress);
			}
		}		
		$(".ment-list").html(htmldata);
		flag = true;
	});	
	
	//星级评论
	var level = 0;
	$(".grade em").each(function(){
		$(this).on('click',function(){
			$(this).addClass("star");
			$(this).prevAll('em').addClass("star");
			$(this).nextAll('em').removeClass("star");
			level = $(this).index();
		});	
	});

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
	$("#ok-btn").on('click',function(){
		if(flag == false)return;
		var self = $(this);				
		if(level == 0){
			$.errtoast('请选择星级评价');
			return;
		}
		if($("#commentContent").val() == '' || !REG.ISNULL.test($("#commentContent").val())){
			$.errtoast('请输入购物体会');
			return;
		}
		$.showIndicator();
		photoIds = '';//清空
		if($(".image-list img").length > 0){
			self.addClass('disabled');
			var img_len = $(".image-list img").length,
				num = 0;
			$(".image-list img").each(function(){
				var fileStr = $(this).attr('src');
					fileStr = fileStr.split(',');
					fileStr = fileStr[1];
				var fileName = $(this).attr('data-name');
				ajax.post('base/uploadfilebackid',{"fileStr": fileStr,"fileName": fileName,"type": "1"},'json',function(data){
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
		ajax.post('goods/addgoodscomments',{
			'goodsId': goodsId,
			"createUser": customerId,
			"commentLevel": level,
			"commentContent": $("#commentContent").val(),
			"photoIds": photoIds,
			"ordersId": ordersId,
			"type": 1
		},'json',function(data){
			$.hideIndicator();
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			$.errtoast('评论成功');
			setTimeout(function(){window.history.back();},1500);					
		});	
	}

});