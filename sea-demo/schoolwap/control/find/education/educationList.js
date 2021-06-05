define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./educationList.css');	
	
	base.init();
	
	var fun_eduList = function(){
		
		var self = this,
			customerId = cookie.getCookie('customerId'),
			classId = base.getQueryString('id'),
			name = base.getQueryString('name'),
			pageNow = 1,
			pageSize = 10,
			loading = false,				
			educationList = [],//音频地址数据		
			flag = false,//是否开启播放器
			isplay = true,//是否可以切换
			iNow = 0,//当前播放位置		
			audio = '';//audio id
		
		base.setTitle(name);
		
		this.getAjax = function(){
			ajax.get('base/geteducationbytype/' + pageSize + '/' + pageNow + '/' + mediaType,'json',function(data){
				if(data.status == 0){
					$(".content").html(base.noList('暂无' + name));
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
					return;
				}
				data = data.data;
				var e = data.educationList;
				if(e.length == 0){
					if(pageNow == 1){
						$(".eduList").html(base.noList('暂无' + name));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();	
				}else{
					var hdata = '';					
					for(var i = 0; i < e.length; i++){
						var isFree = '',isFreec;
						if(e[i].isFree == 0){
							isFree = '免费';
							isFreec = 0;
						}else{
							if(e[i].isPay == 1){
								isFree = '已买';
								isFreec = 0;
							}else{
								isFree = '收费';
								isFreec = 1;
							}
						}
						hdata += '<li data-id="' + e[i].id + '" data-isFree="' + e[i].isFree + '" data-money="' + e[i].money + '" data-isPay="' + e[i].isPay + '" data-eduOrderId="' + e[i].eduOrderId + '">' + 
						    	'	<div class="i">' + 
						    	'		<div class="t ellipsis"><strong>' + e[i].educationName + '</strong><span>&nbsp;&nbsp;---&nbsp;&nbsp;' + e[i].source + '</span></div>' + 
						    	'		<div class="x">' + e[i].educationDescription + '</div>' + 
						    	'	</div>' + 
						    	'	<div class="c" style="background: url(' + SAYIMO.SRVPATH + 'images/find/education/eduList-' + self.random() + '.jpg) no-repeat;background-size: contain;"><em></em></div>' + 
						    	'	<div class="isFree isFree_' + isFreec +'"><em></em><span>' + isFree + '</span></div>' + 
						    	'</li>';
						educationList.push({'id': e[i].id,'url': e[i].contentUrl,'name': e[i].educationName,'source': e[i].source});   	
					}					
					$(".eduList").append(hdata);					
					if(e.length <= pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}
					self.controll();
				}
				loading = false;
			});			
		}//getAjax end

		this.random = function(){
			var a = Math.ceil(Math.random()*5);
			a > 5 ? a = 5 : a = a;
			return a;
		}
		
		this.zeroFun = function(s){
			s < 10 ? s = '0' + s : s = s;
			return s;
		}
		
		this.controll = function(){
			$(".eduList li").each(function(){
				var _this = $(this);
				_this.find('.c').off('click').on('click',function(){
					if( $(this).parents('li').attr('data-isFree') == '1' && $(this).parents('li').attr('data-isPay') == '0' ){
						var _id = $(this).parents('li').attr('data-id');
						self.isFreefrlg(_id);
						return;
					}
					if( $(this).parents('li').attr('data-isFree') == '1' && $(this).parents('li').attr('data-isPay') == '2' ){
						var _eduOrderId = $(this).parents('li').attr('data-eduOrderId');
						self.isPayfrlg(_eduOrderId);
						return;
					}					
					iNow = _this.index();
					if(flag == false){
						$(".content").css('bottom','3rem');					
						var playbox = document.getElementsByClassName('playbox')[0];
						playbox.style.transition = '0.3s';
						playbox.style.WebkitTransform = playbox.style.transform = 'translateY(0px)';
						flag = true;
						$(this).addClass('suspend');
						_this.siblings('li').find('.c').removeClass('play').removeClass('suspend');								
						self.loadplay();
					}else{
						if($(this).hasClass('play')){
							if(isplay){
								self.pasue();//音频暂停
							}
						}else if($(this).hasClass('suspend')){
							if(isplay){
								self.play();//音频播放
							}
						}else{							
							$(this).addClass('suspend');
							_this.siblings('li').find('.c').removeClass('play').removeClass('suspend');								
							self.pasue();//音频暂停
							self.clearline();
							self.loadplay();
						}							
					}					
				});
			});
			$(".paplay").off('click').on('click',function(){
				if(isplay){					
					if(audio.paused){
						self.play();//音频播放					
					}else{						
						self.pasue();//音频暂停
					}
				}
			});
			$(".prev").off('click').on('click',function(){
				self.pasue();//音频暂停				
				if( $(".eduList li").eq(iNow + 1).attr('data-isFree') == '1' && $(".eduList li").eq(iNow + 1).attr('data-isPay') == '0' ){
					var _id = $(this).parents('li').attr('data-id');
					self.isFreefrlg(_id);
					return;
				}
				if( $(".eduList li").eq(iNow + 1).attr('data-isFree') == '1' && $(".eduList li").eq(iNow + 1).attr('data-isPay') == '2' ){
					var _eduOrderId = $(this).parents('li').attr('data-eduOrderId');
					self.isPayfrlg(_eduOrderId);
					return;
				}
				iNow--;
				if(iNow < 0){
					iNow = educationList.length - 1;
				}				
				self.clearline();
				self.loadplay();
				$(".eduList li").eq(iNow).siblings('li').find('.c').removeClass('play').removeClass('suspend');
			});
			$(".next").off('click').on('click',function(){
				self.pasue();//音频暂停
				if( $(".eduList li").eq(iNow + 1).attr('data-isFree') == '1' && $(".eduList li").eq(iNow + 1).attr('data-isPay') == '0' ){
					var _id = $(this).parents('li').attr('data-id');
					self.isFreefrlg(_id);
					return;
				}
				if( $(".eduList li").eq(iNow + 1).attr('data-isFree') == '1' && $(".eduList li").eq(iNow + 1).attr('data-isPay') == '2' ){
					var _eduOrderId = $(this).parents('li').attr('data-eduOrderId');
					self.isPayfrlg(_eduOrderId);
					return;
				}
				iNow++;
				if(iNow == educationList.length){
					iNow = 0;
				}
				self.clearline();
				self.loadplay();
				$(".eduList li").eq(iNow).siblings('li').find('.c').removeClass('play').removeClass('suspend');					
			});			
			$("#touchline").off('click').on('click',function(e){
				if(self.isplay && self.flag){					
					var a = (e.pageX / $(".content").width()) * audio.duration;
					audio.currentTime = a;
				}	
			});			
		}

		this.isFreefrlg = function(id){
			$.modal({
		      title:  '提示',
		      text: '该课程需付费，您还未购买，是否购买？',
		      buttons: [
		        {
		        	text: '取消',
		        	bold: true,
		        },
		        {
		        	text: '去购买',
		        	bold: true,
		        	onClick: function() {
		        		$.showPreloader('正在生成订单');
		        		ajax.get('base/addeducationorder/' + customerId + '/' + id,'json',function(data){
		        			if(data.status == 0){
		        				$.errtoast('生成订单失败，请稍后重试');
		        				return;
		        			}
		        			window.location.href = SAYIMO.SRVPATH + 'view/pay/educationPay.html?id=' + data.data.eduOrderId + '&classId=' + classId;
		        		});					        		
		        	}					          
		        },					        
		      ]
		    });									
		}
		
		this.isPayfrlg = function(id){
			$.modal({
		      title:  '提示',
		      text: '该课程需付费，您已下单但还未支付',
		      buttons: [
		        {
		        	text: '取消',
		        	bold: true,					        	
		        },					      
		        {
		        	text: '取消订单',
		        	bold: true,
		        	onClick: function() {
		        		ajax.get('base/canceleducationorder/' + id,'json',function(data){
		        			if(data.status == 0){
		        				$.errtoast('取消订单失败，请稍后重试');
		        				return;
		        			}		        			
		        			$.errtoast('取消成功');
		        			setTimeout(function(){window.location.reload();},1000);
		        		});		        		
		        	}					        	
		        },
		        {
		        	text: '去支付',
		        	bold: true,
		        	onClick: function() {
		        		window.location.href = SAYIMO.SRVPATH + 'view/pay/educationPay.html?id=' + id + '&classId=' + classId;			        		
		        	}					          
		        },					        
		      ]
		   });
		}
		
		this.loadplay = function(){
			var i = iNow,
				id = 'audio' + i;
			$(".playbox .info .t").text(educationList[i].name);
			$(".playbox .info .s").text(educationList[i].source);
			if($('#' + id).length == 0){			
				var newaudio = $('<audio id="' + id + '">').html('<source src="'+ educationList[i].url +'">').appendTo(".playbox");
				audio = document.getElementById(id);
				isplay = false;					
				//当浏览器开始查找音频/视频时			
				audio.addEventListener('loadstart', function(){
					$(".playbox .c .l .info .load").show();				
				}, false);
				//当浏览器已加载音频/视频的元数据时
				audio.addEventListener('loadedmetadata', function(){
					setInterval(function(){						
						var buffered = audio.buffered.end(0),
							s = - (100 - (buffered/audio.duration) * 100),	
							l = document.getElementById('load-line');							
						if(s <= 0){l.style.WebkitTransform = l.style.transform = 'translateX(' + s + '%)';}					
					},1000);
				}, false);
				var device = $.device;
				if(device.android == true){//android下使用api 的canplay方法进行播放
					//当浏览器可以播放音频/视频时
					audio.addEventListener('canplay', function(){
						isplay = true;
						$(".playbox .c .l .info .load").hide();				
						self.play();
						setInterval(function(){
							var	curtime = audio.currentTime,
								s = - (100 - (curtime/audio.duration) * 100),	
								l = document.getElementById('play-line');
							if(s <= 0){l.style.WebkitTransform = l.style.transform = 'translateX(' + s + '%)';}
							var duration = audio.duration,
								branch = self.zeroFun(Math.floor(duration/60)),
								second = self.zeroFun(Math.floor(duration - branch * 60)),
								branch_c = self.zeroFun(Math.floor(curtime/60)),
								second_c = self.zeroFun(Math.floor(curtime - branch_c * 60));							
							$("#time").text(branch_c + ':' + second_c + ' / ' + branch + ':' + second);
						},1000);
					}, false);
				}else if(device.ios == true){//ios下直接进行播放
					isplay = true;
					$(".playbox .c .l .info .load").hide();						
					audio.play();
				    document.addEventListener("WeixinJSBridgeReady", function () {
				            audio.play();
				    }, false);
					setInterval(function(){
						var	curtime = audio.currentTime,
							s = - (100 - (curtime/audio.duration) * 100),	
							l = document.getElementById('play-line');
						if(s <= 0){l.style.WebkitTransform = l.style.transform = 'translateX(' + s + '%)';}
						var duration = audio.duration,
							branch = self.zeroFun(Math.floor(duration/60)),
							second = self.zeroFun(Math.floor(duration - branch * 60)),
							branch_c = self.zeroFun(Math.floor(curtime/60)),
							second_c = self.zeroFun(Math.floor(curtime - branch_c * 60));							
						$("#time").text(branch_c + ':' + second_c + ' / ' + branch + ':' + second);
					},1000);				    
				}							
				//当音频/视频已暂停时(缓冲)
				audio.addEventListener('pause', function(){
					$(".eduList li").eq(iNow).find('.c').addClass('suspend').removeClass('play');
					$(".paplay").addClass('pasue').removeClass('play');
				}, false);
				//当音频/视频在已因缓冲而暂停或停止后已就绪时
				audio.addEventListener('playing', function(){
					$(".playbox .c .l .info .load").hide();
					self.play();				
				}, false);
				//当音频播放结束时	
				audio.addEventListener('ended', function(){
					$(".eduList li").eq(iNow).find('.c').addClass('suspend').removeClass('play');
					$(".paplay").addClass('pasue').removeClass('play');
				}, false);
				//当在音频/视频加载期间发生错误时
				audio.addEventListener('error', function(){
					$.errtoast('音频加载错误');
					$(".playbox .c .l .info .load").show();
					$(".eduList li").eq(iNow).find('.c').addClass('suspend').removeClass('play');
					$(".paplay").addClass('pasue').removeClass('play');					
				},false);
			}else{
				audio = document.getElementById(id);
				audio.play();
			    document.addEventListener("WeixinJSBridgeReady", function () {
			            audio.play();
			    }, false);				
				isplay = true;
			}			
		}
		
		this.play = function(){
			$(".eduList li").eq(iNow).find('.c').addClass('play').removeClass('suspend');
			$(".paplay").addClass('play').removeClass('pasue');			
			audio.play();
		    document.addEventListener("WeixinJSBridgeReady", function () {
		            audio.play();
		    }, false);			
		}
		
		this.pasue = function(){
			$(".eduList li").eq(iNow).find('.c').addClass('suspend').removeClass('play');
			$(".paplay").addClass('pasue').removeClass('play');
			audio.pause();			
		}
		
		this.clearline = function(){
			var l = document.getElementById('load-line'),
				p = document.getElementById('play-line');
			l.style.WebkitTransform = l.style.transform = 'translateX(-100%)';
			p.style.WebkitTransform = p.style.transform = 'translateX(-100%)';
		}
		
		self.getAjax();
		
		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			loading = true;
			pageNow++;
			self.getAjax();		
			$.refreshScroller();
		});
		
	}//fun_eduList end
	fun_eduList();	
});