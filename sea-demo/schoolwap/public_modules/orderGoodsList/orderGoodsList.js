define(function(require, exports, module) {
	require('./orderGoodsList.css');
	function orderGoodsList(data,sendAddress){
		var htmldata = '';
		for(var i = 0; i < data.length; i++){
			htmldata += '<a href="' + data[i].link + '" class="cont">' + 
			'	<div class="l">' + 
			'		<img src="' + data[i].photoUrl + '" />' + 
			'	</div>' + 
			'	<div class="r">' + 
			'		<h1>' + data[i].name + '</h1>' + 
			'		<div class="r_price">' + 
			'			<em class="r_price_o"><span class="i arial">￥</span><span class="n">' + data[i].transactionPrice.toFixed(2) + '</span></em>' + 
			'			<del class="r_price_p"><span class="i arial">￥</span>	<span class="n">' + data[i].sellPrice.toFixed(2) + '</span></del>' + 
			'		</div>' + 
			'		<div class="num ellipsis">' + data[i].normsValues + ' x' + data[i].buyNum + sendAddress + '</div>' + 
			'	</div>' + 
			'</a>';			
		}
		return htmldata;
	}
	module.exports = orderGoodsList;
});