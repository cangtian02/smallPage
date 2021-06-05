define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./memberList.css');
	
	base.init();
	base.setTitle('我的会员');	
	
	var customerId = cookie.getCookie('customerId');
	
	//获取我的会员信息
	ajax.get('user/getchildrenmember/' + customerId,'json',function(data){
		if(data.status == 0){return;}
		$('#totalcount').text(data.data.totalcount);
		var htmldata = '',
			d =	new Date(),
			readList = data.data.children;
		require('dateFormat');	
		if(data.data.totalcount > 0){
			for(var i = 0; i < readList.length; i++){
				d.setTime(readList[i].createDate);
				var customerType = readList[i].customerType == 1 ? 'VIP会员' : '普通会员';
					htmldata += '  <li>'+
							    '    <div class="item-content">'+
							    '      <div class="item-inner">'+
							    '        <div class="item-title-row">'+
							    '          <div class="item-title sayimo-wallet-div">'+
							    '          		<h3>我的会员&nbsp;-&nbsp;'+readList[i].alias+'</h3>'+
							    '          		<span class="sayimo-wallet-span2">'+ d.format('yyyy-MM-dd HH:mm:ss') + '</span>'+
							    '          		<span class="sayimo-member-span">'+                      
							    '          			<font class="sayimo-wallet-font fr">'+customerType+'</font>'+                       
							    '          		</span>'+         
							    '          </div>'+
							    '        </div>'+
							    '      </div>'+
							    '    </div>'+
							    '  </li>';
			}
			$("#memberList").html(htmldata);
		}else{
			$("#memberList").html(base.noList('您还未发展会员哦'));
		}
	});	
	
});