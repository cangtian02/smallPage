define(function(require) {	
	require('./bottombar.css');	
	var menu = [
		{
			'name': '首页',
			'url': SAYIMO.SRVPATH + 'view/home/home.html',
			'class': 'icon-home'			
		},
		{
			'name': '学生店铺',
			'url': SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-shoplist.html',
			'class': 'icon-store'			
		},
		{
			'name': '发现',
			'url': SAYIMO.SRVPATH + 'view/find/find.html',
			'class': 'icon-find'			
		},
		{
			'name': '购物车',
			'url': SAYIMO.SRVPATH + 'view/shoppingcart/shoppingcart.html',
			'class': 'icon-cart'			
		},
		{
			'name': '我',
			'url': SAYIMO.SRVPATH + 'view/me/me.html',
			'class': 'icon-me'			
		}
	];		
	var menuHtml = '',
		cookie = require('cookie');			
	for(var i = 0; i < menu.length; i++){
	    if(SAYIMO.SERVLETPATH.indexOf(menu[i].url) < 0){
	    	var customerId = cookie.getCookie('customerId');
			if(customerId == '' || customerId == 'undefined' || customerId == null){
				menuHtml += '<a class="tab-item isLogin" href="javascript:;">';
			}else{
				menuHtml += '<a class="tab-item isHref" href="javascript:;">';
			}
	    }else{
	    	menuHtml += '<a class="tab-item active" href="javascript:;">';
	    }
	    menuHtml += '<span class="icon ' + menu[i].class + '"></span>';
	    menuHtml += '<span class="tab-label">' + menu[i].name + '</span>';
	    menuHtml += '</a>';
	}	
	menuHtml = '<nav class="bar bar-tab footer-nav">' + menuHtml + '</nav>'; 	
	$(".page").prepend(menuHtml);
	$('.footer-nav a').on('click',function(){
		var _i = $(this).index();
		if($(this).hasClass('isLogin')){
			$.errtoast('请点击登入');
		}else if($(this).hasClass('isHref')){
			window.location.href = menu[_i].url;
		}
	});
});