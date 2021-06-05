;(function($){
	$.fn.accordion = function(setting){
		setting = $.extend({speed: 500,call: false,callbox: ""},setting || {});
		var	self = $(this);	
			item = self.find("li"),
			len = item.length,
			boxW = self.width(),
			itemW = item.width(),
			anW = (boxW-itemW)/(len-1);
			if(setting.call == true){pb = item.find(setting.callbox).css("bottom");newpb = pb;}			
		item.each(function(i){
			$(this).animate({left:anW*i},setting.speed);
			$(this).data('index',i);
		}).on("mouseover",function(){
			sIndex=$(this).data('index');
			if(setting.call == true){
				pb = item.find(setting.callbox).css("bottom");				
				item.eq(sIndex).find(setting.callbox).stop(true,true).animate({bottom:0});
				item.eq(sIndex).siblings(item).find(setting.callbox).stop(true,true).animate({bottom:newpb});												
			}	
			item.each(function(n){
				n > sIndex ? anL = itemW + anW * (n-1) : anL = anW * n;
				$(this).stop(true,true).animate({left:anL},setting.speed);				
			});
		}).eq(0).trigger("mouseover");	
	}
})(jQuery);