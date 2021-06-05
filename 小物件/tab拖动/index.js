$.init();

function getQueryString (name){//获取页面参数值
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURIComponent(r[2]); return 0;
}

function getActiveTab(n){
	$(".buttons-tab a").removeClass("active");
	$(".buttons-tab #btab"+n).addClass("active");
	$(".tabs .tab").removeClass("active");
	$(".tabs #tab"+n).addClass("active");
}
			
var tab = getQueryString('tab');

var btn_a = document.getElementById('btn-a'),
	list_a = document.getElementById('a-list'),
	l_a_w = list_a.clientWidth,
	w_w = $(".content").width();

var x = 0,//手指初次按下x轴坐标
	l = 0,//记录划过之后X轴偏移坐标
	orientation;//记录滑动方向	
		
if(tab > 1){
	getActiveTab(tab);
	var tab_l = $(".tab-link.active").offset().left,
		tab_w = ($(".tab-link.active").width())*1.5;
	if(tab_l > w_w/2){
		var ll = (w_w - tab_l - w_w - tab_w)/2;
		if( -(ll) > (l_a_w - w_w) ){
			ll = - (l_a_w - w_w);
			l = ll;
			list_a.style.WebkitTransform = list_a.style.transform = 'translate(' + ll + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值	
		}else{
			l = ll;
			list_a.style.WebkitTransform = list_a.style.transform = 'translate(' + ll + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值	
		}		
	}
}

if(l_a_w > w_w){
	btn_a.addEventListener('touchstart',touchTab,false);
	btn_a.addEventListener('touchmove',touchTab,false);
	btn_a.addEventListener('touchend',touchTab,false);//绑定touch事件	
	function touchTab(event){
		var event = event || window.event;	
		switch (event.type){
			case 'touchstart':
					x = event.changedTouches[0].clientX - (l + (l*0.6));		
				break;
			case 'touchmove':
					l = (event.changedTouches[0].clientX - x) * 0.6;
					l < 0 ? orientation = 'left' : orientation = 'right';//判断滑动坐标
					list_a.style.WebkitTransform = list_a.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';//设置偏移值		
				break;
			case 'touchend':
					var dl = 0,
						w = l_a_w - w_w;
					l < 0 ? dl = -(l) : dl = l;		
					if(orientation == 'right' && dl > 0){
						l = 0;
						list_a.style.WebkitTransform = list_a.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';											
					}else if(orientation == 'left' && w<= dl){
						l = -w;
						list_a.style.WebkitTransform = list_a.style.transform = 'translate(' + l + 'px, 0px) scale(1) translateZ(0px)';
					}		
				break;			
			default:
				break;
		}	
	}
}