define(function(require, exports, module) {
	require('./slideFixed.css');	
	function slideFixed(photoUrls) {
		var _dom = '<div class="slideFixed show" id="slideFixed"><div class="slideFixedBox" id="slideFixedBox"></div></div>';	
		$("body").append(_dom);
		setTimeout(function(){$(".slideFixed").removeClass('show');},300);
		var htmldata = '';
		for(var i = 0; i < photoUrls.length; i++){
			htmldata += '<li><img src="' + photoUrls[i].url + '" /></li>';
		}
		htmldata = '<div class="slide-container slide-fixedContainer"><ul class="slide-main">'+ htmldata + '</ul><ul class="slide-pagination"></ul></div>';
		$("#slideFixedBox").append(htmldata);
		$("#slideFixed").show();
		var slide = require('slide');
		slide = new slide({'slideBox': '.slide-fixedContainer','autoplay': false});
		$("#slideFixed").on('click',function(){
			var _this = $(this);
			_this.addClass('hide');
			setTimeout(function(){_this.remove();},300);			
		});		
	}
	module.exports = slideFixed;
});