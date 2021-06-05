define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./reward-list.css');	
	
	window.jsObj.setLoadUrlTitle('赏金猎人');
	
	var fun_rewardList = function(){
		var self = this;
		
		var	pageNow = 1,
			pageSize = 10,
			rewardName = '',
			classId,
			loading = true;
		
		var content = $(".content"),
			toggerBox = $("#toggerBox"),
			rewardClassList = $("#rewardClassList"),
			rewardList = $("#rewardList");
		
		this.getRewardClasslist = function(){// 获取投标分类
			ajax.get('base/baserewardclasslist','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data.rewardClassList;
				if(data.length == 0){
					rewardList.html(base.noList('暂无赏金投标'));
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					// 有投标分类才显示搜索bar
					var search = require('search');	
					search({
						searchId: 'search',//搜索框id
						placeholder: '请输入您要找的商品名称',
						searchType: 'p',//搜索dom格式 p：公共格式
						isOpensugges: false,//不开启模糊搜索提示
						searchCall: function(v){
							pageNow = 1;
							rewardName = v;
							self.getRewardList();
						}//搜索框回调
					});
					var classData = '';
					for(var i = 0; i < data.length; i++){
						classData += '<li data-id="' + data[i].id + '"><div>' + data[i].className + '</div></li>';
					}
					if(data.length%4 != 0){
						for(var j = 0; j < 4 - data.length%4; j++){
							classData += '<li></li>'; 
						}		
					}					
					rewardClassList.find('ul').html(classData);
					if(data.length <= 4){
						content.css('top','4.75rem');
					}else if(data.length > 4 && data.length <= 8){
						content.css('top','6.75rem');
						rewardClassList.css('height','4.2rem');
						rewardClassList.find('ul').css('height','4.2rem');
					}else if(data.length > 8){
						content.css('top','8.75rem');
						rewardClassList.css('height','6.1rem');
						rewardClassList.find('ul').css('height','4.1rem');						
						toggerBox.show();
						var istoggerBox = false;
						toggerBox.on('click',function(){
							if(!istoggerBox){
								rewardClassList.find('ul').css('height','auto');
								toggerBox.html('收起&nbsp;&nbsp;<span class="icon icon-up"></span>');
								istoggerBox = true;
							}else{
								rewardClassList.find('ul').css('height','4.1rem');
								toggerBox.html('展开&nbsp;&nbsp;<span class="icon icon-down"></span>');
								istoggerBox = false;
							}
						});						
					}
					rewardClassList.find('ul li').each(function(){
						$(this).on('click',function(){
							var _id = $(this).attr('data-id');
							if(_id != undefined && _id != null && _id != ''){
								$.attachInfiniteScroll($('.infinite-scroll'));
								$('.infinite-scroll-preloader').show();
								pageNow = 1;
								goodsName = '';
								classId = _id;
								$(this).addClass('active').siblings('li').removeClass('active');
								rewardList.html('');
								self.getRewardList();
							}
						});
					});
					classId = data[0].id;
					rewardClassList.find('ul li').eq(0).addClass('active');
					self.getRewardList();
				}
			});
		}
		
		var lazy = require('LazyLoad');
		
		this.getRewardList = function(){
			loading = true;
			ajax.get('base/selectbaserewardlist?id=&classId=' + classId + '&pageNow=' + pageNow + '&pageSize=' + pageSize + '&rewardName=' + rewardName,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data.reward;
				if(data.length == 0){					
					if(pageNow == 1){
						rewardList.html(base.noList('暂无赏金投标'));
					}
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					var htmlData = '';
					for(var i = 0; i < data.length; i++){
						var status = '', statusClass = '';
						if(data[i].status == 1){
							status = '待中标';
							statusClass = '';
						}else if(data[i].status == 2){
							status = '已中标';
							statusClass = 'p_l_2';							
						}else if(data[i].status == 3){
							status = '已完成';
							statusClass = '';							
						}	
						htmlData += '<li>' +
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
					setTimeout(function(){					
						if(pageNow == 1){
							rewardList.html(htmlData);
						}else{
							rewardList.append(htmlData);
						}
						lazy.init();//刷新图片懒加载
						rewardList.find("li").each(function(){
							$(this).find('a').off('click').on('click',function(){						
								window.jsObj.loadContent($(this).attr('data-url'));
							});
						});						
					},10);
				}
				loading = false;
			});				
		}
		
		self.getRewardClasslist();//获取转让分类

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;			
			pageNow++;
			self.getRewardList();		
			$.refreshScroller();
		});

		$("#myreward").on('click',function(){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/reward/myreward-list.html');
		});
	}
	fun_rewardList();	
});