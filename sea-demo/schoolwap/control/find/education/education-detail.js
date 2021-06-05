define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./education-detail.css');	
	
	base.init();
	base.setTitle('职业课堂');
	
	var fun_eduDetail = function(){		
		var self = this;
		
		var id = base.getQueryString('id'),
			eduOrderId = base.getQueryString('id'),
			customerId = cookie.getCookie('customerId');
		
		var _audio = document.getElementById('audio'),
			playControl = $("#playControl"),
			playLoader = $("#playLoader"),
			playTime = $("#playTime"),
			soureTime = $("#soureTime"),
			eduTime = $("#eduTime"),
			playLineBox = $("#playLineBox"),
			playLine = document.getElementById('playLine'),
			isLoad = false,//是否加载
			isPlay = false;//是否在播放
		
		var isPay,//是否收费且是否购买
			classId,//分类ID
			eduOrderId;//订单ID
		
		var playSetIntervalFun;
		
		ajax.get('base/geteducationdetail/' + id + '/' + customerId,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');				
				return;
			}
			data = data.data.education;
			classId = data.classId;
			$("#eduName").html(data.educationName);
			if(data.isFree == 1){
				$("#isFree, #payBtn").show();
				$("#eduMoney").html(data.money);
				isPay = data.isPay;
				if(isPay == 1){
					$("#payBtn").html('已购买');
				}else if(isPay == 2){
					eduOrderId = data.eduOrderId;
				}
				$("#payBtn").on('click',function(){
					if(isPay == 0 || isPay == 2){
						self.goPay();											
					}
				});
			}
			$("#tab1 .html-content").html('<p>课程分类：' + data.className + '</p><p>课程来源：' + data.source + '</p><p>课程介绍：' + data.educationDescription + '</p>');
			if(data.teacherName != null && data.teacherName != undefined && data.teacherName != ''){
				$("#tab2 .html-content").html('<p><img src="' + data.teacherPhoto + '" class="photo">' + data.teacherName + '</p><p style="margin-top: .5rem;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.teacherDesc + '</p>');
			}
			if(data.mediaType == 1){
				_audio.innerHTML = '<source src="'+ data.contentUrl + '">';//载入MP3	
				self.audioPlay();
			}else if(data.mediaType == 2){
				$(".play-line, .play-control").hide();
				$(".play-soure").css({'background':'#000000',"height":"auto"});
				$(".play-soure").html('<video webkit-playsinline playsinline controls="controls" id="video"><source src="'+ data.contentUrl + '" type="video/mp4"/></video>');
				var video = document.getElementById('video');
				video.addEventListener('durationchange', function(){//当浏览器已加载音频/视频的元数据时
					var duration = video.duration,
						branch = Math.floor(duration/60),
						second = Math.floor(duration - branch * 60),
						t = '';	
					if(branch == 0 && second != 0){
						t = '时长：' + second + '秒';
					}else if(branch != 0 && second == 0){
						t = '时长：' + branch + '分';
					}else if(branch != 0 && second != 0){
						t = '时长：' + branch + '分' + second + '秒';
					}										
					eduTime.html(t);
				}, false);			
			}
		});

		this.zeroFun = function(s){
			s < 10 ? s = '0' + s : s = s;
			return s;
		}
		
		this.audioPlay = function(){// MP3播放				
			audio.addEventListener('loadedmetadata', function(){//当浏览器已加载音频/视频的元数据时
				setTimeout(function(){
					playLoader.hide();
					playControl.addClass('pasue');
					var duration = audio.duration,
						branch = Math.floor(duration/60),
						second = Math.floor(duration - branch * 60),
						t = '';	
					if(branch == 0 && second != 0){
						t = '时长：' + second + '秒';
					}else if(branch != 0 && second == 0){
						t = '时长：' + branch + '分';
					}else if(branch != 0 && second != 0){
						t = '时长：' + branch + '分' + second + '秒';
					}										
					eduTime.html(t);
					soureTime.html(self.zeroFun(branch) + ':' + self.zeroFun(second));
					isLoad = true;//已经加载完毕
				},1000);
			}, false);
						
			audio.addEventListener('ended', function(){//当音频播放结束时
				setTimeout(function(){clearInterval(playSetIntervalFun);},1000);				
				playControl.removeClass('play').addClass('pasue');
				isPlay = false;				
			}, false);
			
			audio.addEventListener('error', function(){//当在音频/视频加载期间发生错误时
				$.errtoast('音频加载错误');
				playLoader.show();
				playControl.removeClass('play');
				playControl.removeClass('pasue');
				isPlay = false;
				isLoad = false;
			},false);
				
			playControl.on('click',function(){				
				if(isPay == 0 || isPay == 2){
					self.goPay();
				}
				if(!isPlay && isLoad){//点击播放					
					self.play();
					self.playSetInterval();
					isPlay = true;
				}else if(isPlay && isLoad){// 点击停止
					audio.pause();
					clearInterval(playSetIntervalFun);
					playControl.removeClass('play').addClass('pasue');
					isPlay = false;
				}
			});
			
			playLineBox.on('click',function(e){// 点击快进
				if(isPlay && isLoad){
					var a = ((e.pageX - playTime.width()) / $(this).width()) * audio.duration;
					audio.currentTime = a;
				}					
			});
		}
		
		this.play = function(){
			playControl.removeClass('pasue').addClass('play');			
			audio.play();
		    document.addEventListener("WeixinJSBridgeReady", function () {
		        audio.play();
		    }, false);				
		}
		
		this.playSetInterval = function(){
			playSetIntervalFun = setInterval(function(){
				var	curtime = audio.currentTime,
					s = - (100 - (curtime/audio.duration) * 100);
				if(s <= 0){playLine.style.WebkitTransform = playLine.style.transform = 'translateX(' + s + '%)';}
				var duration = audio.duration,
					branch_c = self.zeroFun(Math.floor(curtime/60)),
					second_c = self.zeroFun(Math.floor(curtime - branch_c * 60));							
				playTime.html(branch_c + ':' + second_c);
			},1000);			
		}
		
		this.goPay = function(){
			if(isPay == 0){
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
			        		ajax.post('base/addeducationorder',{'customerId': customerId,'educationId': eduOrderId},'json',function(data){
			        			if(data.status == 0){
			        				$.errtoast('生成订单失败，请稍后重试');
			        				return;
			        			}
			        			eduOrderId = data.data.eduOrderId;
			        			window.location.href = SAYIMO.SRVPATH + 'view/pay/educationPay.html?id=' + eduOrderId + '&classId=' + classId;
			        		});					        		
			        	}					          
			        },					        
			      ]
			    });
		    }else if(isPay == 2){	    
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
			        		ajax.post('base/canceleducationorder',{'eduOrderId': eduOrderId},'json',function(data){
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
			        		window.location.href = SAYIMO.SRVPATH + 'view/pay/educationPay.html?id=' + eduOrderId + '&classId=' + classId;			        		
			        	}					          
			        },					        
			      ]
			   });						
			}		   
		}
	}
	fun_eduDetail();	
});