//sayimo配置
var SAYIMO = {};
SAYIMO.HTTP = ('https:' == document.location.protocol) ? 'https://' : 'http://';
SAYIMO.HOST = SAYIMO.HTTP + window.location.host + '/';
SAYIMO.SERVLETPATH = window.location.href;
SAYIMO.APIURL = 'https://ggschool.sayimo.cn/rainbowapi/';
SAYIMO.FILES = 'schoolclient/';
SAYIMO.SRVPATH = SAYIMO.HOST + SAYIMO.FILES;
SAYIMO.KFURL = 'http://free.appkefu.com/AppKeFu/float/wap/chat.php?wg=cysayimo&robot=false';
SAYIMO.TEL = '4000051061';
SAYIMO.BUILD = '';

//seajs设置
seajs.config({
	base: '/schoolclient',
    alias:{   	
    	"base": "public_modules/base/base",
    	"buybar": "public_modules/buybar/buybar",
    	"commentList": "public_modules/commentList/commentList",
    	"groupBuying": "public_modules/groupBuying/groupBuying",
    	"payManner": "public_modules/payManner/payManner",
    	"Pcorp": "public_modules/Pcorp/Pcorp",
    	"popupBox": "public_modules/popupBox/popupBox",
        "expectPosition": "public_modules/popupSelect/expectPosition",
        "profession": "public_modules/popupSelect/profession",    	
    	"search": "public_modules/search/search",
    	"seckillTimes": "public_modules/seckillTimes/seckillTimes",
    	"slide": "public_modules/slide/slide",
    	"slideFixed": "public_modules/slideFixed/slideFixed",
    	"touchTab": "public_modules/touchTab/touchTab",
    	"ajax": "public_modules/ajax",
    	"artTemplate": "public_modules/artTemplate",
    	"cityPicker": "public_modules/cityPicker",
    	"dateDiff": "public_modules/dateDiff",
    	"dateFormat": "public_modules/dateFormat",
    	"errorCode": "public_modules/errorCode",
    	"hammer": "public_modules/hammer",
    	"LazyLoad": "public_modules/LazyLoad",
    	"numbox": "public_modules/numbox",
    	"schoolPicker": "public_modules/schoolPicker",
    	"uploadImg": "public_modules/uploadImg"
    },
	map: [
		[ '.js', '.js?v=1.0.001']
	],    
    preload: ["sea_modules/sm/0.6.2/sm"]
});

//正则匹配
var REG = {};
REG.ISNULL = /[^\s]+/;
REG.PHONE = /^1[34578][0-9]{9}$/;
REG.EMAIL = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
REG.IDCARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;