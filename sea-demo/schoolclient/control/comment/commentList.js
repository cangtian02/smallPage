define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./commentList.css');
	
	window.jsObj.setLoadUrlTitle('评论列表');
	
	var goodsId = base.getQueryString('goodsId'),//获取商品id
		goodsType = base.getQueryString('goodsType'),//商品状态 
		goodComment = [],//好评数组
		middleComment = [],//中评数组
		negativeComment = [],//差评数组
		commentCount = [];//全部评论数组	
	goodsType == 'pre' ? goodsType = 'PRE' : goodsType = '';//PRE为预定预约商品
	
	ajax.get('goods/getgoodscomments/' + goodsId + '?recordNum=&goodsType=' + goodsType,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		data = data.data;
		var commeList = data.goodsComments;
		$('.tab-link').eq(0).text('全部(' + data.commentCount + ')');
		$('.tab-link').eq(1).text('好评(' + data.goodComment + ')');
		$('.tab-link').eq(2).text('中评(' + data.middleComment + ')');
		$('.tab-link').eq(3).text('差评(' + data.negativeComment + ')');	
		for(var i = 0;i < commeList.length;i++){
			commentCount.push(commeList[i]);
			if(commeList[i].commentLevel > 0 && commeList[i].commentLevel < 2){
				negativeComment.push(commeList[i]);
			}else if(commeList[i].commentLevel > 1 && commeList[i].commentLevel < 4){
				middleComment.push(commeList[i]);
			}else if(commeList[i].commentLevel > 3){
				goodComment.push(commeList[i]);
			}
		}
		commentList(0);
		$('.tab-link').eq(0).addClass('one');
	});

	function commentList(i){
		var data,Text;
		switch (i){
			case 0:
				data = commentCount;
				Text = '该商品暂无评论';
				break;
			case 1:
				data = goodComment;
				Text = '亲，给我们一个好评吧';
				break;
			case 2:
				data = middleComment;
				Text = '看来是商品太好了';
				break;
			case 3:
				data = negativeComment;
				Text = '我们是没有差评的';
				break;			
			default:
				break;
		}
		addInfo(i,data,Text);
	}
	
	var commentListmoudus = require('commentList');
	function addInfo(i,data,Text){
		if(data.length == 0){
			$('.tab').eq(i).html(base.noList(Text));					
		}else{			
			$(".tab").eq(i).html('<div class="list-block media-list"><ul class="comment-list">' + commentListmoudus(data) + '</ul></div>');			
		}
	}
	
	$('.tab-link').on('click',function(){
		if($(this).hasClass('one') == false){
			var i = $(this).index();
			commentList(i);
			$(this).addClass('one');
		}
	});

});