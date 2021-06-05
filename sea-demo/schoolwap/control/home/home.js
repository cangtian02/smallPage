define(function(require, exports,module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./home.css');
	require('botbar');
	
	base.init();
	base.setTitle('首页');	

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
				window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + encodeURIComponent(encodeURIComponent(val));			
			}
			return false;
		}

		var search = require('search');
		search({
			searchId: 'search',
			searchListId: 'searchList',
			goodsType: '1',
			searchListCall: function(val){
				window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + val;				
			}
		});	
	}
	addSearch();	

	ajax.get('goods/getindextemplate','json',function(data){
		if(data.status == 0){
			$.errtoast('页面正在路上,敬请期待');
			return;
		}
		iPlayer(data.data);
	});

	function domList(data){
		var Url = '',
			data = data.photos,
			list = [];	
		for(var i = 0; i < data.length; i++){		
			if(data[i].type != -1){
				if(data[i].type == 1){
					if(data[i].goodsClassId == 'undefined' || data[i].goodsClassId == ''){
						Url = SAYIMO.SRVPATH + 'home/home.html';
					}else{
						Url = SAYIMO.SRVPATH + 'view/class/classGoodsById.html?id=' + data[i].goodsClassId;
					}				
				}else if(data[i].type == 2){
					if(data[i].goods.goodsId == 'undefined' || data[i].goods.goodsId == ''){
						Url = SAYIMO.SRVPATH + 'home/home.html';
					}else{
						Url = SAYIMO.SRVPATH + 'view/class/goodsDetail.html?id=' + data[i].goods.goodsId;
					}
				}else if(data[i].type == 3){
					Url = data[i].redirectUrl;
				}
				list.push({'url':Url,'photoUrl':data[i].photoUrl});
			}
		}
		return list;
	}
	
	function iPlayer(data){
		var d = data[0],
			list = domList(d),
			htmldata = '';
		for(var i = 0; i < list.length; i++){
			htmldata += '<li><a href="' + list[i].url + '"><img src="' + list[i].photoUrl + '" /></a></li>';
		}	
		htmldata = '<div class="slide-container"><ul class="slide-main">'+ htmldata + '</ul><ul class="slide-pagination"></ul></div>';
		$(".content").append(htmldata);
		var Slide = require('slide');
		Slide = new Slide();
		iClass(data);
	}	

	function iClass(data){
		var d = data[1],
			list = domList(d),
			htmldata = '';
		for(var i = 0; i < list.length; i++){
			htmldata += '<li class="iClass col-25"><a href="'+ list[i].url + '"><img src="' + list[i].photoUrl + '" /></a></li>';
		}	
		htmldata = '<ul class="iClass row no-gutter">'+ htmldata + '</ul><div class="iNews" id="iNews"><div class="cont"><ul></ul></div></div>';
		$(".content").append(htmldata);
		index(data);
		ajax.get('base/getnewlist/1/5/1','json',iNews);
	}
	
	var laz = require('LazyLoad');
	
	function index(data){
		for(var j = 2; j < data.length; j++){
			if(j != 2 && j != 4){
				var list = domList(data[j]),
					htmldata = '';
				for(var i = 0; i < list.length; i++){
					htmldata += '<li><a href="' + list[i].url + '"><img class="lazy" data-lazyload="' + list[i].photoUrl + '"src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></a></li>';
				}			
				if(j == 8){
					htmldata = '<ul class="iEntry iEntry-' + j + ' clearfix"><div class="iTitle">校园精品</div>'+ htmldata + '</ul>';
				}else{
					htmldata = '<ul class="iEntry iEntry-' + j + ' clearfix">'+ htmldata + '</ul>';
				}		
				$(".content").append(htmldata);
				laz.init();
			}
		}
	}	

	function iNews(data){
		base.setCss('.iNews:before{background: url(' + SAYIMO.SRVPATH + 'images/default/icon_news.png) left center no-repeat;background-size: contain;}');
		if(data.status == 0){return;}data = data.data;
		var htmldata = '', data = data.newsList;
		if(data == ''){
			$("#iNews").hide();		
		}else{
			var datalen = (data.length > 5) ? 5 : data.length;
			for(var i = 0; i < datalen; i++){
				var _link = '';
				if(data[i].type == 1){
					_link = SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + data[i].id + '&type=1';
				}else{
					_link = data[i].url;
				}				
				htmldata += '<li><a href="' + _link + '" class="ellipsis">' + data[i].title + '</a></li>';
			}		
		}
		$("#iNews ul").append(htmldata);
		require('animate');
		var dom = $("#iNews ul"),
			li = dom.find("li"),
			liH = li.height(),
			len = li.length,
			i = 0;
		if(len > 1){	
			dom.append(dom.html());
			function play(){				
				dom.animate({top: "-" + i * liH + "px"},500,"linear",function(){
					if(i > len - 1){
						i = 1;
						dom.css({"top": "0"});
					}else{
						i++;
					}
					setTimeout(play,2000);
				});
			}
			play();
		}		
	}

});