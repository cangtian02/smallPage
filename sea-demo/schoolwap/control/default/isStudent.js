define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie');
	
	base.init();
	base.setTitle('是否是学生');
	
	var isStudent = cookie.getCookie('isStudent');
	
	if (isStudent == 'Y'){
		$(".content").append('<p style="color: #CCC;font-size: .8rem;text-indent: 0;margin: 10rem 0 0 0;padding: 0;text-align: center;">您已是学生会员，将跳转到商城首页</p>');
		setTimeout(function(){
			window.location.href = SAYIMO.SRVPATH + 'view/home/home.html';
		},3000);
	}else{
		$(".content").append('<p style="color: #CCC;font-size: .8rem;text-indent: 0;margin: 10rem 0 0 0;padding: 0;text-align: center;">您还不是学生会员，请进行学生会员验证</p>');
		setTimeout(function(){
			window.location.href = SAYIMO.SRVPATH + 'view/default/activeStudentReg.html';
		},3000);		
	}

});