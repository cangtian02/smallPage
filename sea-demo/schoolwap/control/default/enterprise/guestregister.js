define(function(require, exports, module) {	
	$.init();	
	var base = require('base'),
		ajax = require('ajax');	
	require('./guestregister.css');

	$('#save').on('click',function(){
		var providerName = $('#providerName').val(),
			address = $('#address').val(),
			industry = $('#industry').val(),
			product = $('#product').val(),
			corporate = $('#corporate').val(),
			lockPhone = $('#lockPhone').val(),
			telPhone = $('#telPhone').val(),
			creditCode = $('#creditCode').val(),
			taxCode = $('#taxCode').val();			
		if(providerName == ''){
			$.errtoast('请输入企业全称');
			return;
		}
		if(!REG.ISNULL(providerName)){
			$.errtoast('企业全称为空');
			return;
		}		
		if(address == ''){
			$.errtoast('请输入企业地址');
			return;
		}
		if(!REG.ISNULL(address)){
			$.errtoast('企业地址为空');
			return;
		}			
		if(industry == ''){
			$.errtoast('请输入所属行业');
			return;
		}
		if(!REG.ISNULL(industry)){
			$.errtoast('所属行业为空');
			return;
		}		
		if(product == ''){
			$.errtoast('请输入主营产品');
			return;
		}
		if(!REG.ISNULL(product)){
			$.errtoast('主营产品为空');
			return;
		}		
		if(corporate == ''){
			$.errtoast('请输入法人代表');
			return;
		}
		if(!REG.ISNULL(corporate)){
			$.errtoast('法人代表为空');
			return;
		}			
		if(lockPhone == ''){
			$.errtoast('请输入法人手机');
			return;
		}
		if(!REG.PHONE(lockPhone)){
			$.errtoast('法人手机格式不正确');
			return;
		}		
		if(creditCode == ''){
			$.errtoast('请输入营业执照/信用号');
			return;
		}
		if(!REG.ISNULL(creditCode)){
			$.errtoast('营业执照/信用号为空');
			return;
		}
		if(!REG.ISNULL(taxCode)){
			$.errtoast('税务登记代码为空');
			return;
		}			
		ajax.post('provider/insertEnterpriseInfo',{
			'name': providerName,
			'address': address,
			'industry': industry,
			'product': product,
			'corporate': corporate,
			'lockPhone': lockPhone,
			'telPhone': telPhone,
			'creditCode': creditCode,
			'taxCode': taxCode
		},'json',function(data){
			if(data.status == 0 && data.error == '800001'){
				$.errtoast('营业执照/信用号已存在');
				return;
			}
			if(data.status == 0){
				$.errtoast('系统繁忙，请稍后重试');
				return;
			}
			$.errtoast('申请成功');
			setTimeout(function (){
				window.history.back();
			},1500);						
		});
	});

});