define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		lazy = require('LazyLoad');
	require('./shoppingcart.css');	
	
	var customerId = window.jsObj.readUserData('id');
		
	function getAjax(){
		loading = true;
		ajax.get('goods/getshoppingcartlist/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data.shoppingCartList;
			if(data.length == 0){
				$("#noCart").removeClass('din');
				$("#accountBar").addClass('din');
				return;
			}
			var htmldata = '',
				boxdata = '',
				listdata = '';
			for(var i = 0; i < data.length; i++){				
				var goodsList = data[i].goodsList;
				for(var j = 0; j < goodsList.length; j++){					
					var total = goodsList[j].buyNum * goodsList[j].salePrice;					
					listdata += '<li data-id = "' + goodsList[j].shoppingCardId + '" data-salePrice = "' + goodsList[j].salePrice + '" data-number = "' + goodsList[j].buyNum + '" data-total = "' + total + '" data-stock = "' + goodsList[j].goodsStockCount + '">' + 
						'<div class="list-item">' + 
						'	<div class="l">' + 
						'		<div class="check fl" id="l-check"><i></i></div>' + 
						'		<a class="fl" href="javascript:;" data-name="' + goodsList[j].goodsName + '" data-url="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsList[j].id + '&normsValueId=' + goodsList[j].normsValueId + '"><img class="lazy" data-lazyload="' + goodsList[j].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></a>' + 
						'	</div>' + 
						'	<div class="r">' + 
						'		<a href="javascript:;" data-name="' + goodsList[j].goodsName + '" data-url="' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsList[j].id + '&normsValueId=' + goodsList[j].normsValueId + '">' + 
						'			<h3 class="r_title">' + goodsList[j].goodsName + '</h3>' + 
						'			<div class="r_price">' + 
						'				<em class="red r_price_o">' + 
						'					<span class="i arial">￥</span>' + 
						'					<span class="n">' + goodsList[j].salePrice.toFixed(2) + '</span>' + 
						'				</em>' + 
						'				<del class="r_price_p">' + 
						'					<span class="i arial">￥</span>' + 
						'					<span class="n">' + goodsList[j].originalPrice.toFixed(2) + '</span>' + 												
						'				</del>' + 
						'			</div>' + 
						'			<div class="r_main">' + 
						'				<p>' + goodsList[j].normsValues + ' x<span class="l-number">' + goodsList[j].buyNum + '</span></p>' + 
						'			</div>' + 
						'		</a>' + 
						'	</div><div class="l-delete fr tc" id="ll-delete">删除</div>' + 
						'</div>' + 
						'<div class="control">' + 
						'	<div class="delete fr tc" id="l-delete">删除</div>' + 
						'	<div class="numbox" data-numbox-min="" data-numbox-max="">' + 						
						'		<button class="btn numbox-btn-min" type="button">-</button>' + 
						'		<input id="number" class="numbox-input tc" type="text" name="buyNum" value="' + goodsList[j].buyNum + '" readonly />' + 
						'		<button class="btn numbox-btn-plus" type="button">+</button>' + 
						'	</div>' + 
						'	<div class="main"><p>库存：' + goodsList[j].goodsStockCount + '</p><p>已选数量：<span class="l-number">' + goodsList[j].buyNum + '</span></p><p class="ellipsis">规格：' + goodsList[j].normsValues + '</p></div>' + 								
						'</div>' + 
					'</li>';					
				}
				listdata = '<ul class="cart-list">' + listdata + '</ul>';
				boxdata = '<div class="box-title">' + 
					'<div class="compile fr" id="c-compile">编辑</div>' + 
					'<div class="check fl" id="c-check"><i></i></div>' + 
					'<div class="providerName ellipsis">' + data[i].providerName + '</div>' + 
				'</div>';				
				htmldata += '<div class="cart-box">' + boxdata + listdata + '</div>';
				listdata = '';
				boxdata = '';
			}						
			$('.shoppingcartBox').html('<div class="cartList">' + htmldata + '</div>');
			$("#noCart").addClass('din');
			$("#accountBar").removeClass('din');							
			lazy.init();//刷新图片懒加载
			control();//控制层
		});
	}
	
	var control = function(){
		var self = this;
		var hammer = require('hammer');
		var iscompile = false;
		$(".cart-box").each(function(){
			$(this).find("#c-check").on('click',function(){
				var _this = $(this);
				self.fun_c_check(_this);//商户选择事件				
			});
			$(this).find("#l-check").on('click',function(){
				var _this = $(this);
				self.fun_l_check(_this);//商品选择事件
			});
			$(this).find("#c-compile").on('click',function(){
				var _this = $(this);
				self.fun_compile(_this);//商品编辑事件
			});
			$(this).find("#l-delete").on('click',function(){
				var _this = $(this);
				self.fun_l_delete(_this);//商品删除事件
			});
			$(this).find("#ll-delete").on('click',function(){
				var _this = $(this);
				self.fun_l_delete(_this);//商品删除事件
			});			
			$(this).find('li').each(function(){
				var hammertime = new Hammer($(this)[0],{domEvents: true}); // 实例化Hammer
				hammertime.get('pan').set({});

				var marginX,
					item = $(this).find('.list-item'),
					delWidth = $(this).find('#ll-delete').width();
				$(this).on("panstart", function(e){
					if(iscompile) return;
				    marginX = parseInt(item.css("left"),10);
				});	

				$(this).on("panmove", function(e){
					if(iscompile) return;
					var deltaX = marginX + e.gesture.deltaX;
					if(deltaX <= 0){ item.css({"left": deltaX});}			   
				});	

				$(this).on("panend", function(e){
					if(iscompile) return;
				    var imgLeft = -(parseInt(item.css("left"),10));				    				    
				    if(imgLeft > delWidth){
				    	item.css({"left": -delWidth});
				    	item.addClass('active');
				    	setTimeout(function(){item.removeClass('active');},150);
				    }else if(imgLeft < delWidth){
				    	item.css({"left": '0'});
				    }				    
				});			
			});			
		});
		
		$('#a-check').on('click',function(){
			var _this = $(this);
			self.fun_a_check(_this);//全选事件
		});

		$("#buy-go").off('click').on('click',function(){			
			self.fun_gobuy();//结算事件
		});	
		
		this.fun_c_check = function(_this){//商户选择事件
			var li = _this.parents(".cart-box").find('li');	
			if(_this.hasClass('check-cur') == false){
				_this.addClass('check-cur');				
				li.each(function(){
					if($(this).hasClass('control-true') == false){
						$(this).addClass('control-true');
						$(this).find('#l-check').addClass('check-cur');
					}
				});
			}else{
				_this.removeClass('check-cur');
				li.removeClass('control-true');
				li.find('#l-check').removeClass('check-cur');				
			}
			self.fun_flag();//判断是否全选
			self.fun_account();//清算数据
		}
		
		this.fun_l_check = function(_this){//商品选择事件
			_this.toggleClass('check-cur');			
			_this.parents("li").toggleClass('control-true');
			if(_this.parents(".cart-list").find("li.control-true").length ==  _this.parents(".cart-list").find("li").length){
				_this.parents(".cart-box").find("#c-check").addClass('check-cur');
			}else{
				_this.parents(".cart-box").find("#c-check").removeClass('check-cur');
			}
			self.fun_flag();//判断是否全选
			self.fun_account();//清算数据
		}
		
		this.fun_a_check = function(_this){//全选事件		
			if(_this.hasClass('check-cur') == false){
				$(".cart-box").each(function(){
					$(this).find("#c-check,#l-check").addClass('check-cur');
					$(this).find("li").addClass('control-true');
				});
				_this.addClass('check-cur');
			}else{
				$(".cart-box").each(function(){
					$(this).find("#c-check,#l-check").removeClass('check-cur');
					$(this).find("li").removeClass('control-true');
				});
				_this.removeClass('check-cur');
			}
			self.fun_account();//清算数据
		}
		
		this.fun_flag = function(){//判断是否全选
			if($(".cartList").find("li.control-true").length ==  $(".cartList").find("li").length){
				$("#a-check").addClass('check-cur');
			}else{
				$("#a-check").removeClass('check-cur');
			}				
		}
		
		this.fun_compile = function(_this){//编辑事件
			_this.parents(".cart-box").find("li .list-item").css('left','0');	
			if(!_this.hasClass('cur')){
				iscompile = true;
				_this.text('完成');
				_this.parents(".cart-box").find("li .control").css("display","block");
				_this.addClass('cur');
			}else{
				iscompile = false;
				_this.text('编辑');
				_this.parents(".cart-box").find("li .control").css("display","none");
				_this.removeClass('cur');
				if($(".cartList").find("li.control-true").length > 0){
					self.fun_account();
				}
			}
			self.fun_numbox();//商品选数量
		}
		
		this.fun_numbox = function(){//商品选数量
			require('numbox');
			$(".cartList li").each(function(){
				var _this = $(this),
					_min = _this.attr('data-number'),
					_max = _this.attr('data-stock'),
					_salePrice = _this.attr('data-salePrice');
				_this.find(".numbox").numbox({
					min : _min,
					max : _max,
					callNum : function(){
						var inputBoxVal = _this.find(".numbox .numbox-input").val();
						_this.find(".l-number").text(inputBoxVal);
						_this.attr('data-number', inputBoxVal);
						_this.attr('data-total', inputBoxVal * _salePrice);
					}
				});					
			});			
		}
		
		this.fun_l_delete = function(_this){//商品删除事件
			var _box = _this.parents(".cart-box");
				cartId = _this.parents("li").attr('data-id');
			$.confirm('确定删除？',
				function () {
					ajax.post('goods/deleteshoppingcarts',{"shoppingCartIds": cartId},'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}						
						_this.parents("li").remove();
						if(_box.find("li").length == 0){
							_box.remove();
						}else if(_box.find("li.control-true").length == _box.find("li").length && _box.find("#c-check").hasClass('check-cur') == false){
							_box.find("#c-check").addClass('check-cur');							
						}						
						if($(".cartList li").length == 0){
							$(".cartList, .account-bar").remove();
							$("#noCart").removeClass('din');
							$("#accountBar").addClass('din');
						}else{
							self.fun_flag();//判断是否全选
							self.fun_account();//清算数据
						}						
					});
				}
			);			
		}
		
		this.fun_account = function(){//清算数据
			var li = $(".cartList li.control-true"),
				a_total = 0;
			li.each(function(){
				a_total += ($(this).attr('data-total')) * 1;				
			});
			$("#a-total").text(a_total.toFixed(2));
			$("#a-number").text(li.length);			
		}
		
		this.fun_gobuy = function(){//结算事件
			if($(".cartList li.control-true").length == 0){
				$.errtoast("您还未选择商品哦");				
				return;
			}
			$.showIndicator();
			ajax.get('user/getreceiveaddress/' + customerId,'json',function(data){				
				if(data.status == 0){
					$.hideIndicator();
					$.errtoast('未获取到您的收货地址');
					return;
				}				
				if(data.data.addresses.length == 0){
					$.hideIndicator();
					$.confirm('<span style="font-size:.7rem;">您还没有收获地址,是否去添加？</span>',
						function (){
							window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/addReceivingAddress.html?ralength=0');
						}
					);
					return;
				}
				var areaCode = '', isdefault = -1;
				for(var i = 0; i < data.data.addresses.length; i++){
					if(data.data.addresses[i].isDefault == 1){
						isdefault = 1;
						areaCode = data.data.addresses[i].areaCode;
					}
				}
				if(isdefault == -1){
					$.hideIndicator();
					$.confirm('<span style="font-size:.7rem;">您还没有设置默认收获地址,是否去设置？</span>',
						function (){
							window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html');
						}
					);
					return;					
				}
				var shoppingCartIds = [],
					buyNums = [];
				$(".cartList li.control-true").each(function(){
					shoppingCartIds += $(this).attr('data-id') + ',';
					buyNums += $(this).attr('data-number') + ',';					
				});
				shoppingCartIds = "[" + shoppingCartIds.substr(0,shoppingCartIds.length - 1) + "]";
				buyNums = "[" + buyNums.substr(0,buyNums.length - 1) + "]";								
				ajax.post('order/insertordersbyshoopingcart',{
					"shoppingCartIds": shoppingCartIds,
					"buyNums": buyNums,
					"customerId": customerId,
					"areaCode" : areaCode
				},'json',function(data){
					$.hideIndicator();
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/ordersPay.html?orderIds=[' + data.data.orderId + ']');	
				});										
			});		
		}//fun_gobuy end
	}//control end

	$(document).on('click','a',function(){
		window.jsObj.loadContent($(this).attr('data-url'));
	});
	
	$(document).on('click','.gohome',function(){
		window.jsObj.goHome();
	});

	getAjax();

	$(document).on('refresh', '.pull-to-refresh-content',function() {
		window.location.reload();
	});
		
});