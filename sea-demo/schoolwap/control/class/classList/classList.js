define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./classList.css');
	
	base.init();
	base.setTitle('商品分类');	
	
	var search = require('search');
	search({
		searchId: 'search',
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',
		searchType: 'p',
		goodsType: '1',
		searchCall: function(v){
			window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + v;	
		},
		searchListCall: function(v){
			window.location.href = SAYIMO.SRVPATH + 'view/search/searchGoodsList.html?goodsName=' + v;				
		}
	});
	
	var curClassName = base.getQueryString('name');				

	ajax.get('goods/goodsclasslist','json',getList);

	function getList(data){
		$("#base_load").show();
		if(data.status == 0){
			$.errtoast('系统繁忙，请稍后重试');
			return;
		}
		var htmldata = '',
			classID = [],
			classList = data.data.goodsclasslist;
		if(classList.length > 0){
			for(var i = 0; i < classList.length; i++){
				classID.push(classList[i].className);
				htmldata += '<li data-id="' + classList[i].id + '">' + classList[i].className + '</li>';
			}		
			$("#left_nav").prepend(htmldata);
			curClassName == null ? curClassName = 0 : curClassName = classID.indexOf(curClassName,0);
			$(".left_nav li").eq(curClassName).addClass('current');
			listCont(curClassName);
			$(".left_nav li").eq(curClassName).addClass('one');
			$(".left_nav li").each(function(){
				$(this).on('click',function(){
					var j = $(this).index(),
						_text = $(this).text();
					$(this).addClass('current').siblings('li').removeClass('current');
					window.history.replaceState({title: "商品列表",url: SAYIMO.SRVPATH + 'view/class/classById.html'}, "商品分类", SAYIMO.SRVPATH + 'view/class/classList.html?name=' + _text);
					if($(this).hasClass('one') == false){
						listCont(j);					
						$(this).addClass('one');
					}else{
						$(".classList").hide();				
						$(".classList_" + j).show();					
					}
				});
			});				
		}else{
			$(".content").html(base.noList('商品正在路上'));
		}	
	}
	
	var laz = require('LazyLoad');
	
	function listCont(j){
		var htmldata = '',classList = '',id = $(".left_nav li").eq(j).attr('data-id');
		ajax.get('goods/goodsclasslist?classId=' + id,'json',function(data){
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
					htmldata += '<li><a href="' + SAYIMO.SRVPATH + 'view/class/classById.html?id=' + classList[k].id + '&name=' + classList[k].className + '"><img class="lazy" data-lazyload="' + classList[k].photoPath + '" src="' + SAYIMO.SRVPATH + 'images/default/sydefault.png" /><p class="ellipsis">' + classList[k].className + '</p></a></li>';
				}
				htmldata = '<ul class="classList clearfix classList_' + j + '">' + htmldata + '</ul>';
				$(".content").append(htmldata);
				$(".classList").hide();
				$(".classList_" + j).show();
				laz.init();							
			}else{
				$(".classList_" + j).html(base.noList('商品正在路上'));
			}				
		});
	}

});