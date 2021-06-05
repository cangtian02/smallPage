define(function(require, exports, module){
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');		
	require('./vote-list.css');	
	
	base.init();
	base.setTitle('投票列表');
	
	ajax.get('base/listcommonvote','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		if(data.length == 0){
			$('.content').html(base.noMent('暂无信息'));
			return;
		}	
		var laz = require('LazyLoad');	
		require('dateFormat');//处理时间戳模块			
		var htmldata = '';
		for(var i = 0; i < data.length; i++){
			var d = Math.round(new Date().getTime()),// 当前时间戳
				s = new Date(),
				e = new Date();				
			s.setTime(data[i].startDate);
			e.setTime(data[i].endDate);			
			var _text = '',_class = '',_detail = '';
			if(d < data[i].startDate){
				_text = '【待开始】';
				_class = 1;
			}
			if(d > data[i].startDate && d < data[i].endDate){
				_text = '【已开始】';
				_class = 2;
			}
			if(d > data[i].endDate){
				_text = '【已结束】'; 
				_class = 3;
			}
			htmldata += '<li>' +
						'	<a href="' + SAYIMO.SRVPATH + 'view/activity/vote/vote-index.html?id=' + data[i].voteSubmissionId + '&identifier=' + data[i].identifier + '">' +
						'		<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' +
						'		<div class="r">' +
						'			<p class="z z_' + _class + '">' + _text + '</p>' +
						'			<p class="t clamp_2">' + data[i].subName + '</p>' +
						'			<p class="d">' + s.format('yyyy-MM-dd') + ' 至 ' + e.format('yyyy-MM-dd') + '</p>' +
						'		</div>' +
						'	</a>' +
						'</li>';						
		}			
		$('.content').html('<ul class="ckdsList">'+ htmldata + '</ul>');
		laz.init();// 刷新图片懒加载
	});
	
});