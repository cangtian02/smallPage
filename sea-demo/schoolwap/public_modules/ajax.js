define(function(require, exports, module) {
	var ajax = (function(){		
		return{
			get : function(model,type,callback){
				if(model.indexOf("https") > 0 || model.indexOf("http") > 0){
					var apiurl = model;
				}else{
					var apiurl = SAYIMO.APIURL + model;
				}
				var AJAXTIME = new Date().getTime();
				apiurl.indexOf('?') > 0 ? apiurl = apiurl + '&ver=' + AJAXTIME : apiurl = apiurl;
				$.ajax({
					dataType: type,
					type: "GET",
					data: {},
					url: apiurl,
					success:function(rtn){
						if(rtn == null){
							$.errtoast('服务器错误 (-1),请稍后重试');
							return;
						}
						callback(rtn);
					},
			        error: function () {
			        	setTimeout(function(){$.errtoast('服务器错误 (-1),请稍后重试');},1000);			            
			        }						
				});
			},
			post : function(model,mdata,type,callback){
				if(model.indexOf("https") > 0 || model.indexOf("http") > 0){
					var apiurl = model;
				}else{
					var apiurl = SAYIMO.APIURL + model;
				}
				$.ajax({
					dataType: type,
					type: "POST",
					data: mdata,
					url: apiurl,
					success:function(rtn){
						if(rtn == null){
							$.errtoast('服务器错误 (-1),请稍后重试');
							return;
						}						
						callback(rtn);
					},
			        error: function () {
			           setTimeout(function(){$.errtoast('服务器错误 (-1),请稍后重试');},1000);
			        }						
				});
			}			
		}	
	});	
	module.exports = ajax();
});