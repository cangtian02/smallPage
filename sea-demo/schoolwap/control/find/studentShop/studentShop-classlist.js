define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./studentShop-classlist.css');
	
	base.init();
	base.setTitle('学生店铺');	

	var customerId = cookie.getCookie('customerId'),//会员id
		curClassName = base.getQueryString('name') == null ? 0 : base.getQueryString('name'),
		classID = [];
	
	var search = require('search');
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '1',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		searchCall: function(v){
			window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + v;	
		},//搜索框回调
		searchListCall: function(v){
			window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + v;				
		}//搜索内容回调
	});		
	ajax.get('goods/goodsclasslist/0','json',getList);
	
	function getList(data){
		$("#base_load").show();
		if(data.status == 0){
			$.errtoast('系统繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var htmldata = '',
			classList = data.goodsclasslist;
		if(classList.length > 0){
			for(var i = 0; i < classList.length; i++){
				classID.push(classList[i].className);
				htmldata += '<li data-id="' + classList[i].id + '">' + classList[i].className + '</li>';
			}		
			$("#L_nav_content").prepend(htmldata);
			var curClassName_i = classID.indexOf(curClassName,0);
			if(curClassName_i == -1){
				curClassName = 0;
			}else{
				curClassName = curClassName_i;
			}
			$(".L_nav_content li").eq(curClassName).addClass('current');
		}
		listCont(curClassName);
		$(".L_nav_content li").eq(curClassName).addClass('one');
		$(".L_nav_content li").each(function(){
			$(this).on('click',function(){
				var j = $(this).index(),
					_text = $(this).text();
				$(this).addClass('current').siblings('li').removeClass('current');
				window.history.replaceState({title: "商品列表",url: SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-goodslist.html'}, "商品分类", SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-classlist.html?name=' + _text);
				if($(this).hasClass('one') == false){
					listCont(j);					
					$(this).addClass('one');
				}else{
					$(".classList").hide();				
					$(".classList_" + j).show();					
				}
			});
		});		
	}
	
	var laz = require('LazyLoad');
	
	function listCont(j){
		var htmldata = '',classList = '',id = $(".L_nav_content li").eq(j).attr('data-id');
		ajax.get('goods/goodsclasslist/' + id,'json',function(data){
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}
			data = data.data;
			$("#base_load").hide();
			classList = data.goodsclasslist;
			if(classList == null){
				$(".classList_" + j).html(base.noList('商品正在路上'));
				return;			
			}			
			if(classList.length > 0){
				for(var k = 0; k < classList.length; k++){
					htmldata += '<li><a href="' + SAYIMO.SRVPATH + 'view/find/studentShop/studentShop-goodslist.html?id=' + classList[k].id + '&name=' + classList[k].className + '&isStudent=1"><img class="lazy" data-lazyload="' + classList[k].photoPath + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /><p class="ellipsis">' + classList[k].className + '</p></a></li>';
				}
				htmldata = '<ul class="classList clearfix classList_' + j + '">' + htmldata + '</ul>';
				$(".content").append(htmldata);
				$(".classList").hide();
				$(".classList_" + j).show();
				laz.init();//刷新图片懒加载								
			}else{
				$(".classList_" + j).html(base.noList('商品正在路上'));
			}				
		});
	}

});