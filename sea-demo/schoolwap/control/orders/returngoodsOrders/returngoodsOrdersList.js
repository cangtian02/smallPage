define(function(require, exports, module) {

	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./returngoodsOrdersList.css');
	
	base.init();
	base.setTitle('商品售后');
	
	var ordersFun = function(){
		var self = this;
		//处理tab切换
		var _tab = base.getQueryString('tab');		
		if(_tab != null){base.getActiveTab(_tab);}
		var touchTab = require('touchTab');
		touchTab(_tab);//tab拖动

		//获取数据
		var customerId = cookie.getCookie('customerId'),
			ajax_data,
			status = [1,2,3,4,5,6,7],//状态数组
			pageNow = 1,//分页页数
			pageSize = 5,//一页数量
			loading = false;//加载状态	
				
		this.getAjax = function(I,_data){
			loading = true;
			ajax.get('orderreturn/getreturnorderlist/' + customerId + '/' + pageSize + '/' + pageNow + '?[1,2,3,4,5,6,7]','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				$(".tab-link.active").addClass('y');
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
						var goodsList = orderList[i].goodsList,
							orderGoodsList = require('orderGoodsList');//订单商品dom							
						for(var k = 0; k < goodsList.length; k ++){
							goodsId = goodsList[k].id;
							lidata += orderGoodsList([{ 
								'link': SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsOrdersDetail.html?returnRefId=' + orderList[i].returnRefId,
								'photoUrl': goodsList[k].photoUrl,
								'name': goodsList[k].goodsName,
								'transactionPrice': goodsList[k].preferentialPrice,
								'sellPrice': goodsList[k].originalPrice,
								'normsValues': goodsList[k].normsValue,
								'buyNum': goodsList[k].buyNum
							}],'');				
						}																		
						botdata += 	'<div class="main clearfix">' + 
							'<div class="fr"><span class="red arial">合计: ￥</span><span class="n red">' + orderList[i].totalAmount.toFixed(2) + '</span></div>' +
							'</div>' + self.setOrderBtn(orderList[i].refStatus) + 
						'</li>';
						htmldata += topdata + lidata + botdata;
						topdata = ''; lidata = ''; botdata = '';
					}				
					$(".tab.active").find('.ment-list').append(htmldata);
					var laz = require('LazyLoad');
					laz.init();//刷新图片懒加载														
					if(orderList.length <= pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}										
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
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';
					return btn;
					break;
				case 2:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="okgoods">确认还货</a>' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';			
					return btn;
					break;
				case 3:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 4:
					btn = '<div class="btn">' + 
						'	<a href="javascript:;" class="r" id="receipt">确认收货</a>' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 	
						'</div>';					
					return btn;
					break;
				case 5:
					btn = '<div class="btn">' + 							
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;
				case 6:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;	
				case 7:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';				
					return btn;
					break;						
				default:
					btn = '<div class="btn">' + 
						'	<a href="' + SAYIMO.KFURL + '" class="l">联系客服</a>' + 							
						'</div>';
					return btn;
					break;				
			}			
		}				
		
		this.control = function(){
			$(".tab.active li").each(function(){											
				$(this).find('#cancel').on('click',function(){
					var _this = $(this);
					if(_this.hasClass('one') == false){
						var returnrefid = _this.parents('li').attr('data-returnrefid');
						self.cancel(returnrefid,_this);
						_this.addClass('one');
					}					
				});//取消退换货
				$(this).find('#okgoods').on('click',function(){
					var _this = $(this);
					if(_this.hasClass('one') == false){
						var returnrefid = _this.parents('li').attr('data-returnrefid');
						self.okgoods(returnrefid,_this);
						_this.addClass('one');
					}	
				});//确认还货
				$(this).find('#receipt').on('click',function(){
					var _this = $(this);
					if(_this.hasClass('one') == false){
						var returnrefid = _this.parents('li').attr('data-returnrefid');
						self.receipt(returnrefid,_this);
						_this.addClass('one');
					}	
				});//确认收货
			});		
		}
		
		this.cancel = function(returnrefid,_this){//取消退换货
			$.confirm('确认取消退换货？',
				function () {
					ajax.post('order/cancelordersreturn',{"orderReturnId": returnrefid,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('取消成功');
						setTimeout(function(){window.location.reload();},1500);						
					});
				},
				function () {
					_this.removeClass('one');
				}
			);			
		}

		this.receipt = function(returnrefid,_this){//确认收货
			$.confirm('确认收到该商品？',
				function () {
					ajax.post('order/confirmreturnedorder',{"orderReturnId": returnrefid,"customerId": customerId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('收货成功');
						setTimeout(function(){window.location.reload();},1500);	
					});
				},
				function () {
					_this.removeClass('one');
				}
			);				
		}

		this.okgoods = function(returnrefid,_this){//确认还货
			var emsop = '<option value="qxz">请选择物流公司</option>';
			if($(".t_box").length == 0){
				ajax.get('public/getallems',{},'json',function(data){
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
					self.templateIdcall(returnrefid,_this);//还货物流信息选择
				});
			}else{
				$(".sayimo-mask, .t_box").show();
				self.templateIdcall(returnrefid,_this);//还货物流信息选择
			}			
		}
		
		this.templateIdcall = function(returnrefid,_this){													
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
				ajax.post('order/addreturnemsinfo',{
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
				_this.removeClass('one');
			});
		}
		
		//初始化
		if(_tab != null){
			ajax_data = {'customerId': customerId,"status": status[_tab - 1],"pageSize": pageSize,"pageNow": pageNow};
			self.getAjax(_tab - 1,ajax_data);
		}else{
			ajax_data = {'customerId': customerId,"status": status[0],"pageSize": pageSize,"pageNow": pageNow};		
			self.getAjax(0,ajax_data);				
		}

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				var tab_i = $(this).index();
				window.history.replaceState({title: "",url: ""}, "商品售后", SAYIMO.SRVPATH + 'view/orders/returngoodsOrders/returngoodsOrdersList.html?tab=' + (tab_i + 1));				
				if($(this).hasClass('y')){return;}
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();									
				if(tab_i == 0){
					ajax_data = {'customerId': customerId,"status": status[0],"pageSize": pageSize,"pageNow": pageNow};
					self.getAjax(0,ajax_data);
				}else{
					ajax_data = {'customerId': customerId,"status": status[tab_i],"pageSize": pageSize,"pageNow": pageNow};
					self.getAjax(tab_i,ajax_data);	
				}							
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;
			_tab = $(".tab-link.active").index() + 1;
			if(_tab != 0){
				ajax_data = {'customerId': customerId,"status": status[_tab - 2],"pageSize": pageSize,"pageNow": pageNow};
				self.getAjax(_tab - 1,ajax_data);			
			}else{
				ajax_data = {'customerId': customerId,"pageSize": pageSize,"pageNow": pageNow};
				self.getAjax(0,ajax_data);			
			}
			$.refreshScroller();
		});
		
	}
	ordersFun();
});