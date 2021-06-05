define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./myresume.css');
	
	base.init();
	base.setTitle('我的简历');		
	
	var	customerId = cookie.getCookie('customerId'),
		pageNow = 1,//分页页数
		pageSize = 10,//一页数量
		loading = false,//加载状态
		flag = false;
	
	function getResume(){
		ajax.get('base/getresumeid/' + customerId,'json',function(data){
			$.detachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll-preloader').hide();			
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			if(data.data == 0){
				$("#myresume").html('<div class="goadd"><p>暂无个人简历，请尽快完善，方便找你</p><a href="' + SAYIMO.SRVPATH + 'view/me/resume/addresume.html">点击创建</a></div>');
			}else{
				showresume(data.data);
			}
		});
	}
	
	function showresume(id){	
		ajax.get('base/resumeDetails/' + id,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;
			var DetailHtml = '',
				resumeDetails = data.resumeDetails;
	
			var workStatus = '';			
			resumeDetails.workStatus == 0 ? workStatus = '离职' : workStatus = '在职';
			var isEnable = '';
			resumeDetails.isEnable == 0 ? isEnable = '不可见' : isEnable = '可见';
			var sex = '';
			resumeDetails.sex == 0 ? sex = '女' : sex = '男';
			
			require('dateFormat');
			var a =	new Date();
			a.setTime(resumeDetails.beginDate);
			var b =	new Date();
			b.setTime(resumeDetails.endDate);
			var bord = new Date();
			bord.setTime(resumeDetails.birthday);
			
			var address = '';
			ajax.get('user/getareabycodeasjson/' + resumeDetails.address,'json',function(data){
				if(data.status == 0){
					address = '';
				}else{
					address = data.data.province + ' ' +  data.data.city;
					address = '<div class="table"><div class="t">工作地点：</div><div class="c">' + address + '</div></div>';
			
					DetailHtml += '<div class="b-top clearfix"><img src="' + resumeDetails.headPhoto + '" /><h3>' + resumeDetails.name + '</h3>';
					DetailHtml += '<p>' + sex + ' &nbsp;|&nbsp; ' + resumeDetails.workAge + ' &nbsp;|&nbsp; ' + data.data.province + '</p></div>';
													
					DetailHtml += '<div class="b-title">基本信息</div><div class="b-cont clearfix">';
					DetailHtml += '<div class="table"><div class="t">出生日期：</div><div class="c">' + bord.format('yyyy-MM-dd') + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">籍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贯：</div><div class="c">' + resumeDetails.nativePlace + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">联系电话：</div><div class="c">' + resumeDetails.linkinfo + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">联系邮箱：</div><div class="c">' + resumeDetails.email + '</div></div></div>';
					
					DetailHtml += '<div class="b-title">求职意向</div>';
					DetailHtml += '<div class="b-cont clearfix"><div class="table"><div class="t">求职意向：</div><div class="c">' + resumeDetails.workType + '</div></div>' + address;
					DetailHtml += '<div class="table"><div class="t">期望薪资：</div><div class="c">' + resumeDetails.expectWage + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">期望岗位：</div><div class="c">' + resumeDetails.expectPosition + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">工作状态：</div><div class="c">' + workStatus + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">工作经验：</div><div class="c">' + resumeDetails.workAge + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">到岗时间：</div><div class="c">' + resumeDetails.firstWorkTime + '</div></div></div>';
					
					DetailHtml += '<div class="b-title">能力/特长</div>';
					DetailHtml += '<div class="b-cont clearfix"><div class="table"><div class="t">技能特长：</div><div class="c">' + resumeDetails.skill + '</div></div></div>';			
					
					DetailHtml += '<div class="b-title">教育背景</div>';
					DetailHtml += '<div class="b-cont clearfix"><div class="table"><div class="t">毕业院校：</div><div class="c">' + resumeDetails.school + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">专业名称：</div><div class="c">' + resumeDetails.profession + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">最高学历：</div><div class="c">' + resumeDetails.education + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">入学时间：</div><div class="c">' + a.format('yyyy-MM-dd') + '</div></div>';
					DetailHtml += '<div class="table"><div class="t">毕业时间：</div><div class="c">' + b.format('yyyy-MM-dd') + '</div></div></div>';
					
					DetailHtml += '<div class="b-title">自我评价</div>';
					DetailHtml += '<div class="b-cont clearfix"><div class="table"><div class="t">自我评价：</div><div class="c">' + resumeDetails.selfEvaluation + '</div></div></div>';		
		
					var resumeExperience = '';
					if(resumeDetails.resumeExperience.length == 0){
						resumeExperience += '<div class="b-cont clearfix"><div class="table"><div class="t">暂未填写</div><div class="c"></div></div></div>';				
					}
					for (var i = 0; i < resumeDetails.resumeExperience.length; i++) {
						resumeExperience += '<div class="b-cont clearfix"><div class="table"><div class="t">工作经验：</div><div class="c">' + resumeDetails.resumeExperience[i].workExperience + '</div></div>' +
											'<div class="table"><div class="t">项目经验：</div><div class="c">' + resumeDetails.resumeExperience[i].projectExperience + '</div></div></div>';
					}
					resumeExperience = '<div class="b-title">工作经验</div>' + resumeExperience;
					
					DetailHtml += resumeExperience;
					
					DetailHtml += '<div class="b-cont clearfix"><div class="table"><div class="t">是否企业可见：</div><div class="c">' + isEnable + '</div></div></div>';
					
					var btn = '<div class="content-block">' +
							  '  <div class="row">' +
							  '    <div class="col-50"><a href="javascript:;" class="button button-big button-fill button-danger" id="delete">删除</a></div>' +
							  '    <div class="col-50"><a href="' + SAYIMO.SRVPATH + 'view/me/resume/updateresume.html?id=' + id + '" class="button button-big button-fill button-success">修改</a></div>' +
							  '  </div>' +
							  '</div>';
		
					$('#myresume').html(DetailHtml + btn);
					
					$("#delete").on('click',function(){
					    $.confirm('确认删除您的简历？',
					        function () {
					        	$.showIndicator();
								ajax.post('base/resumedelete',{'id': id},'json',function(data){
									$.hideIndicator();
									if(data.status == 0){
										$.errtoast('服务器繁忙，请稍后重试');
										return;
									}															
									$.errtoast('删除成功');
									setTimeout(function(){window.location.reload();},1500);	
								});
					        }
					    );				
					});
				}					
			});//getareabycodeasjson end							
		});
	}//showresume end
	
	getResume();
	
	$(".tab-link").each(function(){
		$(this).on('click',function(){
			if($(this).index() == 0){
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();					
			}else{
				if(flag == false){
					$.attachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').show();					
					get_deliver();
				}
			}
		});
	});
	
	function get_deliver(){
		ajax.get('base/resumedeliverylist/' + customerId + '/' + pageNow + '/' + pageSize,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			flag = true;
			var deliverylist = data.data.resumedeliverylist;
			if(deliverylist == 0){
				$("#deliver-list").html(base.noMent('暂未投递记录'));
				$.detachInfiniteScroll($('.infinite-scroll'));
				$('.infinite-scroll-preloader').hide();					
			}else{
				require('dateFormat');
				var htmldata = '',d = new Date();
				for(var i = 0; i < deliverylist.length; i++){
					d.setTime(deliverylist[i].deliveryTime);
					htmldata += '<li><a class="item-content item-link" href="' + SAYIMO.SRVPATH + 'view/me/resume/resumedeliverydetail.html?id=' + deliverylist[i].id + '">' +
					'		<div class="item-inner"><div class="item-title-row">' + deliverylist[i].positionName + '</div>' +
					'		<div class="item-title-row">' + deliverylist[i].providerName + '</div>' +
					'		<div class="item-title-row">' + d.format('yyyy-MM-dd HH:mm:ss') + '</div>' +
					'       <div class="payScope red">' + deliverylist[i].payScope + '</div>' +
					'		</div>' +
					'	</a>' +
					'</li>';
				}
				if(pageNow == 1){
					$("#deliver-list").html(htmldata);
				}else{
					$("#deliver-list").append(htmldata);
				}
				if(deliverylist.length < pageSize - 1){
					$.detachInfiniteScroll($('.infinite-scroll'));
					$('.infinite-scroll-preloader').hide();				
				}				
			}
		});
	}

	//下拉加载
	$(document).on('refresh', '.pull-to-refresh-content',function(){
		if($(".tab-link.active").index() == 0){
			getResume();
		}else{
			pageNow = 1;
			get_deliver();			
		}
	    $.pullToRefreshDone('.pull-to-refresh-content'); 
	});
	
});