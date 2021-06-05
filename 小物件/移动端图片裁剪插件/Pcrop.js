;(function($){	
	var Pcorp = function(setting){
		var self = this;
		this.setting = {
			'src': '', // 原始图片地址
			'aspectRatio': [1,1], // 裁剪宽高比
			'quality': 1, // 裁剪完后图片压缩比例
			'callback': new Object // 裁剪完成后回调  返回图片URL
		};
		$.extend(this.setting,setting || {});
				
		this.bodyNode = $(document.body);//保存body	
		
		this.Pcrop_box;
		this.Pcrop_tracker;
		this.Pcrop_img;
		this.Pcrop_btn;
		
		this.winWidth = $(window).width();
		this.winHeight = $(window).height();
		
		this.ptWidth;
		this.ptHeight;
		this.ptTop;
		this.ptLeft;
		
		this.hammertime;
		
		self.renderDOM(); //初始化渲染dom
	};
	
	Pcorp.prototype = {
		renderDOM : function(){
			var self = this;
			
			var strDOM = '<div class="Pcrop_box" id="Pcrop_box"><div class="Pcrop_tracker" id="Pcrop_tracker"></div><div class="Pcrop_btn" id="Pcrop_btn">确定</div></div>';
			self.bodyNode.append(strDOM); //插入dom
			
			self.Pcrop_box = $("#Pcrop_box");
			self.Pcrop_tracker = $("#Pcrop_tracker");
			self.Pcrop_btn = $("#Pcrop_btn");
			
			self.loadImg(self.setting.src); // 加载图片
		},
		loadImg : function(src){
			var self = this; 
			// 加载图片
			var img = new Image();
			img.src = src;
			img.onload = function(){
				if(self.Pcrop_box.find('img').length > 0){
					self.Pcrop_box.find('img').remove();
				}
				self.Pcrop_box.prepend('<img src="' + img.src + '" class="Pcrop_img" id="Pcrop_img" >');
				self.Pcrop_img = $("#Pcrop_img");
				// 图片宽度大于屏幕高度 图片100%宽  否则屏幕60%的宽
				self.Pcrop_img.width() > self.winWidth * 0.6 ? self.Pcrop_img.width(self.winWidth) : self.Pcrop_img.width(self.winWidth * 0.6);
				self.Pcrop_img.css({'top': (self.winHeight - self.Pcrop_img.height()) / 2,'left': (self.winWidth - self.Pcrop_img.width()) / 2});
				// 根据比例计算裁剪框宽高
				if(self.setting.aspectRatio[0] == self.setting.aspectRatio[1]){
					self.Pcrop_tracker.width(self.winWidth * 0.6);
					self.Pcrop_tracker.height(self.winWidth * 0.6);
				}else{
					var tw = self.winWidth * 0.6,
						th = (tw / self.setting.aspectRatio[0]) * self.setting.aspectRatio[1];
					if(th > self.Pcrop_img.height()){
						self.Pcrop_tracker.height(self.Pcrop_img.height());
						self.Pcrop_tracker.width( (self.Pcrop_tracker.height() / self.setting.aspectRatio[1]) * self.setting.aspectRatio[0] );					
					}else{
						self.Pcrop_tracker.width(self.winWidth * 0.6);
						self.Pcrop_tracker.height( (self.Pcrop_tracker.width() / self.setting.aspectRatio[0]) * self.setting.aspectRatio[1] );
					}
				}
				self.ptTop = (self.winHeight - self.Pcrop_tracker.height())/2;
				self.ptLeft = (self.winWidth - self.Pcrop_tracker.width())/2;
				self.ptWidth = self.Pcrop_tracker.width();
				self.ptHeight = self.Pcrop_tracker.height();
				
				self.ImgHammer(); // 手势事件				
				self.Pcrop_btn.on('click',function(){
					self.ImgCrop(); // 确定裁剪
				});				
			}			
		},
		ImgHammer : function(){
			var self = this;  
			// 手势事件
			self.hammertime = new Hammer(self.Pcrop_tracker[0],{domEvents: true}); // 实例化Hammer
			// 处理平移
			self.hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL}); // 设置Hammer可垂直方位
			var marginX,marginY,img_w,img_h;
			self.Pcrop_tracker.on("panstart", function(e){
			    marginX = parseInt(self.Pcrop_img.css("left"),10);
			    marginY = parseInt(self.Pcrop_img.css("top"),10);
			    img_w = self.Pcrop_img.width();
			    img_h = self.Pcrop_img.height();
			});		    
		    self.Pcrop_tracker.on("panmove", function(e){	    	
			    var deltaX = marginX + e.gesture.deltaX,
			    	deltaY = marginY + e.gesture.deltaY;
			    self.Pcrop_img.css({"left": deltaX,'top': deltaY});
		    });
		    // 平移结束后计算图片位置，超出选框后回位
		    self.Pcrop_tracker.on("panend", function(e){
		    	var imgLeft = parseInt(self.Pcrop_img.css("left"),10),
		    		imgTop = parseInt(self.Pcrop_img.css("top"),10);		    				    		
    			if(imgLeft > self.ptLeft){
    				self.transition();
    				self.Pcrop_img.css({"left": self.ptLeft});
    			}
    			if(imgTop > self.ptTop){
    				self.transition();
    				self.Pcrop_img.css({"top": self.ptTop});
    			}     			
    			if(self.winWidth - img_w - imgLeft > self.ptLeft){
    				self.transition();
    				self.Pcrop_img.css({"left": - (self.ptLeft - (self.winWidth - img_w))});
    			}   			
    			if(self.winHeight - img_h - imgTop > self.ptTop){
    				self.transition();    				
    				self.Pcrop_img.css({"top": - (self.ptTop - (self.winHeight - img_h))});
    			}    			
		    }); 
		    // 处理缩放
		    self.hammertime.get('pinch').set({enable: true}); // 开启缩放
			self.Pcrop_tracker.on("pinchstart", function(e){
			    img_w = self.Pcrop_img.width();
			    img_h = self.Pcrop_img.height();							    
			});			    
		    self.Pcrop_tracker.on("pinchmove", function(e){		    	
		    	self.Pcrop_img.width(img_w * e.gesture.scale);
		    	self.Pcrop_img.height(img_h * e.gesture.scale);
		    	self.Pcrop_img.css({'top': (self.winHeight - self.Pcrop_img.height()) / 2,'left': (self.winWidth - self.Pcrop_img.width()) / 2});
		    });
		    self.Pcrop_tracker.on("pinchend", function(e){
		    	img_w = img_w * e.gesture.scale;
		    	img_h = img_h * e.gesture.scale;
		    	var scale = img_w/img_h;
		    	if(img_w < self.ptWidth){
		    		img_w = self.ptWidth;
		    		img_h = img_w/scale;
		    		self.Pcrop_img.width(img_w);
		    		self.Pcrop_img.height(img_h);
		    		self.Pcrop_img.css({'top': (self.winHeight - img_h) / 2,'left': (self.winWidth - img_w) / 2});
		    	}
		    	if(img_h < self.ptHeight){
		    		img_h = self.ptHeight;
		    		img_w = img_h*scale;
		    		self.Pcrop_img.height(img_h);
		    		self.Pcrop_img.width(img_w);
		    		self.Pcrop_img.css({'top': (self.winHeight - img_h) / 2,'left': (self.winWidth - img_w) / 2});		    		
		    	}    	
		    });			    
		},
		transition : function(){
			var self = this;
			self.Pcrop_img.addClass('transition');			
			setTimeout(function(){self.Pcrop_img.removeClass('transition')},300);						
		},
		ImgCrop : function(){
			var self = this;
			// 确定裁剪			
			self.bodyNode.append('<canvas id="J-canvas"></canvas>');
			J_canvas = document.getElementById("J-canvas");
			
			var ctx = J_canvas.getContext("2d"),
				n_w = self.Pcrop_img[0].naturalWidth,//图片实际宽度
				n_h = self.Pcrop_img[0].naturalHeight,//图片实际高度
				w = self.Pcrop_img[0].clientWidth,//图片自适应框架宽度
				h = self.Pcrop_img[0].clientHeight,//图片自适应框架高度度
				s = n_w/w,//缩小宽度比
				j = n_h/h,//缩小高度比
				s_s = w/n_w,//放大宽度比
				j_j = h/n_h;//放大高度比

			J_canvas.width = self.ptWidth;//设置canvas宽
			J_canvas.height = self.ptHeight;//设置canvas高

	    	var imgLeft = parseInt(self.Pcrop_img.css("left"),10),
	    		imgTop = parseInt(self.Pcrop_img.css("top"),10),
				sx = (self.ptLeft + (-(imgLeft))) * s,
				sy = (self.ptTop + (-(imgTop))) * j;
			
			var img = new Image();
			img.src = self.Pcrop_img.attr('src');
			img.onload = function(){
				//ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);详细信息请看w3c
				ctx.drawImage(img, sx, sy, self.ptWidth/s_s, self.ptHeight/j_j, 0, 0, self.ptWidth, self.ptHeight);
				var basesrc = J_canvas.toDataURL("image/jpeg");
				self.setting.callback(basesrc);
				self.Pcrop_box.remove();
			}
			
		}
	},
	window['Pcorp'] = Pcorp;
}(Zepto));