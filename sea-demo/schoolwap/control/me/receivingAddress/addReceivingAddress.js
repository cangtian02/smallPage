define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./addReceivingAddress.css');
	
	base.init();
	base.setTitle('添加地址');		
	
	var customerId = cookie.getCookie('customerId');
	
    $('.tab-control-item').each(function(){
    	$(this).on('click',function(){
    		var i = $(this).index();
    		$(this).addClass('tab-control-active').siblings('a').removeClass('tab-control-active');
    		$(".tab-control-content").eq(i).addClass('tab-control-active').siblings('.tab-control-content').removeClass('tab-control-active');
    	});
    }); 
	
	var schoolPicker = require('schoolPicker'),
		cityPicker = require('cityPicker');
		
	cityPicker($('#city-picker'),$('#baseAreaCode'),'',function(){});	
	
	var dormitoryDom = '<input type="text" placeholder="宿舍楼层号" id="dormitoryNumberText" /><input type="hidden" id="dormitoryNumberCode" />',	
		dormitoryArr = [],
		areaCode = [];
	
	ajax.get('user/getallschool','json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}		
		var htmldata = '',schoolList = data.data.schoolList,hasFloor = [];
		for(var i = 0; i < schoolList.length; i++){
			htmldata += '<option value="' + schoolList[i].schoolCode + '">' + schoolList[i].schoolName + '</option>';
			hasFloor.push(schoolList[i].hasFloor);
			dormitoryArr.push({});
			areaCode.push(schoolList[i].areaCode);
		}
		$("#schooladdressbox").html('<select id="schooladdress" onchange="gradeChange()">' + htmldata + '</select>');				
		if(hasFloor[0] == 1){
			getaddressdatails($("#schooladdress").val(),0);
		}else{
			$("#post_button").removeClass('disabled');
		}
		this.gradeChange = function(){
       		var objS = document.getElementById("schooladdress"),
        		val = objS.options[objS.selectedIndex].value;
        	if(hasFloor[objS.selectedIndex] == 1){
        		$("#post_button").addClass('disabled');
        		getaddressdatails(val,objS.selectedIndex);
        	}else{
        		$("#dormitoryNumberTextbox").html(dormitoryDom);
        	}
		}
	});
	
	function getaddressdatails(val,i){
		if(typeof(dormitoryArr[i].length) === 'undefined'){
			ajax.get('user/getaddressdatails/' + val,'json',function(data){
				if(data.status == 0){
					$.errtoast('服务器繁忙，请稍后重试');
					return;
				}			
				dormitoryArr[i] = data.data.dormitoryList;
				schoolPicker($('#dormitoryNumberText'),'',data.data.dormitoryList);			
				$("#post_button").removeClass('disabled');
			});
		}else{
			schoolPicker($('#dormitoryNumberText'),'',dormitoryArr[i]);			
			$("#post_button").removeClass('disabled');			
		}
	}
	
	$("#post_button").on('click',function(){
		if($(this).hasClass('disabled') == false){
			if($('.tab-control-item.tab-control-active').index() == 0){
				post_school();
			}else{
				post_other();
			}
		}
	});
	
	function post_school(){
		var schooluser = $('#schooluser').val(),
			schoolphone = $('#schoolphone').val(),
			dormitoryNumberText = $('#dormitoryNumberText').val(),
			dormitoryNumberCode = $('#dormitoryNumberCode').val();
		if(schooluser == ''){
			$.errtoast('请输入收件人');
			return;
		}
		if(!REG.ISNULL.test(schooluser)){
			$.errtoast('请输入正确的收件人');
			return;			
		}		
		if(schoolphone == ''){
			$.errtoast('请输入联系方式');
			return;
		}
		if(!REG.PHONE.test(schoolphone)){
			$.errtoast('请输入有效的手机号');
			return;
		}				
		if(dormitoryNumberText == ''){
			$.errtoast('请输入宿舍楼层号');
			return;
		}
		if(!REG.ISNULL.test(dormitoryNumberText)){
			$.errtoast('请输入有效宿舍楼层号');
			return;
		}
       	var _objS = document.getElementById("schooladdress");		
		ajax.post('user/addreceiveaddress',{
			'customerId': customerId,
			'receivingPeople': schooluser,
			'telephone': schoolphone,
			'areaCode': areaCode[_objS.selectedIndex],
			'address': dormitoryNumberText,
			'dormitoryNumberCode': dormitoryNumberCode,
			'isSchool': 1,
			'isDefault': 0,
			'schoolCode': $("#schooladdress").val()
		},'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');		
			}else{
				$.errtoast('添加成功');
				setTimeout(function (){window.history.back();},1500);				
			}		
		});		
	}

	function post_other(){
		var otheruser = $('#otheruser').val(),
			otherphone = $('#otherphone').val(),
			otheraddres = $('#otheraddres').val(),
			pickerCode = $('#baseAreaCode').val();
		if(otheruser == ''){
			$.errtoast('请输入收件人');
			return;
		}
		if(!REG.ISNULL.test(otheruser)){
			$.errtoast('请输入正确的收件人');
			return;			
		}		
		if(otherphone == ''){
			$.errtoast('请输入联系方式');
			return;
		}
		if(!REG.PHONE.test(otherphone)){
			$.errtoast('请输入有效的手机号');
			return;
		}				
		if(otheraddres == ''){
			$.errtoast('请输入详细地址');
			return;
		}
		if( !REG.ISNULL.test(otheraddres)){
			$.errtoast('请输入正确的详细地址');
			return;
		}		
		ajax.post('user/addreceiveaddress',{
			'customerId': customerId,
			'receivingPeople': otheruser,
			'telephone': otherphone,
			'areaCode': pickerCode,
			'address': otheraddres,
			'dormitoryNumberCode': '',
			'isSchool': 0,
			'isDefault': 0,
			'schoolCode': ''
		},'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');		
			}else{
				$.errtoast('添加成功');
				setTimeout(function (){window.history.back();},1500);				
			}		
		});			
	}	
});