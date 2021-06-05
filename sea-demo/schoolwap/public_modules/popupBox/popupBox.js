define(function(require, exports, module) {
	require('./popupBox.css');
	function popupBox(){
		var popupBoxData = '<div class="popup-box" id="popup-box">' +
					'	<div class="okbtn-popup-box tc" id="okbtn-popup-box">确定</div>' +
					'	<a href="javascript:;" id="close-popup-box" class="close-popup-box tc"><i class="iconfont red">&#xe630;</i></a>' +
					'	<div class="popup-box-title">' +
					'		<span class="popup-box-name ellipsis fl"></span>' +
					'		<div class="popup-box-price arial">￥<span class="popup-box-price-money">0.00</span></div>' +
					'	</div>' +
				    '   <div class="popup-box-normList"></div>' +
					'	<div class="popup-box-buy">' +
					'		<span>数量:</span>' +										
					'		<div class="numbox" data-numbox-min="" data-numbox-max="">' +						
					'			<button class="btn numbox-btn-min" type="button">-</button>' +
					'			<input id="number" class="numbox-input tc" type="text" name="buyNum" value="1" readonly />' +
					'			<button class="btn numbox-btn-plus" type="button">+</button>' +
					'		</div>' +
					'		<font class="red" id="nostock"></font>' +
					'	</div>' +
				    '</div>';							
		return popupBoxData;
	}
	module.exports = popupBox;
});