define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	
	base.init();
	base.setTitle('爆款商品');

	var identifier = (base.getQueryString("identifier") == null) ? 'CYBK_01' : base.getQueryString("identifier"),
		goodsName = (base.getQueryString("goodsName") == null) ? '' : base.getQueryString("goodsName");
	
	var _onload = true,
		loading = false;
	
	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',//搜索提示id
		searchType: 'p',//搜索dom格式 p：公共格式
		goodsType: '3',//搜索提示接口搜索商品类型 1：普通 2： 活动 3：爆款
		searchCall: function(v){
			goodsName = v;
			getAjax();
		},//搜索框回调
		searchListCall: function(v){
			goodsName = v;
			getAjax();	
		}//搜索内容回调
	});	

	if(goodsName != ''){$("#search").val(decodeURIComponent(goodsName));}
	
	getAjax();
	
	//加载数据
	function getAjax(){
		$("#classGoodList").html('');
		$("#base_load").show();
		ajax.get('goods/getmoldbabygoodslist/' + identifier + '?goodsName=' + goodsName,'json',getList);	
	}

	var laz = require('LazyLoad'),
		classGoodsList = require('classGoodsList');//商品列表
	
	function getList(data){
		$("#base_load").hide();//隐藏load
		if(data.status == 0){
			$("#classGoodList").html(base.noList('暂无商品'));
			loading = false;			
			return;
		}	
		var moduleData = [],
			classList = data.data.goodsList;
		if(classList.length > 0){
			for(var i = 0; i < classList.length; i++){
				moduleData.push({
					'goodsId': classList[i].goodsId,
					'normsValueId': classList[i].normsValueId,
					'photoUrl': classList[i].photoUrl,
					'goodsName': classList[i].goodsName,
					'preferentialPrice': classList[i].preferentialPrice,
					'originalPrice': classList[i].originalPrice
				});			
			}
			$("#classGoodList").html(classGoodsList(moduleData));
			laz.init();//刷新图片懒加载			
			if(_onload == true){
				setTimeout(function(){		
					$(".content").scrollTop(parseInt(base.getQueryString("stop")));
					_onload = false;
				},100);
			}
			classfun();	
		}else{
			$("#classGoodList").html(base.noList('暂无商品'));
		}
		loading = false;
	}
			
	function classfun(){//dom点击改变无刷新改变url记录数据
		$("#classGoodList li").each(function(){
			$(this).on('click',function(e){
				var goodsId = $(this).attr('id'),
					normsValueId = $(this).attr('data-normsvalueid'),
					stop = parseInt($(".content").scrollTop());
				var goodsdeail = SAYIMO.SRVPATH + 'view/class/goodsDetail.html?goodsId=' + goodsId + '&normsValueId=' + normsValueId + '&isActivity=1&identifier=' + identifier,
					goodslist = SAYIMO.SRVPATH + 'view/activity/bk/bk-goodsList.html?stop=' + stop + '&goodsName=' + goodsName;
				window.history.replaceState({title: "",url: ''}, "爆款商品", goodslist);
				setTimeout(function(){
					window.location.href = goodsdeail;
				},100);
			});
		});		
	}//classfun end
});