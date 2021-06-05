define(function(require, exports, module) {

	var base = require('base'),
		ajax = require('ajax');	
	require('./vote-index.css');
	
	window.jsObj.setLoadUrlTitle('投票评选');
	
	var customerId = window.jsObj.readUserData('id'),
		id = base.getQueryString('id'),
		identifier = base.getQueryString('identifier');
	
	require('dateFormat');
	var lazy = require('LazyLoad');
	
	var voteStatus,voteSubmissionId, keyWord = '';
	
	ajax.get('base/commonvotedetail/' + id,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		
		if(data == null){
			$(".content").html(base.noList('活动筹划中...'));
			$.init();
			return;
		}
		voteSubmissionId = data.voteSubmissionId;
		
		if(data.photoUrl.length > 0){
			var slideData = '';
			for(var i = 0; i < data.photoUrl.length; i++){
				slideData += '<li><img src="' + data.photoUrl[i].photoPath + '" /></li>';
			}	
			var cslideData = '<div class="slide-container slide-slideData"><ul class="slide-main">'+ slideData + '</ul><ul class="slide-pagination"></ul></div>';
			$(".playBox").append(cslideData);		
			var slide = require('slide'),isautoplay = false;
			data.photoUrl.length > 1 ? isautoplay = true : isautoplay = false;
			slide = new slide({'autoplay': isautoplay,'slideBox': '.slide-slideData'});
		}
		
		var voteRule = '';	
		data.voteRule == 1 ? voteRule = '每人一票' : voteRule = '每人一天一票';
		$(".list-block .item-title:last-child").html(voteRule);
		
		$(".name").html(data.voteName);		

		var description = data.description;
		$(".item-link").on('click',function(){
			popupHTML(description);
		});
		
		var s = new Date(), e = new Date(), d = Math.round(new Date().getTime());
		s.setTime(data.startDate);
		e.setTime(data.endDate);			
		$(".time").html('投票有效期：' + s.format('yyyy-MM-dd') + ' 至 ' +  e.format('yyyy-MM-dd'));			
		if(d < s){
			voteStatus = 0;			
		}else if(d > s && d < e){
			voteStatus = 3;
		}else if(d > e){
			voteStatus = 4;
		}		
		if(voteStatus > 0){			
			$("#zt").addClass('r_' + voteStatus);
		}		
		
		addSearch();
		fun_commonvotelist();
		
		$.init();
	});

	function addSearch(){
		var htmldata = '<div class="bar bar-search">' +
						'    <div class="searchbar">' +
						'	    <a class="searchbar-cancel">取消</a>' +
						'	    <div class="search-input">' +
						'	    	<form onsubmit="return searchform(\'search\');">' +
						'	    		<label class="icon icon-search" for="search"></label>' +
						'		    	<input type="search" placeholder="搜索姓名或编号" id="search" >' +
						'	        	<input type="submit" value="" />' +		        	
						'	        </form>' +				    	
						'	    </div>' +
						'   </div>' +			   
					  	'</div>';			
		$(".searchbox").html(htmldata);					
		this.searchform = function(f){			
			var id = $('#' + f),
				val = id.val();
			if(val == '' || val == 'undefined'){
				keyWord = '';
				fun_commonvotelist();
			}else{
				keyWord = encodeURIComponent(encodeURIComponent(val));
				fun_commonvotelist(); 	
			}
			return false;
		}	
	}
	
	function fun_commonvotelist(){
		ajax.get('base/listcommonvoterecords/' + voteSubmissionId + '?keyWord=' + keyWord,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}			
			data = data.data;			
			if(data.length == 0){
				$(".voteList").html(base.noMent('暂无信息'));
				return;
			}
						
			var htmldata = '';
			for(var i = 0; i < data.length; i++){
				var alias = '';
				if(data[i].alias != '' && data[i].alias != undefined && data[i].alias != null){
					alias = '<span>(' + data[i].alias + ')</span>';
				}
				var img = '';
				if(identifier == 'SYDS'){
					for(var j = 0; j < data[i].photoUrl.length; j++){
						img += '<img class="lazy" data-lazyload="' + data[i].photoUrl[j].photoPath + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png">';
					}
					img = '<div class="img">' + img + '</div>';
				}
				htmldata += '<li>' +
							'	<div class="box">' +
							'	<a class="l" href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/activity/vote/vote-detail.html?submissionId=' + data[i].submissionId + '&voteSubmissionId=' + voteSubmissionId + '&identifier=' + identifier + '">' +
							'		<img class="lazy" data-lazyload="' + data[i].headPhoto + '" src="' + SAYIMO.SRVPATH + 'images/default/lazy.png" />' +
							'		<p><span>' + data[i].code + '</span>号</p>' +
							'	</a>' +
							'	<div class="r">' +
							'       <a href="javascript:;" data-url="' + SAYIMO.SRVPATH + 'view/activity/vote/vote-detail.html?submissionId=' + data[i].submissionId + '&voteSubmissionId=' + voteSubmissionId + '&identifier=' + identifier + '">' +
							'			<div class="t">' + data[i].subName + alias + '</div>' +
							'			<div class="i ellipsis">' + data[i].subject + '</div>' +
							'       </a>' +
							'		<div class="b">' +
							'			<div class="btn" data-submissionid="' + data[i].submissionId + '">我来一票</div>' +
							'			<span class="voteCnt">' + data[i].voteCnt + '</span><span>票</span>' +				
							'		</div>' +	
							'	</div>' +
							'	</div>' + img
							'</li>';
			}									
			$(".voteList").html(htmldata);				
			lazy.init();//刷新图片懒加载
			$(".voteList li").each(function(){
				$(this).find('a').off('click').on('click',function(){						
					window.jsObj.loadContent($(this).attr('data-url'));
				});
			});					
			insertcommonvote();		
		});
	}

	/**
	 *
	 	点击我要投票给相应稿件投票
	 *
	 @method insertcommonvote
	 *
	 */
	function insertcommonvote(){
		var issubmit = false;// 是否投过票
		$(".voteList li").each(function(){
			var _this = $(this);
			
			_this.find('.img img').on('click',function(){				
				var photoUrls = [];				
				_this.find('.img img').each(function(){
					photoUrls.push({'url': $(this).attr('src')});
				});
				var slideFixed = require('slideFixed');
			    slideFixed(photoUrls);					
			});	
		
			_this.find('.btn').on('click',function(){
				if(voteStatus == 0){
					$.errtoast('投票未开始');
					return;
				}
				if(voteStatus == 4){
					$.errtoast('投票已结束');
					return;
				}				
				var submissionId = $(this).attr('data-submissionid');
				if(!issubmit){
					$.showIndicator();
					ajax.post('base/insertcommonvote',{'customerId': customerId,'submissionId': submissionId,'voteSubmissionId': voteSubmissionId},'json',function(data){
						$.hideIndicator();
						if(data.status == 0 && data.errorCode == '900003'){
							$.errtoast('您已参与投票');
							$(".voteList li .btn").addClass('disabled');
							issubmit = true;
							return;
						}
						if(data.status == 0 && data.errorCode == '900004'){
							$.errtoast('您今天已投过票了');
							$(".voteList li .btn").addClass('disabled');
							issubmit = true;
							return;
						}						
						if(data.status == 0){
							$.errtoast('服务器繁忙，请稍后重试');
							return;
						}
						$.errtoast('投票成功');
						$(".voteList li .btn").addClass('disabled');
						issubmit = true;
						_this.find(".voteCnt").text(Number(_this.find(".voteCnt").text()) + 1);										
					});
				}					
			});
			
		});
		
	}
	
	function popupHTML(s){
	  	var popupHTML = '<div class="popup">'+
	                    '<div class="content-block">'+
	                      '<div class="closeBtn"><a href="javascript:;" class="close-popup">关闭</a></div>'+
	                      '<div class="html-content">' + s + '</div>'+ 
	                    '</div>'+
	                  '</div>'
	  	$.popup(popupHTML);			
	}
	
});