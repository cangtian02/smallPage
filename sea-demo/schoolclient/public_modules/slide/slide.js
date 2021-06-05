define(function(require, exports, module) {
	require('./slide.css');
	
	function Slide(options) {
		
		var defaults = {
			autoplay: true, // 是否自动播放
			slideBox: '.slide-container' // 
		}
		
		this.options = $.extend(defaults,options);
		
		this.oTotalBox = document.querySelector(this.options.slideBox);
		this.oSlideBox = this.oTotalBox.querySelector('ul');
		this.oIndex = this.oTotalBox.querySelector('.slide-pagination');
		this.oInter = null; //定时器
		  
		this.aSlideList = this.oSlideBox.children;
		this.length = this.aSlideList.length;
		var inHtml = '';
		for(var i = 0; i < this.length; i++){
			inHtml += '<li></li>';
		}
		this.oIndex.innerHTML = inHtml;	
		this.aIndexList = this.oIndex.children;
		
		this.iNow = 1; //移动到第几个元素
		this.iStartX = 0; //记录手指开始按下的X坐标
		this.iStartTranslateX = 0; //物体移动到的X坐标
		
		this.init();	
	}
	
	Slide.prototype.init = function() {
		var first = this.oSlideBox.children[0].cloneNode(true),
			last = this.oSlideBox.children[this.length - 1].cloneNode(true);
		
		this.oSlideBox.appendChild(first);
		this.oSlideBox.insertBefore(last,this.oSlideBox.childNodes[0]);
	
		this.tab(); //初始化选项
		this.setInterval(); //初始化定时器
		
		this.oSlideBox.addEventListener('touchstart', this.touchstartX.bind(this), false);
		this.oSlideBox.addEventListener('touchmove', this.touchmoveX.bind(this), false);
		this.oSlideBox.addEventListener('touchend', this.touchendX.bind(this), false);
	}
	
	Slide.prototype.tab = function() {
		var aSlideList = this.oSlideBox.children;
		var aIndexList = this.oIndex.children;
	
		this.oSlideBox.style.transition = 'transform .3s ease';
		this.oSlideBox.style.WebkitTransform = this.oSlideBox.style.transform = 'translate3d(' + (-(this.iNow * this.oSlideBox.offsetWidth)) + 'px,' + '0,0)';
		
		for (var i = 0; i < aSlideList.length; i++) {
			aSlideList[i].className = '';
		}
		for (var i = 0; i < aIndexList.length; i++) {
			aIndexList[i].className = '';
		}
		
		aSlideList[this.iNow].className = 'active';
		
		if(this.iNow == this.oSlideBox.children.length - 1){
			aIndexList[0].className = 'active';
		}else if(this.iNow == 0){
			aIndexList[this.oIndex.children.length - 1].className = 'active';
		}else{
			aIndexList[this.iNow - 1].className = 'active';
		}
		
	}
	
	Slide.prototype.setInterval = function() {
		if(this.options.autoplay){
			this.oInter = setInterval(function() {
				this.iNow++;
				this.iNow = this.iNow % this.aSlideList.length;
				this.tab();
			}.bind(this), 3000);
		}
	}
	
	Slide.prototype.touchstartX = function () {
		var touchOne = event.changedTouches[0];
		clearInterval(this.oInter);
		this.oSlideBox.style.transition = 'transform 0s ease';;
		this.iStartX = touchOne.pageX; //记录手指开始按下的X坐标
			
		if(this.iNow == this.oSlideBox.children.length - 1){		
			this.iStartTranslateX = (-(1 * this.oSlideBox.offsetWidth));
		}else if(this.iNow == 0){
			this.iStartTranslateX = (-((this.oIndex.children.length) * this.oSlideBox.offsetWidth));
		}else{
			this.iStartTranslateX = (-(this.iNow * this.oSlideBox.offsetWidth));
		}
	}
	
	Slide.prototype.touchmoveX = function () {
		var touchOne = event.changedTouches[0];
		var iMoveX = touchOne.pageX - this.iStartX; //计算按下时，和当前移动到的坐标的差值
		this.oSlideBox.style.WebkitTransform = this.oSlideBox.style.transform = 'translate3d(' + (this.iStartTranslateX + iMoveX) + 'px,' + '0,0)';
	}
	
	Slide.prototype.touchendX = function () {
		var touchOne = event.changedTouches[0];
		var iMoveX = touchOne.pageX - this.iStartX;
		
		this.iNow = (this.iStartTranslateX + iMoveX) / this.oSlideBox.offsetWidth;	
		this.iNow  = -Math.round(this.iNow);
	
		if (this.iNow < 0) {
			this.iNow = 0;
		}
	
		if (this.iNow > this.aSlideList.length - 1) {
			this.iNow = this.aSlideList.length - 1;
		}
		this.tab();
		this.setInterval(); 
	}
	
	module.exports = Slide;

});