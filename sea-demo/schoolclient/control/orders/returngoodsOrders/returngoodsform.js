define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./returngoodsform.css');
	
	window.jsObj.setLoadUrlTitle('申请退换货');
	
	var customerId = window.jsObj.readUserData('id'),
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
	
	ajax.get('order/orderpaydetails/' + ordersId + '/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var orderList = data.orderList,goodsList = orderList[0].goodsList,htmldata = '';
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
				htmldata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsList[k].id + '&normsValueId=' + goodsList[k].normsValueId + ahref + '" class="cont">' + 
				'	<div class="l">' + 
				'		<img src="' + goodsList[k].photoUrl + '" />' + 
				'	</div>' + 
				'	<div class="r">' + 
				'		<h1>' + goodsList[k].goodsName + '</h1>' + 
				'		<div class="r_price">' + 
				'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + goodsList[k].transactionPrice.toFixed(2) + '</span></em>' + 
				'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + goodsList[k].sellPrice.toFixed(2) + '</span></del>' + 
				'		</div>' + 
				'		<div class="num ellipsis">' + goodsList[k].normsValues + ' x' + goodsList[k].buyNum + sendAddress + '</div>' + 
				'	</div>' + 
				'</a>';				
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
		$('.ment-list a').each(function(){
			$(this).on('click',function(){
				window.jsObj.loadContent($(this).attr('data-url'));
			});//进入详情				
		});			
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
		        width: 640
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
            	window.jsObj.refreshLastPage();
            	window.jsObj.finshCurrentActivity();            	
            },1500);
		});			
	}
	
});