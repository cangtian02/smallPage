define(function(require, exports, module) {	
	$.init();	
	var base = require('base');
	require('./applystudentshop.css');	
	base.init();
	base.setTitle('申请学生店铺');	
	$(".btn").attr('href', 'tel:' + SAYIMO.TEL);
	$(".kefu").attr('href', SAYIMO.KFURL);
});