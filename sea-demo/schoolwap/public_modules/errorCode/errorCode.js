define(function(require, exports, module) {
	function errorCode(code,i){// code为传入错误码 , i 为0用 $.errtoast(), 为1 用 $.toast(), 默认为0
		var errorCodeData = [ 
			{"code": "100001","msg": "系统错误"},
			{"code": "100002","msg": "查询错误"},
			{"code": "100003","msg": "无数据"},
			{"code": "100004","msg": "请求路径不存在"},
			{"code": "100005","msg": "未按指定请求方式请求服务器"},
			{"code": "100006","msg": "参数不正确"},
			{"code": "100007","msg": "签名无效"},
			{"code": "100008","msg": "系统正忙，请稍后重试"},
			{"code": "100009","msg": "无权访问请求被拒绝"},
			{"code": "200001","msg": "验证码为空，点击重新发送"},
			{"code": "200002","msg": "验证码已过期"},
			{"code": "200003","msg": "验证码存在，且没有过期"},
			{"code": "200004","msg": "验证码不正确"},
			{"code": "200005","msg": "学生信息不存在"},
			{"code": "200006","msg": "学生信息已绑定"},
			{"code": "300001","msg": "用户没有关注该公众号"},
			{"code": "300002","msg": "收货地址不存在"},
			{"code": "300003","msg": "钱包原始密码不正确"},
			{"code": "300004","msg": "支付密码为空"},
			{"code": "300005","msg": "用户还没有设置提现密码"},
			{"code": "300006","msg": "支付密码错误"},
			{"code": "300007","msg": "此地区暂时不支持发货"},
			{"code": "300008","msg": "该订单已支付"},
			{"code": "300009","msg": "活动商品只能选择校内地址"},
			{"code": "400001","msg": "库存不足"},
			{"code": "400002","msg": "商品评论添加失败"},
			{"code": "500001","msg": "下单失败"},
			{"code": "500002","msg": "下单成功"},
			{"code": "500003","msg": "订单收货地址为空"},
			{"code": "500004","msg": "钱包余额不足"},
			{"code": "500005","msg": "订单支付失败"},
			{"code": "500006","msg": "订单不存在"},
			{"code": "500007","msg": "退换货失败"},
			{"code": "500008","msg": "订单金额被篡改"},
			{"code": "500009","msg": "该状态下没有物流信息"},
			{"code": "500010","msg": "退换货时订单状态不正确"},
			{"code": "600001","msg": "团队人员已满"},
			{"code": "600002","msg": "该成员不是队长"},
			{"code": "600003","msg": "该成员已在团队"},
			{"code": "600004","msg": "团队名字已存在"},
			{"code": "600005","msg": "已向该团队发送请求，请耐心等待"}
		];
		for(var k = 0; k < errorCodeData.length; k++){
			if(errorCodeData[k].code == code){
				if(i == undefined){
					$.errtoast(errorCodeData[k].msg);
				}else if(i == 1){
					$.errtoast(errorCodeData[k].msg);
				}else{
					$.errtoast(errorCodeData[k].msg);
				}
			}
		}	
	}
	module.exports = errorCode;
});