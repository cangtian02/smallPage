define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax'),
		lazy = require('LazyLoad');
	require('./classList.css');
	
	window.jsObj.setLoadUrlTitle('创客商城');
	
	var search = require('search');
	search({
		searchId: 'search',
		placeholder: '请输入您要找的商品名称',
		searchListId: 'searchList',
		searchType: 'p',
		goodsType: '1',
		searchCall: function(v){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/search/search.html?goodsName=' + v);	
		},
		searchListCall: function(v){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/search/search.html?goodsName=' + v);				
		}
	});				
	
	ajax.get('goods/goodsclasslist','json',function(data){		
		if(data.status == 0){
			$(".page").html(base.noList('商品正在路上'));
			return;
		}
		var htmldata = '',
			classList = data.data.goodsclasslist;
		if(classList.length > 0){
			for(var i = 0; i < classList.length; i++){
				htmldata += '<li data-id="' + classList[i].id + '">' + classList[i].className + '</li>';
			}		
			$(".left_nav").prepend(htmldata);
			listCont(0);
			$(".left_nav li").eq(0).addClass('current');			
			$(".left_nav li").eq(0).addClass('one');
			$(".left_nav li").each(function(){
				$(this).on('click',function(){
					var j = $(this).index(),
						_text = $(this).text();
					$(this).addClass('current').siblings('li').removeClass('current');					
					if(!$(this).hasClass('one')){
						listCont(j);					
						$(this).addClass('one');
					}else{
						$(".classList").hide();				
						$(".classList_" + j).show();					
					}
				});
			});				
		}else{
			$(".page").html(base.noList('商品正在路上'));
		}		
	});
	
	function listCont(j){
		$("#base_load").show();
		$(".classList").hide();
		var id = $(".left_nav li").eq(j).attr('data-id');
		ajax.get('goods/goodsclasslist?classId=' + id,'json',function(data){
			
			$("#base_load").hide();
			if(data.status == 0){
				$(".classList_" + j).html(base.noList('商品正在路上'));
				return;
			}
			var htmldata = '',
				classList = data.data.goodsclasslist;	
			if(classList.length > 0){
				for(var k = 0; k < classList.length; k++){
					htmldata += '<li data-id="' + classList[k].id + '"><img class="lazy" data-lazyload="' + classList[k].photoPath + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" /><p class="ellipsis tc">' + classList[k].className + '</p></li>';
				}
				htmldata = '<ul class="classList clearfix bgf classList_' + j + '">' + htmldata + '</ul>';
				$(".content").append(htmldata);
				$(".classList_" + j).show();
				lazy.init();
				$(".classList li").each(function(){
					$(this).off('click').on('click',function(){	
						window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/class/classById.html?id=' + $(this).attr('data-id') + '&name=' + encodeURIComponent($(this).find('p').text()));
					});
				});
			}else{
				htmldata = '<ul class="classList clearfix bgf classList_' + j + '">' + base.noList('商品正在路上') + '</ul>';
				$(".content").append(htmldata);
				$(".classList_" + j).show();				
			}				
		});
	}

});