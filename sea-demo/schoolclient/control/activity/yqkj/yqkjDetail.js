define(function(require, exports, module) {
	
	var base = require('base'),
		ajax = require('ajax');
	require('./yqkjDetail.css');
	
	window.jsObj.setLoadUrlTitle('一起砍价');
	
	var fun_jqkjDetail = function(){
		var self = this;
		
		var customerId = window.jsObj.readUserData('id'),//会员id
			normsValueId = base.getQueryString('normsValueId'),//规格值id
			goodsId = base.getQueryString('goodsId'),//商品id
			areaCode = '';//用户默认收货地址code
	
		var	isActivity = base.getQueryString('isActivity') == null ? 0 : base.getQueryString('isActivity'),//是否是活动
			identifier = base.getQueryString('identifier') == null ? 0 : base.getQueryString('identifier'),//活动标识符		
			shareId = base.getQueryString('shareId');//分享人id	
		
		if(shareId == customerId){shareId = null;}

		var goodsName,
			totalprices,
			normsValue,
			normsValueIds,//规格值id组合
			photoUrls = [],//商品图片数组
			preferentialPrice,//商品原始价格
			minPrice,//砍价最低金额
			canBuyThis,
			isBuy,//是否可购买
			isCollection;//是否收藏
			
		var isOpenpopupBox = false,
			timeFlag = 0;//活动时间  1 未开始 2 已开始 3已结束

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
			ajax.get('goods/getgoodsinfo/' + goodsId + '/' + normsValueId + '?customerId=' + customerId + '&areaCode=' + areaCode + '&isActivity=' + isActivity + '&identifier=' + identifier + '&isStudent=0&seckillTimesId=0','json',function(data){
				if(data.status == 0){
					$.errtoast('系统繁忙，请稍后重试');
					return;
				}
				self.renderDom(data.data);
			});//渲染dom			
		});
		
		this.renderDom = function(data){			
			for(var p = 0; p < data.photoUrls.length; p++){
				photoUrls.push({'url': data.photoUrls[p].url});
			}
			self.renderPlayer(photoUrls);
				
			$("#sendAddress").html(data.sendAddress);
			isBuy = data.isBuy;
			canBuyThis = data.canBuyThis;
			isCollection = data.isCollection;			
			normsValueIds = data.defaultNorm.normsValueIds;
			
			ajax.get('activity/selectbasecutbyidentifier/' + identifier,'json',function(data){
				if(data.status == 0){
					$.errtoast('系统繁忙，请稍后重试');
					return;
				}
				data = data.data[0];				
				goodsName = data.goodsName;
				totalprices = data.preferentialPrice;
				normsValue = data.normsValue;
				preferentialPrice = data.preferentialPrice;
				minPrice = data.minPrice;
				$("#gName").html(goodsName);
				$("#normsValue").html(normsValue);
				$("#gPrice").html(preferentialPrice.toFixed(2));
				if(data.description != '' && data.description != undefined && data.description != null){
					$("#description").html(data.description);
				}
				self.setIntervalTime(data.startDate,data.endDate);
				var dDate = Math.round(new Date().getTime());
				dDate > data.startDate ? timeFlag = 2 : timeFlag = 1;
				dDate > data.endDate ? timeFlag = 3 : timeFlag = timeFlag;
				
				var popupBox = require('popupBox'); 
				$(".page").append(popupBox());//加载选择商品规格弹框
				$(".popup-box .popup-box-buy").hide();
				self.setBuybar();//加载底部菜单
				
				var initID;
				shareId == null ? initID = customerId : initID = shareId;
				ajax.get('activity/selectbasecutdetailbyidentifier/' + identifier + '?customerId=' + initID,'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}
					data = data.data;
					if(data.length > 0){					
						if(shareId == null){
							$("#ljkjbtn").hide();
							//$("#kjInfo, #sharebtn").show();
							$("#kjInfo").show();
						}else{
							$("#sharebtn").hide();
							$("#ljkjbtn,#kjInfo").show();					
						}
						$("#currentPrice").html(data[0].currentPrice);
						$("#cutPrice").html(data[0].cutPrice);
						if(data[0].currentPrice == minPrice && shareId == null){
							$("#kjPriceinfo").html('已经砍到最低价啦，立即下单购买，不然被抢光了哦！');
							$("#ljkjbtn,#sharebtn").hide();
						}
						if(isBuy == 'YES'){
							$("#ljkjbtn,#sharebtn").hide();
						}							
					}
				});
				
				ajax.get('user/selectaccountinfo/' + customerId,'json',function(data){
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}		
					var shareText = data.accountInfo[0].alias + '参加【' + goodsName + '】砍价活动,邀你来砍价',
						shareUrl = SAYIMO.SRVPATH + 'view/activity/yqkj/yqkjDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId + '&isActivity=1&identifier=' + identifier;					
					if(shareId == null && isBuy != 'YES'){
						shareUrl = shareUrl + '&shareId=' + customerId;
					}
					$("body").append('<div style="display:none" id="shareText">' + shareText + '</div><div style="display:none" id="shareUrl">' + encodeURIComponent(shareUrl) + '</div>');	
				});				
				$.init();// 执行sui初始化
				self.control();															
			});			
		}
		
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
		
		this.setIntervalTime = function(s,e){
			setInterval(function(){
				var d = Math.round(new Date().getTime()),c = 0,w = '';
				d > s ? c = e - d : c = s - d;
				d > e ? c = d - e : d = d; 
				d > s ? w = '距离结束时间' : w = '距离开始时间';
				d > e ? w = '活动已结束' : w = w;
				if(c < 1000){
					setTimeout(function(){window.location.reload();},600);
					return;
				}//当时间差小于1秒时return，600ms后刷新页面进入最新砍价状态
				var dd = Math.floor(c/1000/60/60/24),
					hh = Math.floor((c - dd*24*60*60*1000)/1000/60/60),
					mm = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000)/1000/60),
					ss = Math.floor((c - dd*24*60*60*1000 - hh*60*60*1000 - mm*60*1000)/1000);
				hh < 10 ? hh = '0' + hh : hh = String(hh);
				mm < 10 ? mm = '0' + mm : mm = String(mm);
				ss < 10 ? ss = '0' + ss : ss = String(ss);
				$("#gTimes").html(w + '：' + dd + ' 天 ' + hh + ' : ' + mm + ' : ' + ss);				
			},1000);			
		}

		this.setBuybar = function(){
			var buybar = require('buybar');			
			buybar({
				setCont: '.page',
				isSspc: false,
				isCollection: isCollection,
				addOrdersText: '立即购买',
				serviceCall: function(){
					window.jsObj.loadContent(SAYIMO.KFURL + '&goods=true&goodspic=' + photoUrls[0].url + '&goodsname=' + goodsName + '&goodsprice=' + totalprices + '元&goodsurl=' + encodeURIComponent(SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId + '&isActivity=1&identifier=' + identifier));
				},
				collectCall: self.collect,
				shoppingcartCall: '',
				addOrdersCall: self.addOrders				
			});		
			if(isBuy == 'YES' || timeFlag == 1 || timeFlag == 3 || shareId != null){
				$("#addOrders").addClass("noBuy");							
			}			
		}
		
		this.control = function(){
			$("#open-popup-box").on('click',function(){			
				self.popup_box_show();
				self.popup_box_initialize();
				$("#popup-box").attr('data-id','1');
			});//点击展开选择商品规格框并加载规格数据	
			
			$("#close-popup-box, .sayimo-mask").on('click',function(){
				self.popup_box_hide();
			});//点击关闭选择商品规格框
			
			$("#okbtn-popup-box").on('click',function(){
				self.popupbtncallback();
			});//弹框确定事件
			
			$("#ljkjbtn").on('click',function(){//自己第一次砍价
				if(timeFlag == 1){
					$.errtoast('活动即将开始');
					return;
				}
				if(timeFlag == 3){
					$.errtoast('活动已结束');
					return;
				}
				if(shareId == null){
					ajax.post('activity/addcutdetail',{"identifier": identifier,'customerId': customerId},'json',function(data){
						if(data.status == 0 && data.errorCode == '400001'){
							$.errtoast('被人砍光了，你来晚了哦');
							return;
						}
						if(data.status == 0){
							$.errtoast('系统繁忙，请稍后重试');
							return;
						}
						self.shareKj(false);
					});						
				}else{
					self.shareKj(true);
				}
			});

			$("#sharebtn").on('click',function(){// 找人帮砍
				window.jsObj.shareApp('(我的邀请码' + window.jsObj.readUserData('inviteCode') + ')' + '找人帮砍','我正在参加【' + goodsName + '】' + minPrice + '元砍价活动，点击帮我砍价啦！',SAYIMO.SRVPATH + 'images/default/icon_logo_188.png','http://rainbowapi.sayimo.cn/schoolwap/view/find/positionDemand/down_chmkkj_app.html');								
			});
			
			$(".tab-link").eq(1).on('click',function(){// 校友团
				var xytID;
				shareId == null ? xytID = customerId : xytID = shareId;				
				ajax.get('activity/selectbasecutdetailjoinbycustomerid/' + identifier + '?customerId=' + xytID,'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后重试');
						return;
					}
					data = data.data;
					if(data.length > 0){
						var htmldata = '';
						for(var i = 0; i < data.length; i++){
							htmldata += '<li><img src="' + data[i].headPhoto + '" ><p>' + data[i].alias + '，已经帮砍' + data[i].joinCutPrice + '元，棒棒哒！</p></li>';
						}
						$(".detailbyidentifier").html('<ul>' + htmldata + '</ul>');
					}
				});					
			});			
			$(".tab-link").eq(2).on('click',function(){
				self.cybKj('');
			});
			
		}
		
		this.cybKj = function(f){//参与榜
			ajax.get('activity/selectbasecutdetailbyidentifier/' + identifier + '?customerId=' + f,'json',function(data){
				if(data.status == 0){
					$.errtoast('系统繁忙，请稍后重试');
					return;
				}
				data = data.data;
				if(data.length > 0){
					if(f != ''){
						$("#currentPrice").html(data[0].currentPrice);
						$("#cutPrice").html(data[0].cutPrice);						
					}else{
						var htmldata = '';
						for(var i = 0; i < data.length; i++){
							htmldata += '<li><img src="' + data[i].headPhoto + '" ><p>' + data[i].alias + '，当前砍价已经砍掉' + data[i].cutPrice + '元，当前金额' + data[i].currentPrice + '元。</p></li>';
						}
						$(".customerid").html('<ul>' + htmldata + '</ul>');
					}
				}
			});				
		}
		
		this.shareKj = function(flag){// 砍价
			flag == true ? flag = shareId : flag = customerId;
			ajax.post('activity/addcutjoin',{"identifier": identifier,"customerId": flag,"joinCustomerId": customerId},'json',function(data){
				if(data.status == 0 && data.errorCode == '800007'){
					$.errtoast('砍价次数已达上限');
					return;
				}
				if(data.status == 0 && data.errorCode == '800008'){
					$.errtoast('您已参加过此次砍价');
					return;
				}
				if(data.status == 0 && data.errorCode == '800009'){
					$.errtoast('主人已经购买了，不需再砍了');
					return;
				}					
				if(data.status == 0){
					$.errtoast('系统繁忙，请稍后重试');
					return;
				}					
				data = data.data;
				$.errtoast('砍掉了' + data.currentPrice + ',非常不错');
				$("#ljkjbtn").hide();
				$("#kjInfo").show();
				if(shareId == null){
					//$("#sharebtn").show();
					self.cybKj(customerId);
				}else{
					self.cybKj(shareId);
				}
			});				
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
			$(".popup-box-price-money").text(preferentialPrice.toFixed(2));
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
					var seVid = '';
						normsValue='';
					$(".popup-box-normsbox ul li.selected").each(function(){
						seVid += $(this).attr("data-vid") + ",";
						normsValue += $(this).text() + "/";
					});
					if(seVid!='') seVid=seVid.substr(0,seVid.length-1);
					if(normsValue!='') normsValue = normsValue.substr(0,normsValue.length-1);
					ajax.get('goods/getnormsinfo/' + goodsId + '/' + seVid + '?isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=0&customerId=' + customerId,'json',function(data){
						if(data.status == 0){return;}data = data.data;			
						normsValueId = data.normsInfo.goodsNormsValueId;//规格id	
						$("#normsValue, .popup-box-name").html(normsValue);//设置规格值
					});	
				});			
			});						
		}
		
		this.popupbtncallback = function(){
			var popupId = $("#popup-box").attr('data-id');
			if(popupId == 1){
				self.popup_box_hide();
			}else if(popupId == 3){
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
									window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html');
								}
							);	
						}else{
							ajax.post('order/insertnormalorders',{
								"goodsId": goodsId,
								"normsValueId": normsValueId,
								"customerId": customerId,
								"buyNum": '1',
								"identifier": identifier,
								"isActivity": isActivity,
								"seckillTimesId": '0',
								"areaCode": areaCode
							},'json',function(data){
								if(data.status == 0){
									$.errtoast('系统繁忙，请稍后重试');
									return;
								}					
								window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/ordersPay.html?orderIds=[' + data.data.orderId + ']');
							});							
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
		}
		
		this.collect = function(){
			if(isCollection == 2){
				//添加收藏
				ajax.post('goods/goodscollectadd',{
					"customerId": customerId,
					"goodsId": goodsId,
					"normsValueId": normsValueId,
					"type": '1',
					"identifier": identifier,
					"isactivity": isActivity,
					"seckillTimesId": '0'
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
					"seckillTimesId": '0'
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
		
		//购买
		this.addOrders = function(){	
			if(shareId != null){
				$.errtoast('分享页面不能购买');
				return;
			}			
			if(timeFlag == 1){
				$.errtoast('活动即将开始');
				return;
			}
			if(timeFlag == 3){
				$.errtoast('活动已结束');
				return;
			}			
			if(isBuy == 'YES'){				
				$.errtoast('您已参加该活动');
				return;				
			}
			var callBuy = false;
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
								window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html');
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
							$.confirm('不再砍了吗？',
								function () {
									$("#popup-box").attr('data-id','3');
									self.popup_box_show();
									self.popup_box_initialize();	
								}
							);							
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
		
	}	
	fun_jqkjDetail();

});