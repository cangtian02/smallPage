define(function(require, exports, module) {	
	// 从本地读取省市区数据，读取后本地缓存，当版本号不同时刷新缓存
	var areaDataVersion = '1.0.0';
	var t = setInterval(function(){
		var areaData = localStorage.getItem('areaData');
		if(areaData == null){
			localStorage.setItem('areaData',window.jsObj.getAreaData());
			localStorage.setItem('areaDataVersion',areaDataVersion);
		}else{
			if(localStorage.getItem('areaDataVersion') != areaDataVersion){
				localStorage.setItem('areaData',window.jsObj.getAreaData());
				localStorage.setItem('areaDataVersion',areaDataVersion);				
			}else{
				clearInterval(t);
			}			
		}
	},3000);
	
	require('./base.css');
	function base(){			
		this.setCss = function(t){
		    var s = document.createElement('style');
		    s.innerText = t;
		    document.body.appendChild(s);			
		}//向页面写入css		
		this.getQueryString = function(name){ 		
		    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
		    	r = window.location.search.substr(1).match(reg);
		    if(r != null) return decodeURIComponent(r[2]); return null;
		}//获取页面参数值 有值传值无值传null	
		this.noList = function(t){
			return htmldata = '<div style="margin: 4.5rem 0;text-align:center;"><img src="' + SAYIMO.SRVPATH + 'images/default/icon_noList.png" style="display:inline-block;width: 6rem;" /><p style="margin: .7rem 0;color: #817f7f;">' + t + '</p></div>';			
		}//无数据返回无数据dom
		this.noMent = function(t){
			return htmldata = '<div class="no-list tc" style="margin: 4.5rem 0;"><i style="display: inline-block;width: 5rem;height: 5rem;border-radius: 50%;background: #C5C4C4;"><em style="display: inline-block;width: 2.4rem;height: 2.4rem;background: url(' + SAYIMO.SRVPATH + 'images/default/icon_noMent.png) center no-repeat;background-size: contain;margin-top: 1.3rem;"></em></i><p style="color: #817f7f;margin: .7rem 0;">' + t + '</p></div>';			
		}//无内容返回无内容dom
		this.getActiveTab = function(n){
			$(".buttons-tab a").removeClass("active");
			$("#btab" + n).addClass("active");
			$(".tabs .tab").removeClass("active");
			$("#tab" + n).addClass("active");			
		}//处理tab切换			
	}//base end	
	var base = new base();	
	module.exports = base;
});