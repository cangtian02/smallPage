/*
 *  name: 苍天
 *	qq: 1297161816
 *	url: www.ct9001.com
 *	version: 1.0.0
 *	update: 2016.8.1
 *	statement: 可更改源文件用于他处，但请保留头部版权。
 */

;(function($){
	var J_jcorp = function(setting){
		var self = this;
		this.setting = {
			'aspectRatio': 0,//裁剪宽高比   width/height
			'maxSize': [0,0],//裁剪最大尺寸 [width,height]
			'minSize': [0,0],//裁剪最小尺寸 [width,height]
			'picSize': [0,0],//最终保存图片尺寸 [width,height]
			'consoleBox': null,//裁剪完毕后图片输出框
			'quality': 1//裁剪完后图片压缩比例
		};
		$.extend(this.setting,setting || {});
				
		this.bodyNode = $(document.body);//保存body
		
		this.flag = false;//判断是否开启插件
		this.J_jcorpflag = false;//判断是否裁剪过
		
		this.jcrop_api;//jcrop裁剪工具api
			
		this.J_filebox;
		this.J_mask;
		this.J_close;
		this.J_y_img;
		this.J_fileimg;
		this.J_fileimgbox;
		this.J_img_jcrop;
		this.J_img_box;
		this.J_dispose_img;
		this.J_change;
		this.J_esc;
		this.J_jcorp;
		this.J_save;
		this.J_canvas;//div id命名

		var J_jcorpflag = false;//判断是否裁剪过
		
		var jcrop_api;//jcrop裁剪工具api			
			
		this.J_fileName;//上传文件名称		
		this.img_w;
		this.img_h;//选择文件自适应宽高		
		this.imgId;
		
		//开发事件委托
		this.bodyNode.delegate("#J-jcorp","click",function(e){
			e.stopPropagation();//阻止冒泡
			self.initFilebox();//初始化弹出		
		});		
		
	};	
	J_jcorp.prototype = {		
		initFilebox : function(){//初始化弹出
			var self = this;
			//self.flag  判断是否开启插件
			if(self.flag == false){
				self.renderDOM();//加载dom
			}else{
				self.showDOM();//显示dom
			}
		},
		getRandom : function(){
			return Math.round(Math.random() * 10000000);
		},		
		renderDOM : function(){//加载dom
			var self = this;
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
			self.bodyNode.append(strDOM);//插入dom
			self.flag = true;//设置已开启插件
									
			self.J_filebox = $("#J-filebox");
			self.J_mask = $("#J-mask");
			self.J_close = $("#J-close");
			self.J_y_img = $("#J-y-img")
			self.J_fileimg = $("#J-fileimg");
			self.J_fileimgbox = $("#J-fileimg-box");
			self.J_img_jcrop = $("#J-img-jcrop");
			self.J_img_box = $("#J-img-box");
			self.J_dispose_img = $("#J-dispose-img");
			self.J_change = $("#J-enter-change");
			self.J_esc = $("#J-enter-esc");
			self.J_jcorp = $("#J-enter-jcorp");
			self.J_save = $("#J-enter-save");
			self.J_canvas = document.getElementById("J-canvas");//命名div名称
		
			self.control();//控制器
			self.showDOM();//显示dom
			self.Jscale();//图片缩放
		},
		showDOM : function(){//显示dom
			var self = this;
			self.J_filebox.show();
			self.J_mask.show();			
		},
		hideDOM : function(){//隐藏dom
			var self = this;
			self.J_filebox.hide();
			self.J_mask.hide();		
		},
		removeDOM : function(){//注销dom内裁剪模块
			var self = this;
			self.J_dispose_img.html('');
			self.J_y_img.html('');
			self.J_img_jcrop.hide();
			self.resetdom();//重置上传图片按钮和渲染图片canvas
			self.control();//控制器
			self.J_jcorpflag = false;//保存后改为未裁剪状态
		},
		control : function(){//控制中心
			var self = this;
			self.J_close.click(function(){
				self.hideDOM();//关闭dom
			});
			self.J_fileimg.change(function(){
				self.changeImg($(this));//加载图片
			});
			self.J_change.unbind('click').click(function(){
				self.removeDOM();//更换图片
			});
			self.J_esc.unbind('click').click(function(){
				self.Jesc();//重做
			});
			self.J_jcorp.unbind('click').click(function(){
				self.JJcorp();//裁剪
			});
			self.J_save.unbind('click').click(function(){
				self.Jsave();//保存图片
			});
		},
		Jscale : function(){//图片缩放
			var self = this;
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
							self.setJcorpapi();
							document.getElementById('pos').style.display = 'none';							
						} 
					};
				},
				ondrag : function (pos){
					var f = this;					
					var w = self.img_w * pos - 10 < 40 ? 40 : self.img_w * pos - 10,
						h = self.img_h * pos - 10 < 40 ? 40 : self.img_h * pos - 10;	
					if(f.flag == false){
						self.jcrop_api.destroy();//移除jcorp
						self.imgId = 'img_' + self.getRandom();
						self.J_dispose_img.find('img').attr('id',self.imgId);
						f.flag = true;
					}					
					self.J_dispose_img.find('img').css({
						'width': w,
						'height': h,
						'display': 'block'
					});
					$("#pos").text((pos * 100).toFixed(2) + '%');
				}
			}
			new scale('btn','bar');						
		},		
		changeImg : function(f){//加载图片
			var self = this;
			var fileObj = f[0],
				windowURL = window.URL || window.webkitURL,
				img = new Image();				
			self.J_fileName = fileObj.files[0].name;//设置图片名称	
			img.src = windowURL.createObjectURL(fileObj.files[0]);//加载图片src			
	        img.onload = function () {
	        	self.imgId = 'img_' + self.getRandom();
				self.J_dispose_img.html('<img src="' + img.src + '" id="' + self.imgId + '" />');
				self.J_y_img.html('<img src="' + img.src + '" />');
				self.J_img_jcrop.show();
				var w = self.J_dispose_img.find('img')[0].clientWidth,
					h = self.J_dispose_img.find('img')[0].clientHeight;					
				self.loadPic(w,h);
	        };
		},
		loadPic : function(w,h){//渲染图片
			var self = this;			
			var j_w = self.J_img_box.width() - 10,
				j_h = self.J_img_box.height() - 10;
			var scale = Math.min(j_w/w,j_h/h,1);//渲染图片到div中的比例
			self.img_w = w * scale,self.img_h = h * scale;
			self.J_dispose_img.find('img').css({
				'width': self.img_w,
				'height': self.img_h,
				'display': 'block'
			});
			self.setJcorpapi();			
		},
		setJcorpapi : function(){//开启jcorp插件
			var self = this;
			$('#' + self.imgId).Jcrop({
				'aspectRatio': self.setting.aspectRatio,//设置裁剪框宽高比
				'maxSize': self.setting.maxSize,//设置裁剪框最大尺寸
				'minSize': self.setting.minSize//设置裁剪框最小尺寸
			},function(){
				self.jcrop_api = this;//绑定jcorp裁剪插件api属性
			});
		},		
		resetdom : function(){//重置上传图片按钮和渲染图片canvas
			var self = this;
			self.J_fileimg.remove();			
			self.J_fileimgbox.append('<input type="file" id="J-fileimg" accept="image/gif, image/jpeg, image/jpg, image/png" />');			
			self.J_fileimg = $("#J-fileimg");
			self.J_canvas.remove();
			self.J_filebox.append('<canvas id="J-canvas"></canvas>');
			self.J_canvas = document.getElementById("J-canvas");		
		},
		Jesc : function(){//重做
			var self = this;
			if(self.jcorpflag == false){
				alert('您还未进行裁剪');
				return false;
			}
			self.jcrop_api.destroy();//移除jcorp
			self.imgId = 'img_' + self.getRandom();
			var s = self.J_y_img.find('img').attr('src');
			self.J_dispose_img.html('<img src="' + s + '" id="' + self.imgId + '" />');
			self.resetdom();//重置上传图片按钮和渲染图片canvas
			var w = self.dispose_img.find('img')[0].clientWidth,
				h = self.dispose_img.find('img')[0].clientHeight;
			self.loadPic(w,h);			
			self.control();//控制器
		},
		JJcorp : function(){//裁剪
			var self = this;
			var ctx = self.J_canvas.getContext("2d"),
				t = self.jcrop_api.tellSelect(),
				n_w = self.J_dispose_img.find('img')[1].naturalWidth,//图片实际宽度
				n_h = self.J_dispose_img.find('img')[1].naturalHeight,//图片实际高度
				w = self.J_dispose_img.find('img')[1].clientWidth,//图片自适应框架宽度
				h = self.J_dispose_img.find('img')[1].clientHeight,//图片自适应框架高度度
				s = n_w/w,//缩小宽度比
				j = n_h/h,//缩小高度比
				s_s = w/n_w,//放大宽度比
				j_j = h/n_h;//放大高度比
			if(t.w == 0){
				alert('请先进行选框');			
				return false;
			}
			self.J_canvas.width = t.w;//设置canvas宽
			self.J_canvas.height = t.h;//设置canvas高			
			var img = new Image();
			img.src = self.J_dispose_img.find('img').eq(1).attr('src');
			img.onload = function(){
				//ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);详细信息请看w3c
				ctx.drawImage(img, t.x * s, t.y * j, t.w/s_s, t.h/j_j, 0, 0, t.w, t.h);
				var basesrc = self.J_canvas.toDataURL("image/jpeg");			
				self.jcrop_api.destroy();//移除jcorp
				self.J_dispose_img.find('img').attr('src',basesrc);
				self.loadPic(t.w,t.h);
				self.J_jcorpflag = true;//已裁剪
			}					
		},
		Jsave : function(){//保存
			var self = this;			
			var Jsave_w, Jsave_h;			
			if(self.setting.picSize[0] == 0 || self.setting.picSize[1]){
				Jsave_w = self.J_y_img.find('img')[0].naturalWidth;
				Jsave_h = self.J_y_img.find('img')[0].naturalHeight;
			}else{
				Jsave_w = self.setting.picSize[0];
				Jsave_h = self.setting.picSize[1];
			}		
			self.J_canvas.width = Jsave_w;//设置canvas宽
			self.J_canvas.height = Jsave_h;//设置canvas高				
			var img = new Image(),
				ctx = self.J_canvas.getContext("2d");
			img.src = self.J_dispose_img.find('img').eq(1).attr('src');
			img.onload = function(){
				ctx.drawImage(img, 0, 0, Jsave_w, Jsave_h);
				var s = self.J_canvas.toDataURL("image/jpeg", self.setting.quality),
					s_1 = s.split(','),
					s_1 = s_1[1];						
				$(self.setting.consoleBox).append('<img src="' + s + '" data-base64="' + s_1 + '" />');
				self.hideDOM();
				self.removeDOM();					
			}			
		},
	},
	window['J_jcorp'] = J_jcorp;	
})(jQuery);