define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		laz = require('LazyLoad'),
		search = require('search');
	require('./studentShop-shoplist.css');
	require('botbar');
	
	base.setTitle('学生店铺');	
	
	var providerName = '';
	
	search({
		searchId: 'search',//搜索框id
		placeholder: '搜索店铺',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			providerName = v;
			getAjax();
		}//搜索框回调
	});
	
	function getAjax(){
		ajax.get('base/queryallstudentprovider?providerName=' + providerName,'json',function(data){
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}
			data = data.data;
			$("#base_load").hide();
			if(data.length > 0){
				var htmldata = '';
				for(var i = 0; i < data.length; i++){
					htmldata += '<li><a href="' + SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-shopindex.html?providerId=' + data[i].providerId +  '">' +
								'<div class="imgBox"><img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></div>' +  
								'<div class="t"><i></i><p class="clamp_2">' + data[i].providerName + '</p></div></a></li>';
				}
				$(".shoplist").html(htmldata);
				laz.init();//刷新图片懒加载
			}else{
				$(".shoplist").html(base.noList('暂无学生店铺'));
			}
		});
	}
	
	getAjax();
	
});