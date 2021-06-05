define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./education.css');
	
	base.init();
	base.setTitle('职业课堂');
		
	var fun_edu = function(){
		
		var self = this,		
			gid = null,		
			winW = $(".content").width(),
			Num = 0,
			iStartX = 0, //初次按下坐标值
			iStartTranslateX = 0, //物体移动到的X坐标		
			pageNow = 1,
			pageSize = 5,
			tabL = '',
			ebtn = '',
			tabT = '',
			tabTitem = '';
			
		ajax.get('base/geteducationclasslist/' + pageNow + '/' + pageSize,'json',function(data){
			if(data.status == 0){
				$(".content").html(base.noList('暂无课程'));
				return;
			}
			var d = data.data.classList,
				dhtml_c = '',
				dhtml_b = '',
				img = '';
			for(var i = 0; i < d.length; i++){				
				d[i].classIcon == undefined ? img = '' : img = '<img src="' + d[i].classIcon + '" class="img" />';
				dhtml_c += '<div class="o">' + img + 			    			 
			    			'	<div class="t red">' + d[i].className + '课程说明：</div>' + 
			    			'	<div class="c">' + d[i].description + '</div>' + 
			    			'</div>';
				dhtml_b += '<div class="e-tab-btn-item" data-id="' + d[i].id + '"><span>' + d[i].className + '</span></div>';				
			}
			var zhtml = '<div class="e-tab"><div class="l" id="e-tab-l">' + dhtml_c + '</div></div>' + 				    	
				    	'<div class="e-btn" id="e-btn">立即学习</div>' + 				    	
				    	'<div class="e-tab-btn" id="e-tab-btn">' + dhtml_b + '</div>';
			$(".content").append(zhtml);
			self.controll();				
		});
		
		this.controll = function(){
			tabL = document.getElementById('e-tab-l');
			ebtn = $("#e-btn");
			tabT = $("#e-tab-btn");
			tabTitem = tabT.find('.e-tab-btn-item');			
			tabTitem.eq(0).addClass('active');
			gid = tabTitem.eq(0).attr('data-id');		
			tabTitem.each(function(){
				$(this).on('click',function(){
					$(this).addClass('active').siblings('div').removeClass('active');
					gid = $(this).attr('data-id');
					Num = $(this).index();
					tab();
				});
			});
			ebtn.on('click',function(){
				var name = $(".e-tab-btn-item.active span").text();
				window.location.href = SAYIMO.SRVPATH + 'view/find/education/educationList.html?id=' + gid + '&name=' + name;
			});				
			tabL.addEventListener('touchstart', self.touchstartX.bind(this), false);
			tabL.addEventListener('touchmove', self.touchmoveX.bind(this), false);
			tabL.addEventListener('touchend', self.touchendX.bind(this), false);			
		}
		
		this.touchstartX = function(event){
			event.preventDefault();			
			var touchOne = event.changedTouches[0];
			tabL.style.webkitTransition = tabL.style.transition = 'transform 0s ease';
			iStartX = touchOne.pageX;	
			iStartTranslateX = (-(Num * winW));
		}
		
		this.touchmoveX = function(event){			
			var touchOne = event.changedTouches[0],
				iMoveX = touchOne.pageX - iStartX,
				x = iStartTranslateX + iMoveX;
			tabL.style.WebkitTransform = tabL.style.webkitTransform = 'translate3d(' + x + 'px,' + '0,0)';			
		}
		
		this.touchendX = function(event){			
			var touchOne = event.changedTouches[0],
				iMoveX = touchOne.pageX - iStartX;			
			Num = (iStartTranslateX + iMoveX) / winW;	
			Num = - Math.round(Num);					
			if(Num < 0){
				Num = 0;
			}else if(Num == tabTitem.length){
				Num = tabTitem.length - 1;
			}
			self.tab();			
		}	

		this.tab = function(){			
			tabL.style.webkitTransition = tabL.style.transition = 'transform .3s ease';
			var x = -(Num * winW);
			tabL.style.WebkitTransform = tabL.style.webkitTransform = 'translate3d(' + x + 'px,' + '0,0)';			
			tabTitem.eq(Num).addClass('active').siblings('div').removeClass('active');
			gid = tabTitem.eq(Num).attr('data-id');
		}
		
	}//fun_edu end
	fun_edu();	
});