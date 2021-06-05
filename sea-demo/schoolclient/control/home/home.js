define(function(require, exports) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax'),
		lazy = require('LazyLoad');
	require('./home.css');

	function addSearch(){
		var htmldata = '<div class="searchbar">' +
					    '   <div class="search-input">' + 
					    '    	<form onSubmit="return searchform(\'search\')">' +
						'        	<input type="search" placeholder="请输入您要找的商品名称" id="search" >' +
						'        	<input type="submit" value="" />' +
						'        	<label class="icon icon-search"></label>' +
						'         </form>' +
					    '    </div>' +
				        '	<ul class="searchList" id="searchList"></ul>' +	        
				      	'</div>';			
		$(".page").prepend(htmldata);
					
		this.searchform = function(f){			
			var id = $('#' + f),
				val = id.val();
			if(val == '' || val == 'undefined'){
				$.errtoast("请输入搜索内容");
			}else{
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/search/search.html?goodsName=' + encodeURIComponent(encodeURIComponent(val)));			
			}
			return false;
		}
	
		var search = require('search');
		search({
			searchId: 'search',
			searchListId: 'searchList',
			goodsType: '1',
			searchListCall: function(val){
				window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/search/search.html?goodsName=' + val);				
			}
		});	
	}
	
	addSearch();	
	
	var loading = true;
	
	function getAjax(){
		loading = true;
		ajax.get('goods/getindextemplate?identifier=HOME_APP_MODEL','json',function(data){
			if(data.status == 0){
				$('.content').base.noList('页面正在路上,敬请期待');
				return;
			}
			$(".homeBox").html('');
			iPlayer(data.data);
			loading = false;
		});
	}

	function domList(data){
		var Url = '',
			data = data.photos,
			list = [];	
		for(var i = 0; i < data.length; i++){		
			if(data[i].type != -1){
				if(data[i].type == 1){
					if(data[i].goodsClassId == 'undefined' || data[i].goodsClassId == ''){
						Url = SAYIMO.SRVPATH + 'view/home/home.html';
					}else{
						Url = SAYIMO.SRVPATH + 'view/class/classById.html?id=' + data[i].goodsClassId;
					}				
				}else if(data[i].type == 2){
					if(data[i].goods.goodsId == 'undefined' || data[i].goods.goodsId == ''){
						Url = SAYIMO.SRVPATH + 'view/home/home.html';
					}else{
						Url = SAYIMO.SRVPATH + 'view/class/goodsDetail.html?id=' + data[i].goods.goodsId;
					}
				}else if(data[i].type == 3){
					Url = data[i].redirectUrl;
				}
				list.push({'url': Url,'photoUrl': data[i].photoUrl});
			}
		}
		return list;
	}
	
	function iPlayer(data){
		var d = data[0],
			list = domList(d),
			htmldata = '';
		for(var i = 0; i < list.length; i++){
			htmldata += '<li><a href="javascript:;" data-url="' + list[i].url + '"><img src="' + list[i].photoUrl + '" /></a></li>';
		}	
		htmldata = '<div class="slide-container"><ul class="slide-main">'+ htmldata + '</ul><ul class="slide-pagination"></ul></div>';
		$(".homeBox").append(htmldata);
		var Slide = require('slide');
		Slide = new Slide();		
		iClass(data);
	}	

	function iClass(data){
		var d = data[1],
			list = domList(d),
			htmldata = '';
		for(var i = 0; i < list.length; i++){
			htmldata += '<li class="iClass col-25 tc"><a href="javascript:;" data-url="'+ list[i].url + '"><img src="' + list[i].photoUrl + '" /></a></li>';
		}	
		htmldata = '<ul class="iClass row no-gutter bgf">'+ htmldata + '</ul><div class="iNews bgf" id="iNews"><div class="cont"><ul></ul></div></div>';
		$(".homeBox").append(htmldata);
		index(data);
		ajax.get('base/getnewlist/1/5/1','json',iNews);
	}
	
	function index(data){
		for(var j = 2; j < data.length; j++){
			if(j != 2 && j != 4){
				var list = domList(data[j]),
					htmldata = '';
				for(var i = 0; i < list.length; i++){
					htmldata += '<li><a href="javascript:;" data-url="' + list[i].url + '"><img class="lazy" data-lazyload="' + list[i].photoUrl + '"src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /></a></li>';
				}			
				if(j == 8){
					htmldata = '<ul class="iEntry iEntry-' + j + ' clearfix"><div class="iTitle">校园精品</div>'+ htmldata + '</ul>';
				}else{
					htmldata = '<ul class="iEntry iEntry-' + j + ' clearfix">'+ htmldata + '</ul>';
				}		
				$(".homeBox").append(htmldata);
				lazy.init();
			}
		}
	}	

	function iNews(data){
		if(data.status == 0){return;}
		data = data.data.newsList;			
		if(data.length > 0){
			$("#iNews").show();
			var htmldata = '',
				l = (data.length > 5) ? 5 : data.length;
			for(var i = 0; i < l; i++){
				htmldata += '<li><a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + data[i].id + '&type=1" class="ellipsis">' + data[i].title + '</a></li>';
			}		
		}
		$("#iNews ul").append(htmldata);		
		var dom = $("#iNews ul"),
			li = dom.find("li"),
			liH = li.height(),
			len = li.length,
			i = 0;
		if(len > 1){	
			dom.append(dom.html());
			function iNewsPlay(){
				i++;
				dom.addClass('active');
				dom.css('top', -(i * liH));
				setTimeout(function(){
					dom.removeClass('active');					
					if(i > len - 1){
						i = 0;
						dom.css('top','0');						
					}
				},500);
				setTimeout(iNewsPlay,2000);
			}			
			iNewsPlay();
		}		
	}

	getAjax();
	
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		getAjax();
		$.pullToRefreshDone('.pull-to-refresh-content');
	});
	
	$(document).on('click','a',function(){
		window.jsObj.loadContent($(this).attr('data-url'));
	});
		
});