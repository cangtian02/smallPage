;(function($){
	'use strict';
	var colorPicker = function(setting){
		var self = this;		
		this.setting = {};//初始化定义属性     parent：选择器相对父级层
		setting = $.extend(this.setting,setting || {});
		this.colorPicker_box = $('<div class="colorPicker-box">');		
		this.bodyNode = $(document.body);//保存body
		this.renderDOM();//初始化渲染dom结构		
	};
	colorPicker.prototype = {
		renderDOM : function(){//初始化渲染dom结构	
			var self = this;		
			var srtDOM = '	<div class="colorList clearfix" id="colorList"></div>' + 
						'	<ul class="show-box clearfix">' + 
						'		<li>红色：<span id="RGB-R">255</span></li>' + 
						'		<li>绿色：<span id="RGB-G">255</span></li>' + 
						'		<li>蓝色：<span id="RGB-B">255</span></li>' + 
						'		<li>Hex：<span id="Hex">FFFFFF</span></li>' +			
						'	</ul>';//基础dom结构			
		    var baseColorHex = new Array('00','33','66','99','CC','FF');
		    var SpColorHex = new Array('000000','333333','666666','999999','CCCCCC','FFFFFF', 'FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF');
		    var s_one = '';
		    for(var i = 0; i < 12; i++){
		        s_one += '<li data-color="' + SpColorHex[i] + '" style=background-color:#' + SpColorHex[i] + '></li>';
		    }
		    s_one = '<ul class="s-one clearfix">' + s_one + '</ul>';
			var s_two = '';
		    for(var n = 0; n < 2; n++){
		        for(var i = 0; i < 6; i++){
		            s_two += '<ul class="clearfix">';
		            for(var j = 0 + 3 * n; j < 3 + 3 * n; j++){
		                for(var k = 0; k < 6; k++){
		                    s_two+='<li data-color="' + baseColorHex[j] + baseColorHex[k] + baseColorHex[i] + '" style=background-color:#' + baseColorHex[j] + baseColorHex[k] + baseColorHex[i] + '></li>';
		                }
		            }
		            s_two += '</ul>';
		        }
		    }
		    s_two = '<ul class="s-two clearfix">' + s_two + '</ul>';
			self.colorPicker_box.html(srtDOM);			
			self.bodyNode.prepend(self.colorPicker_box);//插入dom			
	    	self.colorPicker_box.find("#colorList").html(s_one + s_two);//插入颜色列表
	    	self.control();//控制器
		},
		control : function(){//控制器
			var self = this;
			self.colorList = self.colorPicker_box.find("#colorList");//所有颜色框
			self.li = self.colorList.find('li');//颜色li
			self.RGB_R = self.colorPicker_box.find("#RGB-R");//选择当前颜色红色值
			self.RGB_G = self.colorPicker_box.find("#RGB-G");//选择当前颜色绿色值
			self.RGB_B = self.colorPicker_box.find("#RGB-B");//选择当前颜色蓝色值
			self.Hex = self.colorPicker_box.find("#Hex");//选择当前颜色Hex值			
			self.li.each(function(){
				var _this = $(this);
				_this.hover(function(){
					var c = $(this).attr('data-color');
					self.Hex.text(c);
					var rgb = self.RGB(c);
					self.RGB_R.text(rgb[0]);
					self.RGB_G.text(rgb[1]);
					self.RGB_B.text(rgb[2]);
				});								
			});
		},
		RGB : function(c){//Hex转换rgb
			var r = parseInt('0x' + c.substr(0,2)),
				g = parseInt('0x' + c.substr(2,2)),
				b = parseInt('0x' + c.substr(4,2));
			return new Array(r,g,b);
		}
	},
	window['colorPicker'] = colorPicker;
})(jQuery);
var colorPicker = new colorPicker();