define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		lazy = require('LazyLoad'),
		search = require('search');
	require('./studentShop-shoplist.css');
	
	window.jsObj.setLoadUrlTitle('学生店铺');
	
	var providerName = '',
		loading = true;
		
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
		loading = true;
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
					htmldata += '<li data-id="' + data[i].providerId +  '"><div>' +
								'<div class="imgBox"><img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></div>' +  
								'<div class="t"><i></i><p class="clamp_2">' + data[i].providerName + '</p></div></div></li>';
				}
				$(".shoplist").html(htmldata);
				lazy.init();//刷新图片懒加载
				$(".shoplist li").each(function(){
					$(this).off('click').on('click',function(){						
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-shopindex.html?providerId=' + $(this).attr('data-id'));
					});
				});									
			}else{
				$(".shoplist").html(base.noList('暂无学生店铺'));
			}
			loading = false;
		});
	}	
	getAjax();
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		getAjax();
		$.pullToRefreshDone('.pull-to-refresh-content');
	});	
	
});