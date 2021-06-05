/*
 *  name: 苍天
 *	qq: 1297161816
 *	url: www.ct9001.com
 *	version: 1.0.0
 *	update: 2016.1.6
 *	statement: 可更改源文件用于他处，但请保留头部版权。
 */
;(function(win){
	var settings,
		defaultsetting = {title:"提示",content:"",width:"400",height:"200",url:"",confirmFun: new Object,cancelFun: new Object},
		contentWidth = 0,
		contentHeight = 0;			
	win.popup={		
		alert: function (setting) {
			open(setting,"alert");
		},
		confirm: function(setting){
			open(setting,"confirm");
		},
		iframe: function(setting){
			open(setting,"iframe");
		},
		close: function(){
			popupwin.remove();
			popupMask.remove();			
		},		
	};
	function init(setting){		
        if(setting != undefined && setting != null){settings = $.extend({},defaultsetting, setting);}
        bodyNode = $(document.body);//保存body
        renderDOM();//渲染剩余的DOM，并且插入到body
		popupMask = $(".popupmask");//遮罩层
		popupwin = $(".popupwin");//弹出层框架
		titletext = popupwin.find(".popuptitle");//弹出框标题
		content = popupwin.find(".popupcontent");//弹出内容 
		close = popupwin.find(".popupclose");//关闭按钮
		popupMask.show();//遮罩层显示		
		popupwinresize();//审查窗口大小是否溢出		
	};
	function popupwinresize(){
		var winWidth = $(window).width(),
			winHeight = $(window).height(),	
			resWidth = 0,
			resHeight = 0;
		winWidth < settings.width ? resWidth = winWidth - 100 : resWidth = settings.width;
		winHeight < settings.height ? resHeight = winHeight - 100 : resHeight = settings.height;		
        contentWidth = resWidth - 20;
        contentHeight = resHeight - 60;
		popupwin.css({"width": resWidth,"height": resHeight,"margin-left": - (resWidth/2),"margin-top": - (resHeight/2)});				
	};
	function open(setting, caller){
		init(setting);
		titletext.text(settings.title);//设置标题		
		switch(caller){
			case "alert" :
				content.text(settings.content);//设置内容				
			break;
			case "confirm" :
				content.html(settings.content);//设置内容
				popupwin.append("<div class='btnBox'></div><div class='btn'><input type='button' id='popupconfirmbtn' class='confirmbtn popupease' value='确定' /><input type='button' id='popupcancelbtn' class='confirmbtn popupease' value='取消' /></div>");
			break;
			case "iframe" :
				content.addClass("loading");
				content.append("<iframe id='iframebox' frameborder='0' marginwidth='0' marginheight='0' width='" + contentWidth + "'height='" + contentHeight + "'src=" + settings.url + "></iframe>");
				$("#iframebox").load(function(){content.removeClass("loading");});
			break;
		}
		popupevent(caller);//弹框事件				
	};
	function popupevent(caller){
		close.click(function(){popup.close();});//移除节点
		if (caller == "confirm"){	
            $(".popupwin").find("#popupconfirmbtn").click(function(){
            	popup.close();
            	if ($.isFunction(settings.confirmFun)) {
                    settings.confirmFun();
                }
            });
           	$(".popupwin").find("#popupcancelbtn").click(function(){
             	popup.close();
            	if ($.isFunction(settings.cancelFun)) {
                    settings.cancelFun();
                }
           	});
        }
		$(".popupmask").click(function(){
			popup.close();
		});
		//绑定窗口调整事件
		var timer = null;
		$(window).resize(function(){
			window.clearTimeout(timer);
			timer = window.setTimeout(function(){
				popupwinresize();
				if(caller == "iframe"){$("#iframebox").css({"width": contentWidth,"height": contentHeight});}
			},300);
		});		
	};
    function renderDOM(){
		var strDOM = "<div class='popupwin'><div class='popubTop'><div class='popupclose popupease'>×</div><span class='popuptitle'></span></div><div class='popupcontent'></div></div><div class='popupmask'></div>";
		bodyNode.append(strDOM);			
	};	
})(window);