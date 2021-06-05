define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./transfer-list.css');	

	window.jsObj.setLoadUrlTitle('物品转让');
	
	var fun_transferList = function(){
		var self = this;
		
		var	pageNow = 1,
			pageSize = 10,
			goodsName = '',
			classId,
			loading = false;
		
		var content = $(".content"),
			toggerBox = $("#toggerBox"),
			transferClassList = $("#transferClassList"),
			isList = $("#isList"),
			transferList_l = $("#transferList_l"),
			transferList_r = $("#transferList_r");
		
		this.getTransferClasslist = function(){// 获取转让分类
			ajax.get('base/transfergoodsclasslist','json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data.classList;
				if(data.length == 0){
					isList.html(base.noList('暂无转让商品'));
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					// 有转让分类才显示搜索bar
					var search = require('search');	
					search({
						searchId: 'search',//搜索框id
						placeholder: '请输入您要找的商品名称',
						searchType: 'p',//搜索dom格式 p：公共格式
						isOpensugges: false,//不开启模糊搜索提示
						searchCall: function(v){
							pageNow = 1;
							goodsName = v;
							self.getTransferList();
						}//搜索框回调
					});
					var classData = '';
					for(var i = 0; i < data.length; i++){
						classData += '<li data-id="' + data[i].id + '"><div><img src="' + data[i].photoUrl + '" ><p class="ellipsis">' + data[i].className + '</p></div></li>';
					}
					if(data.length%4 != 0){
						for(var j = 0; j < 4 - data.length%4; j++){
							classData += '<li></li>'; 
						}		
					}					
					transferClassList.find('ul').html(classData);
					if(data.length <= 4){
						content.css('top','5.1rem');
					}else if(data.length > 4 && data.length <= 8){
						content.css('top','7.95rem');
						transferClassList.css('height','5.7rem');
						transferClassList.find('ul').css('height','5.7rem');
					}else if(data.length > 8){
						content.css('top','9.95rem');
						transferClassList.css('height','5.7rem');
						transferClassList.find('ul').css('height','5.7rem');						
						toggerBox.show();
						var istoggerBox = false;
						toggerBox.on('click',function(){
							if(!istoggerBox){
								transferClassList.find('ul').css('height','auto');
								toggerBox.html('收起&nbsp;&nbsp;<span class="icon icon-up"></span>');
								istoggerBox = true;
							}else{
								transferClassList.find('ul').css('height','5.7rem');
								toggerBox.html('展开&nbsp;&nbsp;<span class="icon icon-down"></span>');
								istoggerBox = false;
							}
						});						
					}
					transferClassList.find('ul li').each(function(){
						$(this).on('click',function(){
							var _id = $(this).attr('data-id');
							if(_id != undefined && _id != null && _id != ''){
								$.attachInfiniteScroll($('.infinite-scroll'));
								$('.infinite-scroll-preloader').show();
								goodsName = '';
								classId = _id;
								$(this).addClass('active').siblings('li').removeClass('active');
								isList.html('');
								transferList_l.html('');
								transferList_r.html('');
								self.getTransferList();
							}
						});
					});
					classId = data[0].id;
					transferClassList.find('ul li').eq(0).addClass('active');
					self.getTransferList();
				}
			});
		}
		
		var lazy = require('LazyLoad');
		this.getTransferList = function(){// 获取相应转让分类的商品
			loading = true;
			ajax.get('base/transfergoodslist/' + pageNow + '/' + pageSize + '?classId=' + classId + '&goodsName=' + goodsName,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}
				data = data.data.goodsList;
				if(data.length == 0){					
					if(pageNow == 1){
						isList.html(base.noList('暂无转让商品'));
					}
					transferList_l.html('');
					transferList_r.html('');
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();						
				}else{
					var htmlData_l = '', htmlData_r = '';
					for(var i = 0; i < data.length; i++){
						var htmlData = '<li>' +
									'<a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/find/transfer/transfer-detail.html?id=' + data[i].id + '">' +
						    		'	<img class="lazy" data-lazyload="' + data[i].photoUrl + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +						    		
						    		'	<div class="t clamp_2">' + data[i].goodsName + '</div>' +
						    		'	<div class="i justifyAlign"><span class="red"><span class="arial">￥</span>' + data[i].price + '</span><span class="c">' + data[i].codeName + '</span></div>' +						    		
						    		'</a>' +
						    		'</li>';						    		
						if(i%2 == 0){
							htmlData_l += htmlData;
						}else{
							htmlData_r += htmlData;
						}
					}
					if(data.length < pageSize){
						$.detachInfiniteScroll($('.infinite-scroll'));
						$('.infinite-scroll-preloader').hide();
					}					
					isList.html('');
					if(pageNow == 1){
						transferList_l.html(htmlData_l);
						transferList_r.html(htmlData_r);
					}else{
						transferList_r.append(htmlData_r);
						transferList_r.append(htmlData_r);
					}	
					lazy.init();//刷新图片懒加载
					$(".transferList li").each(function(){
						$(this).find('a').off('click').on('click',function(){						
							window.jsObj.loadContent($(this).attr('data-url'));
						});
					});	
				}
				loading = false;
			});	
		}
	
		self.getTransferClasslist();//获取转让分类

		$(document).on('infinite', '.infinite-scroll-bottom',function() {
			if (loading) return;			
			pageNow++;
			self.getTransferList();		
			$.refreshScroller();
		});
		
		$("#myTransferList").on('click',function(){
			window.jsObj.loadContent(SAYIMO.SRVPATH + 'view/find/transfer/myTransfer-List.html');
		});
		
	}
	fun_transferList();	
});