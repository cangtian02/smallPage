define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./campusvisitors.css');
	require('./informationList.css');
	require('dateFormat');
	
	window.jsObj.setLoadUrlTitle('创客快讯');

	var pageNow = 1,
		loading = true;
		
	function queryList(type){
		loading = true;
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll-preloader').show();		
		if(type == 0){
			ajax.get('base/getnewlist/' + pageNow + '/10/2','json',getNewsList);
		}else if(type == 1){
			ajax.get('base/getnewlist/' + pageNow + '/10/3','json',getNewsList);
		}
	}
	queryList(0);

	function getNewsList(data){
		var _noment = '';
		$('.tab.active').index() == 0 ? _noment = '暂无需求信息' : _noment = '暂无快讯信息';
		if(data.status == 0){			
			$('.tab.active .list-block ul').html(base.noMent(_noment));
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();			
			return;
		}
		data = data.data.newsList;
		var	htmldata = '', d = new Date();			
		if(data.length > 0){
			for(var i = 0; i < data.length; i++){			
				d.setTime(data[i].publishDate);
				var _url = '',photoUrl = '';
				if(data[i].type == 1){
					_url = SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + data[i].id + '&type=' + (parseInt($('.tab.active').index()) + 2);
				}else{
					_url = data[i].url;
				}
				if(data[i].photoUrl == ''){
					photoUrl = '';
				}else{
					photoUrl = '<div class="item-media"><img src="' + data[i].photoUrl + '"/></div>';
				}
				htmldata += '<li data-url = "' + _url + '"><div class="item-content item-link">' + photoUrl +
				'		<div class="item-inner"><div class="item-title-row"><div class="clamp_2">' + data[i].title + '</div></div>' +
				'		<div class="item-title-row"><div class="item-title">' + data[i].source + '</div>' +
				'		<div class="item-after">' + d.format('yyyy-MM-dd') + '</div></div>' +
				'		</div>' +
				'	</div>' +
				'</li>';
			}
			if(pageNow == 1){
				$('.tab.active .list-block ul').html(htmldata);
			}else{
				$('.tab.active .list-block ul').append(htmldata);
			}			
			if(data.length < 10){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();				
			}
			$(".list-block ul li").each(function(){
				$(this).off('click').on('click',function(){			
					window.jsObj.loadContent($(this).attr('data-url'));
				});
			});	
		}else{
			if(pageNow == 1){
				$('.tab.active .list-block ul').html(base.noMent(_noment));
			}
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();
		}
		if(!$(".tab-link.active").hasClass('cur')){
			$(".tab-link.active").addClass('cur');
		}
		loading = false;
	}

	$('.tab-link').each(function(){
		$(this).on('click',function(){
			if($(this).hasClass('cur') == false){
				queryList($(this).index());
			}
		});	
	});

	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		if(loading) return;
		pageNow = 1;
		queryList($('.tab.active').index());
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	//无限刷新
	$(document).on('infinite', '.infinite-scroll-bottom',function(){
		if(loading) return;
		pageNow++;
		queryList($('.tab.active').index());
		$.refreshScroller();
	});
	
});