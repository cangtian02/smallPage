define(function(require, exports) {
	
	var base = require('base'),
		ajax = require('ajax');
	require('./reservedDetail.css');
		
	window.jsObj.setLoadUrlTitle('预约商品详情');
	
	var fun_goodsDetail = function(){
		var self = this;
		
		var customerId = window.jsObj.readUserData('id'),
			b_normsValueId = base.getQueryString('normsValueId'),//规格值id
			goodsId = base.getQueryString('goodsId'),//商品id			
			isActivity = base.getQueryString('isActivity') == null ? 0 : base.getQueryString('isActivity'),//是否是活动
			identifier = base.getQueryString('identifier') == null ? 0 : base.getQueryString('identifier'),//活动标识符	
			seckillTimesId = base.getQueryString('seckillTimesId') == null ? 0 : base.getQueryString('seckillTimesId');//秒抢时时间段id
			
		var goodsName = '',//商品名称
			story = '',//心语
			normsValue = '',//规格值
			normsValueIds = '',//规格值id组合
			buyCount = 0,//购买人数
			preferentialPrice = 0,//优惠价
			originalPrice = 0,//原价
			stock = 0,//库存		
			normsValueId = 0,//规格值id		
			totalprices = 0,//初始规格价			
			status = 0,//商品是否下架			
			isCollection = 0,//是否收藏过该商品			
			isBuy = '',//活动下是否可购买
			photoUrls = [],//商品图片数组
			Number = 1;//购买数量
							
		var commentone = false,//是否加载评论信息
			isOpenpopupBox = true,//是否第一次打开选择框
			activityFlag = 0;//秒抢标识  1 未开始 2 已开始 3已结束	
		
		ajax.get('pregoods/getgoodsinfo/' + goodsId + '/' + b_normsValueId + '?customerId=' + customerId + '&isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId,'json',function(data){
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}								
			data = data.data;			
			for(var p = 1; p < data.normList.photoUrls.length; p++){
				photoUrls.push({'url': data.normList.photoUrls[p].url});
			}
			goodsName = data.goodsName;//商品名称			
			story = data.story;//心语	
			normsValue = data.normList.normsValue;//规格值
			normsValueIds = data.normList.normsValueIds;//规格id组合		
			buyCount = data.buyCount;//购买人数
			preferentialPrice = (data.normList.preferentialPrice).toFixed(2);//优惠价
			originalPrice = (data.normList.originalPrice).toFixed(2);//原价
			stock = data.normList.stock;//库存
			normsValueId = data.normsValueId;//规格值id
			totalprices = preferentialPrice;//初始规格价
			status = data.status;//商品是否下架										
			isCollection = data.isCollection;//是否收藏过该商品
			if(isActivity == 1){isBuy = data.isBuy;}
						
			$("#buyCount").text(buyCount);
			$("#story").text(story);
			if(data.goodsProduce != '' && typeof(data.goodsProduce) != 'undefined' && typeof(data.goodsProduce) != 'null'){
				$(".goodsProduce").html(data.goodsProduce);
			}//设置商品介绍
			
			self.renderPlayer();//商品图片
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
				$("#extraInfo .t").html('团购说明：');	
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
				if(data.extraInfo == '' && typeof(data.extraInfo) == 'undefined' && typeof(data.extraInfo) == 'null'){$("#extraInfo").remove();}else{$("#extraInfo .html-content").html(data.extraInfo);}
			}			
						
			self.callDom();		
			self.control();//控制中心
			$.init();//dom加载完成后再执行SUI初始化，页面滑动后tab切换就不会提前置顶		
		});		
		
		this.renderPlayer = function(){
			var htmldata = '';
			for(var i = 0; i < photoUrls.length; i++){
				htmldata += '<li><img src="' + photoUrls[i].url + '" /></li>';
			}	
			htmldata = '<div class="slide-container"><ul class="slide-main">'+ htmldata + '</ul><ul class="slide-pagination"></ul></div>';
			$("#gPlayer").append(htmldata);
			var slide = require('slide'),isautoplay = false;
			photoUrls.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay});
			$(".slide-container").append('<h1 class="ellipsis" id="goodsName">' + goodsName + '</h1>');
		}
		
		this.callDom = function(){
			$("#preferentialPrice").html(preferentialPrice);//设置优惠价
			$("#originalPrice").html(originalPrice);//设置原价
			$("#normsValue").html(normsValue + '&nbsp;x' + Number + '件');//设置规格值
			$("#total-prices").text(totalprices);//设置规格价
		}

		this.setBuybar = function(){
			var buybar = require('buybar'),
				flag = false;			
			buybar({
				setCont: '.page',
				isSspc: flag,
				isCollection: isCollection,
				addOrdersText: '立即预约',
				serviceCall: function(){
					var ahref = '';
					if(isActivity == 1 || (isActivity == 1 && identifier.indexOf('TG') > 0) ){				
						ahref = '&isActivity=1&identifier=' + identifier;
					}else if(isActivity == 1 && identifier.indexOf('MQ') > 0){
						ahref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
					}
					ahref = encodeURIComponent('&goods=true&goodspic=' + photoUrls[0].url + '&goodsname=' + goodsName + '&goodsprice=' + totalprices + '元&goodsurl=' + SAYIMO.SRVPATH + 'class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + b_normsValueId + ahref);
					window.jsObj.loadContent(SAYIMO.KFURL + ahref);
				},
				collectCall: self.collect,
				shoppingcartCall: '',
				addOrdersCall: self.addOrders			
			});
			if(isActivity == 1 && isBuy == 'YES'){
				$("#addOrders").addClass('noBuy');
			}		
		}
		
		this.collect = function(){
			if(isCollection == 2){
				//添加收藏
				ajax.post('goods/goodscollectadd',{
					"customerId": customerId,
					"goodsId": goodsId,
					"normsValueId": normsValueId,
					"type": '2',
					"identifier": identifier,
					"isactivity": isActivity,
					"seckillTimesId": seckillTimesId
				},'json',function(data){
					if(data.status == 0){
						$.errtoast('系统繁忙，请稍后再试');
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
						$.errtoast('系统繁忙，请稍后再试');
						return;
					}
					$("#collect .sayimo-icon-collect").removeClass('active');
					$("#collect .t").text('收藏');
					isCollection = 2;					
				});				
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
			Number = $(".numbox .numbox-input").val();
			totalprices = (preferentialPrice * Number).toFixed(2);		
			$(".sayimo-mask").hide();
			$("#popup-box").removeClass("popup-boxt-toggle");			
		}		
		
		this.popup_box_initialize = function(){
			if(isOpenpopupBox == false) return;
			$(".popup-box-name").text(normsValue);				
			$(".popup-box-price-money").html(preferentialPrice);//设置弹框单价
			if(stock == 0){$("#nostock").html('（库存不足）');}
			self.Numbox();
			ajax.get('pregoods/getallnormsvalues/' + goodsId,'json',self.popup_box_normList);					
		}	
		
		this.popup_box_normList = function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			isOpenpopupBox = false;
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
			var seVid = '';normsValue = '';
			$(".popup-box-normsbox ul li.selected").each(function(){
				seVid += $(this).attr("data-vid") + ",";
				normsValue += $(this).text() + "/";
			});
			if(seVid!='') seVid = seVid.substr(0,seVid.length-1);
			if(normsValue != '') normsValue = normsValue.substr(0,normsValue.length-1);
			ajax.get('pregoods/getnormsinfo/' + goodsId + '/' + seVid + '/' + isActivity + '?identifier=' + identifier + '&seckillTimesId=' + seckillTimesId + '&customerId=' + customerId,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}				
				data = data.data;
				normsValueId = data.normsInfo.goodsNormsValueId;//规格id					
				if(isActivity != 1){
					preferentialPrice = (data.normsInfo.preferentialPrice).toFixed(2);//优惠价
					totalprices = (preferentialPrice * Number).toFixed(2);//规格价
					stock = data.normsInfo.stock;//库存
				}			
				if(stock == 0){
					$("#nostock").html('（库存不足）');
				}else{
					$("#nostock").html('');
				}
				self.Numbox();
				$(".popup-box-name").text(normsValue);//设置规格值					
				$(".popup-box-price-money").html(preferentialPrice);//设置弹框单价					
			});				
		}
		
		this.Numbox = function(){
			require('numbox');
			var m = 1,
				max = 0;
			stock == 0 ? m = 0 : m = 1;
			max = stock;
			if($(".numbox #number").val() == ''){
				$(".numbox #number").val(m);
			}
			$(".popup-box-buy .numbox").numbox({
				min : m,
				max : max,
				callNum : function(s){}//点击回调
			});			
		}
		
		this.popupbtncallback = function(){
			var popupId = $("#popup-box").attr('data-id');
			if(popupId == 1){
				self.popup_box_hide();
				self.callDom();
			}else if(popupId == 3){			
				if(isActivity == 1 && stock == 0){
					$.errtoast('活动商品已被抢完');
					return;					
				}
				if(stock == 0){
					$.errtoast('库存不足');
					return;					
				}
				Number = $(".numbox .numbox-input").val();
				var phref = '';
				if(isActivity == 1 && identifier.indexOf('TG') > 0){				
					phref = '&isActivity=1&identifier=' + identifier;
				}else if(isActivity == 1 && identifier.indexOf('MQ') > 0){					
					phref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
				}else if(isActivity == 1){
					phref = '&isActivity=1&identifier=' + identifier;
				}
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/pay/reservedPay.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId + '&buyNum=' + Number + phref);			
			}
		}

		this.addOrders = function(){
			if(activityFlag == 1){
				$.errtoast('活动即将开始');
				return;
			}
			if(activityFlag == 3){
				$.errtoast('活动已结束');
				return;
			}			
			if(isBuy == 'YES'){
				$.errtoast('您已参加活动');
				return;
			}
			if(status == 0){
				$("#addOrders").addClass('noBuy');
				$.errtoast('该商品已下架');
				return;
			}
			if($("#addOrders").hasClass("noBuy")){return;}
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
						$("#popup-box").attr('data-id','3');
						self.popup_box_show();
						self.popup_box_initialize();					
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
		
		this.CommentList = function(){
			ajax.get('goods/getgoodscomments/' + goodsId + '?recordNum=5&goodsType=PRE','json',function(data){				
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
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/comment/commentList.html?goodsId=' + goodsId + '&goodsType=pre');
					});					
				}else{
					$("#comment-list").append('<div class="noInfo tc">暂无评论，还不快抢沙发</div>')
				}				
			});				
		}//加载评论信息
			
	}
	fun_goodsDetail();

});