define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./informationList.css');
	
	base.init();
	base.setTitle('校企快讯');	

	var recordNum = 1,
		loading = false;
	
	function queryList(){
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll-preloader').show();	
		ajax.get('base/getnewlist/1/5/1','json',getNewsList);
	}
	queryList();	
	
	function getNewsList(data){
		if(data.status == 0){
			$('.list-block').html(base.noMent('暂无快讯信息'));
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();			
			return;
		}
		var newsList= data.data.newsList,
			htmldata = '',
			d =	new Date();
		require('dateFormat');	
		if(newsList.length > 0){
			for(var i = 0; i < newsList.length; i++){			
				d.setTime(newsList[i].publishDate);
				var _link = '',photoUrl = '';
				if(newsList[i].type == 1){
					_link = SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + newsList[i].id + '&type=1';
				}else{
					_link = newsList[i].url;
				}
				if(newsList[i].photoUrl == ''){
					photoUrl = '';
				}else{
					photoUrl = '<div class="item-media"><img width="100" height="80" src="' + newsList[i].photoUrl + '"/></div>';
				}
				htmldata+='<li><a class="item-content item-link" href="' + _link + '">' + photoUrl +
				'		<div class="item-inner"><div class="item-title-row"><div class="clamp_2">' + newsList[i].title + '</div></div>' +
				'		<div class="item-title-row timer"><div class="item-title">' + newsList[i].source + '</div>' +
				'		<div class="item-after">' + d.format('yyyy-MM-dd') + '</div></div>' +
				'		</div>' +
				'	</a>' +
				'</li>';
			}
			if(recordNum == 1){
				$('.comment-list').html(htmldata);
			}else{
				$('.comment-list').append(htmldata);
			}			
			if(newsList.length < 10){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();				
			}
		}else{
			if(recordNum == 1){
				$('.list-block').html(base.noMent('暂无快讯信息'));
			}
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();
		}
		loading = false;
	}

	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		recordNum = 1;
		queryList();
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	//无限刷新
	$(document).on('infinite', '.infinite-scroll-bottom',function(){
		if(loading) return;
		loading = true;
		recordNum++;
		queryList();
		$.refreshScroller();
	});

});