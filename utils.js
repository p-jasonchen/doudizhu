var CommonUtil = {
	format : function(){    
		var args = arguments;    
		return this.replace(/\{(\d+)\}/g,                    
			function(m,i){    
				return args[i];    
		});    
	},    

	 $id : function(id,e){
		e = e || document;
		return e.getElementById(id);
	},

	$class : function(_class, e){
		e = e || document;
		return e.getElementsByClassName(_class);
	},
	
	$query: function(selector, e){
		e = e || document;
		return e.querySelector(selector);
	},
	
	$queryAll:function(selector, e){
		e = e || document;
		return e.querySelectorAll(selector);
	},	
	
	print: function(text){
		var player = ddz.chuPaiInfo.curChuPaiPlayer;
		if(player === ddz.player1){
			pre = '玩家1'
		}else if(player === ddz.player2){
			pre = '玩家2';
		}else{
			pre = '玩家3';
		}
		//console.log(pre + ' : '+ text);
		//alert(pre + ' : '+ text);
	},
	adjustSize: function(){
		// alert(orientationAdjusted);
		if(!orientationAdjusted){
			var bodyWidth = document.body.clientWidth,
				bodyHeight = document.body.clientHeight,
				realWidth = 960, realHeight = 576;
			//alert('bodyWidth:' + bodyWidth + ' bodyHeight:' + bodyHeight);
			
			var xRadio = (bodyWidth / realWidth),
				yRadio = (bodyHeight / realHeight );
			
			var scale =  (xRadio < yRadio) ? xRadio : yRadio;
			var area = document.getElementById('game_area');
			area.style.zoom  = scale;
			ddz.scale = scale;	
			orientationAdjusted = true;
			return  area;
		}
	}	
	
};

orientationAdjusted = false;

function updateUIAccordToOrientationCheck(callback,ok){
	// alert('updateUIAccordToOrientationCheck:' + ok);
	setTimeout(function(){
		if(ok) {
			callback();
			CommonUtil.$id('setScreen').style.display = "none";
			CommonUtil.$id('game_area').style.opacity = '1';
		}else{
			CommonUtil.$id('setScreen').style.display = "block";
			CommonUtil.$id('game_area').style.opacity = '0';
		};
	},500);
}

function orientationCheck(callback){			
		var supportsOrientationChange = "onorientationchange" in window,  
			orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";				
			
			
				updateUIAccordToOrientationCheck(callback, window.innerWidth > window.innerHeight);				
			
			
			// 监听事件  
			window.addEventListener(orientationEvent, function() {			
				
			    var ua = navigator.userAgent;  
			    var deviceType="";  			  	
			    //判断设备类型   
			  
			    if (ua.indexOf("iPad") > 0 || ua.indexOf("iPhone") > 0) {  
			       deviceType = "isIpad";  
			    } else if (ua.indexOf("Android") > 0) {  
			       deviceType = "isAndroid";  
			    } else {  
			       //alert("既不是ipad，也不是安卓！");  
			       return;  
			    }  
			     // 判断横竖屏 			  	
			    if ("isIpad" == deviceType) { 			      
					updateUIAccordToOrientationCheck(callback, Math.abs(window.orientation) == 90);						   
			    } else if ("isAndroid" == deviceType ) {  
			       updateUIAccordToOrientationCheck(callback, Math.abs(window.orientation) == 90);		
			    };  
			}, false); 
}