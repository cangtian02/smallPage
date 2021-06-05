define(function(require, exports, module) {
var ind_a=[];
ind_a['0200']='管理科学与工程类';
ind_a['0201']='管理科学';
ind_a['0202']='信息管理和信息系统';
ind_a['0203']='工业工程';
ind_a['0204']='工程管理';
ind_a['0205']='农业经济管理';
ind_a['0300']='工商管理类';
ind_a['0301']='工商管理';
ind_a['0311']='企业管理';
ind_a['0302']='市场营销';
ind_a['0303']='会计学';
ind_a['0307']='涉外会计';
ind_a['0305']='会计电算化';
ind_a['0310']='财政金融';
ind_a['0304']='财务管理';
ind_a['0312']='技术经济';
ind_a['0306']='文秘';
ind_a['0308']='国际商务';
ind_a['0309']='物流管理';
ind_a['0400']='公共管理类';
ind_a['0401']='行政管理';
ind_a['0402']='公共事业管理';
ind_a['0405']='旅游管理';
ind_a['0406']='宾馆/酒店管理';
ind_a['0407']='人力资源管理';
ind_a['0408']='公共关系学';
ind_a['0409']='物业管理';
ind_a['0410']='房地产经营管理';
ind_a['0403']='劳动与社会保障';
ind_a['0404']='土地资源管理';
ind_a['3500']='图书档案学类';
ind_a['3501']='图书档案学';
ind_a['0100']='电子信息类';
ind_a['0101']='计算机科学与技术';
ind_a['0110']='计算机应用';
ind_a['0111']='计算机信息管理';
ind_a['0112']='计算机网络';
ind_a['0113']='电子商务';
ind_a['0102']='通信工程';
ind_a['0103']='电气工程及其自动化';
ind_a['0104']='自动化';
ind_a['0105']='电子信息工程';
ind_a['0106']='电子科学与技术';
ind_a['0107']='电子信息科学与技术';
ind_a['0108']='微电子学';
ind_a['0109']='光信息科学与技术';
ind_a['0500']='机械类';
ind_a['0501']='机械设计制造及其自动化';
ind_a['0502']='材料成型及控制工程';
ind_a['0503']='工业设计';
ind_a['0504']='过程装备与控制工程';
ind_a['0505']='机械电子工程/机电一体化';
ind_a['0506']='模具设计与制造';
ind_a['0507']='机械制造工艺与设备';
ind_a['2100']='仪器仪表类';
ind_a['2101']='测控技术与仪器';
ind_a['2200']='能源动力类';
ind_a['2201']='热能与动力工程';
ind_a['2202']='核工程与核技术';
ind_a['2203']='电力系统及自动化';
ind_a['2204']='制冷与低温技术';
ind_a['1900']='材料类';
ind_a['1901']='冶金工程';
ind_a['1902']='金属材料工程';
ind_a['1903']='无机非金属料工程';
ind_a['1904']='高分子材料与工程';
ind_a['1905']='材料物理';
ind_a['1906']='材料化学';
ind_a['1907']='材料科学与工程';
ind_a['2800']='轻工纺织食品类';
ind_a['2801']='食品科学与工程';
ind_a['2802']='轻化工程';
ind_a['2803']='包装工程';
ind_a['2804']='印刷工程';
ind_a['2805']='纺织工程';
ind_a['2806']='服装设计与工程';
ind_a['0600']='土建类';
ind_a['0601']='建筑学';
ind_a['0602']='城市规划';
ind_a['0610']='园林规划与设计';
ind_a['0603']='土木工程';
ind_a['0611']='道路与桥梁';
ind_a['0604']='建设环境与设备工程';
ind_a['0605']='给水排水工程';
ind_a['0612']='供热通风与空调工程';
ind_a['0606']='工业与民用建筑';
ind_a['0607']='室内装潢设计';
ind_a['0608']='建筑工程';
ind_a['0609']='工程造价管理';
ind_a['1800']='力学类';
ind_a['1801']='力学';
ind_a['1802']='应用力学';
ind_a['2000']='环境科学与安全类';
ind_a['2001']='环境科学';
ind_a['2004']='生态学';
ind_a['2002']='环境工程';
ind_a['2003']='安全工程';
ind_a['2500']='制药工程类';
ind_a['2501']='制药工程';
ind_a['2600']='交通运输类';
ind_a['2601']='交通运输';
ind_a['2602']='交通工程';
ind_a['2603']='油气储运工程';
ind_a['2604']='飞行技术';
ind_a['2605']='航海技术';
ind_a['2606']='轮机工程';
ind_a['2607']='汽车工程';
ind_a['2900']='航空航天类';
ind_a['2901']='飞行器设计与工程';
ind_a['2902']='飞行器动力工程';
ind_a['2903']='飞行器制造工程';
ind_a['2904']='飞行器环境与生命保障工程';
ind_a['2700']='船舶与海洋工程类';
ind_a['2701']='船舶与海洋工程';
ind_a['2300']='水利类';
ind_a['2301']='水利水电工程';
ind_a['2302']='水文与水资源工程';
ind_a['2303']='港口航道与海岸工程';
ind_a['2400']='测绘类';
ind_a['2401']='测绘工程';
ind_a['3200']='公安技术类';
ind_a['3201']='公安技术';
ind_a['3000']='武器类';
ind_a['3001']='武器系统与发射工程';
ind_a['3002']='探测制导与控制技术';
ind_a['3003']='弹药工程与爆炸技术';
ind_a['3004']='特种能源工程与烟火技术';
ind_a['3005']='地面武器机动工程';
ind_a['3006']='信息对抗技术';
ind_a['1400']='数学类';
ind_a['1401']='数学与应用数学';
ind_a['1402']='信息与计算科学';
ind_a['1500']='物理学类';
ind_a['1501']='物理学';
ind_a['1502']='应用物理学';
ind_a['1600']='化学类';
ind_a['1601']='化学';
ind_a['1602']='应用化学';
ind_a['1603']='化学工程与工艺';
ind_a['1604']='精细化工';
ind_a['1605']='化工设备与机械';
ind_a['3100']='生物类';
ind_a['3101']='生物工程';
ind_a['3102']='生物医学工程';
ind_a['3103']='生物科学，技术';
ind_a['1700']='天文地质地理类';
ind_a['1701']='天文学';
ind_a['1702']='地质学';
ind_a['1708']='宝石鉴定与加工';
ind_a['1703']='地理科学';
ind_a['1704']='地球物理学';
ind_a['1705']='大气科学';
ind_a['1706']='海洋科学';
ind_a['1707']='地矿';
ind_a['1709']='石油工程';
ind_a['1000']='经济学类';
ind_a['1001']='经济学';
ind_a['1002']='国际经济与贸易';
ind_a['1003']='财政学';
ind_a['1004']='金融学';
ind_a['1005']='经济管理';
ind_a['1006']='经济信息管理';
ind_a['1007']='工业外贸';
ind_a['1008']='国际金融';
ind_a['1009']='投资经济管理';
ind_a['1010']='统计学';
ind_a['1011']='审计学';
ind_a['0700']='语言文学类';
ind_a['0701']='中国语言文学';
ind_a['0702']='英语';
ind_a['0703']='俄语';
ind_a['0704']='德语';
ind_a['0705']='法语';
ind_a['0706']='日语';
ind_a['0707']='西班牙语';
ind_a['0708']='阿拉伯语';
ind_a['0709']='朝鲜语';
ind_a['0710']='其它外语';
ind_a['0711']='新闻学';
ind_a['0712']='广播电视新闻';
ind_a['0713']='广告学';
ind_a['0714']='编辑出版学';
ind_a['0715']='外贸英语';
ind_a['0716']='商务英语';
ind_a['1200']='艺术类';
ind_a['1201']='音乐，舞蹈，作曲';
ind_a['1202']='绘画，艺术设计';
ind_a['1203']='戏剧，表演';
ind_a['1204']='导演，广播电视编导';
ind_a['1205']='戏剧影视文学';
ind_a['1206']='戏剧影视美术设计';
ind_a['1207']='摄影，动画';
ind_a['1208']='播音，主持，录音';
ind_a['1209']='服装设计';
ind_a['0900']='法学类';
ind_a['0901']='法学';
ind_a['0902']='马克思主义理论';
ind_a['0903']='社会学';
ind_a['0904']='政治学与行政学';
ind_a['0905']='国际政治';
ind_a['0906']='外交学';
ind_a['0907']='思想政治教育';
ind_a['0908']='公安学';
ind_a['0909']='经济法';
ind_a['0910']='国际经济法';
ind_a['1100']='哲学类';
ind_a['1101']='哲学（含伦理学）';
ind_a['1102']='逻辑学';
ind_a['1103']='宗教学';
ind_a['0800']='教育学类';
ind_a['0801']='教育学';
ind_a['0803']='学前教育';
ind_a['0802']='体育学';
ind_a['3400']='医学类';
ind_a['3401']='基础医学';
ind_a['3402']='预防医学';
ind_a['3403']='临床医学与医学技术';
ind_a['3404']='口腔医学';
ind_a['3405']='中医学';
ind_a['3406']='法医学';
ind_a['3407']='护理学';
ind_a['3408']='药学';
ind_a['3409']='心理学';
ind_a['3410']='医学检验';
ind_a['3300']='农业类';
ind_a['3313']='植物生产';
ind_a['3301']='农学';
ind_a['3302']='园艺';
ind_a['3303']='植物保护学';
ind_a['3304']='茶学';
ind_a['3305']='草业科学';
ind_a['3306']='森林资源';
ind_a['3307']='环境生态';
ind_a['3314']='园林';
ind_a['3308']='动物生产';
ind_a['3309']='动物医学';
ind_a['3310']='水产类';
ind_a['3311']='农业工程';
ind_a['3312']='林业工程';
ind_a['1300']='历史学类';
ind_a['1301']='历史学';
ind_a['1302']='考古学';
ind_a['1303']='博物馆学';

	require('./popupSelect.css');

	function fun_profession(sid,fun_flag_arr,callback){
		var self = this;
		if(fun_flag_arr == ''){
			fun_flag_arr = new Array();
		}		
		$(sid).on('click',function(){
		  	var popupHTML = '<div class="popup">'+
		                    '<div class="content-block professionPopup">'+
		                      '<div class="closeBtn"><a href="javascript:;" class="close-popup fl">取消</a></div>'+
		                      '<div class="industryBox"></div>'+ 
		                    '</div>'+
		                  '</div>';
		  	$.popup(popupHTML);
			var dragHtml = '<div class="IndustryList" id="IndustryList"></div>';
			$('.industryBox').html(dragHtml);
			self.professionShow(); 
		});
		
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
		
		this.professionShow = function(){
			var output='',
				flag1;			
			for (var i in ind_a){
				if(i.substring(2) == '00'){
					flag1 = self.in_array(i,fun_flag_arr) ? ' chkON' : '';
					output += '<li><div class="Industry' + i + flag1 +' Industry" data-id="' + i + '"><span class="icon icon-check"></span>' + ind_a[i] + '</div>';
					var myid = i.substr(0,2),flag2,outputd='';
					for (var k in ind_a){
						if(k.substr(0,2) == myid){
							flag2 = self.in_array(k,fun_flag_arr) ? ' chkON' : '';
							if(k.substr(2) != '00'){
								outputd += '<li class="Industry' + k + flag2 +' Industry" data-id="' + k + '"><span class="icon icon-check"></span>' + ind_a[k] + '</li>';
							}
						}
					}
					outputd = '<ul>' + outputd + '</ul>';
					output = output + outputd +'</li>';
				}
			}		
			$('#IndustryList').html('<ul>' + output + '</ul>');
			$(".Industry").each(function(){
				$(this).off('click').on('click',function(){
					var _id = $(this).attr('data-id');
					self.professionChk(_id);
				});
			});			
		}
		
		this.professionChk = function(id){		
			fun_flag_arr[0] = id;
			reqprofession = '';
			reqprofessionCode = '';
			for(var i in fun_flag_arr){
				reqprofession += ',' + ind_a[fun_flag_arr[i]];
				reqprofessionCode += ',' + fun_flag_arr[i];
			}
			reqprofession = reqprofession.substring(1) ? reqprofession.substring(1) : '请选择专业名称';
			reqprofessionCode = reqprofessionCode.substring(1) ? reqprofessionCode.substring(1) : '';
			$(sid).val(reqprofession);
			$.closeModal($(".popup"));
			callback(reqprofession,reqprofessionCode);//点击确定后回调			
		}	
		
	}
	
	module.exports = fun_profession;
});