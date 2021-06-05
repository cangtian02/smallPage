window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback, element) {
			return window.setTimeout(callback, 1000 / 60);
		};
})();

var can;
var ctx;
var wW = document.body.clientWidth;
var wH = document.body.clientHeight;
var bgPic = new Image();
var snowPic = new Image();
var deltaTime;
var lastTime;
var snows = [];
var num = 2000;

function init(){
	can = document.getElementById("snow");
	ctx = can.getContext("2d");	
	can.width = wW;
	can.height = wH;	
	bgPic.src = "canvas_bg.jpg";
	snowPic.src = "snow.png";	
	for (var i = 0; i < num; i++) {
		snows[i] = new snowObj();
		snows[i].init();
	}
	lastTime = Date.now();	
	snowLoop();	
}

function snowLoop(){	
	window.requestAnimFrame(snowLoop);
	var now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;	
	drawBg();
	drawSnow();
}

function drawBg(){		
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,wW,wH);
	ctx.drawImage(bgPic,0,0,wW,wH);		
}

var snowObj = function() {
	this.x;
	this.y;
	this.w;
	this.ySpd;
	this.timer;
	this.beta;
}

snowObj.prototype.init = function() {
	this.x = Math.random() * wW;
	this.y = Math.random() * wH;
	this.ySpd = Math.random() * 3; 
	this.xSpd = Math.random() * 3;
	this.timer = 0;
	this.beta = Math.random() * Math.PI * 5;
	this.w = Math.random() * 8;
}

snowObj.prototype.update = function() {
	this.xSpd = Math.random() * -3;
	this.x += this.xSpd;
	this.y += this.ySpd;
	if (this.x > wW || this.x < 0){
		this.init();
		this.y = Math.random() * -10;
	}else if (this.y > wH){
		this.init();
		this.y = Math.random() * -10;
	}
	this.timer += deltaTime;
	if (this.timer > 2000) {
		this.timer = 0;
	}
}

snowObj.prototype.draw = function() {
	this.beta += deltaTime * 0.005;
	ctx.drawImage(snowPic, this.x, this.y, this.w, this.w);
}

function drawSnow() {
	for (var i = 0; i < num; i++) {
		snows[i].update();
		snows[i].draw();
	}
}
