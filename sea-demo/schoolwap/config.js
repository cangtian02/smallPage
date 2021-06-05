//sayimo配置
var SAYIMO = {};
SAYIMO.HTTP = ('https:' == document.location.protocol) ? 'https://' : 'http://';
SAYIMO.HOST = SAYIMO.HTTP + window.location.host + '/';
SAYIMO.SERVLETPATH = window.location.href;
SAYIMO.STRPWS = 'sayimo';
SAYIMO.FILES = 'schoolwap/';
SAYIMO.KFURL = 'http://free.appkefu.com/AppKeFu/float/wap/chat.php?wg=cysayimo&robot=false';
SAYIMO.TEL = '4000051061';
if(window.location.host == 'ggschool.sayimo.cn' || window.location.host == '127.0.0.1:8020'){ 
	SAYIMO.APIURL = 'https://ggschool.sayimo.cn/schoolapi/'; //研发服务器地址
	SAYIMO.TITLE = '研发服务器';
	SAYIMO.APPID = 'wx5ecb53e27376818e';
}else if(window.location.host == 'testapi.sayimo.cn'){   
	SAYIMO.APIURL = 'https://testapi.sayimo.cn/schoolapi/';   //测试服务器地址
	SAYIMO.TITLE = '测试服务器';
	SAYIMO.APPID = 'wx97b6917b6e39cb25';
}else if(window.location.host == 'rainbowapi.sayimo.cn'){     
	SAYIMO.APIURL = 'https://rainbowapi.sayimo.cn/schoolapi/'; //线上地址
    SAYIMO.TITLE = '彩虹梦客空间创客服务平台';
    SAYIMO.APPID = 'wx0d75c293e5f78a00';    
}
SAYIMO.SRVPATH = SAYIMO.HOST + SAYIMO.FILES;

//顺丰外链地址 （需要会员id不能单独用于外链地址链接）
SAYIMO.PPX = 'http://www.sffix.cn/sffix/toCustomerServiceOther.html?dataSource=SAYIMO&memberId=';//破屏险
SAYIMO.SJHS = 'http://m.shanhs.com/redirect/wechatRedirect.html?redirectCode=wechatSYLogin&stateParam=';//手机回收
SAYIMO.SWX = 'http://www.sffix.cn/sffix/repairFirstsOther.html?dataSource=SAYIMO&memberId=';//顺维修
//项目上线加上dist/ 开发为''
SAYIMO.BUILD = '';

//seajs设置
seajs.config({
	base: '/schoolwap',
    alias:{
    	"base": "public_modules/base/base",
    	"wxcofing": "public_modules/wxcofing",
    	"cookie": "public_modules/cookie",
    	"botbar": "public_modules/bottombar/bottombar",
        "search": "public_modules/search/search",
        "ajax": "public_modules/ajax",
        "animate": "public_modules/animate",
        "touch": "public_modules/touch",
        "LazyLoad": "public_modules/LazyLoad",
        "slide": "public_modules/slide/slide",
        "numbox": "public_modules/numbox",
        "classGoodsList": "public_modules/classGoodsList/classGoodsList",
        "buybar": "public_modules/buybar/buybar",
        "dateDiff": "public_modules/dateDiff",
        "dateFormat": "public_modules/dateFormat",
        "commentList": "public_modules/commentList/commentList",
        "popupBox": "public_modules/popupBox/popupBox",
        "payManner": "public_modules/payManner/payManner",
        "orderGoodsList": "public_modules/orderGoodsList/orderGoodsList",
        "errorCode": "public_modules/errorCode/errorCode",
        "cityPicker": "public_modules/cityPicker/cityPicker",
        "schoolPicker": "public_modules/schoolPicker/schoolPicker",
        "uploadImg": "public_modules/uploadImg/uploadImg",
        "expectPosition": "public_modules/popupSelect/expectPosition",
        "profession": "public_modules/popupSelect/profession",
        "industry": "public_modules/popupSelect/industry",
        "touchTab": "public_modules/touchTab/touchTab",
        "seckillTimes": "public_modules/seckillTimes/seckillTimes",
        "groupBuying": "public_modules/groupBuying/groupBuying",
        "slideFixed": "public_modules/slideFixed/slideFixed"
    },
	map: [
		[ '.js', '.js?v=2.4.9.010']
	],    
    preload: ["sea_modules/sm/0.6.2/sm","sea_modules/jweixin/1.0.0/jweixin-1.0.0"]
});

//正则匹配
var REG = {};
REG.ISNULL = /[^\s]+/;
REG.PHONE = /^1[34578][0-9]{9}$/;
REG.EMAIL = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
REG.IDCARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;