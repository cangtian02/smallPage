/*
 *  name: 苍天
 *	qq: 1297161816
 *	url: www.ct9001.com
 *	version: 1.0.0
 *	update: 2016.8.1
 *	statement: 可更改源文件用于他处，但请保留头部版权。
 */

;(function($){
	$.fn.J_jcorp = function(setting){
		
		var defaults = {
			'aspectRatio': 0,//裁剪宽高比   width/height
			'maxSize': [0,0],//裁剪最大尺寸 [width,height]
			'minSize': [0,0],//裁剪最小尺寸 [width,height]
			'picSize': [0,0],//最终保存图片尺寸 [width,height]
			'quality': 1,//裁剪完后图片压缩比例
			'AjaxData': null,//保存时接口data
			'callback': new Object//接口成功回调
		}
		setting = $.extend(defaults,setting || {});
			
		var	J_bodyNode = $(document.body);//保存body
		
		var J_jcorpflag = false;//判断是否裁剪过
		
		var jcrop_api;//jcrop裁剪工具api
			
		var J_filebox,
			J_mask,
			J_close,
			J_y_img,
			J_fileimg,
			J_fileimgbox,
			J_img_jcrop,
			J_img_box,
			J_dispose_img,
			J_dispose_y,
			J_change,
			J_esc,
			J_jcorp,
			J_save,
			J_canvas;//div id命名
		
		var fileName;//上传文件名称
		
		var img_w,img_h;//选择文件自适应宽高
		
		var imgId;
		
		//绑定事件
		$(this).unbind('click').bind('click',function(e){
			e.stopPropagation();//阻止冒泡
			renderDOM();//初始化弹出
		});
		
		function getRandom(){
			return Math.round(Math.random() * 10000000);
		}
		
		function renderDOM (){//加载dom
			var strDOM = '<div class="J-filebox" id="J-filebox">' + 
						'	<div class="J-title">上传图片<div class="J-close" title="退出" id="J-close">X</div></div>' + 
						'	<div class="J-wrap">' + 
						'		<div class="J-fileimg-box" id="J-fileimg-box">点击上传图片<input type="file" id="J-fileimg" accept="image/gif, image/jpeg, image/jpg, image/png" /></div>' + 
						'		<div class="J-img-jcrop" id="J-img-jcrop">' + 
						'		<div class="J-y-img" id="J-y-img"></div>' + 		
						'			<div class="J-img-box" id="J-img-box">' + 
						'				<div class="J-scale-box"><div class="pos" id="pos"></div><div class="i" id="bar"><em id="btn"></em></div></div>' + 
						'				<div class="J-dispose-img" id="J-dispose-img"></div>' + 
						'			</div>' + 
						'			<div class="J-control">' + 
						'				<div class="J-btn" id="J-enter-change">更换</div>' + 
						'				<div class="J-btn" id="J-enter-esc">重做</div>' + 
						'				<div class="J-btn" id="J-enter-jcorp">裁剪</div>' + 
						'				<div class="J-btn" id="J-enter-save">保存</div>' + 
						'			</div>' + 
						'		</div>' + 
						'	</div>' + 
						'   <canvas id="J-canvas"></canvas>' + 
						'</div>' + 		
						'<div class="J-mask" id="J-mask"></div>';
			J_bodyNode.append(strDOM);//插入dom
									
			J_filebox = $("#J-filebox");
			J_mask = $("#J-mask");
			J_close = $("#J-close");
			J_y_img = $("#J-y-img")
			J_fileimg = $("#J-fileimg");
			J_fileimgbox = $("#J-fileimg-box");
			J_img_jcrop = $("#J-img-jcrop");
			J_img_box = $("#J-img-box");
			J_dispose_img = $("#J-dispose-img");
			J_change = $("#J-enter-change");
			J_esc = $("#J-enter-esc");
			J_jcorp = $("#J-enter-jcorp");
			J_save = $("#J-enter-save");
			J_canvas = document.getElementById("J-canvas");//命名div名称
			
			control();//控制器
			showDOM();//显示dom
			Jscale();//图片缩放
		}
		
		function showDOM(){//显示dom
			J_filebox.show();
			J_mask.show();			
		}
		
		function hideDOM(){//去除dom
			J_filebox.remove();
			J_mask.remove();		
		}
		
		function removeDOM (){//注销dom内裁剪模块
			J_dispose_img.html('');
			J_y_img.html('');
			J_img_jcrop.hide();
			resetdom();//重置上传图片按钮和渲染图片canvas
			control();//控制器
			J_jcorpflag = false;//保存后改为未裁剪状态
		}
		
		function control(){//控制中心
			J_close.click(function(){
				hideDOM();//关闭dom
			});
			J_fileimg.change(function(){
				changeImg($(this));//加载图片				
			});
			J_change.unbind('click').click(function(){
				removeDOM();//更换图片
			});
			J_esc.unbind('click').click(function(){
				Jesc();//重做
			});
			J_jcorp.unbind('click').click(function(){
				JJcorp();//裁剪
			});
			J_save.unbind('click').click(function(){
				Jsave();//保存图片
			});
		}
		
		function Jscale(){//图片缩放
			scale = function (btn,bar){
				this.btn = document.getElementById(btn);
				this.bar = document.getElementById(bar);
				this.flag = false;
				this.init();
			};
			scale.prototype = {
				init : function (){
					var f = this,g = document,b = window,m = Math;
					f.btn.onmousedown = function (e){
						var y = (e||b.event).clientY,						
							max = f.bar.clientHeight,						
							tt = (max - this.clientHeight)/2,
							t = this.offsetTop,
							t_2 = - (this.clientHeight/2);
						document.getElementById('pos').style.display = 'block';
						g.onmousemove = function (e){
							var thisY = (e||b.event).clientY;
							var to = m.min(max,m.max(t_2,t + (thisY - y)));				
							f.btn.style.top = to + 'px';
							var a = 0;
							if(to == tt){
								a = 1
							}else{
								to < tt ? a = 1 + (tt - to)/(max/2) :  a = 1 - (to - tt)/(max/2);
							}
							a < 0 ? a = 0.1 : a = a;
							a > 2 ? a = 1.9 : a = a;
							f.ondrag(a);
							b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
						};
						g.onmouseup = function() {
							this.onmousemove = null;
							f.flag = false;
							setJcorpapi();
							document.getElementById('pos').style.display = 'none';							
						} 
					};
				},
				ondrag : function (pos){
					var f = this;					
					var w = img_w * pos - 10 < 40 ? 40 : img_w * pos - 10,
						h = img_h * pos - 10 < 40 ? 40 : img_h * pos - 10;	
					if(f.flag == false){
						jcrop_api.destroy();//移除jcorp
						imgId = 'img_' + getRandom();
						var i = $("#J_dispose_y").html();
						J_dispose_img.html('<div id="J_dispose_y">' + i + '</div><div id="' + imgId + '">' + i + '</div>');
						f.flag = true;
					}					
					$("#" + imgId).css({
						'width': w,
						'height': h
					});
					J_dispose_img.find('img').css({
						'width': w,
						'height': h
					});						
					$("#pos").text((pos * 100).toFixed(2) + '%');
				}
			}
			new scale('btn','bar');						
		}
		
		function changeImg(f){//加载图片
			var fileObj = f[0],
				windowURL = window.URL || window.webkitURL,
				img = new Image();				
			fileName = fileObj.files[0].name;//设置图片名称
			img.src = windowURL.createObjectURL(fileObj.files[0]); 		
	        img.onload = function () {
				J_y_img.html('<img src="' + img.src + '" />');
	        	imgId = 'img_' + getRandom();
				J_dispose_img.html('<div id="J_dispose_y"><img src="' + img.src + '" /></div><div id="' + imgId + '"><img src="' + img.src + '" /></div>');
				J_dispose_y = $("#J_dispose_y");
				var w = J_y_img.find('img')[0].naturalWidth,
					h = J_y_img.find('img')[0].naturalHeight;					
				J_img_jcrop.show();
				loadPic(w,h);
	        };	        	      	        
		}

		function loadPic(w,h){//渲染图片
			var j_w = J_img_box.width() - 10,
				j_h = J_img_box.height() - 10;
			var scale = Math.min(j_w/w,j_h/h,1);//渲染图片到div中的比例
			img_w = w * scale,img_h = h * scale;
			$("#" + imgId).css({
				'width': img_w,
				'height': img_h
			});
			J_dispose_img.find('img').css({
				'width': img_w,
				'height': img_h
			});			
			setJcorpapi();	
		}
		
		function setJcorpapi(){//开启jcorp插件
			$('#' + imgId).Jcrop({
				'aspectRatio': setting.aspectRatio,//设置裁剪框宽高比
				'maxSize': setting.maxSize,//设置裁剪框最大尺寸
				'minSize': setting.minSize//设置裁剪框最小尺寸
			},function(){
				jcrop_api = this;//绑定jcorp裁剪插件api属性
			});
		}
		
		function resetdom(){//重置上传图片按钮和渲染图片canvas
			J_fileimg.remove();			
			J_fileimgbox.append('<input type="file" id="J-fileimg" accept="image/gif, image/jpeg, image/jpg, image/png" />');			
			J_fileimg = $("#J-fileimg");
			J_canvas.remove();
			J_filebox.append('<canvas id="J-canvas"></canvas>');
			J_canvas = document.getElementById("J-canvas");		
		}
		
		function Jesc(){//重做
			if(J_jcorpflag == false){
				alert('您还未进行裁剪');
				return false;
			}
			jcrop_api.destroy();//移除jcorp
			imgId = 'img_' + getRandom();
			var s = J_y_img.find('img').attr('src');
			J_dispose_img.html('<div id="J_dispose_y"><img src="' + s + '" /></div><div id="' + imgId + '"><img src="' + s + '" /></div>');
			resetdom();//重置上传图片按钮和渲染图片canvas
			var w = $("#" + imgId).find('img')[0].clientWidth,
				h = $("#" + imgId).find('img')[0].clientHeight;
			loadPic(w,h);			
			control();//控制器
		}
		
		function JJcorp(){//裁剪
			var ctx = J_canvas.getContext("2d"),
				t = jcrop_api.tellSelect(),
				n_w = $("#" + imgId).find('img')[0].naturalWidth,//图片实际宽度
				n_h = $("#" + imgId).find('img')[0].naturalHeight,//图片实际高度
				w = $("#" + imgId).width(),//图片自适应框架宽度
				h = $("#" + imgId).height(),//图片自适应框架高度度
				s = n_w/w,//缩小宽度比
				j = n_h/h,//缩小高度比
				s_s = w/n_w,//放大宽度比
				j_j = h/n_h;//放大高度比
			if(t.w == 0){
				alert('请先进行选框');			
				return false;
			}
			J_canvas.width = t.w;//设置canvas宽
			J_canvas.height = t.h;//设置canvas高			
			var img = new Image();
			img.src = $("#" + imgId).find('img').attr('src');
			img.onload = function(){
				//ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);详细信息请看w3c
				ctx.drawImage(img, t.x * s, t.y * j, t.w/s_s, t.h/j_j, 0, 0, t.w, t.h);
				var basesrc = J_canvas.toDataURL("image/jpeg");			
				jcrop_api.destroy();//移除jcorp
				J_dispose_img.html('<div id="J_dispose_y"><img src="' + basesrc + '" /></div><div id="' + imgId + '"><img src="' + basesrc + '" /></div>');
				loadPic(t.w,t.h);
				J_jcorpflag = true;//已裁剪
			}					
		}
		
		function Jsave(){//保存
			var Jsave_w, Jsave_h;			
			if(setting.picSize[0] == 0 || setting.picSize[1]){
				Jsave_w = J_y_img.find('img')[0].naturalWidth;
				Jsave_h = J_y_img.find('img')[0].naturalHeight;
			}else{
				Jsave_w = setting.picSize[0];
				Jsave_h = setting.picSize[1];
			}						
			J_canvas.width = Jsave_w;//设置canvas宽
			J_canvas.height = Jsave_h;//设置canvas高				
			var img = new Image(),
				ctx = J_canvas.getContext("2d");
			img.src = $("#" + imgId).find('img').attr('src');
			img.onload = function(){
				ctx.drawImage(img, 0, 0, Jsave_w, Jsave_h);
				var s = J_canvas.toDataURL("image/jpeg", setting.quality);
				postAjax(s);
			}																				
		}
		
		function postAjax(s){
			var s = s,
				s_1 = s.split(','),
				s_1 = s_1[1];			
			$.ajax({
				dataType: setting.AjaxData[1],
				type: "POST",
				data: {"fileStr": s_1,"fileName": fileName},
				jsonp:"callback",
				url: setting.AjaxData[0],
				async: false,
				success: function(data){
					if(data.status == 0 || data == 'null'){
						alert('图片上传失败');
						hideDOM();
					}else{	
			            setting.callback(s,data);						
						hideDOM();
					}
				},
		        error: function(){
		            alert('图片上传失败');
		            hideDOM();
		        }						
			});				
		}

	};
})(jQuery);