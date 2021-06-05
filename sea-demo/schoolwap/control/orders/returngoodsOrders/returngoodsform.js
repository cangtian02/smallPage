define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./returngoodsform.css');
	
	base.init();
	base.setTitle('申请退换货');

	var customerId = cookie.getCookie('customerId'),//获取会员id
		ordersId = base.getQueryString('ordersId'),//获取订单id
		goodsId = base.getQueryString('goodsId'),//获取商品id
		normsValueId = '',//规格id
		transactionPrice = '',//成交价		
		Number = 1,//购买数量
		canReturnGoodsNum = 0,//可申请退换货数量
		type = null,//退换货方式
		status = null,//订单状态
		photoIds = '',//图片
		applyExplain = '',//申请说明
		orderId = null;//申请订单id	
	
	ajax.get('order/orderdetails/' + orderIds + '/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var orderList = data.orderList,goodsList = orderList[0].goodsList,htmldata = '',orderGoodsList = require('orderGoodsList');//订单商品dom;
		status = orderList[0].status;
		orderId = orderList[0].ordersId;
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
				normsValueId = goodsList[k].normsValueId;
				transactionPrice = goodsList[k].transactionPrice.toFixed(2);
				Number = goodsList[k].buyNum;
				canReturnGoodsNum = goodsList[k].canReturnGoodsNum;
			}
		}		
		$(".ment-list").html(htmldata);
		control();
	});	
	
	function control(){
		require('numbox');
		$(".numbox").numbox({
			min : 1,
			max : canReturnGoodsNum,
			callNum : function(){}
		});
		$(".t-list li").each(function(){
			$(this).on('click',function(){
				$(this).addClass('active').siblings('li').removeClass('active');
				type = $(this).attr('data-type');
			});
		});
		imgcall();
		$("#ok-btn").on('click',function(){			
			okbtn();
		});		
	}
	
	function imgcall(){
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
	}
	
	function okbtn(){
		if(orderId == null){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}		
		if(type == null){
			$.errtoast('请选择退换货方式');
			return;
		}		
		if( !REG.ISNULL.test($("#commentContent").val()) ){
			$.errtoast('请输入申请说明');
			return;
		}	
		applyExplain = $("#commentContent").val();
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
	}
	
	function postAdd(){
		ajax.post('orderreturn/applyforreturngoods',{
			"ordersId": orderId,
			"goodsId": goodsId,
			"normsValueId": normsValueId,
			"type": type,
			"photoIds": photoIds,
			"applyExplain": applyExplain,
			"customerId": customerId,
			"returnNum": $("#number").val(),
			"transactionPrice": transactionPrice		
		},'json',function(data){
			$.hideIndicator();
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');				
				return;
			}			
			$.errtoast('申请成功');
			setTimeout(function(){
				window.location.href = SAYIMO.SRVPATH + 'view/orders/goodsOrders/goodsOrdersList.html?tab=4';
			},1500);
		});			
	}
	
});