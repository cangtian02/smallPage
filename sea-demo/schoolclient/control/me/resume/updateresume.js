define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');
	require('./addresume.css');
	
	window.jsObj.setLoadUrlTitle('修改简历');
	
	var customerId = window.jsObj.readUserData('id'),
		id = base.getQueryString('id');

	var imgUrl = '',//头像地址
		expectPosition = '',//期望职位
		expectPositionCode = '',//期望职位编码
		profession = '',//专业
		professionCode = '',//专业编码
		resumeExperienceNum = 0;
		
	require('dateFormat');
	
	ajax.get('base/resumeDetails/' + id,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}		
		data = data.data.resumeDetails;		
		$("#imgfile").attr('src',data.headPhoto);
		$("#imgfile").attr('data-flag','true');
		imgUrl = data.headPhoto;
		$(".content input").each(function(){
			var _this = $(this),
				id = _this.attr('id');
			for(var i in data){
				if(id == i){
					_this.val(data[i]);
				}
			}				
		});
		if(data.expectPositionCode != '' && data.expectPositionCode != null && data.expectPositionCode != undefined){
			expectPositionCode = data.expectPositionCode;
			expectPosition = data.expectPosition;
		}
		if(data.professionCode != '' && data.professionCode != null && data.professionCode != undefined){
			professionCode = data.professionCode;
			profession = data.profession;
		}
		var fun_expectPosition = require('expectPosition');	
		fun_expectPosition('#expectPosition',expectPositionCode.split(","),function(reqexpectPosition,reqexpectPositionCode){
			expectPosition = reqexpectPosition;
			expectPositionCode = reqexpectPositionCode;
		});
		
		var fun_profession = require('profession');
		fun_profession('#profession',professionCode.split(","),function(reqprofession,reqprofessionCode){
			profession = reqprofession;
			professionCode = reqprofessionCode;
		});	
		
		var cityPicker = require('cityPicker');	
		cityPicker($('#address'),$('#baseAreaCode'),data.address,function(){});
		
		$("#sex").val(data.sex);		
		var bord =	new Date();
		bord.setTime(data.birthday);
		$("#birthday").val(bord.format('yyyy-MM-dd'));		
		$("#workType").val(data.workType);	
		$("#workStatus").val(data.workStatus);		
		$("#workAge").val(data.workAge);		
		$("#firstWorkTime").val(data.firstWorkTime);		
		$("#skill").text(data.skill);		
		$("#education").val(data.education);		
		var a =	new Date();
		a.setTime(data.beginDate);
		var b =	new Date();
		b.setTime(data.endDate);			
		$("#beginDate").val(a.format('yyyy-MM-dd'));
		$("#endDate").val(b.format('yyyy-MM-dd'));		
		$("#selfEvaluation").text(data.selfEvaluation);		
		$("#isEnable").val(data.isEnable);		
		var resumeExperience = '';
		for (var i = 0; i < data.resumeExperience.length; i++) {
			resumeExperienceNum = i + 1;		
			resumeExperience += '<div class="b-cont b-cont-resumeExperience b-cont-resumeExperience-' + resumeExperienceNum + '" id="resumeExperience" data-id="6" data-status="1" data-reid="' + data.resumeExperience[i].id + '" data-sort="' + data.resumeExperience[i].sort + '">' +
					'<div class="b-cont-mask"></div>' +
					'<div class="table">' +
					'	<div class="t">工作经验：</div>' +
					'	<div class="c">' +
					'		<textarea rows="2" class="gzjy" escape="false" class="fromval">' + data.resumeExperience[i].workExperience + '</textarea>' +
					'	</div>' +
					'</div>' +
					'<div class="table">' +
					'	<div class="t">项目经验：</div>' +
					'	<div class="c">' +
					'		<textarea rows="2" class="xmjy" escape="false" class="fromval">' + data.resumeExperience[i].projectExperience + '</textarea>' +
					'	</div>' +
					'</div>' +
					'<div class="set">' +				
					'	<div class="b-delete b-resumeExperience-delete"><i></i>删除</div>' +
					'	<div class="b-bianji b-resumeExperience-bianji"><i></i>编辑</div>' +
					'</div>' +		
				'</div>';
		}
		$(".resumeExperience-box").append(resumeExperience);
		$(".b-cont").show();
		control();
	});

	var Pcorp = require('Pcorp');
	require('uploadImg');
	$("#file").change(function () { //点击上传图片
		$.showIndicator();
	    var that = this;
	    lrz(that.files[0], {}).then(function (rst) {
	        var img = new Image();
	        img.onload = function () {
	        	$.hideIndicator();
				Pcorp({
					'src': rst.base64,
					'aspectRatio': [1,1],
					'quality': .6,
					'callback': function(basesrc){
						var img = new Image();
						img.src = basesrc;
						img.onload = function(){
				        	$("#imgfile").attr('src', img.src);
				        	$("#imgfile").attr('data-name', rst.origin.name);
				        	$("#imgfile").attr('data-flag', 'flase');	        				
						}				
					}
				});
	        };
	        img.src = rst.base64;
	       	return rst;
	    });
	});	
	
	var d = new Date();
	d.setTime(d);
	d = d.format('yyyy-MM-dd');//当前日期
	
	$("#birthday").calendar({
	    value: ['1995-01-01'],
	    maxDate: d
	});
	$("#beginDate").calendar({
	    value: ['2011-09-01'],
	    maxDate: d
	});			
	$("#endDate").calendar({
		onChange: function(p){
		   	var newstr = $("#beginDate").val().replace(/-/g,'/'),
		    	date = new Date(newstr),
		    	time_str = date.getTime().toString();
			if(p.value[0] < time_str){
				$.errtoast('亲,您这是怎么毕业的');
				$("#beginDate").val('');
			}
		}
	});
			
	var mask = $(".mask"),//遮罩层
		bianji = $(".bianji"),//编辑按钮
		mask_block = $("#mask-block");//

	bianji.each(function(){
		var _this = $(this);		
		_this.off('click').on('click',function(){
			mask.show();
			mask_block.show();
			var _id = $(this).attr('data-id');
			$(".b-cont-" + _id).find('.fromval').each(function(){
				$(this).attr('data-list',$(this).val());
			});
			$(".b-cont-" + _id).addClass('cur');
			$(".b-cont-" + _id).find('.b-cont-mask').hide();
		});			
	});	
	
	$("#addresumeExperience").off('click').on('click',function(){
		resumeExperienceNum++;
		var htmldom = '<div class="b-cont b-cont-resumeExperience b-cont-resumeExperience-' + resumeExperienceNum + '" id="resumeExperience" data-id="6" data-status="1" data-reid="">' +
				'<div class="b-cont-mask"></div>' +
				'<div class="table">' +
				'	<div class="t">工作经验：</div>' +
				'	<div class="c">' +
				'		<textarea rows="2" class="gzjy" escape="false" class="fromval"></textarea>' +
				'	</div>' +
				'</div>' +
				'<div class="table">' +
				'	<div class="t">项目经验：</div>' +
				'	<div class="c">' +
				'		<textarea rows="2" class="xmjy" escape="false" class="fromval"></textarea>' +
				'	</div>' +
				'</div>' +
				'<div class="set">' +				
				'	<div class="b-delete b-resumeExperience-delete"><i></i>删除</div>' +
				'	<div class="b-bianji b-resumeExperience-bianji"><i></i>编辑</div>' +
				'</div>' +		
			'</div>';	
		$(".resumeExperience-box").append(htmldom);
		$(".resumeExperience-box .b-cont:last-child").attr('data-sort', $(".resumeExperience-box .b-cont").length);
		mask.show();
		mask_block.show();		
		$(".b-cont-resumeExperience-" + resumeExperienceNum).addClass('cur').show();
		$(".b-cont-resumeExperience-" + resumeExperienceNum).find('.b-cont-mask').hide();
		$(".b-cont-resumeExperience-" + resumeExperienceNum).attr('data-sort', $(".b-cont-resumeExperience").length);
		
		control();
	});	
	
	function control(){
		$(".b-resumeExperience-delete").off('click').on('click',function(){
			var _this = $(this);
		    $.confirm('确认删除？',
		        function () {
		        	if( _this.parents('.b-cont').attr('data-reid') != 0 ){	        		
		        		_this.parents('.b-cont').attr('data-status','0');
		        		_this.parents('.b-cont').hide();
		        	}else{
			        	_this.parents('.b-cont').remove();	        		
		        	}		
		        }
		    );			
		});				
		$(".b-resumeExperience-bianji").off('click').on('click',function(){
			mask.show();
			mask_block.show();			
			$(this).parents('.b-cont-resumeExperience').addClass('cur').show();
			$(this).parents('.b-cont-resumeExperience').find('.b-cont-mask').hide();
		});		
	}
	
	$("#mask-close").on('click',function(){
		$(".b-cont.cur .fromval").each(function(){
			$(this).val($(this).attr('data-list'));
		});		
		$(".b-cont.cur .b-cont-mask").show();
		$(".b-cont.cur").removeClass('cur');
		mask_block.hide();
		mask.hide();
	});	
	$("#mask-update").on('click',function(){
		var _id = $(".b-cont.cur").attr('data-id');
		fun_reg(_id);
	});		

	function fun_reg(id){
		switch (id){
			case '1':
				fun_reg_1();
				break;
			case '2':
				fun_reg_2();
				break;
			case '3':
				fun_reg_3();
				break;
			case '4':
				fun_reg_4();
				break;
			case '5':
				fun_reg_5();
				break;
			case '6':
				fun_reg_6();
				break;					
			default:
				break;
		}
	}
	
	function fun_reg_1(){
		var name = $("#name").val(),
			sex = $("#sex").val(),
			bord = $("#birthday").val(),
			nativePlace = $("#nativePlace").val(),
			linkinfo = $("#linkinfo").val(),
			email = $("#email").val();
		if(name == ''){
			$.errtoast('姓名不能为空');
			return;			
		}			
		if( !REG.ISNULL.test(name) ){
			$.errtoast('姓名输入为空');
			return;
		}			
		if(bord == ''){
			$.errtoast('未选择出生日期');
			return;			
		}			
		if( !REG.ISNULL.test(nativePlace) ){
			$.errtoast('籍贯输入为空');
			return;
		}
		if(linkinfo == ''){
			$.errtoast('联系电话为空');
			return;			
		}		
		if( !REG.ISNULL.test(linkinfo) ){
			$.errtoast('联系电话输入为空');
			return;
		}
		if(!REG.PHONE.test(linkinfo)){
			$.errtoast('联系电话输入错误');
			return;
		}
		if(email == ''){
			$.errtoast('联系邮箱为空');
			return;			
		}		
		if( !REG.ISNULL.test(email) ){
			$.errtoast('联系邮箱输入为空');
			return;
		}
		if(!REG.EMAIL.test(email)){
			$.errtoast('联系邮箱输入错误');
			return;
		}
		fun_reg_ok();
	}

	function fun_reg_2(){
		var workType = $("#workType").val(),
			address = $("#baseAreaCode").val(),
			expectWage = $("#expectWage").val(),
			workStatus = $("#workStatus").val(),
			workAge = $("#workAge").val(),
			firstWorkTime = $("#firstWorkTime").val();
		if(workType == ''){
			$.errtoast('请选择求职意向');
			return;			
		}					
		if(address == 'null'){
			$.errtoast('工作地点为空');
			return;			
		}
		if(expectWage == '' ){
			$.errtoast('请输入期待薪资');
			return;
		}			
		if( !REG.ISNULL.test(expectWage) ){
			$.errtoast('期待薪资输入为空');
			return;
		}
		if(isNaN(expectWage)){
			$.errtoast('期待薪资仅为数字');
			return;			
		}
		if(expectPosition == ''){
			$.errtoast('期望岗位为空');
			return;			
		}
		if(workStatus == ''){
			$.errtoast('请选择工作状态');
			return;			
		}	
		if(workAge == ''){
			$.errtoast('请选择工作年龄');
			return;			
		}				
		if(firstWorkTime == ''){
			$.errtoast('请选择到岗时间');
			return;			
		}				
		fun_reg_ok();
	}
	
	function fun_reg_3(){
		var skill = $("#skill").val();
		if(skill == ''){
			$.errtoast('技能特长不能为空');
			return;			
		}
		if(!REG.ISNULL.test(skill)){
			$.errtoast('技能特长输入为空');
			return;
		}			
		fun_reg_ok();
	}
	
	function fun_reg_4(){
		var school = $("#school").val(),
			education = $("#education").val(),
			beginDate = $("#beginDate").val(),
			endDate = $("#endDate").val();
		if(school == ''){
			$.errtoast('毕业院校不能为空');
			return;			
		}			
		if( !REG.ISNULL.test(school) ){
			$.errtoast('毕业院校输入为空');
			return;
		}			
		if(profession == ''){
			$.errtoast('专业名称为空');
			return;			
		}		
		if(education == ''){
			$.errtoast('请选择学历');
			return;			
		}		
		if(beginDate == ''){
			$.errtoast('入学时间为空');
			return;			
		}		
		if(endDate == ''){
			$.errtoast('毕业时间为空');
			return;			
		}				
		fun_reg_ok();
	}
	
	function fun_reg_5(){
		var selfEvaluation = $("#selfEvaluation").val();
		if(selfEvaluation == ''){
			$.errtoast('自我评价不能为空');
			return;			
		}			
		if( !REG.ISNULL.test(selfEvaluation) ){
			$.errtoast('自我评价输入为空');
			return;
		}			
		fun_reg_ok();
	}

	function fun_reg_6(){
		var gzjy = $(".b-cont.cur .gzjy").val(),
			xmjy = $(".b-cont.cur .xmjy").val();
		if( gzjy != '' && !REG.ISNULL.test(gzjy) ){
			$.errtoast('工作经验输入为空');
			return;
		}
		if( xmjy != '' && !REG.ISNULL.test(xmjy) ){
			$.errtoast('项目经验输入为空');
			return;
		}		
		fun_reg_ok();
	}

	function fun_reg_ok(){
		$(".b-cont.cur").attr('data-flag','1');
		$(".b-cont.cur .fromval").each(function(){
			$(this).attr('data-list',$(this).val());
		});		
		$(".b-cont.cur .b-cont-mask").show();
		$(".b-cont.cur").removeClass('cur');
		mask_block.hide();
		mask.hide();		
	}

	$("#close").on('click',function(){
	    $.confirm('您将放弃您的发布？',
	        function () {
				window.jsObj.finshCurrentActivity();
	        }
	    );			
	});

	$("#update").on('click',function(){	
	    $.confirm('您将确认您的修改？',
	        function () {
	        	$.closeModal();
	        	$.showIndicator();
				if($("#imgfile").attr('data-flag') == 'true'){
					ajaxpost();
				}else{				        	
					var fileStr = $("#imgfile").attr('src');
						fileStr = fileStr.split(',');
						fileStr = fileStr[1];
					var fileName = $("#imgfile").attr('data-name');		        	
					ajax.post('base/uploadfilebackurl',{"fileStr":fileStr,"fileName":fileName},'json',function(data){
						if(data.status == 0){
							$.errtoast('头像上传失败，请稍后重试');
							return;
						}
						imgUrl = data.data[0].photoUrl;
						ajaxpost();				
					});
				}
			}
	    );
	});
	
	function ajaxpost(){
		var resumeExperience = [];//工作经验
		$(".b-cont-resumeExperience").each(function(){			
			var _this = $(this),
				i = _this.index() + 1;
			if(_this.attr('data-reid') != 0){
				resumeExperience.push({
					"id": _this.attr('data-reid'),
					'workExperience': _this.find('.gzjy').val(),
					'projectExperience': _this.find('.xmjy').val(),
					"sort": i,
					"status": _this.attr('data-status')
				});				
			}else{
				if(  _this.find('.gzjy').val() != '' || _this.find('.xmjy').val() != ''){
					resumeExperience.push({
						"id": '',
						'workExperience': _this.find('.gzjy').val(),
						'projectExperience': _this.find('.xmjy').val(),
						"sort": i,
						"status": '1'
					});
				}				
			}				
		});		
		resumeExperience = {'resumeExperience': resumeExperience};
		resumeExperience = JSON.stringify(resumeExperience);
		
		ajax.post('base/resumeupdate',{
			"id": id,						
			"name": $("#name").val(),
			"sex": $("#sex").val(),
			"birthday": $("#birthday").val(),
			"headPhotoUrl": imgUrl,
			"expectPosition": expectPosition,
			"expectPositionCode": expectPositionCode,
			"school": $("#school").val(),
			"profession": profession,
			"professionCode": professionCode,
			"nativePlace": $("#nativePlace").val(),
			"linkinfo": $("#linkinfo").val(),
			"email": $("#email").val(),
			"workType": $("#workType").val(),
			"address": $("#baseAreaCode").val(),
			"expectWage": $("#expectWage").val(),
			"workStatus": $("#workStatus").val(),
			"skill": $("#skill").val(),
			"createUser": customerId,
			"workAge": $("#workAge").val(),
			"firstWorkTime": $("#firstWorkTime").val(),
			"education": $("#education").val(),
			"beginDate": $("#beginDate").val(),
			"endDate": $("#endDate").val(),
			"selfEvaluation": $("#selfEvaluation").val(),
			"isEnable": $("#isEnable").val(),
			'experience': resumeExperience
		},'json',function(data){
			$.hideIndicator();
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}		
			$.errtoast('修改成功');
			setTimeout(function(){
				window.jsObj.refreshLastPage();
    			window.jsObj.finshCurrentActivity();           			
			},1500);
		});			
	}

});