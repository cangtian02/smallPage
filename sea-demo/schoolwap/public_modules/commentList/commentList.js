define(function(require, exports, module) {
	require('./commentList.css');
	function commentList(data){
		var htmldata = '',
			appendComment = '',
			photoUrl = '',
			gdata = data,
			d =	new Date(),
			Level = '';
		require('dateFormat');	
		for(var i = 0;i<gdata.length;i++){
			Level = '';
			appendComment = '';
			photoUrl = '';
			d.setTime(gdata[i].createTime);
			if(gdata[i].commentLevel > 0){
				for(var j = 0; j < gdata[i].commentLevel; j++){
					Level += '<img src="' + SAYIMO.SRVPATH + 'images/default/star.png" />';
				}
				Level = '<div class="star">' + Level + '</div>';
			}
			if(gdata[i].appendComment.length>0){
				if(gdata[i].appendComment[0].type == 0){
					gdata[i].appendComment[0].refUser = '系统';
				}
				appendComment = '<ol>'+
								'	<div><font class="red">' + gdata[i].appendComment[0].refUser + '&nbsp;回复：</font>' + gdata[i].appendComment[0].refComment + '</div>'+																
								'</ol>';
			}
			if(gdata[i].photoUrlList.length > 0){
				for(var p = 0; p < gdata[i].photoUrlList.length; p++){
					photoUrl += '<img src="' + gdata[i].photoUrlList[p].photoUrl + '" />';
				}
				photoUrl = '<div class="comment-img">' + photoUrl + '</div>';
			}
			htmldata += '<li>'+
						'	<div class="item-content"><div class="top clearfix"><div class="fr right tr">'+ Level +
						'			<div class="timer">' + d.format('yyyy-MM-dd') + '</div></div><div class="left">' +									
						'		<div class="item-media"><img src="' + gdata[i].userPhotoUrl + '"></div>'+
						'		<div class="item-inner">'+
						'			<div class="item-title-row">'+
						'				<div class="item-title">' + gdata[i].createUser + '</div>'+
						'			</div>'+
						'			<div class="item-subtitle">' + gdata[i].commentContent + '</div>' +									
						'		</div></div></div>'+
						'	</div>'+ photoUrl + appendComment +						
						'</li>';						
		}
		return htmldata;
	}
	module.exports = commentList;
});