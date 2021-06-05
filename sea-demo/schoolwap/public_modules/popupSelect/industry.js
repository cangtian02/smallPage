define(function(require, exports, module) {
var fun_a=[];
fun_a['01']='计算机软件';
fun_a['37']='计算机硬件';
fun_a['38']='计算机服务(系统、数据服务，维修)';
fun_a['31']='通信/电信/网络设备';
fun_a['39']='通信/电信运营、增值服务';
fun_a['32']='互联网/电子商务';
fun_a['40']='网络游戏';
fun_a['02']='电子技术/半导体/集成电路';
fun_a['35']='仪器仪表/工业自动化';
fun_a['41']='会计/审计';
fun_a['03']='金融/投资/证券';
fun_a['42']='银行';
fun_a['43']='保险';
fun_a['04']='贸易/进出口';
fun_a['22']='批发/零售';
fun_a['05']='快速消费品(食品,饮料,化妆品)';
fun_a['06']='服装/纺织/皮革';
fun_a['44']='家具/家电/工艺品/玩具';
fun_a['45']='办公用品及设备';
fun_a['14']='机械/设备/重工';
fun_a['33']='汽车及零配件';
fun_a['08']='制药/生物工程';
fun_a['46']='医疗/护理/保健/卫生';
fun_a['47']='医疗设备/器械';
fun_a['12']='广告';
fun_a['48']='公关/市场推广/会展';
fun_a['49']='影视/媒体/艺术';
fun_a['13']='文字媒体/出版';
fun_a['15']='印刷/包装/造纸';
fun_a['26']='房地产开发';
fun_a['09']='建筑与工程';
fun_a['50']='家居/室内设计/装潢';
fun_a['51']='物业管理/商业中心';
fun_a['34']='中介服务';
fun_a['07']='专业服务(咨询，人力资源)';
fun_a['52']='检测，认证';
fun_a['18']='法律';
fun_a['23']='教育/培训';
fun_a['24']='学术/科研';
fun_a['11']='餐饮业';
fun_a['53']='酒店/旅游';
fun_a['17']='娱乐/休闲/体育';
fun_a['54']='美容/保健';
fun_a['27']='生活服务';
fun_a['21']='交通/运输/物流';
fun_a['55']='航天/航空';
fun_a['19']='石油/化工/矿产/地质';
fun_a['16']='采掘业/冶炼';
fun_a['36']='电力/水利';
fun_a['56']='原材料和加工';
fun_a['28']='政府';
fun_a['57']='非盈利机构';
fun_a['20']='环保';
fun_a['29']='农业/渔业/林业';
fun_a['58']='多元化业务集团公司';
fun_a['30']='其他行业';

	require('./popupSelect.css');

	function industry(sid,fun_flag_arr,callback){		
		if(fun_flag_arr == ''){
			fun_flag_arr = new Array();
		}
		var self = this;
		$(sid).on('click',function(){
		  	var popupHTML = '<div class="popup">'+
		                    '<div class="content-block">'+
		                      '<div class="closeBtn"><a href="javascript:;" class="close-popup fl">取消</a><a href="javascript:;" class="fr" id="okbtn">确定</a></div>'+
		                      '<div class="industryBox"></div>'+ 
		                    '</div>'+
		                  '</div>';
		  	$.popup(popupHTML);
			var dragHtml ='	<dl class="IndustrySelected" id="IndustrySelected"><dt>已选行业：<div class="fr"><span class="red">0</span>&nbsp;/&nbsp;5</div></dt><dd></dd></dl>';
				dragHtml+='	<div class="IndustryList" id="IndustryList"></div>';
			$('.industryBox').html(dragHtml);
			self.industryShow();
		});

		this.industryShow = function(){
			var output='',
				flag,
				output2='';
			for (var i in fun_a){
				flag = self.in_array(i,fun_flag_arr) ? ' chkON' : '';
				output += '<li><div class="Funtype' + i + flag +' Funtype" data-id="' + i + '"><span class="icon icon-check"></span>' + fun_a[i] + '</div>';			
			}		
			for(var i in fun_flag_arr){
				output2 += '<li class="Funtype' + fun_flag_arr[i] + ' chkON Funtype" data-id="' + fun_flag_arr[i] + '">' + fun_a[fun_flag_arr[i]] + '<span>×</span></li>';
			}
			$('#IndustryList').html('<ul>' + output + '</ul>');		
			$('#IndustrySelected dd').html(output2);
			$("#IndustrySelected .fr .red").text(fun_flag_arr.length);
			self.industrycontrol();
		}
		
		this.industrycontrol = function(){
			$("#okbtn").on('click',function(){
				var reqexpectPosition = '',
					reqexpectPositionCode = '';
				for(var i in fun_flag_arr){
					reqexpectPosition += ',' + fun_a[fun_flag_arr[i]];
					reqexpectPositionCode += ',' + fun_flag_arr[i];
				}
				reqexpectPosition = reqexpectPosition.substring(1) ? reqexpectPosition.substring(1) : '请选择行业';
				reqexpectPositionCode = reqexpectPositionCode.substring(1) ? reqexpectPositionCode.substring(1) : '';
				$(sid).val(reqexpectPosition);
				$.closeModal($(".popup"));
				callback(reqexpectPosition,reqexpectPositionCode);//点击确定后回调
			});
			$(".Funtype").each(function(){
				$(this).off('click').on('click',function(){
					var _id = $(this).attr('data-id');
					self.industryChk(_id);
				});
			});	
		}
		
		this.industryChk = function(id){
			if(!self.in_array(id,fun_flag_arr)){			
				if(id.substr(2) == '00'){
					for (var i in fun_a){
						if(i.substr(0,2) == id.substr(0,2)){
							if(self.in_array(i,fun_flag_arr)) self.industrydel(i);
						}
					}
				}else{
					var myid = id.substr(0,2) + '00';
					if(self.in_array(myid,fun_flag_arr)) self.industrydel(myid);
				};
	
				if(fun_flag_arr.length < 5){
					fun_flag_arr[fun_flag_arr.length] = id;
					var html='<li class="Funtype' + id + '" data-id="' + id + '">' + fun_a[id] + '<span>×</span></li>';
					$('#IndustrySelected dd').append(html);
					$('.Funtype'+id).addClass('chkON');
					$(".IndustrySelected li").each(function(){
						$(this).off('click').on('click',function(){
							var _id = $(this).attr('data-id');
							self.industryChk(_id);
						});
					});				
				}else{
					window.jsObj.callToast('您最多能选择5项');
					return false;
				}
			}else{
				self.industrydel(id);
			}
			$("#IndustrySelected .fr .red").text(fun_flag_arr.length);		
		}
	
		this.industrydel = function(id){
			for (var i in fun_flag_arr){
				if(fun_flag_arr[i] == id) fun_flag_arr.splice(i,1);;
			}
			$('#IndustrySelected .Funtype' + id).remove();
			$('.Funtype' + id).removeClass('chkON');
		}

		this.in_array = function(needle, haystack) {
			if(typeof needle == 'string' || typeof needle == 'number') {
				for(var i in haystack) {
					if(haystack[i] == needle) {
						return true;
					}
				}
			}
			return false;
		}
		
	}
	
	module.exports = industry;

});