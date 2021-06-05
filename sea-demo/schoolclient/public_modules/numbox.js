define(function(require){
	;(function($){
		$.fn.numbox = function(setting){		
			setting = $.extend({min: 1,max: 10,callNum: new Object},setting || {});		
			var numbox = $(this),
				minBtn = numbox.find(".numbox-btn-min"),
				plusBtn = numbox.find(".numbox-btn-plus"),
				inputBox = numbox.find(".numbox-input"),
				inputBoxVal = inputBox.val();
				
			numbox.attr('data-numbox-min',setting.min);
			numbox.attr('data-numbox-max',setting.max);
		
			checkValue();
			
			//减
			minBtn.on('click',function(){
				inputBoxVal--;
				inputBoxVal = inputBoxVal < 1 ? 1 : inputBoxVal;
				NumSlice(inputBoxVal);
			});
			//加
			plusBtn.on('click',function(){
				inputBoxVal++;
				inputBoxVal = inputBoxVal > setting.max ? setting.max : inputBoxVal; 
				NumSlice(inputBoxVal);
			});
			
			function NumSlice(inputBoxVal){
				inputBox.val(inputBoxVal);
				if ($.isFunction(setting.callNum)) {
	                setting.callNum(inputBoxVal);//点击事件回调
	            }
				checkValue();
			}
			//验证是否合法
			function checkValue() {
				var val = parseInt(inputBox.val()),
					maxNum = parseInt(setting.max);
				if(val <= 1){			
					if(maxNum <= 1){
						numbox.find("button").attr("disabled","disabled");
					}else{
						minBtn.attr("disabled","disabled");
						plusBtn.removeAttr("disabled");
					}
				}else{			
					if(val < maxNum){
						numbox.find("button").removeAttr("disabled");
					}else if(val == maxNum){
						plusBtn.attr("disabled","disabled");
						minBtn.removeAttr("disabled");
					}else if(val > maxNum){
						val = 1;				
						plusBtn.removeAttr("disabled");
						minBtn.attr("disabled","disabled");									
					}
				}
				inputBox.val(val);
			}		
		}
	}(Zepto));
});