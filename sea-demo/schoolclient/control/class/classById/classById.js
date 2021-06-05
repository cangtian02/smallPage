define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax'),
		lazy = require('LazyLoad');		
	require('./classById.css');
	
	//获取初始值
	var classId = base.getQueryString("id"),//分类id
		name = decodeURIComponent(base.getQueryString("name")),//分类名称
		pageSize = 10,//分页个数
		pageNow = 1,//分页页码
		sortMode = '',//升降序
		sortWord = '',//排序字段		
		brandId = '',//品牌id
		goodsName = '',//搜索名称
		d_two = '',
		loading = true,
		sort_bar = false;//是否显示搜索栏
	
	window.jsObj.setLoadUrlTitle(name);

	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '1',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		classID: classId,//商品分类id
		searchCall: function(v){
			pageNow = 1;
			goodsName = v;
			getAjax();		
		},//搜索框回调
		searchListCall: function(v){
			pageNow = 1;
			goodsName = v;
			getAjax();				
		}//搜索内容回调
	});
	
	//下拉刷新与无线加载绑定
	$(document).on('infinite', '.infinite-scroll-bottom',function() {
		if (loading) return;
		pageNow++;
		getAjax();
		$.refreshScroller();
	});
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		pageNow = 1;
		getAjax();
		$.pullToRefreshDone('.pull-to-refresh-content');
	});
	
	function getAjax(){		
		loading = true;	
		ajax.get('goods/getgoodslistbyclassid/' + classId + '/' + pageSize + '/' + pageNow + '?goodsName=' + goodsName + '&sortWord=' + sortWord + '&sortMode=' + sortMode + '&brandId=' + brandId,'json',function(data){
			if(data.status == 0){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();				
				return;
			}						
			data = data.data.goodsList;
			if(data.length > 0){
				var htmldata = '';
				for(var i = 0; i < data.length; i++){
					htmldata += '<li data-id="' + data[i].goodsId + '" data-normsvalueid="' + data[i].normsValueId + '">' +
								'	<div class="dis bgf">' +
								'		<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
								'		<div class="tt ellipsis">' + data[i].goodsName + '</div>' +
								'		<div class="money"><font><span class="arial">￥</span>' + data[i].preferentialPrice.toFixed(2) + '</font><del><span class="arial">￥</span>' + data[i].originalPrice.toFixed(2) + '</del></div>' +
								'	</div>' +
								'</li>';	
				}				
				if(pageNow == 1){
					$("#classGoodList").html(htmldata);
				}else{
					$("#classGoodList").append(htmldata);
				}					
				lazy.init();//刷新图片懒加载
				if(sort_bar == false){
					$("#sort-bar, .pull-to-refresh-layer, .infinite-scroll-preloader").show();//初次进入有商品时显示搜索栏
					$("#base_load").hide();
					sort_bar = true;
				}								
				if(data.length < pageSize){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
				}
				$(".classGoodList li").each(function(){
					$(this).off('click').on('click',function(){						
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + $(this).attr('data-id') + '&normsValueId=' + $(this).attr('data-normsvalueid'));
					});
				});			
			}else{			
				if(pageNow == 1){
					$("#base_load").hide();//隐藏load
					$("#classGoodList").html(base.noList('商品正在路上'));				
				}											
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();
			}
			loading = false;			
		});
	}
	
	getAjax();

	$(".sort-bar li").each(function(){
		$(this).on('click',function(){
			var self = $(this),
				i = self.index();
			self.addClass('active');
			if(i == 0){
				if (loading) return;
				if(self.hasClass('flag') == false){
					self.addClass('active').siblings('li').attr('class','');
					d_two = 0;
					sortMode = '';
					sortWord = '';
					brandId = '';
					pageNow = 1;
					getAjax();
					self.addClass('flag');
				}				
			}else if(i == 3){
				$(".sort-bar li").eq(0).attr('class','');
				sortBrand();
			}else{
				if (loading) return;
				$(".sort-bar li").eq(0).attr('class','');
				if(self.hasClass('j') == false && self.hasClass('s') == false){
					d_two = null;
				}
				if(d_two == null){
					self.addClass('j');
					d_two = 0;
				}else if(d_two == 0){
					self.addClass('s').removeClass('j');
					d_two = 1;
				}else if(d_two == 1){
					self.addClass('j').removeClass('s');
					d_two = 0;
				}
				var j;
				i == 1 ? j = 2 : j =1;
				$(".sort-bar li").eq(j).removeClass('active');
				sortWord = i;
				sortMode = d_two;
				pageNow = 1;
				getAjax();				
			}		
		});
	});

	function sortBrand(){
		if($(".t_box").length == 0){
			var _text = '<div class="mask show"></div>' +
						'<div class="t_box show">' + 
						'	<div class="t tc red">请选择品牌名称</div>' + 
						'	<div class="cont">' + 
						'		<div class="list-block brandList"><ul><div class="infinite-scroll-preloader"><div class="preloader"></div></div></ul></div>' + 
						'	</div>' + 
						'</div>';
			$(".page").append(_text);		
			ajax.get('goods/getbrandlistbyclassid/' + classId,'json',function(data){
				if(data.status == 0){
					$(".brandList").html('<p>暂无品牌分类</p>');
					return;
				}				
				var brandList = data.data.brandList;			
				if(brandList.length == 0){
					$(".brandList").html('<p>暂无品牌分类</p>');
				}else{
					var html = '';
					for(var i = 0; i < brandList.length; i++){
						html += '<li data-id="' + brandList[i].id + '">' +
				              	'<a href="javascript:;" class="item-link item-content">' +
				                '	<div class="item-inner">' +
				                '  		<div class="item-title">' + brandList[i].brandName + '</div>' +
				                '	</div>' +
				              	'</a>' +
				            	'</li>';
			        }
					$('.brandList ul').html(html);
					$('.brandList ul li').each(function(){
						$(this).on('click',function(){
							brandId = $(this).attr('data-id');
							pageNow = 1;
							$(this).addClass('active').siblings('li').removeClass('active');
							$(".mask, .t_box").removeClass('show').addClass('hide');
							getAjax();			
						});
					});				
				}
			});		
		}else{
			$(".mask, .t_box").removeClass('hide').addClass('show');
			$('.brandList ul li').each(function(){
				if($(this).attr('data-id') == brandId){
					$(this).addClass('active');
				}else{
					$(this).removeClass('active');
				}
			});				
		}
		$(".mask").on('click',function(){
			$(".mask, .t_box").removeClass('show').addClass('hide');
		});
	}

});