define(function(require, exports, module){
	require('./search.css');	
	function search(settings){

		this.settings = {
			searchId: '',//搜索框id
			placeholder: '',
			searchListId: '',//搜索提示id
			searchType: '',//搜索dom格式 p：公共格式
			goodsType: '',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
			classID: '',//商品分类id
			isOpensugges: true,//是否开启模糊搜索提示
			searchCall: new Object,//搜索框回调
			searchListCall: new Object//搜索内容回调
		};		
		$.extend(this.settings,settings || {});
		
		if(settings.searchType == 'p'){
			var htmldata = '<div class="bar bar-search">' +
							'    <div class="searchbar">' +
							'	    <a class="searchbar-cancel">取消</a>' +
							'	    <div class="search-input">' +
							'	    	<form onsubmit="return searchform(\'search\');">' +
							'	    		<label class="icon icon-search" for="search"></label>' +
							'		    	<input type="search" placeholder="' + settings.placeholder + '" id="search" >' +
							'	        	<input type="submit" value="" />' +		        	
							'	        </form>' +				    	
							'	    </div>' +
							'	    <ul class="searchList" id="searchList"></ul>' +
							'   </div>' +			   
						  	'</div>';	      						      	
			$(".page").prepend(htmldata);			
			
			this.searchform = function(){
				$(".content").removeClass('showafter');
				$('#' + settings.searchListId).hide();						
				settings.searchCall( encodeURIComponent(encodeURIComponent($('#' + settings.searchId).val())));							
				return false;
			}			
		}
		
		if(typeof(settings.isOpensugges) == 'undefined'){
			$('#' + settings.searchId).on('click',function(){			
				$('#' + settings.searchListId).show();
				if($('#' + settings.searchListId).html() != ''){
					$(".content").addClass('showafter');
				}			
			});
			$('#' + settings.searchId).bind('input input',function(){
				var goodsName = $('#' + settings.searchId).val();
				if(goodsName != ''){
					var ajax = require('ajax');
					var classID = settings.classID == undefined ? '' : settings.classID;
					ajax.get('goods/suggestgoodssearch?goodsName=' + encodeURIComponent(encodeURIComponent(goodsName)) + '&Type=' + settings.goodsType + '&classId=' + classID,'json',function(data){
						if(data.status == 1){
							$(".content").addClass('showafter');
							data = data.data;
							if(data.length > 0){
								var h = '';
								for(var i = 0; i < data.length; i++){
									h += '<li class="ellipsis">' + data[i] + '</li>';
								}
								$('#' + settings.searchListId).html(h);
								$('#' + settings.searchListId).find("li").each(function(){
									$(this).on('click',function(){
										$('#' + settings.searchListId).hide();
										$(".content").removeClass('showafter');
										settings.searchListCall( encodeURIComponent(encodeURIComponent($(this).text())) );							
									});
								});
							}						
						}
					});
				}
			});
			$(".content").on('click',function(){
				$('#' + settings.searchListId).hide();
				$(this).removeClass('showafter');
			});
		}
	}
	module.exports = search;
});