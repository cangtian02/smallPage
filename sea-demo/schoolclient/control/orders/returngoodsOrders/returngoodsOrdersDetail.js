define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./returngoodsOrdersDetail.css');
	
	window.jsObj.setLoadUrlTitle('商品售后详情');
	
	var	customerId = window.jsObj.readUserData('id'),
		returnRefId = base.getQueryString('returnRefId'),//获取订单id
		status = 0,//订单状态
		goodsId = [],//商品id品数组
		emsFlag = false;//是否可查询物流

	ajax.get('orderreturn/returnordersdetail/' + returnRefId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		status = data.status;		
		var receiveInfo = '<p>' + data.receivePeople.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.receivePeople.phone + '</p><span>' + data.receivePeople.receiveAddress + '</span>';					
		$(".receiveInfo .item-title").html(receiveInfo);		
		var htmldata = '',
			topdata = '',
			lidata = '',
			botdata = '';		
		topdata += '<li>' + 
			'<div class="top">' + 
			'	<span class="fr red">' + setOrderStatus() + '</span>' + 
			'	<span class="l">订单号：' + data.returnOrdersNo + '</span>' + 
			'</div>';
		var goodsList = data.goods;
		for(var k = 0; k < goodsList.length; k++){				
			goodsId.push({
				'id': goodsList[k].goodsId,
				'name': goodsList[k].goodsName,
				'isturnback': goodsList[k].isTurnBack,
				'status': goodsList[k].status
			});
			lidata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsList[k].goodsId + '&normsValueId=' + goodsList[k].normsValueId + '" class="cont">' + 
			'	<div class="l">' + 
			'		<img src="' + goodsList[k].photoUrl + '" />' + 
			'	</div>' + 
			'	<div class="r">' + 
			'		<h1>' + goodsList[k].goodsName + '</h1>' + 
			'		<div class="r_price">' + 
			'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + goodsList[k].transactionPrice.toFixed(2) + '</span></em>' + 
			'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + goodsList[k].originalPrice.toFixed(2) + '</span></del>' + 
			'		</div>' + 
			'		<div class="num ellipsis">' + goodsList[k].normsValue + ' x' + goodsList[k].buyNum + '</div>' + 
			'	</div>' + 
			'</a>';				
		}		
		var leaveWords = '';
		if(data.leaveWords != '' && data.leaveWords != null){
			leaveWords = '<div class="orderInfo leaveWords">买家留言：' + data.leaveWords + '</div>';
		}
		var refuseExplain = '';
		if(data.refuseExplain != '' && data.refuseExplain != null){
			if(status == 7){
				refuseExplain = '<div class="orderInfo leaveWords">驳回理由：' + data.refuseExplain + '</div>';
			}else{
				refuseExplain = '<div class="orderInfo leaveWords">商家回复：' + data.refuseExplain + '</div>';
			}
		}
		var emsInfo = '';
		if(data.emsInfo != null && data.emsInfo.emsName != '' && data.emsInfo.emsNo != ''){
			emsInfo = '<div class="orderInfo leaveWords">快递信息：' + data.emsInfo.emsName + '&nbsp;&nbsp;单号：' + data.emsInfo.emsNo + '</div>';
			emsFlag = true;
		}				
		var returnGoodsNum = '<div class="orderInfo leaveWords">售后数量：' + data.returnGoodsNum + ' 件</div>';
		botdata += 	'<div class="main tr">' + 
			'合计:<span class="arial red">￥</span><span class="n red">' + data.totalMoeny.toFixed(2) + '</span>' +
			'</div>' + 
		'</li>';
		htmldata += topdata + lidata + returnGoodsNum + leaveWords + refuseExplain + emsInfo + botdata;
		topdata = ''; lidata = ''; botdata = '';					
		$(".ment-list").html(htmldata);
		statusBarBtn();
	});	
	
	function setOrderStatus(){
		switch(status){
			case 1:
				return '待审核';
				break;
			case 2:
				return '待确认';
				break;
			case 3:
				return '待退换货';
				break;
			case 4:
				return '待收货';
				break;
			case 5:
				return '已换货';
				break;
			case 6:
				return '已退货';
				break;
			case 7:
				return '已驳回';
				break;						
			default:
				return '';
				break;
		}		
	}
	
	function statusBarBtn(){
		switch (status){
			case 1:
				$(".bar").append('<a href="javascript:;" class="r" id="cancel">取消退换货</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');	
				break;
			case 2:										
				$(".bar").append('<a href="javascript:;" class="r" id="okgoods">确认还货</a>');					
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');	
				break;
			case 3:
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');
				break;	
			case 4:
				$(".bar").append('<a href="javascript:;" class="r" id="receipt">确认收货</a>');
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');	
				break;	
			case 5:
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');
				break;
			case 6:
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');
				break;
			case 7:
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');
				break;					
			default:
				$(".bar").append('<a href="javascript:;" class="l" id="tel">联系客服</a>');
				break;
		}
		control();//控制中心			
	}
	
	function control(){
		$('.ment-list li a').each(function(){
			$(this).on('click',function(){
				window.jsObj.loadContent($(this).attr('data-url'));
			});//进入详情				
		});	
		$('#tel').on('click',function(){				
			window.jsObj.loadContent(SAYIMO.KFURL);												
		});//联系客服		
		if(emsFlag){
			$(".bar").append('<a href="javascript:;" class="l" id="logistics">查看物流</a>');
			$("#logistics").on('click',function(){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/orderEmsTrack/orderEmsTrack.html?orderId=' + returnRefId);
			});
		}
		$("#cancel").on('click',function(){
			$.confirm('确认取消退换货？',
				function () {
					ajax.post('orderreturn/cancelordersreturn',{"customerId": customerId,"orderReturnId": returnRefId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('取消成功');
						setTimeout(function(){
							window.jsObj.refreshLastPage();
							window.jsObj.finshCurrentActivity();	
						},1500);
					});
				}
			);
		});//取消退换货
		$("#receipt").on('click',function(){
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('orderreturn/confirmreturnedorder',{"orderReturnId": returnRefId,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('收货成功');
						setTimeout(function(){window.jsObj.refreshLastPage();window.location.reload();},1500);						
					});
				}
			);
		});//确认收货				
		$("#okgoods").on('click',function(){
			var emsop = '<option value="qxz">请选择物流公司</option>';
			if($(".t_box").length == 0){
				ajax.get('base/getallems','json',function(data){
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}						
					var emsList = data.data.emsList;
					for(var i = 0;i < emsList.length; i++){
						emsop += '<option value="' + emsList[i].id + '">' + emsList[i].emsName + '</option>';
					}				
					emsop = emsop + '<option value="qt">其他物流公司</option>';
					var _text =	'<div class="mask"></div>' + 
						'<div class="t_box">' + 
						'	<div class="t tc red">请选择还货物流信息</div>' + 
						'	<div class="cont">' + 
						'		<div class="l c">' + 
						'			<ul class="n" id="te_list">' +
						' 				<li class="active">上门取件</li><li>送至校盟网点</li><li>物流</li>' + 
						'			</ul>' +
						'		</div>' + 
						'		<div class="r c">' + 
						'			<ul class="s" id="ti_list">' + 
						' 				<li class="active" data-type="1"><p>已通知专人上门取件请点击确认</p></li>' +
						' 				<li data-type="2"><p>已送至校盟网点请点击确认</p></li>' +
						' 				<li data-type="3">' +
						'				<select id="emsId">' + emsop + '</select>' +
						'				<input type="text" id="emsName" placeholder="其他物流公司" />' +
						'				<input type="tel" id="emsNo" placeholder="请输入物流单号" /></li>' +
						'			</ul>' +
						'			<div class="btn">确认</div>' +
						'		</div>' + 
						'	</div>' + 
						'</div>';
					$("body").append(_text);
					$(".sayimo-mask, .t_box").show();
					templateIdcall();//还货物流信息选择
				});
			}else{
				$(".sayimo-mask, .t_box").show();
				templateIdcall();//还货物流信息选择	
			}			
		});//确认还货
	}//control end
	
	function templateIdcall(){												
		$("#te_list li").each(function(){
			$(this).on('click',function(){
				$(this).addClass('active').siblings('li').removeClass('active');
				$("#ti_list li").eq($(this).index()).addClass('active').siblings('li').removeClass('active');
			});
		});
		$("#ti_list select").on('change',function(){
			if($(this).val() == 'qt'){
				$("#emsName").show();
			}else{
				$("#emsName").hide();
			}
		});			
		$(".t_box .btn").on('click',function(){
			var type = $("#ti_list li.active").attr('data-type'),emsId = '',emsNo = '',emsName = '';
			if(type == 1 || type == 2){
				emsId = '',emsNo = '',emsName = '';
			}else if(type == 3){
				var t = document.getElementById("emsId");										
				emsNo = $("#emsNo").val();
				emsId = t.options[t.selectedIndex].value;
				emsName = $("#emsName").val();
				if(document.getElementById("emsName").style.display != 'inline-block'){
					emsName = '';
				}else{
					emsId = '';
				}										
				if(document.getElementById("emsName").style.display != 'inline-block' && emsId == 'qxz'){
					$.errtoast('请选择物流公司');
					return;
				}				
				if(document.getElementById("emsName").style.display == 'inline-block' &&  emsName == ''){						
					$.errtoast('请输入物流公司');
					return;						
				}
				if(emsNo == ''){
					$.errtoast('请输入物流单号');
					return;							
				}
			}
			ajax.post('orderreturn/addreturnemsinfo',{
				"customerId": customerId,
				"returnRefId": returnRefId,
				"type": type,
				"emsId": emsId,
				"emsNo": emsNo,
				"emsName": emsName
			},'json',function(data){				
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}					
				$.errtoast('还货成功');
				setTimeout(function(){window.location.reload();},1500);
			});																				
		});
		$(".sayimo-mask").on('click',function(){
			$(".sayimo-mask, .t_box").hide();
		});
	}		
	
});