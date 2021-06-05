define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./myreward-list.css');	
	
	window.jsObj.setLoadUrlTitle('我的投标');
	
	var rewardList = function(){
		var self = this;
		
		var	customerId = window.jsObj.readUserData('id'),	
			status = [1,2,3,-1],//状态数组
			loading = true,
			pageNow = 1,
			pageSize = 10;
		
		var lazy = require('LazyLoad');
		
		this.getAjax = function(j){
			loading = true;
			ajax.get('base/selectmyrewardlist/' + customerId + '/' + pageSize + '/' + pageNow + '?status=' + status[j],'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				
				$(".tab-link.active").addClass('y');
				if(data.length == 0){
					if(pageNow == 1){
						$(".tab.active .rewardList").html(base.noMent('暂无投标'));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();
				}else{
					var htmldata = '';
					for(var i = 0; i < data.length; i++){
						var status = '', statusClass = '';
						if(j == 0){
							status = '待中标';
							statusClass = ' p_l_1';
						}else if(j == 1){
							status = '已中标';
							statusClass = ' p_l_2';							
						}else if(j == 2){
							status = '已完成';
							statusClass = ' p_l_3';							
						}else{
							status = '未中标';
							statusClass = ' p_l_4';						
						}
						var other_d = new Date();
						other_d.setTime(data[i].submitDate);
						htmldata += '<li>' +
									'	<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/find/reward/reward-detail.html?id=' + data[i].id + '">' +
									'		<div class="p_l' + statusClass + '">' + status + '</div>' +
									'		<div class="l">' +
									'			<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
									'		</div>' +
									'		<div class="r">' +
									'			<div class="t clamp_2">' + data[i].rewardName + '</div>' +
									'			<div class="p red">赏金：<span class="arial">￥</span>' + data[i].factPrice.toFixed(2) + '</div>' +									
									'			<div class="i ellipsis">' + data[i].resume + '</div>' +	
									'		</div>' +
									'	</a>' +
									'</li>'; 
					}
					if(data.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();
					}					
					if(pageNow == 1){
						$(".tab.active .rewardList").html(htmldata);
					}else{
						$(".tab.active .rewardList").append(htmldata);
					}
					lazy.init();//刷新图片懒加载
					$(".tab.active .rewardList li").each(function(){
						$(this).find('a').off('click').on('click',function(){						
							window.jsObj.loadContent($(this).attr('data-url'));
						});
					});						
				}
				loading = false;
			});
		}
	
		self.getAjax(0);				

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				if($(this).hasClass('y')){return;}
				pageNow = 1;
				$.attachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').show();					
				self.getAjax($(this).index());				
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;
			self.getAjax($(".tab-link.active").index());
			$.refreshScroller();
		});
		
	}
	rewardList();

});