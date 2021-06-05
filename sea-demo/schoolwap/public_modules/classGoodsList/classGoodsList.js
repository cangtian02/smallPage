define(function(require, exports, module) {
	require('./classGoodsList.css');
	function classGoodsList(data,pageNow){	
		var classGoodsList_h = '',pn = '';
		if(pageNow == undefined){
			pn = '';			
		}else{
			pn = 'data-pageNow="' + pageNow + '"';
		}		
		for(var i = 0; i < data.length; i++){
			classGoodsList_h += '<li id="' + data[i].goodsId + '" data-normsValueId="' + data[i].normsValueId + '"' + pn + '>' + 
						'	<div class="dis bgf">' + 
						'	<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' + 
						'	<div class="tt ellipsis">' + data[i].goodsName + '</div>' + 
						'	<div class="money">' + 
						'	<font><span class="arial">￥</span>'+ data[i].preferentialPrice.toFixed(2) + '</font>' + 
						'	<del><span class="arial">￥</span>' + data[i].originalPrice.toFixed(2) + '</del>' + 
						'</div></div></li>';
		}
		return classGoodsList_h;
	}
	module.exports = classGoodsList;
});