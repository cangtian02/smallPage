define(function(require, exports, module) {
	require('./touchTab.css');
	function touchTab(_tab){
		var touchTab = document.getElementById('touchTab'),
			touchTab_list = document.getElementById('touchTab-list'),
			l_a_w = touchTab_list.clientWidth,
			w_w = $(".content").width();
		var x = 0,//手指初次按下x轴坐标
			l = 0,//记录划过之后X轴偏移坐标
			orientation;//记录滑动方向					
		if(_tab > 1){
			var tab_l = $(".tab-link.active").offset().left,
				tab_w = ($(".tab-link.active").width())*1.5;
			if(tab_l > w_w/2){
				var ll = (w_w - tab_l - w_w - tab_w)/2;
				if( -(ll) > (l_a_w - w_w) ){
					ll = - (l_a_w - w_w);
					l = ll;
					touchTab_list.style.WebkitTransform = touchTab_list.style.transform = 'translate(' + ll + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值	
				}else{
					l = ll;
					touchTab_list.style.WebkitTransform = touchTab_list.style.transform = 'translate(' + ll + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值	
				}		
			}
		}			
		if(l_a_w > w_w){
			touchTab.addEventListener('touchstart',touchTabFun,false);
			touchTab.addEventListener('touchmove',touchTabFun,false);
			touchTab.addEventListener('touchend',touchTabFun,false);//绑定touch事件	
			function touchTabFun(event){
				var event = event || window.event;	
				switch (event.type){
					case 'touchstart':
							x = event.changedTouches[0].clientX - (l + (l*0.6));		
						break;
					case 'touchmove':
							l = (event.changedTouches[0].clientX - x) * 0.6;
							l < 0 ? orientation = 'left' : orientation = 'right';//判断滑动坐标
							touchTab_list.style.WebkitTransform = touchTab_list.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值		
						break;
					case 'touchend':
							var dl = 0,
								w = l_a_w - w_w;
							l < 0 ? dl = -(l) : dl = l;
							setTimeout(function(){
								if(orientation == 'right' && dl > 0){
									l = 0;
									touchTab_list.className += ' active';
									touchTab_list.style.WebkitTransform = touchTab_list.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';
									setTimeout(function(){
										touchTab_list.className = 'touchTab-list';
									},300);																										
								}else if(orientation == 'left' && w <= dl){										
									l = -w;
									touchTab_list.style.WebkitTransform = touchTab_list.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';
								}
							},100);
						break;			
					default:
						break;
				}	
			}
		}	
	}
	module.exports = touchTab;
});