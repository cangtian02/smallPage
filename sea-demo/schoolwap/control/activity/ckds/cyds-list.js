define(function(require, exports, module){
	
	$.init();
	
	var base = require('base'),
		ajax = require('ajax');		
	require('./cyds-list.css');	
	
	base.init();
	base.setTitle('团队清单');
	
	var teamId = base.getQueryString('teamId');
	
	var name = '';
	
	var search = require('search');	
	search({
		searchId: 'search',//搜索框id
		placeholder: '请输入团员名称',
		searchType: 'p',//搜索dom格式 p：公共格式
		isOpensugges: false,//不开启模糊搜索提示
		searchCall: function(v){
			name = v;
			getAjax();
		}//搜索框回调
	});
	
	function getAjax(){
		ajax.get('base/baseteammemberlistbyteamid/' + teamId + '?name=' + name,'json',function(data){
			if(data.status == 0){
				$.errtoast('服务器繁忙，请稍后重试');
				return;
			}
			data = data.data;		
			$("#teamCount").text(data.teamCount);			
			var htmldata = '';
			for(var i = 0; i < data.teamList.length; i++){
				htmldata += '<li class="justifyAlign"><span>' + data.teamList[i].name + '</span><span>' + data.teamList[i].schoolName + '</span></li>'
			}
			$("#teamList").html(htmldata);
		});
	}
	
	getAjax();

});