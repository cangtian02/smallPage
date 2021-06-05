define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),		
		ajax = require('ajax');
	require('./positionDemandList.css');
	
	base.init();
	base.setTitle('兼职招聘');	

	var recordNum = 1,
		loading = true,
		_condition = '',
		workType = '',
		workAreaCode  = '',
		positionClassCode = '';

	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入您要找的职位',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			recordNum = 1;
			_condition = v;
			$('.list-block ul').html(base.baseLoad());
			queryList();
		}//搜索框回调
	});
	
	function queryList(){
		loading = true;
		$.attachInfiniteScroll($('.infinite-scroll'));
		$('.infinite-scroll-preloader').show();		
		ajax.get('base/getpositiondemandlist/1/5' + '?condition=' + _condition + '&workType=' + workType + '&workAreaCode=' + workAreaCode + '&positionClassCode=' + positionClassCode,'json',function(data){
			if(data.status == 0){
				$('.list-block ul').html(base.noMent('暂无招聘信息'));		
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();				
				return;
			}
			
			if(data.data.resumeList.length == 0){
				if(recordNum == 1){
					$('.list-block ul').html(base.noMent('暂无招聘信息'));
				}
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();
			}else{	
				var demandList= data.data.resumeList,
					htmldata = '',
					d =	new Date();
				require('dateFormat');				
				for(var i = 0; i < demandList.length; i++){			
					d.setTime(demandList[i].updateTime);
					var interviewAddress = '',education = '';			
					if(demandList[i].interviewAddress != '' && demandList[i].interviewAddress != null && demandList[i].interviewAddress != undefined){
						interviewAddress = '<i class="col_1"></i>' + demandList[i].interviewAddress + '&nbsp;';
					}
					if(demandList[i].education != '' && demandList[i].education != null && demandList[i].education != undefined){
						education = '<i class="col_2"></i>' + demandList[i].education;
					}			
					htmldata += '<li><a class="item-content" '+
					'			href="' + SAYIMO.SRVPATH + 'view/find/positionDemand/positionDemandDetail.html?id=' + demandList[i].id + '">' + 
					'			<div class="item-inner">' +
					'			<div class="item-title-row top-timer">' +
					'			<div class="item-title item-font1">' + demandList[i].name +
					'			</div><div class="item-after item-after-font1">' + d.format('yyyy-MM-dd') +
					'			</div></div>'+
					'			<div class="item-title-row top-timer">'+
					'			<div class="item-title item-font2">' + demandList[i].enterpriseName +
					'			</div><div class="item-after item-after-font2">' + demandList[i].payScope +
					'			</div></div>'+
					'			<div class="item-title-row top-timer">'+
					'			<div class="item-title item-font3">' + interviewAddress + education + 
					'			</div></div></div></a></li>';
				}
				if(recordNum == 1){
					$('.list-block ul').html(htmldata);
				}else{
					$('.list-block ul').append(htmldata);
				}			
				if(demandList.length < 9){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();				
				}
			}
			loading = false;			
		});
	}
	
	$('.list-block ul').html(base.baseLoad());
	queryList();	
	
	var sortBar = $("#sort-bar"),
		mask = $(".content-mask");
	
	sortBar.find('li:first-child .c').on('click',function(){
		$(this).parents('li').find('dl').show();
		mask.show();
	});
	
	sortBar.find('li:first-child dl dd').each(function(){
		$(this).on('click',function(){
			$(this).addClass('active').siblings('dd').removeClass('active');
			$(this).parents('li').find('dl').hide();
			mask.hide();
			var _t = $(this).attr('data-dd');
			if(_t != undefined){
				$(this).parents('li').find('dl dd:first-child').show();
				$(this).parents('li').find('.c .t').text(_t);
				$(this).parents('li').find('.c').addClass('active');								
			}else{
				$(this).parents('li').find('dl dd:first-child').hide();
				$(this).parents('li').find('.c .t').text($(this).parents('li').find('dl dd:first-child').text());
				$(this).parents('li').find('.c').removeClass('active');
				_t = '';
			}
			workType = encodeURIComponent(encodeURIComponent(_t));
			recordNum = 1;
			$('.list-block ul').html(base.baseLoad());
			queryList();
		});
	});	
	
	var cityPicker = require('cityPicker');
	cityPicker($('#city-picker'),$('#baseAreaCode'),'',function(a,b){
		sortBar.find('li').eq(1).find('.c').addClass('active');
		sortBar.find('li').eq(1).find('.c .t').text(a[1]);
		workAreaCode = b;
		recordNum = 1;
		$('.list-block ul').html(base.baseLoad());
		queryList();
	});

	sortBar.find('li').eq(1).on('click',function(){
		$(".bar-nav").prepend('<button class="button button-link pull-left">清除</button>');	
		$(".pull-left").on('click',function(){
			$.closeModal(".picker-modal.modal-in");			
			sortBar.find('li').eq(1).find('.c').removeClass('active');
			sortBar.find('li').eq(1).find('.c .t').text('工作区域');
			workAreaCode = '';
			recordNum = 1;
			$('.list-block ul').html(base.baseLoad());
			queryList();
		});		
	});
	
    var fun_expectPosition = require('expectPosition');
	fun_expectPosition('#positionClass','',function(reqexpectPosition,reqexpectPositionCode){
		positionClassCode = reqexpectPositionCode;
		if(positionClassCode != ''){
			sortBar.find('li:last-child .c').addClass('active');			
		}else{
			sortBar.find('li:last-child .c').removeClass('active');
		}
		$('.list-block ul').html(base.baseLoad());
		recordNum = 1;
		queryList();	
	});	
	
	$(".content-mask").on('click',function(){
		sortBar.find('li:first-child dl').hide();
		$(this).hide();
	});
	
	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		if(loading) return;	
		recordNum = 1;
		$('.list-block ul').html(base.baseLoad());
		queryList();
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	//无限刷新
	$(document).on('infinite', '.infinite-scroll-bottom',function(){
		if(loading) return;
		recordNum++;
		queryList();
		$.refreshScroller();
	});

	$(".fabu-btn a").on('click',function(){
		location.href = SAYIMO.SRVPATH + 'view/find/positionDemand/downapp.html';
	});
	
	$(".fabu-btn .close").on('click',function(){
		$(".fabu-btn").hide();
	});

});