define(function(require, exports, module) {
	
	var ajax = require('ajax'),
		rawCitiesData;

   	var raw,
   		provinces,
   		initCities,
	    initDistricts,
	    currentProvince,
	    currentCity,
	    currentDistrict,
	    t,
	    defaults;

	function schoolPicker(divfrom,schoolcode,dormitoryList){
		var values = '';
		rawCitiesData = dormitoryList;
		if( typeof(schoolcode) === "undefined" || schoolcode == ''  || schoolcode == null){
			schoolcode = '100101';
			values = ['10栋','1层','101号'];
		}else{					
			values = new Array;
			for (var i = 0; i < rawCitiesData.length; i++) if (rawCitiesData[i].id == schoolcode.substr(0, 2)) {
				values.push(rawCitiesData[i].name);
				for (var j = 0; j < rawCitiesData[i].sub.length; j++) if (rawCitiesData[i].sub[j].id == schoolcode.substr(0, 4)) {
					values.push(rawCitiesData[i].sub[j].name);
					for (var k = 0; k < rawCitiesData[i].sub[j].sub.length; k++) rawCitiesData[i].sub[j].sub[k].id == schoolcode && values.push(rawCitiesData[i].sub[j].sub[k].name)
				}
			}
		}				
		fun_openpicker(divfrom,values);	
	}

	function fun_openpicker(divfrom,values){
	   	raw = rawCitiesData;
	    provinces = raw.map(function(d){return d.name;});
	    initCities = sub(raw[0]);
	    initDistricts = [""];	
	    currentProvince = provinces[0];
	    currentCity = initCities[0];
	    currentDistrict = initDistricts[0];	
	    defaults = {	
	        cssClass: "dormitoryNumberText",
	        rotateEffect: false,	
	        onChange: function (picker, values, displayValues) {
	            var newProvince = picker.cols[0].value;
	            var newCity;
	            if(newProvince !== currentProvince) {
	                // 如果Province变化，节流以提高reRender性能
	                clearTimeout(t);	
	                t = setTimeout(function(){
	                    var newCities = getCities(newProvince);
	                    newCity = newCities[0];
	                    var newDistricts = getDistricts(newProvince, newCity);
	                    picker.cols[1].replaceValues(newCities);
	                    picker.cols[2].replaceValues(newDistricts);
	                    currentProvince = newProvince;
	                    currentCity = newCity;
	                    picker.updateValue();
	                }, 200);
	                return;
	            }
	            newCity = picker.cols[1].value;
	            if(newCity !== currentCity){
	                picker.cols[2].replaceValues(getDistricts(newProvince, newCity));
	                currentCity = newCity;
	                picker.updateValue();
	            }
	            var cityId = getCityId(picker.cols[0].value,picker.cols[1].value,picker.cols[2].value);
	            $('#dormitoryNumberCode').val(cityId);
	        },	
	        cols: [
	        {
	            textAlign: 'center',
	            values: provinces,
	            cssClass: "col-province"
	        },
	        {
	            textAlign: 'center',
	            values: initCities,
	            cssClass: "col-city"
	        },
	        {
	            textAlign: 'center',
	            values: initDistricts,
	            cssClass: "col-district"
	        }
	        ],
	        onOpen : function(){
	        	$(".sayimo-mask").show();
	        },
	        onClose : function(){
	        	$(".sayimo-mask").hide();
	        }
	    };	    
		divfrom.schoolPicker({
		    value: values
		});		    
	}
	
    var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
            var d = data[i];
            if(d.name === "请选择") continue;
            result.push(d.name);
        }
        if(result.length) return result;
        return [""];
    };

    var sub = function(data) {
        if(!data.sub) return [""];
        return format(data.sub);
    };

    var getCities = function(d) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === d) return sub(raw[i]);
        }
        return [""];
    };

    var getDistricts = function(p, c) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === p) {
                for(var j=0;j< raw[i].sub.length;j++) {
                    if(raw[i].sub[j].name === c) {
                        return sub(raw[i].sub[j]);
                    }
                }
            }
        }
        return [""];
    };
    
    var getCityId = function(p,c,d) {
        for(var i=0;i< raw.length;i++) {
            if(raw[i].name === p){
            	for(var j=0;j< raw[i].sub.length;j++) {
                    if(raw[i].sub[j].name === c) {
                        if(!raw[i].sub[j].hasOwnProperty('sub')){
                        	return raw[i].sub[j].id;
                        }else{
                        	for(var k=0;k< raw[i].sub[j].sub.length;k++){
                        		if(raw[i].sub[j].sub[k].name === d){
                        			return raw[i].sub[j].sub[k].id;
                        		}
                        	}
                        }
                    }
                }
            }
        }
        return "";
    };

    $.fn.schoolPicker = function(params) {
        return this.each(function() {
            if(!this) return;
            var p = $.extend(defaults, params);
            if (p.value) {
                $(this).val(p.value.join(' '));
            } else {
                var val = $(this).val();
                val && (p.value = val.split(' '));
            }
            if (p.value) {
                if(p.value[0]) {
                    currentProvince = p.value[0];
                    p.cols[1].values = getCities(p.value[0]);
                }
                if(p.value[1]) {
                    currentCity = p.value[1];
                    p.cols[2].values = getDistricts(p.value[0], p.value[1]);
                } else {
                    p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0]);
                }
                !p.value[2] && (p.value[2] = '');
                currentDistrict = p.value[2];
            }
            $(this).picker(p);
        });
    };

	module.exports = schoolPicker;	
});