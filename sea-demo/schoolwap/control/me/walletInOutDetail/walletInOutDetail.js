define(function(require, exports, module) {
	
	$.init();
	
	var base = require('base'),
		cookie = require('cookie'),
		ajax = require('ajax');
	require('./walletInOutDetail.css');
	
	base.init();
	base.setTitle('收支明细');		
	
	var customerId = cookie.getCookie('customerId');
	
	ajax.get('user/getinoutdetails/' + customerId,'json',function(data){
		if(data.status == 0){
			$.errtoast('服务器繁忙，请稍后重试');
			return;
		}
		require('dateFormat');
		var htmldata = '',
			readList = data.data;
		if(readList != undefined){
			for(var i = 0; i < readList.length; i++){
				var money = '',
					d = new Date();
					
				d.setTime(readList[i].createDate);
				
				var createDate = d.format('yyyy-MM-dd HH:mm:ss');
				
				if(readList[i].inCome != ''){
					money = '<span class="sayimo-wallet-span1">+' + readList[i].inCome + '元</span>';
				}else{
					money = '<span class="sayimo-wallet-span1">-' + readList[i].exPend + '元</span>';
				}
				htmldata += 	'	<li>'+
							    '    <div class="item-content">' +
							    '      <div class="item-inner">' +
							    '        <div class="item-title-row">' +
							    '          <div class="item-title sayimo-wallet-div">' +
							    '          		<span class="sayimo-wallet-span ellipsis fl">' + readList[i].commet + '：</span>' + money +
							    '          </div>' +
							    '        </div>' +
							    '        <div class="item-subtitle">' +
							    '        	<span class="sayimo-wallet-span2">' +
						        '      			财务流水号：' + readList[i].emsNo +
						        '      		</span>' +
						        '      		<br>' +
						        '      		<span class="sayimo-wallet-span2">' + createDate +
						        '      		</span>' +
							    '        </div>' +
							    '      </div>' +
							    '    </div>' +
							    '  </li>';
			}
			htmldata = '<div class="list-block media-list"><ul>' + htmldata + '</ul></div>';
			$(".content").append(htmldata);
		}else{
			$(".content").append(base.noList('暂无收支信息'));
		}	
	});

});