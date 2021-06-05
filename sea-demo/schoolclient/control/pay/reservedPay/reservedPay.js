define(function(require, exports, module) {
		
	var base = require('base'),
		ajax = require('ajax');
	require('./reservedPay.css');	
	
	window.jsObj.setLoadUrlTitle('预约商品订单支付');
	
	var fun_reservedPay = function(){
		$.showIndicator();
		
		var self = this,
			customerId = window.jsObj.readUserData('id'),
			ordersId = base.getQueryString('ordersId'),//获取订单id
			soure = base.getQueryString('soure'),//获取订单来源
			isActivity = base.getQueryString('isActivity') == null ? 0 : base.getQueryString('isActivity'),//是否是活动
			identifier = base.getQueryString('identifier') == null ? 0 : base.getQueryString('identifier'),//活动标识符	
			seckillTimesId = base.getQueryString('seckillTimesId') == null ? 0 : base.getQueryString('seckillTimesId');//秒抢时时间段id		
			
		var goodsId = '',//商品id
			normsValueId = '',//商品规格id
			Number = '',//购买数量
			receivePeople = '',//收货地址名称
			pay_type = -1,//支付方式
			walletBalance = 0,//钱包余额
			ordersTotalMoney = 0,//支付总额
			paypickType = '',//配送方式
			scheduleDate = '',//配送日期
			scheduleId = '',//配送时间段id
			scheduleIds = '',//配送时间段文字		
			leaveWords = '',//留言内容
			provider = '',//商家信息
			providerTel = '';//商家电话			
		
		var isSufficient = true,//钱包余额是否不足订单总额
			startDate = '',
			endDate = '',
			activityFlag = 0;//秒抢标识  1 未开始 2 已开始 3已结束
		
		// 判断收货地址areaCode
		ajax.get('user/getreceiveaddress/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');	
				return;
			}
			data = data.data;
			var receiveInfo = '';			
			for(var a = 0; a < data.addresses.length; a++ ){
				if(data.addresses[a].isDefault == 1){
					if(data.addresses[a].isSchool == 1){
						receiveAddress = '<em class="red">【校内地址】</em>' + data.addresses[a].address;				
					}else{
						receiveAddress = data.addresses[a].address;
					}					
					receiveInfo = '<p>' + data.addresses[a].receivingPeople + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.addresses[a].telephone + '</p><span>' + receiveAddress + '</span>';	
					receivePeople = data.addresses[a].receivingPeople;								
				}
			}			
			$(".receiveInfo").on('click',function(){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/receivingAddressList.html?orderId=pre');
			});
			$(".receiveInfo li:first-child .item-title").html(receiveInfo);
			self.renderDom();			
		});	
		
		this.renderDom = function(){
			if(ordersId == null){//从商品详情进入
				goodsId = base.getQueryString('goodsId'),//商品id
				normsValueId = base.getQueryString('normsValueId'),//规格值id
				Number = base.getQueryString('buyNum');//购买数量
				ajax.get('pregoods/getgoodsinfo/' + goodsId + '/' + normsValueId + '?customerId=' + customerId + '&isActivity=' + isActivity + '&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId,'json',function(data){				
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}
					data = data.data;
					$(".receiveInfo li:last-child .item-title").html('<p>' + data.provider.providerName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.provider.providerTel + '</p><span>' + data.provider.providerAddress + '</span>');				
					var htmldata = '', main = '', ahref = '';
					if(isActivity == 1){
						if(isActivity == 1 && identifier.indexOf('MQ') > 0){
							ahref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
						}else{
							ahref = '&isActivity=1&identifier=' + identifier;
						}
					}					
					htmldata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + data.id + '&normsValueId=' + data.normsValueId + ahref + '" class="cont">' + 
					'	<div class="l">' + 
					'		<img src="' + data.normList.photoUrls[0].url + '" />' + 
					'	</div>' + 
					'	<div class="r">' + 
					'		<h1>' + data.goodsName + '</h1>' + 
					'		<div class="r_price">' + 
					'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + data.normList.preferentialPrice.toFixed(2) + '</span></em>' + 
					'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + data.normList.originalPrice.toFixed(2) + '</span></del>' + 
					'		</div>' + 
					'		<div class="num ellipsis">' + data.normList.normsValue + ' x' + Number + '</div>' + 
					'	</div>' + 
					'</a>';						
					$(".ment-list").html(htmldata);
					$(".ment-list a").on('click',function(){
						window.jsObj.loadContent($(this).attr('data-url'));
					});						
					main = '合计:<span class="i red arial">￥</span><span class="n red">' + ((data.normList.preferentialPrice) * Number).toFixed(2) + '</span>';	
					$(".bar .main").html(main);
					if(data.pickType == 1){
						paypickType = data.pickType;
						$(".ps-info li:first-child .item-title").append('<div class="ps-list fl active" data-type="1"><em></em>专人配送</div>');						
						$(".receiveInfo li:first-child").show();
					}else if(data.pickType == 2){
						paypickType = data.pickType;
						$(".ps-info li:first-child .item-title").append('<div class="ps-list fl active" data-type="2"><em></em>门店自取</div>');
						$("#sdfs").text('自取时间：');						
						$(".receiveInfo li:last-child").show();
					}else{
						paypickType = 1;
						$(".receiveInfo li:first-child").show();
						$(".ps-info li:first-child .item-title").append('<div class="ps-list fl active" data-type="1"><em></em>专人配送</div><div class="ps-list fl" data-type="2"><em></em>门店自取</div>');
						scheduleDate = {"scheduleDate_zrps":'',"scheduleDate_smzq":''};//配送日期
						scheduleId = {"scheduleId_zrps":'',"scheduleId_smzq":''};//配送时间段id
						scheduleIds = {"scheduleIds_zrps":'',"scheduleIds_smzq":''};//配送时间段文字
						self.pickTypecall();//配送方式选择
					}
					providerTel = data.provider.providerTel;					
					if(isActivity == 1 && identifier.indexOf('MQ') > 0){//秒抢
						$("#template .item-title .fr").html('尽快送达');
						self.seckillTimes(data.seckillInfo.seckillStartDate,data.seckillInfo.seckillEndDate);				
					}else if(isActivity == 1 && identifier.indexOf('TG') > 0){//团购
						var groupInfo = {
							startDate : data.groupBuyInfo.startDate,
							endDate : data.groupBuyInfo.endDate,
							number : data.groupBuyInfo.number,
							alreadyBuy : data.groupBuyInfo.alreadyBuy
						}							
						self.groupBuyTimes(groupInfo);						
					}
					self.control();					
				});
			}else{//从订单进入
				ajax.get('preorders/preordersdetail/' + customerId + '/' + ordersId,'json',function(data){
					if(data.status == 0){
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}
					data = data.data;
					walletBalance = data.walletBalance;
					ordersTotalMoney = data.ordersTotalMoney;
					var goodsList = data.orderList.goodsList, htmldata = '', main = '', ahref = '';
					if(isActivity == 1){
						if(isActivity == 1 && identifier.indexOf('MQ') > 0){
							ahref = '&isActivity=1&identifier=' + identifier + '&seckillTimesId=' + seckillTimesId;
						}else{
							ahref = '&isActivity=1&identifier=' + identifier;
						}
					}
					goodsId = goodsList[0].id;
					htmldata += '<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/reserved/reservedDetail.html?goodsId=' + goodsList[0].id + '&normsValueId=' + goodsList[0].normsValueId + ahref + '" class="cont">' + 
					'	<div class="l">' + 
					'		<img src="' + goodsList[0].photoUrl + '" />' + 
					'	</div>' + 
					'	<div class="r">' + 
					'		<h1>' + goodsList[0].goodsName + '</h1>' + 
					'		<div class="r_price">' + 
					'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + goodsList[0].transactionPrice.toFixed(2) + '</span></em>' + 
					'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + goodsList[0].sellPrice.toFixed(2) + '</span></del>' + 
					'		</div>' + 
					'		<div class="num ellipsis">' + goodsList[0].normsValue + ' x' + goodsList[0].buyNum + '</div>' + 
					'	</div>' + 
					'</a>';	
					
					$(".ment-list").html(htmldata);
					$(".ment-list a").on('click',function(){
						window.jsObj.loadContent($(this).attr('data-url'));
					});						
					main = '合计:<span class="i red arial">￥</span><span class="n red">' + data.ordersTotalMoney.toFixed(2) + '</span>';	
					$(".bar .main").html(main);
					if(data.goodsPickType == 1){
						$(".ps-info li:first-child .item-title").append('<li class="ps-list fl active" data-type="1"><em></em>专人配送</li>');
						$(".receiveInfo li:first-child").show();
					}else if(data.goodsPickType == 2){
						$(".ps-info li:first-child .item-title").append('<li class="ps-list fl active" data-type="2"><em></em>门店自取</li>');
						$("#sdfs").text('自取时间：');
						$(".receiveInfo li:last-child").show();
					}else{
						$(".receiveInfo li:first-child").show();
						$(".ps-info li:first-child .item-title").append('<div class="ps-list fl" data-type="1"><em></em>专人配送</div><div class="ps-list fl" data-type="2"><em></em>门店自取</div>');							
					}
					$(".receiveInfo li:last-child .item-title").html('<p>' + data.provider.providerName + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.provider.providerTel + '</p><span>' + data.provider.providerAddress + '</span>');					
					paypickType = data.orderList.orderPickType;
					if(paypickType == 1){
						$("#sdfs").text('配送时间：');
					}else{
						$("#sdfs").text('自取时间：');
					}						
					if($(".ps-info .ps-list").length == 1){							
						if(data.orderList.orderScheduleDate == '' || data.orderList.orderScheduleDate == 0 || data.orderList.orderScheduleDate == null){
							scheduleId = 0;
							scheduleIds = data.orderList.startTime;								
						}else{
							scheduleId = data.orderList.orderScheduleId;
							scheduleIds = data.orderList.startTime + '-' + data.orderList.endTime;								
						}
						scheduleDate = data.orderList.orderScheduleDate;																	
					}else{						
						if(paypickType == 1){
							$(".ps-info .ps-list").eq(0).addClass('active');
							if(data.orderList.orderScheduleDate == '' || data.orderList.orderScheduleDate == 0 || data.orderList.orderScheduleDate == null){								
								scheduleId = {"scheduleId_zrps": '0',"scheduleId_smzq":''};
								scheduleIds = {"scheduleIds_zrps": data.orderList.startTime,"scheduleIds_smzq":''};								
							}else{								
								scheduleId = {"scheduleId_zrps": data.orderList.orderScheduleId,"scheduleId_smzq":''};
								scheduleIds = {"scheduleIds_zrps": data.orderList.startTime + '-' + data.orderList.endTime,"scheduleIds_smzq":''};
							}							
							scheduleDate = {"scheduleDate_zrps": data.orderList.orderScheduleDate,"scheduleDate_smzq":''};					
						}else{
							$(".ps-info .ps-list").eq(1).addClass('active');
							if(data.orderList.orderScheduleDate == '' || data.orderList.orderScheduleDate == 0 || data.orderList.orderScheduleDate == null){								
								scheduleId = {"scheduleId_zrps": '',"scheduleId_smzq": '0'};
								scheduleIds = {"scheduleIds_zrps": '',"scheduleIds_smzq": data.orderList.startTime};								
							}else{								
								scheduleId = {"scheduleId_zrps": '',"scheduleId_smzq": data.orderList.orderScheduleId};
								scheduleIds = {"scheduleIds_zrps": '',"scheduleIds_smzq": data.orderList.startTime + '-' + data.orderList.endTime};
							}							
							scheduleDate = {"scheduleDate_zrps": '',"scheduleDate_smzq": data.orderList.orderScheduleDate};							
						}
						self.pickTypecall();//配送方式选择
					}
					if(isActivity != 1){
						if($(".ps-info .ps-list").length == 1){
							$("#template .item-title .fr").html(scheduleDate + '&nbsp;' + scheduleIds);
						}else{
							if(paypickType == 1){
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_zrps + '&nbsp;' + scheduleIds.scheduleIds_zrps);
							}else{
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_smzq + '&nbsp;' + scheduleIds.scheduleIds_smzq);
							}
						}
					}
					providerTel = data.provider.providerTel;
					if(isActivity == 1 && identifier.indexOf('MQ') > 0){//秒抢
						$("#template .item-title .fr").html('尽快送达');
						self.seckillTimes(data.orderList.seckillStartDate,data.orderList.seckillEndDate);				
					}else if(isActivity == 1 && identifier.indexOf('TG') > 0){//团购
						var groupInfo = {
							startDate : data.orderList.startDate,
							endDate : data.orderList.endDate,
							number : data.orderList.number,
							alreadyBuy : data.orderList.alreadyBuy
						}							
						self.groupBuyTimes(groupInfo);						
					}					
					self.control();						
				});				
			}
		}

		this.seckillTimes = function(s,e){
			var seckillTimes = require('seckillTimes');
			seckillTimes('#activityBox',s,e,function(f){});				
		}
		
		this.groupBuyTimes = function(d){
			var groupBuying = require('groupBuying');
			groupBuying('#activityBox',d,function(f){});
		}
		
		this.control = function(){
			self.renderpayManner();
			$(".content").append('<a href="javascript:;" class="telpro">联系商家</a>');			
			$(".telpro").on('click',function(){
				window.jsObj.callPhone(providerTel);
			});			
			self.templateIdcall();//配送时间选择
			$.hideIndicator();
			$.init();//支付页面很重要，dom成功加载才能执行SUI初始化，反之不显示页面								
			$("#confirmPay").on('click',function(){
				if(activityFlag == 3){
					$.errtoast('活动已结束');
					return;
				}			
				if($(this).hasClass('noPay') == false){
					self.confirmPay();
				}			
			});//提交支付			
		}

		this.renderpayManner = function(){
			var payManner = require('payManner');//加载支付方式dom
			payManner('.content',function(f){
				pay_type = f;
				if(pay_type == 1){
					if($("#confirmPay").hasClass('noPay') != false && activityFlag != 3){
						$("#confirmPay").removeClass('noPay');
					}
				}else{
					if(isSufficient == false){//当钱包余额不足订单总额时屏蔽支付按钮
						$("#confirmPay").addClass('noPay');
					}
				}
			});			
		}				
						
		this.pickTypecall = function(){
			$(".ps-list").each(function(){
				$(this).on('click',function(){
					paypickType = $(this).attr('data-type');
					$(this).addClass('active').siblings('.ps-list').removeClass('active');
					$(".receiveInfo li").eq($(this).index() - 1).show().siblings('li').hide();
					if(paypickType == 2){
						$("#template .item-title .fr").html('门店自取');
						$("#sdfs").text('自取时间：');
						if(scheduleId.scheduleId_smzq == '' || scheduleIds.scheduleIds_smzq == ''){
							if(isActivity == 1 && identifier.indexOf('MQ') > 0){
								$("#template .item-title .fr").html('隔日门店自取');
							}else{
								$("#template .item-title .fr").html('您还未选择自取时间');
							}								
						}else{
							$("#template .item-title .fr").html(scheduleDate.scheduleDate_smzq + '&nbsp;' + scheduleIds.scheduleIds_smzq);
						}						
					}else{
						$("#sdfs").text('送达时间：');					
						if(scheduleIds.scheduleIds_zrps == ''){
							if(isActivity == 1 && identifier.indexOf('MQ') > 0){
								$("#template .item-title .fr").html('尽快送达');
							}else{
								$("#template .item-title .fr").html('您还未选择配送时间');
							}							
						}else{								
							if(scheduleId.scheduleId_zrps == 0){
								$("#template .item-title .fr").html(scheduleId.scheduleId_zrps);
							}else{
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_zrps + '&nbsp;' + scheduleIds.scheduleIds_zrps);
							}
						}
					}
				});
			});			
		}
			
		this.templateIdcall = function(){
			var onebox = false,beforeTimes, timeslist;	
			$("#template").on('click',function(){
				if(isActivity == 1 && identifier.indexOf('MQ') > 0){return;}		
				if(onebox == false){					
					var _text = '', _times = '',d_date = '';
					ajax.get('preorders/getpreschdulebygoodsid/' + goodsId,'json',function(data){
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						data = data.data;
						beforeTimes = data.beforeTimes;
				    	var date = new Date();
				    	if( data.scheduleTime.times[0].scheduleId == 0){
			        		var df = date.getFullYear(),
			        			dm = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
			        			dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();				        		
			        		_text = '<li data-date="' + df + '-' + dm + '-' + dd + '">' + dm + '月' +  dd + '日' + '</li>';
				    		timeslist = 0;
				    	}else{
					    	d_date = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
					       	for(var i = 0; i < 7; i++){
					        	date = new Date();
					        	date.setDate(date.getDate() + i);
					        	if(data.scheduleTime.weekday.indexOf(date.getDay()) >= 0){
					        		var df = date.getFullYear(),
					        			dm = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
					        			dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();				        		
					        		_text += '<li data-date="' + df + '-' + dm + '-' + dd + '">' + dm + '月' +  dd + '日' + '</li>';
					       		}
					        }
					       	timeslist = data.scheduleTime.times;
				        }				    	
						$("#te_list").html(_text);				
						$("#te_list li:first-child").addClass('active');
						$("#te_list li").each(function(){
							if($(".ps-info .ps-list").length == 1){
								if(scheduleDate == $(this).attr('data-date')){
									$(this).addClass('active').siblings('li').removeClass('active');
								}					
							}else{							
								if(paypickType == 1){
									if(scheduleDate.scheduleDate_zrps == $(this).attr('data-date')){
										$(this).addClass('active').siblings('li').removeClass('active');
									}
								}else{
									if(scheduleDate.scheduleDate_smzq == $(this).attr('data-date')){
										$(this).addClass('active').siblings('li').removeClass('active');
									}						
								}
							}
							$(this).on('click',function(){
								if($("#te_list li").length > 1){
									$(this).addClass('active').siblings('li').removeClass('active');
									_times = '';
							       	for(var j = 0; j < timeslist.length; j++){
							       		var d = ($("#te_list li.active").attr('data-date')).replace(/-/g,'/'),
							       			s = timeslist[j].startTime,
							       			s = (new Date(d + ' ' + s)).getTime();
							       			m = new Date().getTime() + beforeTimes * 60 * 1000;						       									       			
							       		if(s - m >= 0){						       			
							       			_times += '<li data-scheduleId="' + timeslist[j].scheduleId + '">' + timeslist[j].startTime + '~' + timeslist[j].endTime + '</li>';
							       		}else{
							       			_times += '<li class="din" data-scheduleId="' + timeslist[j].scheduleId + '">' + timeslist[j].startTime + '~' + timeslist[j].endTime + '</li>';
							       		}
							       	}
							       	$("#ti_list").html(_times);
							       	if($("#ti_list li").length == $("#ti_list li.din").length){
							       		$("#ti_list").prepend('<div class="red" style="margin-top: .5rem;">已过预约时间，将不再配送</div>');
							       	}
									if($(".ps-info .ps-list").length == 1){
										scheduleDate = $(this).attr('data-date');					
									}else{							       	
										if(paypickType == 1){
											scheduleDate.scheduleDate_zrps = $(this).attr('data-date');								
										}else{
											scheduleDate.scheduleDate_smzq = $(this).attr('data-date');							
										}
									}
									self.ti_list();
								}
							});
						});					
						if(timeslist == 0){
							_times = '<li data-scheduleId="0">尽快送达</li>';
							$("#ti_list").html(_times);
						}else{						
					       	for(var j = 0; j < timeslist.length; j++){
					       		var d = ($("#te_list li.active").attr('data-date')).replace(/-/g,'/'),
					       			s = timeslist[j].startTime,
					       			s = (new Date(d + ' ' + s)).getTime();
					       			m = new Date().getTime() + beforeTimes * 60 * 1000;
					       		if(s - m >= 0){					       			
					       			_times += '<li data-scheduleId="' + timeslist[j].scheduleId + '">' + timeslist[j].startTime + '~' + timeslist[j].endTime + '</li>';
					       		}else{
					       			_times += '<li class="din" data-scheduleId="' + timeslist[j].scheduleId + '">' + timeslist[j].startTime + '~' + timeslist[j].endTime + '</li>';
					       		}
					       	}
					       	$("#ti_list").html(_times);
					       	if($("#ti_list li").length == $("#ti_list li.din").length){
					       		$("#ti_list").prepend('<div class="red" style="margin-top: .5rem;">已过预约时间，将不再配送</div>');
					       	}
						}
						$(".sayimo-mask, .t_box").show();
						onebox = true;
						self.ti_list();				    					    	
					});					
				}else{				
					$(".sayimo-mask, .t_box").show();
				}												
			});			
		}
						
		this.ti_list = function(){
			$("#ti_list li").each(function(){
				if($(".ps-info .ps-list").length == 1){
					if(scheduleId == $(this).attr('data-scheduleId')){
						$(this).addClass('active').siblings('li').removeClass('active');
					}					
				}else{
					if(paypickType == 1){
						if(scheduleId.scheduleId_zrps == $(this).attr('data-scheduleId')){
							$(this).addClass('active').siblings('li').removeClass('active');
						}
					}else{
						if(scheduleId.scheduleId_smzq == $(this).attr('data-scheduleId')){
							$(this).addClass('active').siblings('li').removeClass('active');
						}						
					}
				}
				$(this).on('click',function(){
					$(this).addClass('active').siblings('li').removeClass('active');
					if($(".ps-info .ps-list").length == 1){
						scheduleId = $(this).attr('data-scheduleId');
						scheduleIds = $(this).text();
						if(scheduleId == 0){
							scheduleDate = '';
							$("#template .item-title .fr").html(scheduleIds);
						}else{
							scheduleDate = $("#te_list li.active").attr('data-date');
							$("#template .item-title .fr").html(scheduleDate + '&nbsp;' + scheduleIds);
						}						
					}else{
						if(paypickType == 1){
							scheduleId.scheduleId_zrps = $(this).attr('data-scheduleId');
							scheduleIds.scheduleIds_zrps = $(this).text();
							if(scheduleId.scheduleId_zrps == 0){
								scheduleDate.scheduleDate_zrps = '';
								$("#template .item-title .fr").html(scheduleIds.scheduleIds_zrps);
							}else{
								scheduleDate.scheduleDate_zrps = $("#te_list li.active").attr('data-date');
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_zrps + '&nbsp;' + scheduleIds.scheduleIds_zrps);
							}
						}else{
							scheduleId.scheduleId_smzq = $(this).attr('data-scheduleId');
							scheduleIds.scheduleIds_smzq = $(this).text();						
							if(scheduleId.scheduleId_smzq == 0){
								scheduleDate.scheduleDate_smzq = '';
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_smzq);
							}else{
								scheduleDate.scheduleDate_smzq = $("#te_list li.active").attr('data-date');
								$("#template .item-title .fr").html(scheduleDate.scheduleDate_smzq + '&nbsp;' + scheduleIds.scheduleIds_smzq);
							}							
						}
					}
					$(".sayimo-mask, .t_box").hide();				
				});
			});	
			$(".sayimo-mask").on('click',function(){
				if($(".ps-info .ps-list").length == 1){
					if(scheduleId == 0){
						scheduleDate = '';
						if(scheduleIds == ''){
							$("#template .item-title .fr").html('您还未选择配送时间');
						}else{
							$("#template .item-title .fr").html(scheduleIds);
						}							
					}else{
						$("#template .item-title .fr").html(scheduleDate + '&nbsp;' + scheduleIds);
					}						
				}else{				
					if(paypickType == 1){						
						if(scheduleId.scheduleId_zrps == 0){
							scheduleDate.scheduleDate_zrps = '';
							if(scheduleIds.scheduleIds_zrps == ''){
								$("#template .item-title .fr").html('您还未选择配送时间');
							}else{
								$("#template .item-title .fr").html(scheduleIds.scheduleIds_zrps);
							}							
						}else{
							$("#template .item-title .fr").html(scheduleDate.scheduleDate_zrps + '&nbsp;' + scheduleIds.scheduleIds_zrps);
						}
					}else{
						if(scheduleId.scheduleId_smzq == 0){
							scheduleDate.scheduleDate_smzq = '';
							if(scheduleIds.scheduleIds_smzq == ''){
								$("#template .item-title .fr").html('您还未选择自取时间');
							}else{
								$("#template .item-title .fr").html(scheduleIds.scheduleIds_smzq);
							}							
						}else{
							$("#template .item-title .fr").html(scheduleDate.scheduleDate_smzq + '&nbsp;' + scheduleIds.scheduleIds_smzq);
						}						
					}
				}
				$(".sayimo-mask, .t_box").hide();
			});			
		}
		
		this.confirmPay = function(){
			if(paypickType == ''){
				$.errtoast('请选择配送方式');
				return;				
			}
			if(paypickType == 1){
				if(receivePeople == ''){
					$.errtoast('请选择收货地址');
					return;
				}				
				if($(".ps-info .ps-list").length == 1){
					if( (identifier == 0 && scheduleIds == '') || (identifier != 0 && identifier.indexOf('MQ') < 0 && scheduleIds == '') ){
						$.errtoast('请选择配送时间');
						return;
					}
				}else{					  
					if( (identifier == 0 && scheduleIds.scheduleIds_zrps == '') || (identifier != 0 && identifier.indexOf('MQ') < 0 && scheduleIds.scheduleIds_zrps == '') ){
						$.errtoast('请选择配送时间');
						return;
					}
				}					
			}else{
				if($(".ps-info .ps-list").length == 1){
					if( (identifier == 0 && scheduleIds == '') || (identifier != 0 && identifier.indexOf('MQ') < 0 && scheduleIds == '') ){
						$.errtoast('请选择自取时间');
						return;
					}
				}else{
					if( (identifier == 0 && scheduleIds.scheduleIds_smzq == '') || (identifier != 0 && identifier.indexOf('MQ') < 0 && scheduleIds.scheduleIds_smzq == '') ){
						$.errtoast('请选择自取时间');
						return;
					}
				}					
			}
			var p_scheduleId = '',p_scheduleIds,p_scheduleDate = '';			
			if($(".ps-info .ps-list").length == 1){
				p_scheduleId = scheduleId;
				p_scheduleIds = scheduleIds;
				p_scheduleDate = scheduleDate;				
			}else{
				if(paypickType == 1){
					p_scheduleId = scheduleId.scheduleId_zrps;
					p_scheduleIds = scheduleIds.scheduleIds_zrps;
					p_scheduleDate = scheduleDate.scheduleDate_zrps;						
				}else{
					p_scheduleId = scheduleId.scheduleId_smzq;
					p_scheduleIds = scheduleIds.scheduleIds_smzq;
					p_scheduleDate = scheduleDate.scheduleDate_smzq;						
				}					
			}									
			leaveWords = $("#leaveWords").val();
			if( leaveWords != '' && !REG.ISNULL.test(leaveWords) ){
				$.errtoast('留言内容为空');
				return;				
			}
			if(pay_type == -1){
				$.errtoast('请选择支付方式');
				return;
			}			
			if(ordersId == null){
				$.showIndicator();
				seckillTimesId == 0 ? seckillTimesId = '' : seckillTimesId = seckillTimesId;
				if(isActivity == 1 && identifier.indexOf('MQ') > 0){
				    var date = new Date(),
			        	df = date.getFullYear(),
			        	dm = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
			        	dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
			        p_scheduleDate = df + '-' + dm + '-' + dd;
			        p_scheduleId = 0;
				}												
				ajax.post('preorders/insertpreorders',{
					"goodsId": goodsId,
					"normsValueId": normsValueId,
					"customerId": customerId,
					"buyNum": Number,
					"leaveWords": leaveWords,
					"pickType": paypickType,
					"scheduleId": p_scheduleId,
					"scheduleDate": p_scheduleDate,
					"isActivity": isActivity,
					"identifier": identifier,
					"seckillTimesId": seckillTimesId
				},'json',function(data){
					if(data.status == 0 && data.errorCode == '400001'){
						$.hideIndicator();
						$.errtoast('库存不足');
						return;
					}
					if(data.status == 0){
						$.hideIndicator();
						$.errtoast('服务器繁忙，请稍后重试');
						return;						
					}					
					ordersId = data.data.ordersId;//订单id
					ajax.get('preorders/preordersdetail/' + customerId + '/' + ordersId,'json',function(data){
						$.hideIndicator();	
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;						
						}						
						walletBalance = data.data.walletBalance;//钱包余额
						ordersTotalMoney = data.data.ordersTotalMoney;//支付总额				
						if(pay_type == 1){
							self.wechat_pay(p_scheduleId,p_scheduleDate);
						}else if(pay_type == 0){
							self.sayimo_pay(p_scheduleId,p_scheduleDate);
						}											
					});					
				});
			}else{
				var s = p_scheduleDate,
					s = s.replace(/-/g,'/');
					i = p_scheduleIds,
					i = i.split('-'),
					i = i[1],
					d = s + ' ' + i,
					date = new Date(d),
					t = date.getTime(),
					cd = Math.round(new Date().getTime());	
				if(t <= cd){
					if(paypickType == 1){
						$.errtoast('配送时间已过期');
					}else{
						$.errtoast('自取时间已过期');
					}				
					return;				
				}				
				if(pay_type == 1){
					self.wechat_pay(p_scheduleId,p_scheduleDate);
				}else if(pay_type == 0){
					self.sayimo_pay(p_scheduleId,p_scheduleDate);
				}				
			}
		}
		
		this.sayimo_pay = function(p_scheduleId,p_scheduleDate){
			$.showIndicator();
			ajax.get('user/existwalletpaypwd/' + customerId,'json',function(data){
				$.hideIndicator();	
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				if(data.data == 0){
					$.confirm('您还未设置支付密码,是否去设置？',function (){
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/password/setPwd.html');
					});
					return;					
				}
				if(ordersTotalMoney * 1 > walletBalance * 1){
					$.errtoast('您的钱包余额不足');
					$('#confirmBuy').addClass('nopay');
					isSufficient = false;
					return;
				}
			    $.modalPassword('请输入支付密码', function (value){
			    	if(value == ''){
			    		$.errtoast("请输入支付密码");
			    		return;
			    	}
					if(!REG.ISNULL.test(value) ){
						$.errtoast('支付密码为空');
						return;				
					}				 
			    	$.showIndicator();
			    	ajax.post("preorders/paypreorders",{
						"orderIds": ordersId,
						"payMoney": ordersTotalMoney,
						"payType": pay_type,
						"customerId": customerId,
						"password": value,
						"leaveWords": leaveWords,
						"pickType": paypickType,
						"scheduleId": p_scheduleId,
						"scheduleDate": p_scheduleDate
			    	},'json',function(data){
		    			$.hideIndicator();
						if(data.status == 0){
							$.hideIndicator();
							var errorCode = require('errorCode');//载入错误码
				    		errorCode(data.errorCode);			    								
							return;
						}			    			
		    			self.succeedCallback();									                    					    		
			    	});		 
			    },function(){});
			});				
		}
		
		this.wechat_pay = function(p_scheduleId,p_scheduleDate){
			$.toast('微信支付开通中...');
		}
		
		this.succeedCallback = function(){
			$.errtoast('支付成功');
            setTimeout(function(){
            	if(soure == 'orders'){window.jsObj.refreshLastPage();}           	
            	window.jsObj.finshCurrentActivity();  
            	if(soure == null){window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/orders/reservedOrders/reservedOrdersList.html?tab=2');}
            },1500);			
		}
		
	}//fun_reservedPay end
	fun_reservedPay();	
});