define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./informationList.css');
		
	window.jsObj.setLoadUrlTitle('校企快讯');
	
	var pageNow = 1,
		loading = true;
	
	function queryList(){
		loading = true;
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll-preloader').show();	
		ajax.get('base/getnewlist/' + pageNow + '/10/1','json',getNewsList);
	}
	queryList();	
	
	function getNewsList(data){
		if(data.status == 0){
			$('.list-block ul').html(base.noMent('暂无快讯信息'));
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();			
			return;
		}
		data= data.data.newsList;
		var	htmldata = '', d = new Date();
		require('dateFormat');	
		if(data.length > 0){
			for(var i = 0; i < data.length; i++){			
				d.setTime(data[i].publishDate);
				var _link = '',photoUrl = '';
				if(data[i].type == 1){
					_link = SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + data[i].id + '&type=1';
				}else{
					_link = data[i].url;
				}
				if(data[i].photoUrl == ''){
					photoUrl = '';
				}else{
					photoUrl = '<div class="item-media"><img src="' + data[i].photoUrl + '"/></div>';
				}
				htmldata+='<li data-url="' + _link + '"><div class="item-content item-link">' + photoUrl +
				'		<div class="item-inner"><div class="item-title-row"><div class="clamp_2">' + data[i].title + '</div></div>' +
				'		<div class="item-title-row"><div class="item-title">' + data[i].source + '</div>' +
				'		<div class="item-after">' + d.format('yyyy-MM-dd') + '</div></div>' +
				'		</div>' +
				'	</div>' +
				'</li>';
			}
			if(pageNow == 1){
				$('.list-block ul').html(htmldata);
			}else{
				$('.list-block ul').append(htmldata);
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
				$('.list-block ul').html(base.noMent('暂无快讯信息'));
			}
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();
		}
		loading = false;
	}

	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		if(loading) return;
		pageNow = 1;
		queryList();
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	//无限刷新
	$(document).on('infinite', '.infinite-scroll-bottom',function(){
		if(loading) return;
		pageNow++;
		queryList();
		$.refreshScroller();
	});

});