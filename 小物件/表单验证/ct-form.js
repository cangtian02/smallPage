function to_submit(f){
	var id = $("#" + f),
		contact = id.find("#contact"),
		phone = id.find("#phone"),
		email = id.find("#email"),
		content = id.find("#content");
	if(!contact.val()){
		id.find(".ext_contact .placeholder").css("color","#FF0000");
		contact.focus();
		return false;
	}else{
		id.find(".ext_contact .placeholder").css("color","#000000");
	}
}
function set_comment(obj,maxlength){
	var _text = $("#" + obj.id).parents(".content").find(".clon");
	if(obj.value.length == 0){
		_text.text("最多输入100字");
	}else if(obj.value.length > 0 && obj.value.length < maxlength){
		var len = maxlength - obj.value.length;
		_text.text("您还能输入"+ len + "个字");
	}else if(obj.value.length == maxlength){
		_text.text("浓缩是精华");
	}
}