define(function(require, exports, module) {
	require('./payManner.css');
	function payManner(d,f){
		var htmldata = '<div class="payManner">' +
						'<p>选择支付方式：</p>' +
						'<div class="list-block media-list">' +
						'   <ul>' +
						'      	<li>' +
						'       	<div class="item-content">' +
						'        		<div class="item-media"><img src="' + SAYIMO.SRVPATH + 'images/default/icon_wei_pay.png"></div>' +
						'          		<div class="item-inner">' +
						'	            	<div class="item-title-row">' +
						'	              		<div class="item-title">微信支付</div>' +
						'	            	</div>' +
						'	            	<div class="text">微信安全支付</div>' +
						'	            	<div class="cir"></div>' +
						'	            	<img src="' + SAYIMO.SRVPATH + 'images/default/cur_select.png" class="current" data-type="1" />' +
						'         		</div>' +
						'        	</div>' +
						'      	</li>' +
						'      	<li>' +
						'       	<div class="item-content">' +
						'        		<div class="item-media"><img src="' + SAYIMO.SRVPATH + 'images/default/icon_zhifubao_pay.png"></div>' +
						'          		<div class="item-inner">' +
						'	            	<div class="item-title-row">' +
						'	              		<div class="item-title">支付宝支付</div>' +
						'	            	</div>' +
						'	            	<div class="text">支付宝安全支付</div>' +
						'	            	<div class="cir"></div>' +
						'	            	<img src="' + SAYIMO.SRVPATH + 'images/default/cur_select.png" class="current" data-type="2" />' +
						'         		</div>' +
						'        	</div>' +
						'      	</li>' +						
						'      	<li>' +
						'        	<div class="item-content">' +
						'        		<div class="item-media"><img src="' + SAYIMO.SRVPATH + 'images/default/icon_say_pay.png"></div>' +
						'          		<div class="item-inner">' +
						'	            	<div class="item-title-row">' +
						'	              		<div class="item-title">钱包支付</div>' +
						'	            	</div>' +
						'	            	<div class="text">使用账户钱包余额支付</div>' +
						'	            	<div class="cir"></div>' +
						'	            	<img src="' + SAYIMO.SRVPATH + 'images/default/cur_select.png" class="current" data-type="0" />' +
						'         		</div>' +
						'        	</div>' +
						'      	</li>' +				      	
						'    </ul>' +
						'</div>' +		
					'</div>';
		$(d).append(htmldata);
		$(".payManner li").each(function(){
			$(this).on('click',function(){
				$(this).find('.current').css('display','block');
				$(this).siblings('li').find('.current').css('display','none');
				var type = $(this).find('.current').attr('data-type');
				f(type);
			});
		});//选择支付方式		
	}
	module.exports = payManner;
});