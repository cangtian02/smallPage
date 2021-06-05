define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./receivingAddressList.css');		
	
	window.jsObj.setLoadUrlTitle('收货地址');
	
	var customerId = window.jsObj.readUserData('id'),
		orderId = base.getQueryString('orderId');
	
	var receivingAddressLength = 0;
	
	//获取收货地址并写入页面
	ajax.get('user/getreceiveaddress/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var htmldata = '',
			readList = data.addresses;
		receivingAddressLength = readList.length;	
		if(readList.length > 0){
			for(var i = 0; i < readList.length; i++){
				var isDefault = '',
					setDefault = '',
					address = '',
					updateAddressBtn = '';
				if(readList[i].isDefault == 1){
					isDefault = '<div class="item-title">默认地址</div>';
					setDefault = 'checked="checked"';
				}else{
					isDefault = '<div class="item-title">设为默认地址</div>';
				}
				if(readList[i].isSchool == 1){
					address = '<span class="red">【校内地址】</span>' + readList[i].address;
				}else{
					address = readList[i].address;
				}
				if(orderId == null){
					updateAddressBtn = '<a class="update" href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/me/receivingAddress/updateReceivingAddress.html?id=' + readList[i].id + '&default=' + readList[i].isDefault + '">'+
				                		'<img src="' + SAYIMO.SRVPATH + 'images/me/update.png" name="updateAddressBtn" data-addressid="' + readList[i].id + '">编辑' + 
				                	'</a>' +
				                	'<a href="javascript:;" class="delAddress" data-addressid="'+readList[i].id+'">'+
				                		'<img src="' + SAYIMO.SRVPATH + 'images/me/delete.png" name="deleteAddressBtn">删除 '+
				                	'</a>';				                	
				}			
				htmldata += '<li>' +
								'<div class="address-top">' +          
									'<span>' + readList[i].receivingPeople + ' </span>' +       
									'<span  class="sayimo-address-span">'+readList[i].telephone+'</span>' +     
								'</div>' +
								'<div class="address-center">' + address +               
								'</div>' +
								'<div class="address-bot">' +
					            '<label class="label-checkbox item-content">' +
					            '<input type="radio" class="my-radio" name="my-radio" ' + setDefault + ' data-addressid="'+ readList[i].id + '" data-isdefault="' + readList[i].isDefault + '" />'+
					            '<div class="item-media"><i class="icon icon-form-checkbox"></i></div>' +
					            '<div class="item-inner">' +
					            	'<div class="item-title-row">' + isDefault+
					            	'</div>' +
					            '</div>' +
					        '</label>' +
					        '<div class="item-after">' + updateAddressBtn + 
				            '</div></div></li>';
			}
			htmldata = '<div class="list-block media-list"><ul>' + htmldata + '</ul></div>';
			if(orderId == null){
				var botbtn = '<div class="auth_button" id="auth_button">确认默认地址</div><div class="auth_button" id="add_button">添加收货地址</div>';
			}else{
				var botbtn = '<div class="auth_button" id="auth_button">确认默认地址</div>';				
			}
			$(".content").html(htmldata + botbtn);			
		}else{
			var botbtn = base.noList('您还未有收货地址');
				botbtn = botbtn + '<div class="auth_button" id="add_button">添加收货地址</div>';			
			$(".content").html(botbtn);	
		}
		control();
	});

	function control(){
		$("#add_button").on('click',function(){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/me/receivingAddress/addReceivingAddress.html?ralength=' + receivingAddressLength);
		});
		$('#auth_button').on('click',function(){
			if($('.my-radio').length > 0){
				var addressid = $("input[name='my-radio']:checked").attr('data-addressid');
				if( typeof(addressid) === 'undefined'){
					$.errtoast('请先选择收货地址');
					return;
				}
				$.showIndicator();
				ajax.post('user/setdefaultreceivingaddress',{
					'id': addressid,
					'isDefault': 1,
					'customerId': customerId
				},'json',function(data){
					if(data.status == 0){					
						$.errtoast('服务器繁忙，请稍后重试');
						return;
					}					
					if(orderId != null && orderId != 'pre'){
						ajax.post('order/addorderreceiveaddress',{'orderIds': orderId,'customerId': customerId},'json',function(data){
							if(data.status == 0){
								$.hideIndicator();
								$.errtoast('服务器繁忙，请稍后重试');
								return;
							}							
							$.hideIndicator();
							$.errtoast('设置成功');
							setTimeout(function(){
								window.jsObj.refreshLastPage();
	    						window.jsObj.finshCurrentActivity(); 								
							},1500);
						});
					}else if(orderId != null && orderId == 'pre'){
						$.hideIndicator();
						$.errtoast('设置成功');
						setTimeout(function(){
							window.jsObj.refreshLastPage();
							window.jsObj.finshCurrentActivity();
						},1500);
					}else{
						$.hideIndicator();
						$.errtoast('设置成功');
						setTimeout(function(){window.location.reload();},1500);
					}										
				});							
			}else{
				$.errtoast('请先选择收货地址');
			}						
		});
		
		$(".list-block li").each(function(){
			$(this).find(".update").on('click',function(){
				window.jsObj.loadContent($(this).attr('data-url'));
			});
			$(this).find(".delAddress").on('click',function(){			
				var _this  = $(this).parents("li"),
					addressid = $(this).attr('data-addressid');
			     $.confirm('确认删除收货地址吗？',
			        function () {
			        	$.showIndicator();
					 	ajax.post('user/deletereceiveaddressbyid',{'id': addressid},'json',function(data){
							if(data.status == 0){
								$.errtoast('服务器繁忙，请稍后重试');
								return;
							}
							$.hideIndicator();
							$.errtoast('删除成功');
							_this.remove();
							if($(".list-block li").length == 0){
								$(".list-block, #auth_button").remove();
								$(".content").prepend(base.noList('您还未有收货地址'));
								receivingAddressLength = 0;
							}							
					 	});
			       }
			      );			
			});
		});
		
	}//control end

});