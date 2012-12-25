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
		if(!ddz.started){
			var bodyWidth = window.innerWidth,
				bodyHeight = ScreenAdapter.pageContHeight,
				realWidth = 960, realHeight = 576;
			window.log('bodyWidth:' + bodyWidth + ' bodyHeight:' + bodyHeight);
			
			var xRadio = (bodyWidth / realWidth),
				yRadio = (bodyHeight / realHeight );
			
			var scale =  (xRadio < yRadio) ? xRadio : yRadio;
			scale = (scale < 1) ? scale : 1;
			var area = document.getElementById('game_area');
			area.style.zoom  = scale;
			ddz.scale = scale;				
			return  area;
		}
	}	
	
};

function updateUIAccordToOrientation(){
	// alert('updateUIAccordToOrientationCheck:' + ok);
	log('ScreenAdapter.orientation body:' + ScreenAdapter.orientation);
	if( ScreenAdapter.orientation==ScreenAdapter.Horizontal){
		CommonUtil.adjustSize();
		CommonUtil.$id('setScreen').style.display = "none";
		CommonUtil.$id('game_area').style.display = 'block';
		
		var player3 = ddz.player3;
		if(player3){
			var  shouPaiAreaWidth = player3.shouPaiAreaObj.clientWidth;
			player3.faPaiXOffset = (shouPaiAreaWidth-player3.cardWidth)/(17 -1);
		}
	
	}else if(!ddz.started){
		CommonUtil.$id('setScreen').style.display = "block";
		CommonUtil.$id('game_area').style.display = 'none';
	}	
}
