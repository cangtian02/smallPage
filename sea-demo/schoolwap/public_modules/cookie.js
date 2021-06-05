define(function(require, exports, module) {

	function encrypt(str){//加密
	  var str = encodeURIComponent(str);
	  var pwd = SAYIMO.STRPWS;
	  var prand = "";
	  for(var i=0; i<pwd.length; i++) {
	    prand += pwd.charCodeAt(i).toString();
	  }
	  var sPos = Math.floor(prand.length / 5);
	  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
	  var incr = Math.ceil(pwd.length / 2);
	  var modu = Math.pow(2, 31) - 1;
	  if(mult < 2) {
	    alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
	    return null;
	  }
	  var salt = Math.round(Math.random() * 1000000000) % 100000000;
	  prand += salt;
	  while(prand.length > 10) {
	    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	  }
	  prand = (mult * prand + incr) % modu;
	  var enc_chr = "";
	  var enc_str = "";
	  for(var i=0; i<str.length; i++) {
	    enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
	    if(enc_chr < 16) {
	      enc_str += "0" + enc_chr.toString(16);
	    } else enc_str += enc_chr.toString(16);
	    prand = (mult * prand + incr) % modu;
	  }
	  salt = salt.toString(16);
	  while(salt.length < 8)salt = "0" + salt;
	  enc_str += salt;
	  return enc_str;	
	}
	
	function decrypt(str){//解密
	  if(str == null || str.length < 8) {
	    alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
	    return;
	  }
	  var pwd = SAYIMO.STRPWS;
	  var prand = "";
	  for(var i=0; i<pwd.length; i++) {
	    prand += pwd.charCodeAt(i).toString();
	  }
	  var sPos = Math.floor(prand.length / 5);
	  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
	  var incr = Math.round(pwd.length / 2);
	  var modu = Math.pow(2, 31) - 1;
	  var salt = parseInt(str.substring(str.length - 8, str.length), 16);
	  str = str.substring(0, str.length - 8);
	  prand += salt;
	  while(prand.length > 10) {
	    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
	  }
	  prand = (mult * prand + incr) % modu;
	  var enc_chr = "";
	  var enc_str = "";
	  for(var i=0; i<str.length; i+=2) {
	    enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
	    enc_str += String.fromCharCode(enc_chr);
	    prand = (mult * prand + incr) % modu;
	  }
	  return decodeURIComponent(enc_str);	
	}

	if ( ! $.cookie ){
		$.cookie = {
			set : function( $name , $value , $options ){
				$options = $.extend( {} , $options );
				if ( typeof($options.expires) == 'undefined' || typeof($options.expires) != 'number' ) $options.expires = -1;
				var $date = new Date();
				$date.setTime( $date.getTime() + $options.expires );
				var $expires = '; expires=' + $date.toUTCString();
				var $path = $options.path ? ';path=' + $options.path : ';path=/';
				var $domain = $options.domain ? ';domain=' + $options.domain : '';
				var $secure = $options.secure ? ';secure' : '';
				document.cookie = [$name , '=' , escape( $value ) , $expires , $path , $domain , $secure ].join('');
			},
			get : function( $name ){
				if ( document.cookie && document.cookie != '' ){
					var $arr = document.cookie.match( new RegExp( "(^| )"+$name+"=([^;]*)(;|$)" ) );
					if($arr != null){  
				        return unescape($arr[2]);  
				    }else{  
				        return null;  
				    }
				}
				return null;
			}
		}
	}

	var Cookie = (function(){
		return{
			setCookie : function(keyname,value,expires){//存储cookie
				if ( typeof(expires) == 'undefined' || typeof(expires) == '' ) expires = -1;
				var options = {'expires':expires*1000};
				$.cookie.set(keyname,encrypt(value),options);
			},		
			getCookie : function(keyname){//获取cookie
				var strValue = $.cookie.get(keyname);
				var str = '';
				if(strValue != null){
					str = decrypt(strValue);
				}
				return str;
			}		
		}
	});

	module.exports = Cookie();

});