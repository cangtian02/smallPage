define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./mustRead.css');
	
	base.init();
	base.setTitle('会员必读');		
	
	var Members_read = (base.getQueryString('mark') == null) ? 'Members_read' : base.getQueryString('mark');

	ajax.get('user/getmembersmustread/' + Members_read,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;					
		}
		var htmldata = '',
			readList = data.data.memberMustReadList;
		if(readList.length > 0){
			var title = '';
			for(var i = 0; i < readList.length; i++){
				title = '';			
				if(readList[i].showType == 'image'){
					title = '<span class="w ellipsis">' + readList[i].title + '</span><span class="more"></span>';
				}else if(readList[i].showType == 'news'){
					title = '<a href="' + readList[i].materailUrl + '"><span class="w ellipsis">' + readList[i].title + '</span><span class="more"></span></a>';
				}else if(readList[i].showType == 'text'){
					title = '<a href="' + readList[i].urlPath + '"><span class="w ellipsis">' + readList[i].title + '</span><span class="more"></span></a>';
				}						
				htmldata += '<li>' +
							'	<div class="t">' + title + '</div>' + 
							'	<div class="i">' + readList[i].details + '</div>' + 
							'</li>';
			}
			htmldata = '<ul class="list">' + htmldata + '</ul>';
			$(".content").append(htmldata);
			$(".list li").each(function(){
				$(this).on('click',function(){
					if($(this).find('a').length == 0){
						$(this).toggleClass('show');
					}
				});
			});
		}else{
			$(".content").append(base.noList('暂无信息'));
		}		
	});
	
});