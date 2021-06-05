define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./studentShop-goodslist.css');		
	
	base.init();
	
	//获取初始值
	var customerId = cookie.getCookie('customerId'),//会员id
		classId = base.getQueryString("id"),//分类id
		name = base.getQueryString("name"),//分类名称
		pageSize = (base.getQueryString("pageSize")) == null ? 10 : (base.getQueryString("pageSize")),//分页个数
		pageNow = (base.getQueryString("pageNow")) == null ? 1 : (base.getQueryString("pageNow")),//分页页码
		sortWord = (base.getQueryString("sortWord")) == null ? '' : (base.getQueryString("sortWord")),//排序字段
		sortMode = (base.getQueryString("sortMode")) == null ? '' : (base.getQueryString("sortMode")),//升降序
		brandId = (base.getQueryString("brandId")) == null ? '' : (base.getQueryString("brandId")),//品牌id
		goodsName = (base.getQueryString("goodsName")) == null ? '' : (base.getQueryString("goodsName")),//搜索名称
		goodsId = (base.getQueryString("goodsId")) == null ? '' : (base.getQueryString("goodsId")),//商品id
		d_two = sortMode,//搜索辩别
		loading = false,
		_onload = true,
		sort_bar = false;//是否显示搜索栏
	
	base.setTitle(name);
	
	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '1',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		classID: classId,//商品分类id
		searchCall: function(v){		
			pageSize = pageSize;pageNow = 1;sortWord = '';sortMode = '';brandId = '';goodsName = v;loading = true;
			refresh();		
		},//搜索框回调
		searchListCall: function(v){			
			pageSize = pageSize;pageNow = 1;sortWord = '';sortMode = '';brandId = '';goodsName = v;loading = true;
			refresh();					
		}//搜索内容回调
	});
	
	//下拉刷新与无线加载绑定
	$(document).on('infinite', '.infinite-scroll-bottom',function() {
		if (loading) return;
		pageNow++;
		getAjax(1);
		$.refreshScroller();
	});
	$(document).on('refresh', '.pull-to-refresh-content',function() {
		if (loading) return;
		pageNow--;
		if(pageNow == 0){pageNow = 1}
		pageSize = pageSize;pageNow = pageNow;sortWord = sortWord;sortMode = sortMode;brandId = brandId;goodsName = goodsName;
		loading = true;
		getAjax(2);
		$.pullToRefreshDone('.pull-to-refresh-content');
	});
	
	//初始化	
	getAjax(1);//ajax获取数据
	if(goodsId != ''){
		if(sortWord != ''){
			$(".sort-bar li").eq(sortWord).addClass('active');
		}
		if(sortMode == 0){
			$(".sort-bar li").eq(sortWord).addClass('j');
		}else{
			$(".sort-bar li").eq(sortWord).addClass('s');
		}	
	}	
	
	function getAjax(i){//ajax获取数据 i = 1为页面初次载入和无限加载方式， i = 2 为下拉加载		
		var f;
		if(i == 1){f = getList;}else if(i == 2){f = getListpull;}
		ajax.get('goods/getgoodslistbyclassid/' + classId + '/' + pageSize + '/' + pageNow + '?goodsName = ' + goodsName + '&sortWord = ' + sortWord + '&sortMode = ' + sortMode + '&brandId = ' + brandId + '&isStudent = 1' + '&providerId = ' + providerId + '&timestamp = ' + timestamp,'json',f);		
	}//getAjax end
	
	var laz = require('LazyLoad');
	
	function getList(data){
		if(data.status == 0 && sort_bar == false){
			$("#base_load").hide();//隐藏load
			$("#classGoodList").html(base.noList('未上传商品'));
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();				
			return;
		}						
		var moduleData = '',
			classList = data.data.goodsList;
		if(classList.length > 0){			
			for(var i = 0; i < classList.length; i++){								
				moduleData += '<li id="' + classList[i].goodsId + '" data-normsvalueid="' + classList[i].normsValueId + '" data-pagenow="' + pageNow + '">' +
							'<div class="l"><img class="lazy" data-lazyload="' + classList[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></div>' +
							'<div class="r">' +
							'<div class="shopinfo"><img class="lazy" data-lazyload="' + classList[i].providerPhotoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' + classList[i].providerName + '</div>' +
							'<h1>' + classList[i].goodsName + '</h1>' +
							'<div class="r_price">' +
							'<em class="r_price_o"><span class="arial">￥</span><span class="n">' + classList[i].preferentialPrice.toFixed(2) + '&nbsp;</span></em>' +
							'<del class="r_price_p"><span class="arial">￥</span><span class="n">' + classList[i].originalPrice.toFixed(2) + '</span></del>' +
							'</div>' +
							'</div>' +
							'</li>';				
			}
			$("#classGoodList").append(moduleData);		
			laz.init();//刷新图片懒加载
			if(sort_bar == false){
				$("#sort-bar, .pull-to-refresh-layer, .infinite-scroll-preloader").show();//初次进入有商品时显示搜索栏
				$(".bar-search~.content").css('top','2.1rem');
				$("#base_load").hide();//隐藏load
				sort_bar = true;
			}
			classfun();
			if(_onload == true){
				setTimeout(function(){		
					$(".content").scrollTop(parseInt(base.getQueryString("stop")));
					_onload = false;
				},100);
			}
			if(pageNow >= 1){
				if(classList.length <= pageSize - 1){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();					
				}
			}			
		}else{			
			if(pageNow == 1){
				$("#base_load").hide();//隐藏load
				$("#classGoodList").html(base.noList('未上传商品'));				
			}											
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();
		}
		loading = false;
	}//getList end	

	function getListpull(data){
		if(data.status == 0){
			return;
		}	
		var moduleData = '',
			classList = data.data.goodsList;
		if(classList.length > 0){
			for(var i = 0; i < classList.length; i++){
				moduleData += '<li id="' + classList[i].goodsId + '" data-normsvalueid="' + classList[i].normsValueId + '" data-pagenow="' + pageNow + '">' +
							'<div class="l"><img class="lazy" data-lazyload="' + classList[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /></div>' +
							'<div class="r">' +
							'<div class="shopinfo"><img class="lazy" data-lazyload="' + s_photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" />' + s_providerName + '</div>' +							
							'<h1>' + classList[i].goodsName + '</h1>' +
							'<div class="r_price">' +
							'<em class="r_price_o"><span class="arial">￥</span><span class="n">' + classList[i].preferentialPrice + '</span></em>' +
							'<del class="r_price_p"><span class="arial">￥</span><span class="n">' + classList[i].originalPrice + '</span></del>' +
							'</div>' +
							'</div>' +
							'</li>';
			}							
			if(pageNow == 1){
				$("#classGoodList").html(moduleData);
			}else{
				$("#classGoodList").prepend(moduleData);
			}
			laz.init();//刷新图片懒加载			
			classfun();
		}
		loading = false;
	}
	
	function classfun(){//dom点击改变无刷新改变url记录数据
		$(".classGoodList li").each(function(){
			$(this).on('click',function(e){
				var goodsId = $(this).attr('id'),
					normsValueId = $(this).attr('data-normsvalueid'),
					_pageNow = $(this).attr('data-pageNow'),
					st = parseInt($(".content").scrollTop()),
					li = $(".classGoodList li"),stop=0;
				if( _pageNow > 1 ){
					stop = st - ((li.height()/2)*(_pageNow-li.eq(0).attr('data-pageNow'))*10);
					stop < 0 ? stop = 0 : stop = stop;
				}else{
					stop = st;
				}						
				var goodsdeail = SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId +  '&isStudent=1',
					goodslist = SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-list.html?id=' + classId + '&pageSize=' + pageSize + '&pageNow=' + _pageNow + '&sortWord=' + sortWord + '&sortMode=' + sortMode + '&brandId=' + brandId + '&goodsName' + goodsName + '&goodsId=' + goodsId + '&stop=' + stop + '&name=' + name;
				window.history.replaceState({title: "",url: ''}, "商品列表", goodslist);
				setTimeout(function(){
					window.location.href = goodsdeail;
				},100);
			});
		});		
	}//classfun end

	//排序搜索
	$(".sort-bar li").each(function(){
		$(this).on('click',function(){
			var self = $(this),
				i = self.index();
			self.addClass('active').siblings('li').attr('class','');	
			switch (i){
				case 0: s_bar_one(self,i); break;
				case 1: s_bar_two(self,i); break;
				case 2: s_bar_two(self,i); break;
				case 3: s_bar_tree(self,i); break;
				default: break;
			}			
		});
	});
	
	function s_bar_one(self,i){
		if(self.hasClass('flag') == false){
			d_two = 0;	
			pageSize = pageSize;pageNow = 1;sortWord = '';sortMode = '';brandId = '';goodsName = '';loading = true;
			refresh();
			self.addClass('flag');
		}
	}
	
	function s_bar_two(self,i){
		if(loading == false){		
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
			pageSize = pageSize;pageNow = 1;sortWord = i;sortMode = d_two;brandId = brandId;goodsName = goodsName;loading = true;
			refresh();
		}
	}
	
	function s_bar_tree(self,i){
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
							pageSize = pageSize;pageNow = 1;sortWord = i;sortMode = d_two;brandId = $(this).attr('data-id');goodsName = '';loading = true;
							$(this).addClass('active').siblings('li').removeClass('active');
							$(".mask, .t_box").removeClass('show').addClass('hide');
							refresh();			
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

	function refresh(){
		$("#classGoodList").html('');
		getAjax(1);	
	}

});