define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./returngoodsOrdersList.css');
	
	window.jsObj.setLoadUrlTitle('商品售后订单');
	
	var ordersFun = function(){
		var self = this;
		
		var _tab = base.getQueryString('tab') == null ? 0 : base.getQueryString('tab');		
		if(_tab > 0){base.getActiveTab(Number(_tab) + 1);}
		var touchTab = require('touchTab');
		touchTab(_tab);

		//获取数据
		var customerId = window.jsObj.readUserData('id'),
			ajax_data,
			status = [1,2,3,4,5,6,7],//状态数组
			pageNow = 1,
			pageSize = 5,
			loading = false;
				
		this.getAjax = function(I){
			loading = true;
			if(pageNow == 1){$(".tab.active .ment-list").html('');}	
			ajax.get('orderreturn/getreturnorderlist/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + status[I],'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				var orderList = data.returnOrderList;
				if(orderList.length == 0){					
					if(pageNow == 1){
						$(".tab.active").find('.ment-list').html(base.noMent('您还没有相关订单'));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();								
				}else{
					var htmldata = '',
						topdata = '',
						lidata = '',
						botdata = '';											
					for(var i = 0; i < orderList.length; i++){
						topdata += '<li data-returnrefid = "' + orderList[i].returnRefId + '">' + 
							'<div class="top">' + 
							'	<span class="fr">' + self.setOrderStatus(orderList[i].refStatus) + '</span>' + 
							'	<span class="l">订单号：' + orderList[i].returnOrderNo + '</span>' + 
							'</div>';
						var goodsList = orderList[i].goodsList;						
						for(var k = 0; k < goodsList.length; k ++){
							goodsId = goodsList[k].id;
							lidata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsOrdersDetail.html?returnRefId=' + orderList[i].returnRefId + '" class="cont">' + 
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
						botdata += 	'<div class="main clearfix">' + 
							'<div class="fr"><span class="red arial">合计: ￥</span><span class="n red">' + orderList[i].totalAmount.toFixed(2) + '</span></div>' +
							'</div>' + self.setOrderBtn(orderList[i].refStatus) + 
						'</li>';
						htmldata += topdata + lidata + botdata;
						topdata = ''; lidata = ''; botdata = '';
					}				
					if(orderList.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}					
					if(pageNow == 1){
						$(".tab.active").find('.ment-list').html(htmldata);
					}else{
						$(".tab.active").find('.ment-list').append(htmldata);
					}					
					var lazy = require('LazyLoad');
					lazy.init();//刷新图片懒加载
					self.control();//控制中心																			
				}
				loading = false;
			});			
		}
				
		this.setOrderStatus = function(status){
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
		
		this.setOrderBtn = function(status){
			var btn = '';
			switch (status){
				case 1:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="cancel">取消退换货</a>' + 	
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="okgoods">确认还货</a>' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 4:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">确认收货</a>' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 	
						'</div>';					
					return btn;
					break;
				case 5:
					btn = '<div class="btn">' + 							
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;	
				case 7:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;						
				default:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="l" id="tel">联系客服</a>' + 							
						'</div>';
					return btn;
					break;				
			}			
		}				
		
		this.control = function(){
			$(".tab.active li").each(function(){	
				$(this).find('a').off('click').on('click',function(){
					window.jsObj.loadContent($(this).attr('data-url'));
				});//进入详情
				$(this).find('#tel').off('click').on('click',function(){				
					window.jsObj.callPhone(SAYIMO.KFURL);										
				});//联系客服					
				$(this).find('#cancel').off('click').on('click',function(){
					self.cancel($(this).parents('li').attr('data-returnrefid'));				
				});//取消退换货
				$(this).find('#okgoods').off('click').on('click',function(){
					self.okgoods($(this).parents('li').attr('data-returnrefid'));
				});//确认还货
				$(this).find('#receipt').off('click').on('click',function(){
					self.receipt($(this).parents('li').attr('data-returnrefid'));
				});//确认收货
			});		
		}
		
		this.cancel = function(returnrefid){//取消退换货
			$.confirm('确认取消退换货？',
				function () {
					ajax.post('orderreturn/cancelordersreturn',{"customerId": customerId,"orderReturnId": returnrefid},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('取消成功');
						setTimeout(function(){window.location.reload();},1500);						
					});
				}
			);			
		}

		this.receipt = function(returnrefid){//确认收货
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('orderreturn/confirmreturnedorder',{"orderReturnId": returnrefid,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('收货成功');
						setTimeout(function(){window.location.reload();},1500);	
					});
				}
			);				
		}

		this.okgoods = function(returnrefid){//确认还货
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
					var _text =	'' + 
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
						'				<input type="text" id="emsName" placeholder="请输入物流公司名称" />' +
						'				<input type="tel" id="emsNo" placeholder="请输入物流单号" /></li>' +
						'			</ul>' +
						'			<div class="btn">确认</div>' +
						'		</div>' + 
						'	</div>' + 
						'</div>';
					$("body").append(_text);
					$(".sayimo-mask, .t_box").show();
					self.templateIdcall(returnrefid);//还货物流信息选择
				});
			}else{
				$(".sayimo-mask, .t_box").show();
				self.templateIdcall(returnrefid);//还货物流信息选择
			}			
		}
		
		this.templateIdcall = function(returnrefid){													
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
					"returnRefId": returnrefid,
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
		
		//初始化	
		self.getAjax(_tab);

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				var tab_i = $(this).index();
				window.history.replaceState({title: "",url: ""}, "商品售后订单", SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsOrdersList.html?tab=' + tab_i);				
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();
				self.getAjax(tab_i);								
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;	
			self.getAjax($(".tab-link.active").index());
			$.refreshScroller();
		});
		
	}
	ordersFun();
});