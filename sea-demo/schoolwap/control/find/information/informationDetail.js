define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./informationDetail.css');
	
	base.init();
	base.setTitle('快讯详情');	

	var id = base.getQueryString('id'),
		type = base.getQueryString('type'),	
		api_url = 'base/getnewdetails',
		d=	new Date();
		
	if(type == 1){
		api_url = 'base/getnewdetails/' + id + '/' + type;
	}else if(type == 2){
		api_url = 'base/getnewdetails/' + id + '/' + type;
	}else if(type == 3){
		api_url = 'base/getnewdetails/' + id + '/' + type;
	}
	
	ajax.get(api_url,'json',getDetail);
	
	require('dateFormat');
	
	function getDetail(data){
		if(data.status == 0){
			$('.card').html(base.noList('快讯信息到火星上去了'));
			return;
		}		
		var DetailHtml = '',
			newsDetail = data.data.news;

		base.setTitle(newsDetail.title);
		
		d.setTime(newsDetail.publishDate);
		DetailHtml = '<div class="card-header news-title">' + newsDetail.title + '</div>' + 
						'	<div class="card-content">' +
						'	<div class="DateSource" ><span >' + d.format('yyyy-MM-dd') + '&nbsp;&nbsp;&nbsp;&nbsp;</span>' +
						'	<span>' + newsDetail.source + '</span>' +
						'</div>' +
					'<div class="image-text">' + newsDetail.details + '</div></div>' +
					'<div class="author">本组稿件' + newsDetail.source + '/&nbsp;&nbsp;&nbsp;&nbsp;' + newsDetail.author + '</div>';
		$('.card').html(DetailHtml);
	}
	
});