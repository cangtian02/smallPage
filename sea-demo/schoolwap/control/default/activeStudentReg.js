define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./activeStudentReg.css');
	
	base.init();
	base.setTitle('学生注册');

	var customerId = cookie.getCookie('customerId');
	
	$(".tel a").attr('href', 'tel:' + SAYIMO.TEL);
	$(".tel .item-font-two").html(SAYIMO.TEL);
	
	$("#button").on('click',function (){
		var studentName = $('#studentName').val(),
			studentNo = $('#studentNo').val(),
			reg = new RegExp("^[0-9a-zA-Z]*$");			
		if( studentName == '' ){
			$.errtoast('请输入您的姓名');
			return;
		}
		if( !REG.ISNULL.test(studentName) ){
			$.errtoast('姓名为空');
			return;
		}		
		if( studentNo == '' ){
			$.errtoast('请输入您的学号');
			return;
		}
		if( !reg.test(studentNo) ){
			$.errtoast('请输入正确的学号');
			return;
		}
		ajax.post('user/bindstudentinfo',{"customerId": customerId,'studentName': studentName,'studentNo': studentNo},'json',function(data){
        	if(data.status == 0){
        		var errorCode = require('errorCode');//载入错误码
        		errorCode(data.errorCode);
        		return;		        		
        	}			
			$.errtoast('绑定成功');	
			setTimeout(function(){
				cookie.setCookie("isStudent",'Y',24*60*60);
				cookie.setCookie("isFristLogin",'1',24*60*60);
				window.location.href = SAYIMO.SRVPATH + 'view/activity/zxxszs/zxxszs-list.html';				
			},1500);			
		});
	});
	
	$("#notStudent").on('click',function (){
		window.location.href = SAYIMO.SRVPATH + 'view/home/home.html';
	});

});