$(document).ready(function(){
	
	for (var a = 0; a < playList.length; a++){
		var item = playList[a];
		$(".ctPlay-list").append('<li><div class="icon fl"><span class="fa fa-volume-down fcad"></span></div><span class="name fs14 fcc tran">'+item.title+' - '+item.name+'</span></li>');		
	}	
		
	var i = 0,
		isloop = false,
		israndom = false,
		audio = document.getElementById("ct-audio"),
		prevbtn = $(".ctPlay-btn .prev"),
		plpubtn = $(".ctPlay-btn .plpu"),
		nextbtn = $(".ctPlay-btn .next"),
		plpuimg = $(".ctPlay-img .imgplpu"),
		img = $(".ctPlay-img img"),
		time = $(".ctPlay-progress .time"),
		volumebtn = $(".ctPlay-volume"),
		volumeline = volumebtn.find(".ctPlay-volume-line"),
		volumeoff = volumebtn.find(".fa-volume-up"),
		proline = $(".ctPlay-progress-line");
		
	function loadplay(i){
		playList[i].img == '' ? playList[i].img = 'images/px.jpg' : playList[i].img = playList[i].img;		
		$(".ctPlay-img img").attr("src",playList[i].img);
		$(".ctPlay-info h1").text(playList[i].title);
		$(".ctPlay-info h2").text(playList[i].name);
		$(".ctPlay-info h3").text(playList[i].info);
		$(".ctPlay-list li").eq(i).addClass("cur").siblings("li").removeClass("cur");
		var newaudio = $('<audio id="ct-audio">').html('<source src="'+ playList[i].url +'">').appendTo(".ctMusicPlay");
		audio = document.getElementById("ct-audio");		
		audio.addEventListener('canplay', canplay, false);
		audio.addEventListener('ended', ended, false);
	}	
	loadplay(i);

	function canplay(){
		duration = audio.duration;
		branch = Math.floor(duration/60);
		second = Math.floor(duration - branch * 60);
		time.text(branch + ':' + second);
	}
	
	function ended(){
		if(isloop == true){
			i = i;
			audio.remove();
			loadplay(i);
			audio.load();
			play();
		}else if(israndom == true){
			i = Math.floor(Math.random() * playList.length);
			audio.remove();
			loadplay(i);
			audio.load();
			play();
		}else if(isloop == false && israndom == false){
			setTimeout(function(){
				nextbtn.click();
			},500);
		}else{
			setTimeout(function(){
				nextbtn.click();
			},500);			
		}
	}
	
	function timeset(){
		var duration = audio.duration,
			curtime = audio.currentTime,
			Ntime = duration - curtime,
			Nbranch = Math.floor(Ntime/60),
			Nsecond = Math.floor(Ntime - Nbranch * 60);
		Nsecond < 10 ? Nsecond = ('0' + Nsecond) : Nsecond = Nsecond;
		time.text(Nbranch + ':' + Nsecond);
		currentTime();
	}
	
	function play(){
		audio.play();
		plpubtn.removeClass("fa-play").addClass("fa-pause");
		plpuimg.removeClass("fa-play").addClass("fa-pause");
		img.addClass("imgplay");
		setInterval(timeset,1000);
		
	}
	function pause(){
		audio.pause();
		plpubtn.removeClass("fa-pause").addClass("fa-play");
		plpuimg.removeClass("fa-pause").addClass("fa-play");
		img.removeClass("imgplay");
	}
	
	function currentTime(){
		var curtime = Math.floor(audio.currentTime),
			ztime = Math.floor(audio.duration),
			biW = curtime/ztime;
			proline.find("i").width(biW * 100 + '%');
	}	
	proline.mousedown(function(e){
		var px = e.pageX - proline.offset().left;
			newbiw = (px/proline.width()) * audio.duration,
		audio.currentTime = newbiw;
		play();
	}).mousemove(function(e){
		var phx = e.pageX - proline.offset().left;
			pbiw = (phx/proline.width()) * audio.duration;			
			pbranch = Math.floor(pbiw/60),
			psecond = Math.floor(pbiw - pbranch * 60);
		psecond < 10 ? psecond = ('0' + psecond) : psecond = psecond;		
		$(this).find("em").text(pbranch + ':' + psecond).show();
		$(this).find("em").css({left: (phx/proline.width()*100) + '%'});
	}).mouseout(function(){
		$(this).find("em").hide();
	});	
	
	function volume(newvol){
		audio.volume = newvol;
		volumeline.find("i").width(newvol * 100 + '%');	
	}
	volume(0.5);
	
	volumeline.mousedown(function(e){
		var vx = e.pageX - volumeline.offset().left;
			newvol = vx/volumeline.width();			
			volume(newvol);
			if(newvol == 0){
				volumebtn.find(".fa-volume-up").click();
			}else if(volumeoff.hasClass("fcf")){
				volumeoff.removeClass("fcf");
				volumeoff.addClass("fcad");
				volumeoff.find("em").hide();
			}
	}).mousemove(function(e){
		var vhx = e.pageX - volumeline.offset().left;
			vvol = Math.floor((vhx/volumeline.width()) * 100);	
		$(this).find("em").text(vvol + '%').show();
		$(this).find("em").css({left:vvol + '%'});
	}).mouseout(function(){
		$(this).find("em").hide();
	});
	
	volumeoff.click(function(){
		if(audio.muted == true){
			audio.muted = false;
			volumeline.find("i").show();
			$(this).removeClass("fcf");
			$(this).addClass("fcad");
			$(this).find("em").hide();
		}else{
			audio.muted = true;
			volumeline.find("i").hide();
			$(this).addClass("fcf");
			$(this).removeClass("fcad");
			$(this).find("em").show();
		}		
	});
	
	plpubtn.click(function(){
		if(audio.paused == true){
			play();
		}else{			
			pause();
		}
	});
	
	plpuimg.click(function(){
		if(audio.paused == true){
			play();
		}else{			
			pause();
		}
	});
	
	prevbtn.click(function(){
		audio.remove();
		if(i == 0){i = playList.length - 1;}else{--i;}
		loadplay(i);
		audio.load();
		play();
	});
	
	nextbtn.click(function(){
		audio.remove();
		if(i == playList.length - 1){i = 0;}else{++i;}
		loadplay(i);
		audio.load();
		play();
	});
	
	$(".ctPlay-progress .fa-repeat").bind("click",function(){
		if($(this).hasClass("loop")){
			isloop = false;
			$(this).removeClass("fcf");
			$(this).removeClass("loop");
			$(this).addClass("fcad");				
		}else{
			isloop = true;
			$(this).removeClass("fcad");
			$(this).addClass("fcf");
			$(this).addClass("loop");
			if(israndom == true){
				$(".ctPlay-progress .fa-random").removeClass("fcf");
				$(".ctPlay-progress .fa-random").addClass("fcad");
			}
			israndom = false;
		}
	});
	
	$(".ctPlay-progress .fa-random").bind("click",function(){
		if($(this).hasClass("random")){
			israndom = false;
			$(this).removeClass("fcf");
			$(this).removeClass("random");
			$(this).addClass("fcad");			
		}else{
			israndom = true;
			$(this).removeClass("fcad");
			$(this).addClass("fcf");
			$(this).addClass("random");
			if(isloop == true){
				$(".ctPlay-progress .fa-repeat").removeClass("fcf");
				$(".ctPlay-progress .fa-repeat").addClass("fcad");				
			}
			isloop = false;
		}
	});
	
	$(".ctPlay-list li").each(function(){
		$(this).click(function(){
			$(this).addClass("cur").siblings("li").removeClass("cur");
			i = $(this).index();
			audio.remove();
			loadplay(i);
			audio.load();
			play();			
		});
	});
	
});