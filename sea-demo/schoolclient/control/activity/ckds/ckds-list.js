define(function(require, exports, module){
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');		
	require('./ckds-list.css');	
	
	window.jsObj.setLoadUrlTitle('创客大赛');
	
	ajax.get('base/gamelist','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		if(data.length == 0){
			$('.content').html(base.noMent('暂无信息'));
			return;
		}	
		var lazy = require('LazyLoad');	
		require('dateFormat');
		var htmldata = '';
		for(var i = 0; i < data.length; i++){
			var d = Math.round(new Date().getTime()),// 当前时间戳
				s = new Date(),
				e = new Date();				
			s.setTime(data[i].applyStartDate);
			e.setTime(data[i].applyEndDate);			
			var _text = '',_class = '',_detail = '';
			if(d < data[i].applyStartDate){
				_text = '【待开始】';
				_class = 1;
			}
			if(d > data[i].applyStartDate && d < data[i].applyEndDate){
				_text = '【已开始】';
				_class = 2;
			}
			if(d > data[i].applyEndDate){
				_text = '【已结束】'; 
				_class = 3;
			}
			if(data[i].type == '1'){
				_detail = 'ckds-index.html';
			}else{
				_detail = 'ckds-cyds.html';
			}
			htmldata += '<li>' +
						'	<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/activity/ckds/' + _detail + '?id=' + data[i].id + '&identifier=' + data[i].identifier + '">' +
						'		<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
						'		<div class="r">' +
						'			<p class="z z_' + _class + '">' + _text + '</p>' +
						'			<p class="t clamp_2">' + data[i].activityName + '</p>' +
						'			<p class="d">' + s.format('yyyy-MM-dd') + ' 至 ' + e.format('yyyy-MM-dd') + '</p>' +
						'		</div>' +
						'	</a>' +
						'</li>';
		}			
		$('.content').html('<ul class="ckdsList">'+ htmldata + '</ul>');
		lazy.init();// 刷新图片懒加载
		$(".ckdsList li").each(function(){
			$(this).find('a').off('click').on('click',function(){						
				window.jsObj.loadContent($(this).attr('data-url'));
			});
		});			
	});

});