define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./education-list.css');	
	
	base.init();
	base.setTitle('职业课堂');
	
	var fun_eduList = function(){		
		var self = this;
		
		var pageNow = 1,
			pageSize = 10,
			loading = false;	
		
		this.getEduList = function(j){
			var t = '';j == 1 ? t = '音频' : t = '视频';
			ajax.get('base/geteducationbytype/' + pageSize + '/' + pageNow + '/' + j,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					$("#tab" + j).html(base.noList('暂无' + t + '教学'));
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
					return;
				}
				data = data.data;
				if(data.educationList.length == 0){
					if(pageNow == 1){$("#tab" + j).html(base.noList('暂无' + t + '教学'));}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					require('dateFormat');
					data = data.educationList;
					var htmldata = '',d = new Date();;
					for(var i = 0; i < data.length; i++){
						var fc = '',ft = '',c = '';
						data[i].isFree == 0 ? fc = 'm' : fc = 's';
						data[i].isFree == 0 ? ft = '免费' : ft = '收费';
						if(data[i].classId == 1){c = '初';}else if(data[i].classId == 2){c = '中';}else{c = '高';}
						d.setTime(data[i].createTime);
						htmldata += '<li data-id="' + data[i].id + '">' +
									'<div class="l"><img src="' + SAYIMO.SRVPATH + 'images/find/education/eduList-' + self.random() + '.jpg" ><span class="' + fc + '">' + ft + '</span></div>' +
									'<div class="r"><p class="t clamp_2">' + data[i].educationName + '</p><p class="s">来源：' + data[i].source + '</p>' +
									'<p class="d">发布时间：' + d.format('yyyy-MM-dd HH:mm:ss') + '</p><span class="c">' + c+ '</span></div></li>';	
					}
					if(pageNow == 1){
						$("#tab" + j).html('<ul class="eduList">' + htmldata + '</ul>');
					}else{
						$("#tab" + j).find(".eduList").append(htmldata);
					}
					if(data.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();							
					}
					$(".tab-link").eq(j - 1).addClass('on');
					self.listClickFun(j);
				}
				loading = false;
			});
		}

		this.random = function(){
			var a = Math.ceil(Math.random()*5);
			a > 5 ? a = 5 : a = a;
			return a;
		}
		
		self.getEduList(1);
		
		this.listClickFun = function(j){// 列表点击把数据使用localStorage本地缓存
			$("#tab" + j).find(".eduList li").each(function(){
				$(this).on('click',function(){
					var _this = $(this),
						id = _this.attr('data-id'),
						localEduList = localStorage.getItem('eduList');
					if(localEduList == null){
						localStorage.setItem('eduList',JSON.stringify([{'id': id,'val': '<li data-id="' + id + '">' +  _this.html() + '</li>'}]));						
					}else{
						localEduList = JSON.parse(localEduList);
						var localEduListId = '';
						for(var i = 0; i < localEduList.length; i++){
							localEduListId += localEduList[i].id;
						}
						if(localEduListId.indexOf(id) < 0){
							localEduList.push({'id': id,'val': '<li data-id="' + id + '">' +  _this.html() + '</li>'});
							localStorage.setItem('eduList',JSON.stringify(localEduList));	
						}
					}
					window.location.href = SAYIMO.SRVPATH + 'view/find/education/education-detail.html?id=' + id;
				});
			});
		}
		
		$(".tab-link").each(function(i){
			i = i + 1;
			if(i < 3){
				$(this).on('click',function(){
					if($("#tab" + i).html() == '' || ($("#tab" + i).find('.eduList li').length > pageSize && (($("#tab" + i).find('.eduList li').length)%pageSize) != 0)){
						$.attachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').show();
					}
					if(!$(this).hasClass('on')){	
						pageNow = 1;
						self.getEduList(i);
					}
				});
			}
		});
		
		$(".tab-link:last-child").on('click',function(){
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();				
			if(!$(this).hasClass('on')){								
				var localEduList = localStorage.getItem('eduList');
				if(localEduList == null){
					$("#tab3").html(base.noList('暂未播放教学课程'));
				}else{
					var htmldata = '';
					localEduList = JSON.parse(localEduList);					
					for(var i = 0; i < localEduList.length; i++){
						htmldata += localEduList[i].val;
					}
					$("#tab3").html('<ul class="eduList">' + htmldata + '</ul>');
				}
				$(this).addClass('on');
				$("#tab3 .eduList li").each(function(){
					$(this).on('click',function(){
						window.location.href = SAYIMO.SRVPATH + 'view/find/education/education-detail.html?id=' + $(this).attr('data-id');
					});
				});				
			}
		});
		
		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			loading = true;
			pageNow++;
			var i = $(".tab-link.active").index() + 1;
			if(i < 3){self.getEduList(i);}
			$.refreshScroller();
		});
		
	}
	fun_eduList();	
});