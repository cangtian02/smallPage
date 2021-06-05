define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./campusvisitors.css');
	require('dateFormat');
	
	base.init();
	base.setTitle('创客快讯');

	var tab = (base.getQueryString('tab') == null) ? 1 : base.getQueryString('tab');
	base.getActiveTab(tab);

	var recordNum = 1,
		type = tab,
		loading = false;
		
	function queryList(type){
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll-preloader').show();		
		if(type == 1){
			ajax.get('base/getnewlist/1/5/2','json',getNewsList);
		}else if(type == 2){
			ajax.get('base/getnewlist/1/5/3','json',getNewsList);
		}
	}

	queryList(tab);

	$('.tab-link').each(function(){
		$(this).on('click',function(){
			if($(this).hasClass('cur') == false){
				type = $(this).index() + 1;
				queryList(type);
			}
		});	
	});

	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		recordNum = 1;
		queryList($('.tab.active').index() + 1);
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	//无限刷新
	$(document).on('infinite', '.infinite-scroll-bottom',function(){
		if(loading) return;
		loading = true;
		recordNum++;
		queryList($('.tab.active').index() + 1);
		$.refreshScroller();
	});
	
	function getNewsList(data){
		var _noment = '';
		type == 1 ? _noment = '暂无快讯信息' : _noment = '暂无需求信息';
		if(data.status == 0){			
			$('.tab.active').html(base.noMent(_noment));
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();			
			return;
		}
		var newsList= data.data.newsList,
			htmldata = '',
			d =	new Date();			
		if(newsList.length > 0){
			for(var i = 0; i < newsList.length; i++){			
				d.setTime(newsList[i].publishDate);
				var _link = '',photoUrl = '';
				if(newsList[i].type == 1){
					_link = SAYIMO.SRVPATH + 'view/find/information/informationDetail.html?id=' + newsList[i].id + '&type=' + (parseInt(type) + 1);
				}else{
					_link = newsList[i].url;
				}
				if(newsList[i].photoUrl == ''){
					photoUrl = '';
				}else{
					photoUrl = '<div class="item-media"><img width="100" height="80" src="' + newsList[i].photoUrl + '"/></div>';
				}
				htmldata+='<li data-link = "' + _link + '"><a class="item-content item-link" href="javascript:;">' + photoUrl +
				'		<div class="item-inner"><div class="item-title-row"><div class="clamp_2">' + newsList[i].title + '</div></div>' +
				'		<div class="item-title-row timer"><div class="item-title">' + newsList[i].source + '</div>' +
				'		<div class="item-after">' + d.format('yyyy-MM-dd') + '</div></div>' +
				'		</div>' +
				'	</a>' +
				'</li>';
			}
			if(recordNum == 1){
				$('.tab.active .comment-list').html(htmldata);
			}else{
				$('.tab.active .comment-list').append(htmldata);
			}			
			if(newsList.length < 10){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();				
			}
			classfun();
		}else{
			if(recordNum == 1){
				$('.tab.active').html(base.noMent(_noment));
			}
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();
		}
		if($(".tab-link.active").hasClass('cur') == false){
			$(".tab-link.active").addClass('cur');
		}
		loading = false;
	}

	function classfun(){//dom点击改变无刷新改变url记录数据
		$(".comment-list li").each(function(){
			$(this).on('click',function(e){						
				var deail = $(this).attr('data-link'),
					i = $('.tab.active').index() + 1,
					list = SAYIMO.SRVPATH + 'view/find/information/campusvisitors.html?tab=' + i;
				window.history.replaceState({title: "",url: ''}, "创客快讯", list);
				setTimeout(function(){
					window.location.href = deail;
				},50);
			});
		});		
	}//classfun end
	
});