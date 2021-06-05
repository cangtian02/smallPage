define(function(require, exports, module) {
	
	var base = require('base'),
		ajax = require('ajax');
	require('./goodsDetail.css');
	
	window.jsObj.setLoadUrlTitle('商品详情');
	
	var fun_goodsDetail = function(){
		var self = this;
		
		var customerId = window.jsObj.readUserData('id'),
			normsValueId = base.getQueryString('normsValueId'),
			goodsId = base.getQueryString('goodsId'),
			areaCode = '';
			
		var	isActivity = base.getQueryString('isActivity') == null ? 0 : base.getQueryString('isActivity'),//是否是活动
			identifier = base.getQueryString('identifier') == null ? 0 : base.getQueryString('identifier'),//活动标识符		
			isStudent = base.getQueryString('isStudent') == null ? 0 : base.getQueryString('isStudent'),//是否是学生店铺			
			seckillTimesId = base.getQueryString('seckillTimesId') == null ? 0 : base.getQueryString('seckillTimesId');//秒抢时时间段id
			
		var	buyNumber = 1,//购买数量
			goodsName = '',//商品名称
			sendAddress = '',//发货地
			normsValue = '',//规格值
			normsValueIds = '',//规格值id组合
			buyCount = 0,//购买人数
			originalPrice = 0,//原价
			preferentialPrice = 0,//优惠价
			stock = 0,//库存		
			logisticsCost = 0,//运费				
			g_normsValueId = 0,//规格值id		
			totalprices = 0,//商品规格价
			photoUrls = [],//商品图片数组
			isCollection = 0,//是否收藏过该商品
			canBuyThis = '',//在活动下判断用户是否可购买
			isBuy = '',//是否购买过活动商品，YES代表购买过,NO未购买过
			g_status = 0,//正常商品是否下架
			TSHstatus = 0;//特奢汇商品是否下架
				
		var isOpenpopupBox = false,//是否打开过规格弹框
			commentone = false,//是否加载过评论信息			
			activityFlag = 0;//秒抢标识  1 未开始 2 已开始 3已结束
		
		ajax.get('user/getreceiveaddress/' + customerId,'json',function(data){
			if(data.status == 1){
				if(data.data.addresses.length > 0){				
					for(var i = 0; i < data.data.addresses.length; i++){
						if(data.data.addresses[i].isDefault == 1){
							areaCode = data.data.addresses[i].areaCode;
						}
					}
					if(areaCode == ''){
						areaCode = data.data.addresses[0].areaCode;
					}
				}
			}
			ajax.get('goods/getgoodsinfo/' + goodsId + '/' + normsValueId + '?customerId=' + customerId + '&areaCode=' + areaCode + '&isActivity=' + isActivity + '&identifier=' + identifier + '&isStudent=' + isStudent + '&seckillTimesId=' + seckillTimesId,'json',function(data){
				if(data.status == 0){
					$.errtoast('系统繁忙，请稍后重试');
					return;
				}
				self.renderDom(data.data);
			});//渲染dom			
		});
		
		this.renderDom = function(data){				
			for(var p = 0; p < data.photoUrls.length; p++){
				photoUrls.push({'url':data.photoUrls[p].url});
			}
			self.renderPlayer(photoUrls);//加载商品图片幻灯片
			
			goodsName = data.goodsName;//商品名称
			sendAddress = data.sendAddress;//发货地
			normsValue = data.defaultNorm.normsValue;//规格值
			normsValueIds = data.defaultNorm.normsValueIds;//规格值id组合
			buyCount = data.buyCount;//购买人数
			originalPrice = (data.defaultNorm.originalPrice).toFixed(2);//原价
			preferentialPrice = (data.defaultNorm.preferentialPrice).toFixed(2);//优惠价
			stock = data.defaultNorm.stock;//库存		
			logisticsCost = (data.logisticsCost == 0) ? '免运费' : '<span class="red">运费 ' + data.logisticsCost + ' 元</span>';//运费				
			g_normsValueId = data.normsValueId;//规格值id		
			totalprices = preferentialPrice;//商品规格价									
			isCollection = data.isCollection;//是否收藏过该商品
			g_status = data.status;//正常商品是否下架
			TSHstatus = data.Tshstatus;//特奢汇商品是否下架			
			if(isActivity == 1){
				canBuyThis = data.canBuyThis;//在活动下判断用户是否可购买
				isBuy = data.isBuy;
			}

			$("#buyCount").text(buyCount);//设置购买人数
			$("#goodsName").text(goodsName);//设置商品名称
			$("#sendAddress").text(sendAddress);//设置发货地
			$("#logisticsCost").html(logisticsCost);//设置运费
						
			if(data.goodsProduce != '' && typeof(data.goodsProduce) != 'undefined' && typeof(data.goodsProduce) != 'null'){
				$(".goodsProduce").html(data.goodsProduce);
			}//设置商品介绍
			
			if(data.goodsAttr != '' && typeof(data.goodsAttr) != 'undefined' && typeof(data.goodsAttr) != 'null'){
				$(".goodsAttr").html(data.goodsAttr);		
			}//设置商品属性
						
			if(isStudent == 1){//学生店铺
				$(".shopInfo").show();
				if(data.providerPhotoUrl != '' && typeof(data.providerPhotoUrl) != 'undefined' && typeof(data.providerPhotoUrl) != 'null'){
					$("#providerPhotoUrl").attr('src',data.providerPhotoUrl);
				}					
				$("#providerName").text(data.providerName);
				$("#providerGoodsTotal").text(data.providerGoodsTotal);
				$("#goodsCollectionCount").text(data.goodsCollectionCount);
				$("#gostudentshop").on('click',function(){
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-shopindex.html?providerId=' + data.providerId);
				});
			}
			
			var popupBox = require('popupBox'); 
			$(".page").append(popupBox());//加载选择商品规格弹框				
			self.setBuybar();//加载底部菜单

			if(isActivity == 1 && identifier.indexOf('MQ') > 0){//秒抢
				ajax.get('activity/selectbaseseckillidentifier/' + identifier,'json',function(data){						
					if(data.status == 0){$("#extraInfo").remove();return;}
					var hdata = data.data.activityExpalin.split('<p><br/></p>'),hdom = '';
					for(i in hdata){hdom += hdata[i];}
					$("#extraInfo .html-content").html(hdom);
				});
				var seckillTimes = require('seckillTimes');
				seckillTimes('#activityBox',data.seckillInfo.seckillStartDate,data.seckillInfo.seckillEndDate,function(f){
					activityFlag = f;
					if(f == 1 || f == 3){$("#addOrders").addClass('noBuy');}
				});					
			}else if(isActivity == 1 && identifier.indexOf('TG') > 0 ){//团购
				var hdata = data.groupBuyInfo.description.split('<p><br/></p>'),hdom = '';
				for(i in hdata){hdom += hdata[i];}
				$("#extraInfo .topTitle").html('团购说明：');	
				$("#extraInfo .html-content").html(hdom);
				var groupInfo = {
					startDate : data.groupBuyInfo.startDate,
					endDate : data.groupBuyInfo.endDate,
					number : data.groupBuyInfo.number,
					alreadyBuy : data.groupBuyInfo.alreadyBuy
				}				
				var groupBuying = require('groupBuying');
				groupBuying('#activityBox',groupInfo,function(f){
					activityFlag = f;
					if(f == 1 || f == 3){$("#addOrders").addClass('noBuy');}
				});				
			}else{
				if(extraInfo == ''){$("#extraInfo").remove();}else{$("#extraInfo .html-content").html(data.extraInfo);}
			}
			
			self.callDom();//渲染多次调用dom																
			self.control();//控制中心
			$.init();//dom加载完成后再执行SUI初始化，页面滑动后tab切换就不会提前置顶
		}//renderDom end
		
		this.renderPlayer = function(photoUrls){
			var htmldata = '';
			for(var i = 0; i < photoUrls.length; i++){
				htmldata += '<li><img src="' + photoUrls[i].url + '" /></li>';
			}	
			htmldata = '<div class="slide-container"><ul class="slide-main">'+ htmldata + '</ul><ul class="slide-pagination"></ul></div>';
			$("#gPlayer").append(htmldata);
			var slide = require('slide'),isautoplay = false;
			photoUrls.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay});			
		}
		
		this.callDom = function(){
			$("#preferentialPrice").text(preferentialPrice);//设置优惠价
			$("#originalPrice").text(originalPrice);//设置原价
			$("#stock").text(stock);//设置库存
			$("#normsValue").text(normsValue + '/' + buyNumber + '件');//设置规格值
			$("#total-prices").text(totalprices);//设置规格价				
		}
		
		this.setBuybar = function(){
			var buybar = require('buybar'),
				isSspc = true;
			if(isActivity == 1){isSspc = false;}			
			buybar({
				setCont: '.page',
				isSspc: isSspc,
				isCollection: isCollection,
				addOrdersText: '立即购买',
				serviceCall: function(){
					var ahref = '';
					if(isActivity == 1 || (isActivity == 1 && identifier.indexOf('TG') > 0) ){				
						ahref = '&isActivity=1&identifier=' + identifier;
					}else if(isActivity == 1 && identifier.indexOf('MQ') > 0){
						ahref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
					}else if(isStudent == 1){
						ahref = '&isStudent=1';
					}
					ahref = encodeURIComponent('&goods=true&goodspic=' + photoUrls[0].url + '&goodsname=' + goodsName + '&goodsprice=' + totalprices + '元&goodsurl=' + SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId + ahref);
					window.jsObj.loadContent(SAYIMO.KFURL + ahref);
				},
				collectCall: self.collect,
				shoppingcartCall: self.addShoppingCart,
				addOrdersCall: self.addOrders				
			});		
			if(isBuy == 'YES'){
				$("#addOrders").addClass("noBuy");							
			}			
		}
		
		this.control = function(){
			$("#share").on('click',function(){
				window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')' + goodsName,goodsName + '/' + normsValue + preferentialPrice + '元',SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');				
			});
			$("#open-popup-box").on('click',function(){			
				self.popup_box_show();
				self.popup_box_initialize();
				$("#popup-box").attr('data-id','1');
			});//点击展开选择商品规格框并加载规格数据				
			$("#close-popup-box, .sayimo-mask").on('click',function(){
				self.popup_box_hide();
				self.callDom();
			});//点击关闭选择商品规格框			
			$("#okbtn-popup-box").on('click',function(){
				self.popupbtncallback();
			});//弹框确定事件			
			$("#commentBtn").on('click',function(){
				if(commentone == false){self.CommentList();}			
			});//查看评论			
		}
		
		this.popup_box_show = function(){
			$(".sayimo-mask").show();
			$("#popup-box").addClass("popup-boxt-toggle");										
		}

		this.popup_box_hide = function(){
			$(".sayimo-mask").hide();
			$("#popup-box").removeClass("popup-boxt-toggle");									
		}
		
		this.popup_box_initialize = function(){
			if(isOpenpopupBox == true)return;
			$(".popup-box-name").text(normsValue);
			$(".popup-box-price-money").text(preferentialPrice);
			if(stock == 0){$("#nostock").html('（库存不足）');}
			self.numbox();
			ajax.get('goods/getallnormsvalues/' + goodsId,'json',self.popup_box_normList);	
			isOpenpopupBox = true;			
		}
		
		this.popup_box_normList = function(data){
			if(data.status == 0){return;}data = data.data;				
			var htmldata = '',lidata = '';
			for(var i = 0; i < data.normList.length; i++){
				htmldata += '<div class="popup-box-normsbox"><p class="popup-box-normsName">' + data.normList[i].normsName + '：</p><ul class="popup-box-normsValuesList clearfix">';
				for(var j = 0; j < data.normList[i].normsValuesList.length; j++){
					lidata += '<li data-vid="' + data.normList[i].normsValuesList[j].normsValueId + '">' + data.normList[i].normsValuesList[j].normsValue + '</li>';
				}
				htmldata = htmldata + lidata + '</ul></div>';
				lidata = '';
			}
			$(".popup-box-normList").append(htmldata);		
			normsValueIds = normsValueIds.split(",");
			$(".popup-box-normsbox ul li").each(function(){
				for(var k = 0; k < normsValueIds.length; k++){
					if($(this).attr("data-vid") == normsValueIds[k]){
						$(this).addClass('selected');
					}
				}
				$(this).on('click',function(){
					$(this).addClass("selected").siblings("li").removeClass("selected");
					self.popup_box_norm_info();
				});			
			});						
		}
		
		this.popup_box_norm_info = function(){
			var seVid = '';
				normsValue='';
			$(".popup-box-normsbox ul li.selected").each(function(){
				seVid += $(this).attr("data-vid") + ",";
				normsValue += $(this).text() + "/";
			});
			if(seVid!='') seVid=seVid.substr(0,seVid.length-1);
			if(normsValue!='') normsValue = normsValue.substr(0,normsValue.length-1);
			ajax.get('goods/getnormsinfo/' + goodsId + '/' + seVid + '?isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId + '&customerId=' + customerId,'json',function(data){
				if(data.status == 0){return;}data = data.data;				
				if(isActivity != 1){
					preferentialPrice = (data.normsInfo.preferentialPrice).toFixed(2);//优惠价
					totalprices = (preferentialPrice * buyNumber).toFixed(2);//规格价
					stock = data.normsInfo.stock;//库存
				}
				originalPrice = (data.normsInfo.originalPrice).toFixed(2);//原价				
				normsValueId = data.normsInfo.goodsNormsValueId;//规格id
				buyNumber = $(".popup-box-buy #number").val();//购买数量					
				$(".popup-box-name").text(normsValue);//设置规格值
				$(".popup-box-price-money").text(totalprices);//设置规格价
				if(stock == 0){
					$("#nostock").html('（库存不足）');
				}else{
					$("#nostock").html('');						
				}
				self.numbox();
			});				
		}

		this.numbox = function(){
			require('numbox');		
			var Stock = 0;
			if(isActivity == 1){
				if(isActivity == 1 && identifier.indexOf('TG') > 0 ){
					Stock = stock;
				}else{
					Stock = 1;
				}
			}else{
				Stock = stock;
			}			
			if(Stock == 0){
				$(".numbox .numbox-input").val(1);
			}
			$(".popup-box-buy .numbox").numbox({
				min : 1,
				max : Stock,
				callNum : function(){
					var inputBoxVal = $(".numbox .numbox-input").val();
					totalprices = (preferentialPrice * inputBoxVal).toFixed(2);					
					$(".popup-box-price-money").text(totalprices);//设置规格价	
					buyNumber = inputBoxVal;
					self.callDom();
				}
			});			
		}
		
		this.addShoppingCart = function(){
			if(TSHstatus == 2 || g_status == 0){
				$.errtoast("该商品已下架");
				return;
			}
			$("#popup-box").attr('data-id','2');
			self.popup_box_show();
			self.popup_box_initialize();			
		}
		
		this.addOrders = function(){
			var callBuy = false;
			if(activityFlag == 1){
				$.errtoast('活动即将开始');
				return;
			}
			if(activityFlag == 3){
				$.errtoast('活动已结束');
				return;
			}			
			if(isBuy == 'YES'){				
				$.errtoast('您已参加该活动');
				return;				
			}
			if(TSHstatus == 2 || g_status == 0){
				callBuy = false;
				$("#addOrders").addClass("noBuy");				
				$.errtoast('该商品已下架');					
				return;
			}
			// 判断收货地址areaCode
			ajax.get('user/getreceiveaddress/' + customerId,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');	
					return;
				}
				var isdefault = -1;
				if(data.data.addresses.length > 0){				
					for(var i = 0; i < data.data.addresses.length; i++){
						if(data.data.addresses[i].isDefault == 1){
							areaCode = data.data.addresses[i].areaCode;
							isdefault = 1;
						}
					}
					if(isdefault == -1){
						$.confirm('<div style="font-size:.7rem;">您还没有设置默认收货地址,是否去设置？</div>',
							function () {
								window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html?orderId=pre');
							}
						);	
					}else{
						if(isActivity == 1){
							if(canBuyThis == 'unPay'){
								callBuy = false;
								$("#addOrders").addClass("noBuy");	
								$("#addOrders").text("您已购买未付款");
								setTimeout(function(){
									window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/orderManagement.html?tab=2');
								},1500);
							}else{
								callBuy = true;
							}
						}else{
							callBuy = true;
						}
						if(callBuy == true){
							$("#popup-box").attr('data-id','3');
							self.popup_box_show();
							self.popup_box_initialize();							
						}						
					}
				}else{
					$.confirm('<div style="font-size:.7rem;">您还没有收货地址,是否去添加？</div>',
						function () {
							window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/addReceivingAddress.html?ralength=0');
						}
					);					
				}			
			});																
		}
		
		this.popupbtncallback = function(){
			var popupId = $("#popup-box").attr('data-id');
			if(popupId == 1){
				self.popup_box_hide();
				self.callDom();
			}else if(popupId == 2){
				if(stock == 0){								
					$.errtoast("库存不足");
					return;
				}				
				ajax.post('goods/addshoppingcart',{
					"goodsId": goodsId,
					"normsValueId": normsValueId,
					"customerId": customerId,
					"buyNum": buyNumber
				},'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}
					self.popup_box_hide();
					$.errtoast('添加成功,在购物车等着您');
				});
			}else if(popupId == 3){
				if(stock == 0){								
					$.errtoast("库存不足");
					return;
				}				
				ajax.post('order/insertnormalorders',{
					"goodsId": goodsId,
					"normsValueId": normsValueId,
					"customerId": customerId,
					"buyNum": buyNumber,
					"identifier": identifier,
					"isActivity": isActivity,
					"seckillTimesId": seckillTimesId,
					"areaCode": areaCode
				},'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}
					window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/ordersPay.html?orderIds=[' + data.data.orderId + ']');
				});						
			}			
		}
		
		this.collect = function(){
			if(isCollection == 2){
				//添加收藏
				ajax.post('goods/goodscollectadd',{
					"customerId": customerId,
					"goodsId": goodsId,
					"normsValueId": g_normsValueId,
					"type": '1',
					"identifier": identifier,
					"isactivity": isActivity,
					"seckillTimesId": seckillTimesId
				},'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}
					$("#collect .sayimo-icon-collect").addClass('active');
					$("#collect .t").text('已收藏');
					isCollection = 1;
				});				
			}else if(isCollection == 1){
				//取消收藏
				ajax.post('goods/goodscollectdelete',{
					"customerId": customerId,
					"goodsId": goodsId,
					"identifier": identifier,
					"seckillTimesId": seckillTimesId
				},'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}										
					$("#collect .sayimo-icon-collect").removeClass('active');
					$("#collect .t").text('收藏');
					isCollection = 2;
				});				
			}			
		}//商品收藏
		
		this.CommentList = function(){
			ajax.get('goods/getgoodscomments/' + goodsId + '?recordNum=5','json',function(data){				
				if(data.status == 0){
					$("#comment-list").append('<div class="noInfo tc">暂无评论，还不快抢沙发</div>');
					return;
				}
				commentone = true;
				data = data.data;
				if(data.commentCount > 0){									
					$(".comment-box").append('<div class="commentmore tc"><a id="commentmore" href="javascript:;">查看更多...</a></div>');				
				  	var commentList = require('commentList');
					$("#comment-list").append(commentList(data.goodsComments));
					$("#commentmore").on('click',function(){
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/comment/commentList.html?goodsId=' + goodsId);
					});
				}else{
					$("#comment-list").append('<div class="noInfo tc">暂无评论，还不快抢沙发</div>')
				}				
			});			
		}//加载评论信息
	}
	fun_goodsDetail();	
});