define(function(require, exports, module) {
	require('./buybar.css');	
	function buybar(settings){		
		var defaults = {
			setCont: '',//载入dom div-class
			isSspc: '',//是否显示加入购物车 true显示 false不显示
			isCollection: '',//1已收藏  2未收藏
			addOrdersText: '',//购买按钮文字
			serviceCall: new Object,//客服回调
			collectCall: new Object,//收藏回调
			shoppingcartCall: new Object,//购物车回调
			addOrdersCall: new Object//购买回调
		}		
		this.settings = $.extend(defaults,settings);					
		var shoppingcartDom = '';
		if(settings.isSspc == true){
			shoppingcartDom = '<div class="btn-gwc" id="addShoppingCart">加入购物车</div>';
		}		
		var htmldata = '<nav class="bar bar-tab">' + 
						'	<div class="l">' + 
						'		<div class="btn boxflex">' + 
						'			<div class="btn-kf" id="service"><span class="sayimo-icon sayimo-icon-service"></span><span>客服</span></div>' + 
						'			<div class="btn-sc" id="collect"><span class="sayimo-icon sayimo-icon-collect"></span><span class="t">收藏</span></div>' + 
						'		</div>' + 
						'	</div>' + 
						'	<div class="r">' + 
						'		<div class="btn boxflex">' + shoppingcartDom +
						'			<div class="btn-ljgm" id="addOrders">' + settings.addOrdersText + '</div>' + 
						'		</div>' + 
						'	</div>' + 
						'</nav>';		
		$(settings.setCont).prepend(htmldata);		
		if(settings.isCollection == 1){
			$("#collect .sayimo-icon-collect").addClass('active');
			$("#collect .t").text('已收藏');
		}else{
			$("#collect .t").text('收藏');
		}		
		$('#service').on('click',function(){
			settings.serviceCall();							
		});//客服回调		
		$('#collect').on('click',function(){
			settings.collectCall();							
		});//收藏回调			
		$('#addShoppingCart').on('click',function(){
			settings.shoppingcartCall();							
		});//添加购物车回调	
		$('#addOrders').on('click',function(){
			settings.addOrdersCall();							
		});//加入购物车回调		
	}
	module.exports = buybar;
});