define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./informationDetail.css');
	
	var id = base.getQueryString('id'),
		type = base.getQueryString('type'),
		d=	new Date();
	
	require('dateFormat');
	ajax.get('base/getnewdetails/' + id + '/' + type,'json',function(data){
		if(data.status == 0){
			$('.card').html(base.noList('快讯信息到火星上去了'));
			return;
		}		
		var DetailHtml = '',newsDetail = data.data.news;
		window.jsObj.setLoadUrlTitle(newsDetail.title);		
		d.setTime(newsDetail.publishDate);
		DetailHtml = '<div class="card-header news-title">' + newsDetail.title + '</div>' + 
						'	<div class="card-content">' +
						'	<div class="DateSource" ><span >' + d.format('yyyy-MM-dd') + '&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
						'	<span>' + newsDetail.source + '</span>' +
						'</div>' +
					'<div class="image-text">' + newsDetail.details + '</div></div>' +
					'<div class="author">本组稿件' + newsDetail.source + '/&nbsp;&nbsp;&nbsp;&nbsp;' + newsDetail.author + '</div>';
		$('.card').html(DetailHtml);		
	});
});