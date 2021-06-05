define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./mecollectList.css');
	
	window.jsObj.setLoadUrlTitle('我的收藏');
	
	var collect = function(){
		var self = this;
		
		var customerId = window.jsObj.readUserData('id'),
			pageNow = 1,
			pageSize = 10,
			loading = true;				

		var lazy = require('LazyLoad');
		
		this.init = function(j){
			loading = true;
			ajax.get('goods/goodscollectlist/' + customerId + '/' + pageNow + '/' + pageSize + '/' + j,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data;
				var c = data.goodscollectionList;
				if(c.length == 0){
					if(pageNow == 1){
						$("#tab" + j).find('.collect-list').html(base.noMent('暂无收藏'));
					}					
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();										
				}else{					
					var h = '',ahref = '',btn = '',r = '';
					if(j == 1){
						r = 'view/class/goodsDetail.html';
					}else{
						r = 'view/reserved/reservedDetail.html';
					}
					for(var i = 0; i < c.length; i++){
						if(c[i].isactivity == 1){
							if(c[i].identifier.indexOf('KJ') > 0){r = 'view/activity/yqkj/yqkjDetail.html';}
							ahref = '&isActivity=' + c[i].isactivity + '&identifier=' + c[i].identifier;
							if(c[i].seckillTimesId != 0){
								ahref += '&seckillTimesId=' + c[i].seckillTimesId;
							}
						}else{
							ahref = '';
						}
						if(j == 1 && c[i].isactivity != 1){
							btn = '<div class="sa-icon sa-icon-1" id="addShopcart"></div>' + 
									'<div class="sa-icon sa-icon-2" id="deleteCollect"></div>';
						}else{
							btn = '<div class="sa-icon sa-icon-2" id="deleteCollect"></div>';								
						}
						h += '<li data-goodsId="' + c[i].goodsId + '" data-normsValueId="' + c[i].normsValueId + '" data-identifier="' + c[i].identifier + '" data-seckillTimesId="' + c[i].seckillTimesId + '">' + 
							'	<div class="cont">' + 
							'		<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + r + '?goodsId=' + c[i].goodsId + '&normsValueId=' + c[i].normsValueId + ahref + '" class="l">' + 
							'			<img class="lazy" data-lazyload="' + c[i].phtotUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png">' + 
							'		</a>' + 
							'		<div class="r">' + 
							'			<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + r + '?goodsId=' + c[i].goodsId + '&normsValueId=' + c[i].normsValueId + ahref + '">' + c[i].goodsName + '</a>' + 
							'			<div class="bot">' + 
							'				<div class="m fl"><span class="i arial">￥</span><span class="n">' + c[i].sellPrice + '</span></div>' + 
							'				<div class="b fr">' + btn + 
							'				</div>' + 
							'			</div>' + 
							'		</div>' + 
							'	</div>' + 
							'</li>';
					}					
					if(c.length <= pageSize - 1){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();					
					}										
					if(self.pageNow == 1){
						$("#tab" + j).find('.collect-list').html(h);
					}else{
						$("#tab" + j).find('.collect-list').append(h);
					}
					lazy.init();//刷新图片懒加载
					self.control(j);//控制						
				}
				$("#btab" + j).addClass('getlist');
				loading = false;
			});			
		}
		
		this.control = function(j){
			$("#tab" + j).find('.collect-list li').each(function(){
				$(this).find('a').off('click').on('click',function(){					
					window.jsObj.loadContent($(this).attr('data-url'));					
				});					
				$(this).find('#addShopcart').off('click').on('click',function(){
					var goodsId = $(this).parents('li').attr('data-goodsId'),
						normsValueId = $(this).parents('li').attr('data-normsValueId');	
					ajax.post('goods/addshoppingcart',{
						"goodsId": goodsId,
						"normsValueId": normsValueId,
						"customerId": customerId,
						"buyNum": '1'
					},'json',function(data){					
						if(data.status == 0){
							$.errtoast('添加失败');
						}else{
							$.errtoast('添加成功,在购物车等着您');							
						}						
					});						
				});
				$(this).find('#deleteCollect').off('click').on('click',function(){
					var t = $(this);
					$.confirm('确认取消该收藏？',
						function () {
							var goodsId = t.parents('li').attr('data-goodsId'),
								identifier = t.parents('li').attr('data-identifier'),
								seckillTimesId = t.parents('li').attr('data-seckillTimesId');
							ajax.post('goods/goodscollectdelete',{
								"goodsId": goodsId,
								"customerId": customerId,
								"identifier": identifier,
								"seckillTimesId": seckillTimesId 
							},'json',function(data){
								if(data.status == 0){
									$.errtoast('服务器繁忙，请稍后重试');
									return;
								}																
								$.errtoast('取消成功');
								t.parents('li').remove();
								if($(".tab.active .collect-list").html() == ''){
									$(".tab.active").html(base.noMent('暂无收藏'));
								}
							});	
						}
					);										
				});				
			});			
		}
		
		self.init(1);

		$(".tab-link").each(function(){
			$(this).on('click',function(){
				var i = $(this).index() + 1;
				if($("#btab" + i).hasClass('getlist') == false){
					$.attachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').show();						
					pageNow = 1;				
					self.init(i);
				}
			});
		});

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;
			pageNow++;			
			self.init($(".tab-link.active").index() + 1);
			$.refreshScroller();
		});
		
	}
	
	collect();

});