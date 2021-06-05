(function(){

    document.addEventListener('touchstart', function(ev) {
      ev.preventDefault();
    }, false);
    
    function Slide(){
    	this.touchBox = document.getElementById('warp_box');
    	this.touchPage = document.getElementsByClassName('page');
    	this.len = this.touchPage.length;
    	this.i = 0;//记录个数
		this.y = 0;//手指初次按下y轴坐标
		this.t = 0;//记录划过之后y轴偏移坐标	
		this.winH = this.touchBox.offsetHeight;
		
		this.touchPage[0].className = 'page page1 active';
		
		this.touchBox.addEventListener('touchstart', this.touchFun.bind(this),false);
		this.touchBox.addEventListener('touchmove', this.touchFun.bind(this),false);
		this.touchBox.addEventListener('touchend', this.touchFun.bind(this),false);
    }
    
   	Slide.prototype.touchFun = function(event){
		var event = event || window.event;
		switch (event.type){
			case 'touchstart':
				this.touchBox.style.transition = 'none';
				this.y = event.changedTouches[0].clientY;
				this.t = -this.i * this.winH;
				break;
			case 'touchmove':
				var touchY = (event.changedTouches[0].clientY - this.y) * 0.6;
				this.touchBox.style.WebkitTransform = this.touchBox.style.transform = 'translate(0px, ' + (this.t + touchY) + 'px) scale(1) translateZ(0px)';			
				break;
			case 'touchend':
				var touchY = event.changedTouches[0].clientY - this.y;
				this.i = -Math.round((this.t + touchY) / this.winH);
				if(this.i < 0){this.i = 0;}
				if(this.i > this.len - 1){this.i = this.len - 1;}
				this.tab();
				break;			
			default:
				break;
		}   		
   	}
	
	Slide.prototype.tab = function(){
		this.touchBox.style.transition = '0.5s';
		this.touchBox.style.WebkitTransform = this.touchBox.style.transform = 'translate(0px, ' + (-this.i * this.winH) + 'px) scale(1) translateZ(0px)';
		for(var j = 0; j < this.len; j++){
			this.touchPage[j].className = 'page page' + (j + 1);
		}
		this.touchPage[this.i].className = 'page page' + (this.i + 1) + ' active';
	}
	
	window.onload = function(){
		new Slide();
	}
	
}());