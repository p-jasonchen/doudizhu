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
	
	bubbleSort: function(dataArray, cmpFunc){
		var length = dataArray.length, temp, data1 ,data2, ret=0;
		for(var i = 0; i < length - 1; i++){
			for (var j = length -1; j >=1;j--) {
				
				data1 = dataArray[j], data2 = dataArray[j-1];
				ret = cmpFunc(data1, data2);
				if(ret > 0){
					temp = data1;
					dataArray[j] = data2;
					dataArray[j-1] = temp;
				}					
			}
		}
		return dataArray;
	},
	
	fire: function (elem, type){  
		var evt;  
		if(document.createEventObject){// IE浏览器支持fireEvent方法  
			elem.fireEvent('on'+type);  
		}else{// 其他标准浏览器使用dispatchEvent方法  
			evt = document.createEvent('HTMLEvents');  
			// initEvent接受3个参数：  
			// 事件类型，是否冒泡，是否阻止浏览器的默认行为  
			evt.initEvent(type, true, true);  
			elem.dispatchEvent(evt);  
		}  
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
		var bodyWidth = document.body.clientWidth,
			bodyHeight = document.body.clientHeight,
			realWidth = 960, realHeight = 576;
		//alert('bodyWidth' + bodyWidth + ' and bodyHeight:' + bodyHeight);
		var xRadio = (bodyWidth / realWidth),
			yRadio = (bodyHeight / realHeight );
		
		var scale =  (xRadio < yRadio) ? xRadio : yRadio;
		var area = document.getElementById('game_area');
		area.style.zoom  = scale;
		//alert('scale:' + scale);
		return  area;
	}
	
	
};


/**
 * 浏览器判断,如果是PC使用mouse机制
 */
var START_EV = NC.browser.hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = NC.browser.hasTouch ? 'touchmove' : 'mousemove',
    END_EV = NC.browser.hasTouch ? 'touchend' : 'mouseup';
	
var START_EV = 'touchstart',
    MOVE_EV = 'touchmove',
    END_EV = 'touchend' ;
	
(function(ns){
    //倒计时类
    ns.CountDown=function(opt){
        //overDate,runCallBack,overTimeCallback
        opt.overTime=opt.overTime||1000 * 60;
        var NowTime = new Date();
        this.endTime= new Date(NowTime.getTime() + opt.overTime);
        this.timer=null;
        this.start(opt.runCallBack,opt.overTimeCallback);      
    }
   
    ns.CountDown.prototype.start=function(runCallBack,overTimeCallback){
        this.runCallBack=runCallBack;
        this.overTimeCallback=overTimeCallback;
        var NowTime = new Date();
        var that=this;
        function GetRTime(){
            NowTime = new Date();
            var nMS=this.endTime.getTime() - NowTime.getTime();
            //var nM=Math.floor(nMS/(1000*60)) % 60;
            var nS=Math.floor(nMS/1000) % 60;
            var nMS=Math.floor(nMS/100) % 10;
            if(nS>= 0){
                runCallBack&&runCallBack(nS);
            }
            else {
                this.timer=null;
                overTimeCallback&&overTimeCallback();
                return;
            }

	            this.timer=setTimeout(function(){            	
	                GetRTime.apply(that);
	            },50);
        }
        	GetRTime.apply(that);
    }
    ns.CountDown.prototype.stop=function(){
				clearTimeout(this.timer);
				this.timer=null;
    	}
		
})(CommonUtil);



/*
@param:	chaiPaiResult 
	{
		danZhangArray:danZhangArray,
		danDuiArray:danDuiArray,
		sanZhangArray:sanZhangArray,
		validLianZiInfo:validLianZiInfo
	}
*/
var PositiveChuPaiJudger = function(chaiPaiResult, player){
		this.chaiPaiResult = chaiPaiResult || {};
		this.judger = ChuFeiJi;		
		this.player =  player;
}

PositiveChuPaiJudger.prototype.doChuPaiJudge = function(){
	this.judger.doChuPaiJudge(this);	
}

var ChuFeiJi = {
	doChuPaiJudge: function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult, paiType, feiJiLength,startCardSeq;		
		var feiJiInfoArray = chaiPaiResult.feiJiInfoArray || [], 
			danZhangArray = chaiPaiResult.danZhangArray,
			danDuiArray = chaiPaiResult.danDuiArray,
			player = chuPaiJudger.player;
		
		feiJiLength = feiJiInfoArray.length;
		if(feiJiLength != 0){
			var	feiJi = feiJiInfoArray[feiJiLength - 1],
				lianXuCount = feiJi.length, 
				danZhangArrayLength = danZhangArray.length,
				danDuiArrayLength = danDuiArray.length,
				startCardSeq = feiJi.cardSeq;;
			if(lianXuCount < danZhangArrayLength || lianXuCount < danDuiArrayLength){
				feiJiLength = lianXuCount;
				player.chuFeiJiNumSpecified(feiJi,feiJiLength);
				
				if(feiJiLength < danZhangArrayLength){
					player.chuDanZhangNumSpecified(danZhangArray, feiJiLength);
					paiType = 'feiJiDai1';
				}else{
					player.chuDanDuiNumSpecified(danDuiArray, feiJiLength);
					paiType = 'feiJiDaiDui';					
				}
			}else {	
				feiJiLength = danZhangArrayLength;
				player.chuFeiJiNumSpecified(feiJi,feiJiLength);				
				player.chuDanZhangNumSpecified(danZhangArray, feiJiLength);				
				paiType = 'feiJiDai1';
			}	
			
			var chuPaiInfo = ddz.chuPaiInfo;
				chuPaiInfo.paiType = paiType,
				chuPaiInfo.length = feiJiLength,
				chuPaiInfo.startCardSeq = startCardSeq;
				
		}else{
			chuPaiJudger.judger = ChuSanZhang;
			chuPaiJudger.doChuPaiJudge();
		}		
	}
	
}

var ChuSanZhang = {
	doChuPaiJudge: function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult, paiType;		
		var sanZhangArray = chaiPaiResult.sanZhangArray || [], 
			danZhangArray = chaiPaiResult.danZhangArray || [],
			danDuiArray = chaiPaiResult.danDuiArray || [],
			
			danZhangArrayLength = danZhangArray.length,
			danDuiArrayLength = danDuiArray.length,
			player = chuPaiJudger.player;
		if(sanZhangArray.length != 0){
			var curPai = sanZhangArray[0];				
				player.chuSanZhang(curPai);
				
				startCardSeq = curPai.cardSeq;
			if(danZhangArrayLength != 0){
				player.chuDanZhangNumSpecified(danZhangArray,1);
				paiType = 'sanDai1';
			}else if(danDuiArrayLength != 0){
				player.chuDanDuiNumSpecified(danDuiArray, 1);
				paiType = 'sanDaiDui';
			}else{
				paiType = 'sanZhang';
			}
			var chuPaiInfo = ddz.chuPaiInfo;
				chuPaiInfo.paiType = paiType,				
				chuPaiInfo.startCardSeq = startCardSeq;		
		}else{
			chuPaiJudger.judger = ChuLianZi;
			chuPaiJudger.doChuPaiJudge();
		}
		
	}
}

var ChuLianZi = {
	doChuPaiJudge : function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult, paiType,
			validLianZiInfo = this.selectNiceLianZiInfo(chaiPaiResult),
			sameCount = validLianZiInfo.sameCount,
			lianXuCount = validLianZiInfo.lianXuCount;
			lianZi = validLianZiInfo.lianZi,
			player = chuPaiJudger.player;
		if(lianZi.length != 0){
			switch(sameCount){
				case 1:
					player.chuDanZhangNumSpecified(lianZi, lianXuCount);
					paiType = 'lianPai';break;
				case 2:
					player.chuDanDuiNumSpecified(lianZi, lianXuCount);
					paiType = 'lianDui';break;
			}
			
			var chuPaiInfo = ddz.chuPaiInfo;
				chuPaiInfo.paiType = paiType,
				chuPaiInfo.length = lianXuCount,
				chuPaiInfo.startCardSeq = validLianZiInfo.startCardSeq;			
			
		}else{
			chuPaiJudger.judger = ChuDanZhang;
			chuPaiJudger.doChuPaiJudge();
		}		
	},
	
	selectNiceLianZiInfo : function(chaiPaiResult){
		var danLianInfoArray =chaiPaiResult.danLianInfoArray,
			duiLianInfoArray = chaiPaiResult.duiLianInfoArray,
			feiJiInfoArray = chaiPaiResult.feiJiInfoArray;
		return danLianInfoArray.shift() 
				|| duiLianInfoArray.shift() 
				|| feiJiInfoArray.shift() 
				|| {lianZi : [], sameCount : 0};
		
	}
	
}

var ChuDanZhang = {
	doChuPaiJudge : function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult,
			danZhangArray = chaiPaiResult.danZhangArray || [];
			
		if(danZhangArray.length != 0){
			startCardSeq = chuPaiJudger.player.chuDanZhangNumSpecified(danZhangArray, 1);
			paiType = 'danZhang';
			var chuPaiInfo = ddz.chuPaiInfo;
			chuPaiInfo.paiType = paiType,
			chuPaiInfo.startCardSeq = startCardSeq;				
		}else{
			chuPaiJudger.judger = ChuDanDui;
			chuPaiJudger.doChuPaiJudge();
		}
	}
}

var ChuDanDui = {
	doChuPaiJudge : function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult,
			danDuiArray = chaiPaiResult.danDuiArray || [];
		if(danDuiArray.length != 0){
			startCardSeq = chuPaiJudger.player.chuDanDuiNumSpecified(danDuiArray, 1);	
			paiType = 'danDui';
			var chuPaiInfo = ddz.chuPaiInfo;
			chuPaiInfo.paiType = paiType,
			chuPaiInfo.startCardSeq = startCardSeq;					
		}else{
			chuPaiJudger.judger = ChuSiZhangDaiX;
			chuPaiJudger.doChuPaiJudge();
		}		
	}
}

var ChuSiZhangDaiX = {
	doChuPaiJudge : function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult,
			danZhangArray = chaiPaiResult.danZhangArray || [],
			danDuiArray = chaiPaiResult.danDuiArray || [];
			bombArray = chaiPaiResult.bombArray || [],
		bombLength = bombArray.length,
		player = chuPaiJudger.player;
		paiType = -1;
		if(bombLength != 0){
			zhaDan = bombArray[bombLength -1];
			if(zhaDan.length == 2){
				chuPaiJudger.judger = ChuZhaDan;
				chuPaiJudger.doChuPaiJudge();
			}else{
				
				player.chuSiZhang(zhaDan);			
				if(danZhangArray.length >= 2){
					player.chuDanZhangNumSpecified(danZhangArray,2,selectedArray);
					paiType = 'siDai2DanZhang';
				}else if(danDuiArray.length >= 1){					
					if(danDuiArray.length >= 2){
						player.chuDanDuiNumSpecified(danDuiArray, 2);
						paiType = 'siDai2Dui';
					}else {
						player.chuDanDuiNumSpecified(danDuiArray, 1);
						paiType = 'siDai1Dui';
					}					
				}
				if(paiType !== -1){
					var chuPaiInfo = ddz.chuPaiInfo;
					chuPaiInfo.paiType = paiType,
					chuPaiInfo.startCardSeq = zhaDan.startCardSeq;		
				}else{
					chuPaiJudger.judger = ChuZhaDan;
					chuPaiJudger.doChuPaiJudge();
				}
			}
		}
		
	}
}
var ChuZhaDan = {
	doChuPaiJudge : function(chuPaiJudger){
		var chaiPaiResult = chuPaiJudger.chaiPaiResult,			
			bombArray = chaiPaiResult.bombArray  || [],
			zhaDan = bombArray.pop(), card, player = chuPaiJudger.player;
		if(zhaDan){
			if(zhaDan.length == 2){
				player.chuDanZhangNumSpecified(zhaDan, 2);
				paiType = 'shuangWang';				
			}else{
				player.chuSiZhang(zhaDan);
				paiType = 'siZhang';				
			}
			
		}
		
		var chuPaiInfo = ddz.chuPaiInfo;
		chuPaiInfo.paiType = paiType,
		chuPaiInfo.startCardSeq = zhaDan.startCardSeq;		
	}
}

var PaiTypeConstants = {	
	shuangWang:'双王炸弹',
	siZhang        :'四张炸弹',
	siDai2DanZhang :'四带二单张',
	siDai1Dui      :'四带一对',
	siDai2Dui      :'四带两对',
	danZhang       :'单张',
	danDui         :'单对', 
	lianPai        :'连牌',
	lianDui        :'连队',
	sanZhang       :'三张不带',
	sanDai1        :'三张带一',
	sanDaiDui      :'三张带对',
	feiJi          :'飞机不带',
	feiJiDai1      :'飞机带单张',
	feiJiDaiDui    :'飞机带对'
}

var PaiTypeJudger = function(sortedPaiArray){
	this.judger = ShuangWang;
	this.sortedPaiArray = sortedPaiArray || [];
	this.paiType = -1;
}
PaiTypeJudger.prototype.doJudge = function(){
	return this.judger.doJudge(this);
}




var ShuangWang = {
	doJudge: function(paiTypeJudger){		
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 2 && (paiArray[0][0].cardSeq + paiArray[1][0].cardSeq == 33)){
			paiType = 'shuangWang';
			CommonUtil.print(PaiTypeConstants[paiType]);
			paiTypeJudger.paiType = paiType;
		}else{
			paiTypeJudger.judger = FourBomb;
			paiTypeJudger.doJudge();
		}
	}	
}

var FourBomb = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType,startCardSeq;
		if(length == 1 && paiArray[0].length == 4){
			paiType = 'siZhang';
			CommonUtil.print(PaiTypeConstants[paiType]);
			paiTypeJudger.paiType = paiType;
			paiTypeJudger.startCardSeq = paiArray[0][0].cardSeq;
			
		}else{
			paiTypeJudger.judger = Four11;
			paiTypeJudger.doJudge();
		}
	}
}

var Four11 = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 3 && paiArray[0].length == 4 && paiArray[1].length == 1 && paiArray[2].length == 1){
			paiType = 'siDai2DanZhang';
			startCardSeq = paiArray[0][0].cardSeq;
			
			paiTypeJudger.paiType = paiType;
			paiTypeJudger.startCardSeq = startCardSeq;			
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = Four2;
			paiTypeJudger.doJudge();
		}
	}
}

var Four2 = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 2 && paiArray[0].length == 4 && paiArray[1].length == 2){
			paiType = 'siDai1Dui';
			paiTypeJudger.paiType = paiType;
			
			startCardSeq = paiArray[0][0].cardSeq;
			paiTypeJudger.startCardSeq = startCardSeq;		
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = Four22;
			paiTypeJudger.doJudge();
		}
	}
}

var Four22 = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 3 && paiArray[0].length == 4 && paiArray[1].length == 2 && paiArray[2].length == 2){
			paiType = 'siDai2Dui';
			paiTypeJudger.paiType = paiType;
			
			startCardSeq = paiArray[0][0].cardSeq;
			paiTypeJudger.startCardSeq = startCardSeq;		
			
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = SinglePai;
			paiTypeJudger.doJudge();
		}
	}
}

var SinglePai = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType, 
			start = paiArray[0];
		if(length == 1 && start.length == 1){
			paiType = 'danZhang';
			paiTypeJudger.paiType = paiType;
			startCardSeq = paiArray[0][0].cardSeq;
			paiTypeJudger.startCardSeq = startCardSeq;		
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = SingleDui;
			paiTypeJudger.doJudge();
		}		
	}
}

var SingleDui = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType, 
			start = paiArray[0];
		if(length == 1 && start.length == 2){
			paiType = 'danDui';
			paiTypeJudger.paiType = paiType;
			startCardSeq = paiArray[0][0].cardSeq;
			paiTypeJudger.startCardSeq = startCardSeq;		
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = LianPai;
			paiTypeJudger.doJudge();
		}		
	}
}

var LianPai = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType, 
			start = paiArray[0],  endIndex = length -1 ;
		if(length >= 5 && (start.length == 1) && (endIndex != (start.cardSeq - paiArray[endIndex].cardSeq ) ) ){
			paiType = 'lianPai';
			paiTypeJudger.paiType = paiType;			
			paiTypeJudger.startCardSeq = start.cardSeq;		
			paiTypeJudger.length = length;
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = LianDui;
			paiTypeJudger.doJudge();
		}		
	}
}
var LianDui = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType, 
			start = paiArray[0],  endIndex = length -1 ;
		if(length >= 3 && (start.length == 2) && (endIndex == (start[0].cardSeq - paiArray[endIndex][0].cardSeq ) ) ){
			paiType = 'lianDui';
			paiTypeJudger.paiType = paiType;
			paiTypeJudger.startCardSeq = start.cardSeq;		
			paiTypeJudger.length = length;
			CommonUtil.print(PaiTypeConstants[paiType]);
		}else{
			paiTypeJudger.judger = ThreeeX;
			paiTypeJudger.doJudge();
		}		
	}
}

var ThreeeX = {
	doJudge : function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
				length = paiArray.length, paiType = -1, 
				start = paiArray[0],  endIndex = length -1 ;
			if(start.length == 3){
				switch(length){
					case 1:{
						paiType = 'sanZhang';						
						break;
					}						
					case 2:{
						var daiLength = paiArray[1].length;
						if(daiLength == 1){
							paiType = 'sanDai1';							
						}else if(daiLength == 2){
							paiType = 'sanDaiDui';							
						}						
						break;
					}					
				}
			}
			if(paiType == -1){
				paiTypeJudger.judger = FeiJi;
				paiTypeJudger.doJudge();
			}else{
				CommonUtil.print(PaiTypeConstants[paiType]);
				paiTypeJudger.paiType = paiType;
				paiTypeJudger.startCardSeq = start[0].cardSeq;				
			}			
		}
}

var FeiJi = {
	doJudge: function(paiTypeJudger){
		var paiArray = paiTypeJudger.sortedPaiArray, 
			length = paiArray.length, paiType = -1, 
			start = paiArray[0],  endIndex = length -1 , 
			curArray, threeCount = 0, otherCount = 0;
			
		if(start.length == 3){
			for(var i = 1; i < length; i++){
				curArray = paiArray[i];
				if(curArray.length == 3){
					threeCount++;				
				}else{
					break;
				}				
			}
			if( (start[0].cardSeq - paiArray[threeCount][0].cardSeq ) != threeCount){
				threeCount = 1;
			}else{
				threeCount++;
			}
			
			for(var i = threeCount; i < length; i++){
				otherCount += paiArray[i].length;
			}		
			if(threeCount >= 2){
				if(otherCount == 0){
					paiType = 'feiJi';				
				}else if(otherCount == threeCount){
					paiType = 'feiJiDai1';				
				}else if(otherCount == (threeCount + threeCount)){
					paiType = 'feiJiDaiDui';				
				}
			}
			
			paiTypeJudger.startCardSeq = start[0].cardSeq;
			paiTypeJudger.length = threeCount;
		}else if(start.length == 4){
			var fourCount = 1,preCardSeq = start[0].cardSeq, curCardSeq;
			for(var i = 1; i < length; i++){
				curArray = paiArray[i];				
				if(curArray.length == 4){
					curCardSeq = curArray[0].cardSeq;
					if(preCardSeq - curCardSeq == 1){
						fourCount++;
						preCardSeq = curCardSeq;
					}else{
						fourCount = 1;
						paiType = -1;
						break;
					}
				}else{
					fourCount = 1;
					paiType = -1;
					break;
				}				
			}	
			if(fourCount != 1){
				paiType = 'feiJiDai1';
				paiTypeJudger.startCardSeq = start[0].cardSeq;
				paiTypeJudger.length = fourCount;
			}
		}else{
			paiType = -1;			
		}
		if(paiType == -1){
		/*
			CommonUtil.print('非法牌型');
			var  mapCard;
			for(var i = 0; i < length; i++){
				curArray = paiArray[i];
				for(var j = 0 , k = curArray.length; j < k; j++ ){
					mapCard = curArray[j];
					mapCard.dead = false;	
					//CommonUtil.fire(mapCard.mapImg, 'click');				
				}
				
			}
			*/
		}else{
			CommonUtil.print(PaiTypeConstants[paiType]);
			paiTypeJudger.paiType = paiType;			
		}		
	}	
}


var  ChuPaiInfo = function(paiType, player){
	this.paiType = paiType;
	this.player = player;
}

var PaiInfo4ChaiPai = function(array){
	if(array instanceof Array){
		this.array = array;
		this.remainCards4ChaiPai = array.length;
		this.cardSeq = array[0].cardSeq;
	}else{
		throw '传入参数必须是数组';
	}
	
}

/*
拆牌得到的连牌信息，
lianPai:连牌中实际包含的数组，
minCards:数组中重复张数最小的值
*/
var LianPaiInfo = function(lianPai, minCards){
	this.lianPai = lianPai;
	this.minCards = minCards;
}

/*
符合规则的连牌信息
*/
var ValidLianPaiInfo = function(lianZi, sameCount){
	lianZi = lianZi || [];	
	this.lianZi = lianZi;
	this.lianXuCount = lianZi.length;
	if(this.lianXuCount == 0) 
		throw 'lianZi length is 0, illegal lian pai info';
	this.startCardSeq = lianZi[0].cardSeq;
	this.sameCount = sameCount;
	
}

var Player = function(opt){
	opt = opt || {};
	this.AIPlayer = ( typeof opt.AIPlayer  == 'undefined' ? true : opt.AIPlayer);	
	this.index = opt.index;
	this.cardArray = opt.cardArray;	
	this.shouPaiCount = this.cardArray.length;
	this.sortedPaiInfoArray = null;
	this.initSortedPaiInfoArray();
	this.shouPaiAreaId = opt.shouPaiAreaId;
	this.shouPaiAreaObj = CommonUtil.$id(opt.shouPaiAreaId);
	
	this.cardContainerObj = CommonUtil.$id(opt.cardContainerId);	
	var playerAreaObj = CommonUtil.$id(opt.playerId);
	this.playerAreaObj = playerAreaObj;
	
	
		
	this.chupaiId = opt.chupaiId;
	this.buchuId = opt.buchuId;
	this.chongxuanId = opt.chongxuanId;
	this.tishiId = opt.tishiId;
	this.selectPaiArray = [];
	this.chaiPaiStack = [];
	this.chaiPaiResultStack = [];
	
	this.selectedCardArray = [];	
	
	this.shouPaiNumClass = opt.shouPaiNumClass;	
	
	this.initQiangDiZhuObj();
	this.initChuPaiObj();
	
	this.qiangDiZhuObj.area.style.display = 'block';
	
	var  shouPaiAreaWidth = this.shouPaiAreaObj.clientWidth;
	this.cardWidth = 95; //参看demo.css .card_img;
	this.cardHeight = 116;
	this.faPaiXOffset = (shouPaiAreaWidth-this.cardWidth)/(17 -1); 
	this.curFaPaiLeft  = 0;
	
	this.cardDomElemArray = [];
	
	this.touchstartCrood = {x:0,y:0};
	
	
}

Player.prototype.initQiangDiZhuObj = function(){
	var htmlObj = {},  playerAreaObj = this.playerAreaObj;
	var area = CommonUtil.$query('.qiangdizhu_area', playerAreaObj);
	var timeRemain = CommonUtil.$query('.time_remain',area);
	var paopaoArea = CommonUtil.$query('.paopao_container', area);
	var textArea = CommonUtil.$query('.text', paopaoArea);
	var selector = (this.AIPlayer ? '.clock' : '.action_container' );
	var clockArea = CommonUtil.$query(selector,area);
	var positiveActionTextArea = CommonUtil.$query('#positive_btn .text_3char',clockArea);
	var negativeactionTextArea = CommonUtil.$query('#negative_btn .text_2char',clockArea);
	clockArea.style.display = 'none';
	
	htmlObj.area = area;
	htmlObj.timeRemain = timeRemain;
	htmlObj.clockArea = clockArea;
	htmlObj.paopaoArea = paopaoArea;
	htmlObj.textArea = textArea;
	htmlObj.positiveActionTextArea = positiveActionTextArea;
	htmlObj.negativeactionTextArea = negativeactionTextArea;
	
	htmlObj.status = JIAO_DIZHU;	
	
	this.qiangDiZhuObj = htmlObj;
	
}

Player.prototype.initChuPaiObj = function(){
	var htmlObj = {},  playerAreaObj = this.playerAreaObj;
	var area = CommonUtil.$query('.wrapper', playerAreaObj);
	var timeRemain = CommonUtil.$query('.time_remain',area);
	var paopaoArea = CommonUtil.$query('.paopao_container', area);
	var textArea = CommonUtil.$query('.text', paopaoArea);
	var selector = (this.AIPlayer ? '.clock' : '.action_container' );
	var clockArea = CommonUtil.$query(selector,area);
	clockArea.style.display = 'none';
	
	var chuPaiBtn = CommonUtil.$id('chupai_btn');
	var chongXuanBtn = CommonUtil.$id('chongxuan_btn');
	
	htmlObj.area = area;
	htmlObj.timeRemain = timeRemain;
	htmlObj.clockArea = clockArea;
	htmlObj.paopaoArea = paopaoArea;
	htmlObj.textArea = textArea;
	htmlObj.chuPaiBtn = chuPaiBtn;
	htmlObj.chongXuanBtn = chongXuanBtn;	
	this.chuPaiObj = htmlObj;
}

Player.prototype.pushOneCard = function(card){
	this.cardArray.push(card);
	this.shouPaiCount++;
	if(!this.AIPlayer){
		ele = this.creatDomEleFromCard(card);
		this.cardDomElemArray.push(ele);
		this.shouPaiAreaObj.appendChild(ele);
		var that = this;
		
		setTimeout(function(){
			var cardDomElemArray = that.cardDomElemArray;
			dom = cardDomElemArray[cardDomElemArray.length-1];
			dom && (dom.style.webkitTransform = dom.webkitTransform);
		},10);
		
	}
	
	setTimeout(function(){ddz.assignCardsControl()}, 50);
}



Player.prototype.creatDomEleFromCard  = function(card){
	var ele = document.createElement('div'), transXBase = 303, transYBase = -256;
	ele.className = 'card_img ' + card.className;
	transX = -transXBase + this.curFaPaiLeft;
	transY = -transYBase;
	style = ele.style;
	style.position = 'absolute';
	style.left = transXBase + 'px';
	style.top = transYBase + 'px';
	
	
	//style.webkitTransition='-webkit-transform 1s ease';
	
	webkitTransform = 'translate(' + transX + 'px, ' + transY+ 'px)';
	
	this.curFaPaiLeft += this.faPaiXOffset;	
	
	ele.webkitTransform = webkitTransform;
	
	//ele.style.webkitTransform = webkitTransform;
	
	return ele;
}
Player.prototype.showMyFigure = function(){
	var playerAreaObj = this.playerAreaObj;
	if(this.isDiZhu){
		avatarObj =  CommonUtil.$class('role_avatar', playerAreaObj)[0];
		bodyObj =  CommonUtil.$class('role_body', playerAreaObj)[0];
		avatarObj.style.backgroundPositionX = '-120px';
		avatarObj.style.backgroundPositionY = '-262px';
		bodyObj.style.backgroundPositionX = '-8px';
		bodyObj.style.backgroundPositionY = '-176px';
	}	
	if(this.shouPaiNumClass){
		this.shouPaiNumArea = CommonUtil.$class(this.shouPaiNumClass, playerAreaObj)[0];
		this.shouPaiNumArea.innerText = this.shouPaiCount;
	}
	
}

Player.prototype.assignDiPai = function(){
	var diPai = ddz.dipai;
	CommonUtil.bubbleSort(diPai, this.cardCmpFunction);
	this.cardArray = this.cardArray.concat(diPai);
	this.initSortedPaiInfoArray();
	this.shouPaiCount  = this.cardArray.length;
}

Player.prototype.chuDanZhangNumSpecified = function(danZhangArray, num){
	danZhangArray = danZhangArray || [];
	selectedCardArray = this.selectedCardArray;
	var size = danZhangArray.length, curPaiInfo, curCard;
	if(size < num) return;	
	for(var i = 0; i < num; i++){
		curPaiInfo = danZhangArray[i];
		curCard = curPaiInfo.array[0],
		selectedCardArray.push(curCard),
		curCard.mapImg.selected = true;						
		curCard.dead = true;	
	}
	this.shouPaiCount  -= num;
	return danZhangArray[0].cardSeq;
}

Player.prototype.chuDanDuiNumSpecified = function(danDuiArray, num){
	danDuiArray = danDuiArray || [];
	selectedCardArray = this.selectedCardArray;
	var size = danDuiArray.length, curPaiInfo,curCard;
	if(size < num) return;
	for(var i = 0; i < num; i++){
		curPaiInfo = danDuiArray[i];
		curCard = curPaiInfo.array[0],
		curCard.mapImg.selected = true,
		selectedCardArray.push(curCard);		
		curCard.dead = true;

		curCard = curPaiInfo.array[1],
		curCard.mapImg.selected = true,
	    selectedCardArray.push(curCard);
		curCard.dead = true;
	}
	this.shouPaiCount  = this.shouPaiCount - 2*num;
	return danDuiArray[0].cardSeq;
}

Player.prototype.chuSiZhang = function(siZhang){
	var selectedCardArray = this.selectedCardArray,
		paiInfoArray = siZhang.array, curCard;
		
		curCard = paiInfoArray[0],
		curCard.mapImg.selected = true,
		curCard.dead = true,
		selectedCardArray.push(curCard);
		
		curCard = paiInfoArray[1],
		curCard.dead = true,
		curCard.mapImg.selected = true,
		selectedCardArray.push(curCard);
		
		curCard = paiInfoArray[2],
		curCard.mapImg.selected = true,
		curCard.dead = true,
		selectedCardArray.push(curCard);
		
		curCard = paiInfoArray[3],
		curCard.mapImg.selected = true,
		curCard.dead = true,
		selectedCardArray.push(curCard);	
		
		this.shouPaiCount  -= 4;		
}

/*
可能飞机的长度大于出牌所需的feiJiLength,从中取合适的出
*/
Player.prototype.chuFeiJiNumSpecified  = function(feiJi, feiJiLength){
	feiJi = feiJi || [];
	var size = feiJi.length, curPaiInfo, num = feiJiLength;
	if(size < num) return;
	for(var i = 0; i < num; i++){
		curPaiInfo = feiJi[i];
		this.chuSanZhang(curPaiInfo);
	}
	return feiJi[0].array[0].cardSeq;
}
Player.prototype.chuSanZhang = function(sanZhang){
	var selectedCardArray = this.selectedCardArray,
	    paiInfoArray = sanZhang.array, curCard;
		curCard = paiInfoArray[0],
		curCard.mapImg.selected = true,
		curCard.dead = true,
		selectedCardArray.push(curCard);
		
		curCard = paiInfoArray[1],
		curCard.dead = true,
		curCard.mapImg.selected = true,
		selectedCardArray.push(curCard);
		
		curCard = paiInfoArray[2],
		curCard.mapImg.selected = true,
		curCard.dead = true,
		selectedCardArray.push(curCard);
		this.shouPaiCount  -= 3;
		return curCard.cardSeq;
}

Player.prototype.mapImg2Card = function(){
	var cardImgs = CommonUtil.$class('card_img', this.shouPaiAreaObj), curCard;	
		that  = this;
	for(var i = 0, j = cardImgs.length; i < j; i++){				
		curCard = cardImgs[i];		
		curCard.mapCard = this.cardArray[parseInt(curCard.getAttribute('index'))];
		curCard.mapCard.mapImg = curCard;		
		/*
		!this.AIPlayer && curCard.addEventListener('click', function(){
			var s = this.style, selectOffset = 10, top;
			if(this.selected){
				this.mapCard.dead = false;
				top = parseFloat(s.top || 0) + selectOffset + 'px';
				this.selected = false;
			}else{
				this.mapCard.dead = true;
				this.selected = true;
				top = parseFloat(s.top || 0) - selectOffset + 'px';
			}
			s.top = top;
			
			ddz.player3.updateChuPaiActionUI();
		});	
		*/		
	}
}

Player.prototype.registeSelectCardAction = function(){		

	if(!this.AIPlayer){
		var that = this;
		this.shouPaiAreaObj.addEventListener(START_EV, function(evt){
		
			console.log(START_EV);
			var e = evt;
			 var event = evt.touches ? evt.touches[0] : evt;			
				that.touchstartCrood.x = event.clientX ;
				that.touchstartCrood.y = event.clientY;
				that.touchSelectedCardImgs = [];
				that.touching  = true;
				
			
		
		});	

		this.shouPaiAreaObj.addEventListener(MOVE_EV, function(evt){
			evt.preventDefault();
			if(!that.touching) return;
			var touchSelectedCardImgs = that.touchSelectedCardImgs;
			//console.log(MOVE_EV);
			var event = evt.changedTouches ? evt.changedTouches[0] : evt;
			var touchendX = event.clientX, touchendY = event.clientY;
			
			if(touchendX >  that.touchstartCrood.x){
				startLeft = that.touchstartCrood.x;
				endLeft = touchendX;
			}else{
				startLeft = touchendX;
				endLeft = that.touchstartCrood.x;
			}
			
			var curCardImgs = CommonUtil.$class('card_img', that.shouPaiAreaObj), curCard;
			
			if(curCardImgs.length > 1){
				cardOffset = curCardImgs[1].getBoundingClientRect().left - curCardImgs[0].getBoundingClientRect().left;
				
				for(var i = 0, j = curCardImgs.length; i < j; i++){
					curImg = curCardImgs[i];			 
					
					var s = curImg.style, rect = curImg.getBoundingClientRect(),
						curImgLeft = rect.left;
					if(curImgLeft + cardOffset >= startLeft && curImgLeft  <= endLeft){					
						s.boxShadow='0 0 0 100px rgba(0, 0, 0, 0.31)inset';
						if(touchSelectedCardImgs.indexOf(curImg) == -1){
							touchSelectedCardImgs.push(curImg);
						}
					}else{
						s.boxShadow='';
						if(touchSelectedCardImgs.indexOf(curImg) != -1){
							touchSelectedCardImgs.pop();
						}
					}					
					
				}	
			}				

		});
		
		this.shouPaiAreaObj.addEventListener(END_EV, function(evt){	
		console.log(END_EV);	
		
		var touchSelectedCardImgs = that.touchSelectedCardImgs, selectOffset = 10;
		var curImg = evt.target;
		if(touchSelectedCardImgs.indexOf(curImg) == -1){
			touchSelectedCardImgs.push(curImg);
		}
		
		
		for(var i = 0, j = touchSelectedCardImgs.length; i < j; i++){
			curImg = touchSelectedCardImgs[i];			 
				
				var s = curImg.style,top;				
				s.boxShadow = '';
				if(curImg.selected){
					curImg.mapCard.dead = false;
					top = parseFloat(s.top || 0) + selectOffset + 'px';
					curImg.selected = false;
				}else{
					curImg.mapCard.dead = true;
					curImg.selected = true;
					top = parseFloat(s.top || 0) - selectOffset + 'px';
				}
					s.top = top;
		}	

		that.touching = false;
		that.updateChuPaiActionUI();
	});
	
	}
	
	
}



Player.prototype.registeChupaiAction = function(){
	var that = this,  chupaiBtn = this.chuPaiObj.chuPaiBtn;	
	chupaiBtn && chupaiBtn.addEventListener('click', function(e){		
		// that.judgeChupaiType();		
		 // ddz.placeCards();		
		
		that.nonAIChuPai();
		
		//that.clockAreaObj && (that.clockAreaObj.style.display = 'none');
		
	});
	
	buchuBtn = CommonUtil.$id(this.buchuId);
	buchuBtn && buchuBtn.addEventListener('click', function(e){		
		// that.judgeChupaiType();		
		 // ddz.placeCards();		
			/*
		var className = e.currentTarget.className;
		var pattern  = /gray_btn|green_btn|red_btn/;
		match = pattern.exec(className)[0];
		switch(match){
			case 'gray_btn':break;
			default:
		}
		*/
		that.buChuPai();
		//that.clockAreaObj && (that.clockAreaObj.style.display = 'none');
		
	});
	
	chongXuanBtn = CommonUtil.$id(this.chongxuanId);	
	chongXuanBtn && chongXuanBtn.addEventListener('click', function(e){	
		that.doChongXuan();
	});	
}

Player.prototype.registeQiangDiZhuAction = function(){
	var that = this,  area = this.qiangDiZhuObj.area;
		negativeBtn = CommonUtil.$query('#negative_btn', area);	
	negativeBtn && negativeBtn.addEventListener('click', function(){		
		// that.judgeChupaiType();		
		 // ddz.placeCards();			
		
		
		var className = 'text bujiao';
		if(ddz.qiangDiZhuStatus == JIAO_DIZHU){
				className = 'text bujiao';				
		}else{
			className = 'text buqiang';			
		}
		that.qiangDiZhuObj.textArea.className = className;	
		
		
		that.buQiangDiZhu();
		//that.clockAreaObj && (that.clockAreaObj.style.display = 'none');
		
	});
	
	positiveBtn = CommonUtil.$query('#positive_btn', area);
	positiveBtn && positiveBtn.addEventListener('click', function(){
		// that.judgeChupaiType();		
		 // ddz.placeCards();			
		
		
		that.doAIQiangDiZhu();
		
		//that.qiangDiZhuSuccess();
		//that.clockAreaObj && (that.clockAreaObj.style.display = 'none');
		
	});
}

Player.prototype.isNonAISelectedPaiOk = function(judger){
	var chuPaiInfo = ddz.chuPaiInfo,
		strongPlayer = chuPaiInfo.strongPlayer,	
		ok = (judger.paiType != -1);		
	if(ok){
		ok = (strongPlayer === this);
		if(!ok){
			var judgerPaiType = judger.paiType, chuPaiType = chuPaiInfo.paiType;
			if(judgerPaiType == 'shuangWang'){
				ok = true;
			}else if(chuPaiType != 'shuangWang'){
				if(judgerPaiType == 'siZhang'){
					if(chuPaiType == 'siZhang'){
						ok = judger.startCardSeq > chuPaiInfo.startCardSeq ;						
					}else{
						ok = true;
					}
				}else{
					ok = ( (judger.paiType == chuPaiInfo.paiType) &&
							(judger.startCardSeq > chuPaiInfo.startCardSeq) );
		
				}
			}
		}
	}
	return ok;
}

Player.prototype.doTiShi = function(){
	var chuPaiInfo = ddz.chuPaiInfo;
	var strongPlayer = chuPaiInfo.strongPlayer;
	if(strongPlayer == this){
		
	}else{
		var curPaiType = chuPaiInfo.paiType;
	}
}
Player.prototype.nonAIChuPai = function(){
	var selectCards = this.getSelectedCards() || [];
	this.selectedCardArray = selectCards;
	if(selectCards.length == 0)return;	
	var judger = this.judgeChupaiType() || {}, 
		that = this,
		chuPaiInfo = ddz.chuPaiInfo;
	var strongPlayer = chuPaiInfo.strongPlayer;
	if(this.isNonAISelectedPaiOk(judger) ){	
		chuPaiInfo.paiType = judger.paiType;
		chuPaiInfo.startCardSeq = judger.startCardSeq;
		chuPaiInfo.length = judger.length;
		chuPaiInfo.curChuPaiPlayer=this;	
		chuPaiInfo.strongPlayer	 = this;	
		this.doNonAIChuPai();
		
	}else{
		// this.buChuPai();
		//this.this.selectedCardArray.length = 0;
	}
}

Player.prototype.getSelectedCards = function(){
	var selectCards = [];
	var cardImgs = CommonUtil.$class('card_img', this.shouPaiAreaObj), curCard;
	for(var i = 0, j = cardImgs.length; i < j; i++){
		curCard = cardImgs[i];
		if(curCard.selected){
			selectCards.push(curCard.mapCard);
		}
	}
	return selectCards;
}

Player.prototype.clearSelectedCards = function(){
	//if(this.AIPlayer) return;
	var cardImgs = CommonUtil.$class('card_img', this.shouPaiAreaObj), curCard;
	for(var i = 0, j = cardImgs.length; i < j; i++){
		curCard = cardImgs[i].mapCard;
		curCard.dead = false;
		
	}
	this.selectedCardArray.length = 0;
}

Player.prototype.getSortedPaiInfo = function(cardArray, cmpFunction){
	var cards = cardArray || [];
	if(cards.length == 0) return;
	var curCard = cards[0], curSeq = curCard.cardSeq;
	var cardCount = cards.length, mapCardArray = [curCard], paiArray = [mapCardArray];	
	
	//curCard.dead = true;
	for(var i = 1; i < cardCount; i++){
		curCard = cards[i];
		//curCard.dead = true;
		if(curCard.cardSeq == curSeq){			
			mapCardArray.push(curCard);
		}else{	
			curSeq = curCard.cardSeq;
			mapCardArray = [curCard];			
			paiArray.push(mapCardArray);			
		}
	}		
	var sortedArray = CommonUtil.bubbleSort(paiArray,cmpFunction), paiInfoArray = [];
	for(var i = 0, j = sortedArray.length; i < j; i++ ){
		paiInfoArray.push(new PaiInfo4ChaiPai(sortedArray[i]));
	}
	return {
		paiInfoArray:paiInfoArray,
		sortedArray:sortedArray
	};
	
}
Player.prototype.judgeChupaiType = function(){
	var selectCards = this.selectedCardArray;
	var sortedInfo = this.getSortedPaiInfo(selectCards, this.chupaiCmpFunction), 
		sortedArray = sortedInfo.sortedArray;
	var judger = new PaiTypeJudger(sortedArray);
	judger.doJudge();
	return judger;
}


Player.prototype.findAlonePaiBasedOnSortedPaiInfoArray = function(sortedPaiInfoArray){
	var array = sortedPaiInfoArray || [];
	var i = 0, size = array.length;
	if(size == 0) return {};
	//minCardsInlianPaiElem用于记录连牌中牌数最小的那个值，以便后来从lianPaiInfoArray中提取符合规则的连牌或连对。
	var aloneArray = [], lianPaiInfoArray = [], aloneBomb = [], minCardsInlianPaiElem = 0;	
	var curPaiInfo = array[0], pai0Seq = curPaiInfo.cardSeq;
	
	if(size == 1){
			aloneArray.push(curPaiInfo);
	}else {
		//大王
		if(pai0Seq == 17){
			i++;
			if(array[1].cardSeq == 16){
				i++;
				aloneBomb.push([ array[0], array[1] ]);
			}else{
				aloneArray.push(curPaiInfo);			
			}
		}else if(pai0Seq == 16){
			i++;
			aloneArray.push(curPaiInfo);
		}	
	}
	if(i < size){
		var lianxuCount = 0,curPaiInfo = null, preSeq = -1, curSeq,tmp = [];
		for(; i < size ; i++){
			curPaiInfo = array[i];
			if(curPaiInfo.remainCards4ChaiPai != 0){
				lianxuCount = 1;
				preSeq = curPaiInfo.cardSeq;
				tmp.push(curPaiInfo);
				i++;
				break;
			}else{
				aloneArray.push(curPaiInfo);
			}
		}
		for(; i < size ; i++){
			curPaiInfo = array[i], curSeq = curPaiInfo.cardSeq;
			
			if(curPaiInfo.remainCards4ChaiPai != 0 && preSeq == (curSeq + 1)){
				lianxuCount++;
				tmp.push(curPaiInfo);				
			}else{					
				if(lianxuCount < 5){
					for(var p = 0, q = tmp.length; p < q; p++){				
						aloneArray.push(tmp[p]);
					}			
				}else{
					var lianPai = [], minCards = 4, tmpInfo;
					for(var p = 0, q = tmp.length; p < q; p++){		
						tmpInfo = tmp[p];
						lianPai.push(tmpInfo);
						if(tmpInfo.remainCards4ChaiPai < minCards){
							minCards = tmpInfo.remainCards4ChaiPai;
						}
					}
					lianPaiInfoArray.push(new LianPaiInfo(lianPai, minCards));
				}	
				
				if(curPaiInfo.remainCards4ChaiPai == 0){					
					curPaiInfo.remainCards4ChaiPai = curPaiInfo.array.length;
					aloneArray.push(curPaiInfo);
					tmp = [];
					lianxuCount = 0;
				}else{
					tmp = [curPaiInfo];
					lianxuCount = 1;
				}
				
			}
			preSeq = curSeq;
		}	
		
		if(lianxuCount < 5){
			for(var p = 0, q = tmp.length; p < q; p++){				
				aloneArray.push(tmp[p]);
			}	
		}else{
			var lianPai = [], minCards = 4, tmpInfo;
			for(var p = 0, q = tmp.length; p < q; p++){		
				tmpInfo = tmp[p];
				lianPai.push(tmpInfo);
				if(tmpInfo.remainCards4ChaiPai < minCards){
					minCards = tmpInfo.remainCards4ChaiPai;
				}
			}
			lianPaiInfoArray.push(new LianPaiInfo(lianPai, minCards));
		}		
	}
	
	//从低于5连的aloneArray中找出单张，单对，三张
	var oneArray = [], twoArray = [], threeArray = [];
	for(i = 0, size = aloneArray.length; i < size; i++){
		curPaiInfo = aloneArray[i];		
		remainCards = curPaiInfo.remainCards4ChaiPai,
		cards = (remainCards == 0) ? curPaiInfo.array.length : remainCards;
		switch(cards){
			case 1:
				oneArray.push(curPaiInfo);break;
			case 2:
				twoArray.push(curPaiInfo);break;
			case 3:			
				threeArray.push(curPaiInfo);break;
			case 4:
				aloneBomb.push(curPaiInfo);break;
		}
	}
	
	
	//从twoArray中找出提取出连对和单对
	var duiInfo = this.extractDuiInfoFromTwoArray(twoArray);
	
	//从threeArray中提取出飞机和三张
	var threeInfo = this.extractThreeInfoFromThreeArray(threeArray);	
	
	aloneArray = null, tmp = null;
	return {
		oneArray:oneArray, 
		duiInfo: duiInfo, 
		threeInfo: threeInfo, 
		aloneBomb:aloneBomb,
		lianPaiInfoArray:lianPaiInfoArray			
	};
	
}


Player.prototype.commonExtractLianPaiFromArray = function(paiInfoArray, minValidPaiNum){
	var lianxuCount = 0, paiInfoArray = paiInfoArray || [], lianPaiArray = [],danPaiArray= [];
	for(i = 0, size = paiInfoArray.length; i < size; i++){
		curPaiInfo = paiInfoArray[i];		
		lianxuCount++, i++;
		preSeq = curPaiInfo.cardSeq;
		break;		
	}
	if(lianxuCount == 1){
		tmp = [curPaiInfo];
		for(; i < size; i++){
			curPaiInfo = paiInfoArray[i];				
			
				curSeq = curPaiInfo.cardSeq;
				if(preSeq == (curSeq + 1)){
					lianxuCount++;
					tmp.push(curPaiInfo);
				}else{					
					if(lianxuCount < minValidPaiNum){
						arrayToUse = danPaiArray;
					}else{
						arrayToUse = [];
					}
					for(var p = 0, q = tmp.length; p < q; p++){				
						arrayToUse.push(tmp[p]);
					}					
					if(arrayToUse !== danPaiArray){
						lianPaiArray.push(arrayToUse);
					}
					tmp = [curPaiInfo];
					lianxuCount = 1;
				}						
			preSeq = curSeq;				
		}		
		
		if(lianxuCount < minValidPaiNum){
			arrayToUse = danPaiArray;
		}else{
			arrayToUse = [];
		}
		for(var p = 0, q = tmp.length; p < q; p++){				
			arrayToUse.push(tmp[p]);
		}	
		if(arrayToUse !== danPaiArray){
			lianPaiArray.push(arrayToUse);
		}
	}

	return {	
		danPaiArray : danPaiArray,
		lianPaiArray : lianPaiArray
	}
}

Player.prototype.extractDuiInfoFromTwoArray = function(twoArray){
	return this.commonExtractLianPaiFromArray(twoArray, 3);
}

Player.prototype.extractThreeInfoFromThreeArray = function(threeArray){
	return this.commonExtractLianPaiFromArray(threeArray, 2);
}


Player.prototype.initSortedPaiInfoArray = function(){
	CommonUtil.bubbleSort(this.cardArray, this.cardCmpFunction);
	var paiInfo =  this.getSortedPaiInfo(this.cardArray, this.findPaiCmpFunction) || {},
		paiInfoArray = paiInfo.paiInfoArray || [];
	this.sortedPaiInfoArray = 	paiInfoArray;
}

Player.prototype.updateSortedPaiInfoArray = function(){
	var curArray = this.sortedPaiInfoArray, curArrayInPaiInfo, firstCard;
	for(var i = 0, size = curArray.length; i < size; i++){
		curArrayInPaiInfo = curArray[i].array;
		firstCard = curArrayInPaiInfo[0];
		while(firstCard && firstCard.dead){
			curArrayInPaiInfo.shift();
			firstCard = curArrayInPaiInfo[0];
		}		
	}
	var newSortedPaiInfoArray = [], arrayLength;
	for(var i = 0, size = curArray.length; i < size; i++){
		curPaiInfo = curArray[i];
		arrayLength = curPaiInfo.array.length
		if(arrayLength != 0){
			curPaiInfo.remainCards4ChaiPai = arrayLength;
			newSortedPaiInfoArray.push(curPaiInfo);			
		}
	}
	this.sortedPaiInfoArray = newSortedPaiInfoArray;
}
/*
 找出一副牌中只能组成一种牌型的牌（3条，对子，单张为一种牌型。）意思就是有一张牌和剩余牌中的任何一张牌没有联系。
 */
Player.prototype.findAlonePaiBaseOnCardArray = function(){		
	var paiInfo =  this.getSortedPaiInfo(this.cardArray, this.findPaiCmpFunction) || {},
		paiInfoArray = paiInfo.paiInfoArray || [];	
	return this.findAlonePaiBasedOnSortedPaiInfoArray(paiInfoArray);
	
}

/*
被动出牌
*/
Player.prototype.negativeChuPai = function(){
	var chiBuQi = '吃不起', isChiBuQi = true,
	    chuPaiInfo = ddz.chuPaiInfo,
	    paiType = chuPaiInfo.paiType,
	    selectedCardArray = this.selectedCardArray,
		newStartCardSeq;
	var chaiPaiResult = this.doSimpleChaiPai(),		
		danZhangArray = chaiPaiResult.danZhangArray || [],
		danDuiArray = chaiPaiResult.danDuiArray || [],		
		sanZhangArray = chaiPaiResult.sanZhangArray || [], 
		bombArray = chaiPaiResult.bombArray,
		
		danLianInfoArray =chaiPaiResult.danLianInfoArray || [],
		duiLianInfoArray = chaiPaiResult.duiLianInfoArray ||[],
		feiJiInfoArray = chaiPaiResult.feiJiInfoArray || [];
	
	
	switch(paiType){
		case 'feiJiDaiDui':		
		case 'feiJiDai1':		
		case 'feiJi':{
			feiJi = feiJiInfoArray.pop();
			feiJiLength = chuPaiInfo.length;
			if(feiJi && feiJi.length >= feiJiLength){
				startCardSeq = feiJi.cardSeq;
				if(startCardSeq > chuPaiInfo.startCardSeq){
					switch( paiType){
						case 'feiJiDaiDui':	{
							if(danDuiArray.length >= feiJiLength){
								this.chuDanDuiNumSpecified(danDuiArray, feiJiLength);
								isChiBuQi = false;
							}
							break;
						}
						case 'feiJiDai1':	{
							if(danZhangArray.length >= feiJiLength){
								this.chuDanZhangNumSpecified(danZhangArray, feiJiLength);
								isChiBuQi = false;
							}
							break;
						}
					}
					if(!isChiBuQi){					
						newStartCardSeq = this.chuFeiJiNumSpecified(feiJi,feiJiLength);
					}
				}
			}
			break;
		}
		case 'sanDaiDui':
		case 'sanDai1':
		case 'sanZhang':{
			sanZhang = sanZhangArray.pop();
			if(sanZhang){
				startCardSeq = sanZhang.cardSeq;
				if(startCardSeq > chuPaiInfo.startCardSeq){
					switch(paiType){
						case 'sanDaiDui':{
							if(danDuiArray.length >= 1){
								this.chuDanDuiNumSpecified(danDuiArray, 1);
								isChiBuQi = false;
							}
							break;
						}
						case 'sanDai1':{
							if(danZhangArray.length >= 1){
								this.chuDanZhangNumSpecified(danZhangArray, 1);
								isChiBuQi = false;
							}
							break;
						}					
					}
					if(!isChiBuQi){
						newStartCardSeq = this.chuSanZhang(sanZhang);
					}
				}
			}
			break;
		}
		case 'lianDui':{
			lianDui = duiLianInfoArray.pop();
			lanDuiLength = chuPaiInfo.length;
			if(lianDui && lianDui.startCardSeq > chuPaiInfo.startCardSeq && lianDui.lianXuCount >= lanDuiLength){
				newStartCardSeq = this.chuDanDuiNumSpecified(lianDui.lianZi, lanDuiLength);
				isChiBuQi = false;
			}
			break;
		}
		case 'lianPai':{
			lianPai = danLianInfoArray.pop();
			lianPaiLength = chuPaiInfo.length;
			if(lianPai && lianPai.startCardSeq > chuPaiInfo.startCardSeq && lianPai.lianXuCount >= lianPaiLength){
				newStartCardSeq = this.chuDanZhangNumSpecified(lianPai.lianZi, lianPaiLength);
				isChiBuQi = false;
			}
			break;
		}case 'danDui':{
			if(danDuiArray.length >= 1 && danDuiArray[0].cardSeq > chuPaiInfo.startCardSeq){
				newStartCardSeq = this.chuDanDuiNumSpecified(danDuiArray, 1);
				isChiBuQi = false;
			}
			break;
		}		
		case 'danZhang':{
			if(danZhangArray.length >= 1 && danZhangArray[0].cardSeq > chuPaiInfo.startCardSeq){
				newStartCardSeq = this.chuDanZhangNumSpecified(danZhangArray, 1);
				isChiBuQi = false;
			}
			break;
		}
		case 'siDai2Dui':{		
		}
		case 'siDai1Dui':{
		}
		case 'siDai2DanZhang':{
		}
		case 'siZhang':{
		}
	}
	
	this.placeCardSelected();
	chuPaiInfo.curChuPaiPlayer = this;
	if(!isChiBuQi){	
		var chuPaiInfo = ddz.chuPaiInfo;
			chuPaiInfo.startCardSeq = newStartCardSeq;
		
		this.placeCards();
		this.updateSortedPaiInfoArray();
		CommonUtil.print(PaiTypeConstants[paiType]);
		if(this.sortedPaiInfoArray.length == 0){
			ddz.chuPaiInfo.isOver = true;
			CommonUtil.print('一方牌数为0，游戏结束');
		}	
		chuPaiInfo.strongPlayer = this;		
	}else{
		CommonUtil.print(chiBuQi);		
	}
	
}

/*
主动出牌
*/
Player.prototype.positiveChuPai = function(){
	var chaiPaiResult = this.doSimpleChaiPai();
	var  chaiPaiResult = new PositiveChuPaiJudger(chaiPaiResult,this);
	chaiPaiResult.doChuPaiJudge();
	chuPaiInfo = ddz.chuPaiInfo;
	chuPaiInfo.curChuPaiPlayer=this;
	chuPaiInfo.strongPlayer=this;	
	
	this.placeCardSelected();
	this.placeCards();
	this.updateSortedPaiInfoArray();	
	CommonUtil.print(PaiTypeConstants[chuPaiInfo.paiType]);
	if(this.sortedPaiInfoArray.length == 0){
		chuPaiInfo.isOver = true;
		CommonUtil.print('一方牌数为0，游戏结束');
	}	
	
}

Player.prototype.positiveTiShi = function(){
	
}

Player.prototype.doChongXuan = function(){
	
	var selectedCards = this.getSelectedCards();
	for(var i = 0, j = selectedCards.length; i < j; i++){
		curCard = selectedCards[i];			
		curCard.dead = false;		
	}
	this.placeCards();
	this.selectedCardArray.length = 0;
	this.updateChuPaiActionUI();

}

Player.prototype.doQiangDiZhu = function(){	
	var timer = this.qiangDiZhuObj.timer;
	timer && timer.stop();
	{
		rand = Math.floor(Math.random() * 3);
		var className = 'text bujiao';
		if(ddz.qiangDiZhuStatus == JIAO_DIZHU){
			if(rand == 1){				
				className = 'text jiao_dizhu';				
				ddz.qiangDiZhuStatus = QIANG_DIZHU;				
			}else{
				className = 'text bujiao';
				this.qiangDiZhuObj.status = GIVE_UP;
				ddz.negativeActionNum++;
			}
		}else{
			if(rand == 2){
				className = 'text qiang_dizhu';
				this.qiangDiZhuObj.status = QIANG_DIZHU;
				ddz.qiangDiZhuCount++;				
			}else{
				className = 'text buqiang';
				this.qiangDiZhuObj.status = GIVE_UP;
				ddz.negativeActionNum++;
			}
		}		
		this.qiangDiZhuObj.textArea.className = className;	
		
		
		this.showAfterQiangDiZhuUI();
		ddz.qiangDiZhuControl();
	}
	
}

Player.prototype.doAIQiangDiZhu = function(){
	var timer = this.qiangDiZhuObj.timer;
	timer && timer.stop();
	var className = 'text jiao_dizhu';
		if(ddz.qiangDiZhuStatus == JIAO_DIZHU){
				className = 'text jiao_dizhu';
				ddz.qiangDiZhuStatus = QIANG_DIZHU;
		}else{
			className = 'text qiang_dizhu';
			this.qiangDiZhuObj.status = QIANG_DIZHU;
			ddz.qiangDiZhuCount++;
		}
		this.qiangDiZhuObj.textArea.className = className;
		this.showAfterQiangDiZhuUI();
		ddz.qiangDiZhuControl();
		
}

Player.prototype.buQiangDiZhu = function(){
var timer = this.qiangDiZhuObj.timer;
	timer && timer.stop();
	this.qiangDiZhuObj.status = GIVE_UP;
	ddz.negativeActionNum++;
	
	this.showAfterQiangDiZhuUI();
	ddz.qiangDiZhuControl();
	
}

Player.prototype.qiangDiZhuSuccess = function(){	
	ddz.diZhu = this;
	ddz.diZhu.isDiZhu = true;
	ddz.diZhuIndex = this.index;
	ddz.chuPaiInfo.strongPlayer = ddz.diZhu;
	if(!this.AIPlayer){
		
	}	
	setTimeout(function(){ddz.startGame();},1000)
	
}

Player.prototype.doChuPai = function(){
	var chuPaiInfo = ddz.chuPaiInfo,
		strongPlayer = chuPaiInfo.strongPlayer;	
	
	if(strongPlayer == this){
		this.positiveChuPai();
	}else{
		this.negativeChuPai();
	}
	// this.selectedCardArray.length = 0;
	/*
	var clockArea = this.clockAreaObj, that = this;
	clockArea && (clockArea.style.display = 'none');
	*/
	
	var timer = this.chuPaiObj.timer;
		timer && timer.stop();
	setTimeout( function(){ddz.gameControl()}, 0);
}

Player.prototype.doNonAIChuPai = function(){	
	this.shouPaiCount -= this.selectedCardArray.length;
	var that  = this;
	var timer = this.chuPaiObj.timer;
		timer && timer.stop();
	this.placeCardSelected();
	that.placeCards();	
	this.updateSortedPaiInfoArray();
	if(this.sortedPaiInfoArray.length == 0){
			ddz.chuPaiInfo.isOver = true;
			CommonUtil.print('一方牌数为0，游戏结束');
	}		
	setTimeout( function(){ddz.gameControl()}, 0);
}

Player.prototype.buChuPai = function(){
	var chuPaiInfo = ddz.chuPaiInfo;
	
	
	if(!chuPaiInfo.paiType || chuPaiInfo.strongPlayer === this){
		this.forceChuPaiWhenTimeout();
	}else{
		this.clearSelectedCards();
		var timer = this.chuPaiObj.timer;
		timer && timer.stop();			
		this.placeCards();
		this.placeCardSelected();
		setTimeout( function(){ddz.gameControl()}, 0);
	}
}

Player.prototype.forceChuPaiWhenTimeout = function(){
	this.clearSelectedCards();
	this.doChuPai();
	
}
Player.prototype.updateChuPaiActionUI = function(){
	var selectedCards = this.getSelectedCards();
	var className = 'action_btn gray_btn';
	if(selectedCards.length > 0 ){
		className = 'action_btn red_btn';			
	}
	this.chuPaiObj.chuPaiBtn.className = className;	
	this.chuPaiObj.chongXuanBtn.className = className;	
	
}

Player.prototype.showBeforeChuPaiUI = function(){
	var htmlObj = this.chuPaiObj;
	var clockArea = htmlObj.clockArea;
	clockArea && (clockArea.style.display = 'block');		
	
	var paopaoArea = htmlObj.paopaoArea;	
	paopaoArea && (paopaoArea.style.display = 'none');	
	this.cardContainerObj.innerHTML = '';	
	if(!this.AIPlayer){
		this.updateChuPaiActionUI();
	}
}

Player.prototype.showBeforeQiangDiZhuUI = function(){
	if(!this.AIPlayer && ddz.qiangDiZhuStatus == QIANG_DIZHU){
		this.qiangDiZhuObj.positiveActionTextArea.className = 'text_3char qiang_dizhu';
		
		this.qiangDiZhuObj.negativeactionTextArea.className = 'text_2char buqiang';
	}
	
	//ddz.ElemObj.mulEff.style.display = 'none';
	var htmlObj = this.qiangDiZhuObj;
	var clockArea = htmlObj.clockArea;
	clockArea && (clockArea.style.display = 'block');
	
	var paopaoArea = htmlObj.paopaoArea;	
	paopaoArea && (paopaoArea.style.display = 'none');	
	
	//this.cardContainerObj.innerHTML = '';	
}

Player.prototype.showAfterQiangDiZhuUI = function(){
	//ddz.ElemObj.mulEff.className = 'mul_eff_2 fadeOut';
	
	
	if(this.qiangDiZhuObj.status == QIANG_DIZHU ){
	
		ddz.showTotalMulValue();
		
		var mulEff = ddz.ElemObj.mulEff;				
		mulEff.className = 'mul_eff_2';	
		setTimeout(function(){
			var mulEff = ddz.ElemObj.mulEff;				
			mulEff.className = 'mul_eff_2 cancel_animate';	
		},500);
		
		
	}	
	
	var htmlObj = this.qiangDiZhuObj;
	var clockArea = htmlObj.clockArea;
	clockArea && (clockArea.style.display = 'none');		
	
	var paopaoArea = htmlObj.paopaoArea;	
	paopaoArea && (paopaoArea.style.display = 'block');		
	
	//this.cardContainerObj.innerHTML = '';	
}


Player.prototype.startQiangDiZhuTimer = function(){
	if(this.qiangDiZhuObj.status == GIVE_UP){
		this.qiangDiZhuObj.paopaoArea.style.display = 'none';
		this.qiangDiZhuObj.clockArea.style.display = 'none';
		ddz.qiangDiZhuControl();
		return;
	}
	if(ddz.negativeActionNum == 2){
		this.qiangDiZhuSuccess();
		return;
	}
	
	var vt = 1000 * 15, that = this;
	/*
	var clockArea = this.clockAreaObj;
	clockArea && (clockArea.style.display = 'block');
	*/
    var timer = new CommonUtil.CountDown({overTime:vt, runCallBack:function (remainSec) {
			that.qiangDiZhuObj.timeRemain.innerText = remainSec;
        }, overTimeCallback:function () {               
				//that.clearSelectedCards();
				that.buQiangDiZhu();
    }});
	this.qiangDiZhuObj.timer = timer;	
	this.showBeforeQiangDiZhuUI();
	if(this.AIPlayer){
		setTimeout(function(){that.doQiangDiZhu()}, 3000);		
	}else{
	}	
}
Player.prototype.startChuPaiTimer = function(){
	var vt = 1000 * 30, that = this;
	/*
	var clockArea = this.clockAreaObj;
	clockArea && (clockArea.style.display = 'block');
	*/
    var timer = new CommonUtil.CountDown({overTime:vt, runCallBack:function (remainSec) {
			that.chuPaiObj.timeRemain.innerText = remainSec;
        }, overTimeCallback:function () {               
				that.clearSelectedCards();
				that.doChuPai();
    }});
	this.chuPaiObj.timer = timer;	
	this.showBeforeChuPaiUI();
	if(this.AIPlayer){
		setTimeout(function(){that.doChuPai()}, 3000);		
	}else{
	}	
	
}

Player.prototype.placeLianPai2LianInfoArray = function(lianInfoArray, lianPaiArray, sameCount){
	if(lianInfoArray || lianPaiArray) return;
	try{
		var lianInfo = new ValidLianPaiInfo(lianPaiArray, sameCount);
		lianInfoArray.push(lianInfo);
	}catch(error){}
}

Player.prototype.doSimpleChaiPai = function(){
	var data = this.findAlonePaiBasedOnSortedPaiInfoArray(this.sortedPaiInfoArray);
	// var data = this.findAlonePaiBaseOnCardArray() || {},
		lianPaiInfoArray = data.lianPaiInfoArray || [];
		danLianInfoArray = [], duiLianInfoArray = [], feiJiInfoArray =  [];
	var oneArrayOrigin = data.oneArray || [],
		duiInfoOrigin = data.duiInfo || {},
		threeInfoOrigin = data.threeInfo || {};
	
	var duiLianPaiArray = duiInfoOrigin.lianPaiArray || [];
	for(var i = 0 , size = duiLianPaiArray.length; i < size; i ++){
		this.placeLianPai2LianInfoArray(duiLianInfoArray, duiLianPaiArray[i], 2);
	}
	
	var feiJiPaiArray = threeInfoOrigin.lianPaiArray || [];
	for(var i = 0 , size = feiJiPaiArray.length; i < size; i ++){
		this.placeLianPai2LianInfoArray(feiJiInfoArray, feiJiPaiArray[i], 3);
	}
	
		
	if(lianPaiInfoArray.length == 0){
		return {
			danZhangArray:oneArrayOrigin,
			danDuiArray:duiInfoOrigin.danPaiArray,			
			sanZhangArray:threeInfoOrigin.danPaiArray,
			
			danLianInfoArray : danLianInfoArray,
			duiLianInfoArray:duiLianInfoArray,
			feiJiInfoArray: feiJiInfoArray,				
			
			bombArray : data.aloneBomb,		
		}
	};
	
	var ret = this.extractLianZiFromlianPaiInfoArray(lianPaiInfoArray[0]);		
	var	validLianZiInfo = ret.validLianZiInfo || {sameCount : 0},
		oneArrayInLianPai = ret.oneArray,
		duiInfoInLianPai = ret.duiInfo,
		threeInfoInLianPai = ret.threeInfo;
		
	var danZhangArray = this.combineDanPaiInfo(oneArrayOrigin, oneArrayInLianPai),
		danDuiArray = this.combineDanPaiInfo(duiInfoOrigin.danPaiArray, duiInfoInLianPai.danPaiArray),
		sanZhangArray = this.combineDanPaiInfo(threeInfoOrigin.danPaiArray, threeInfoInLianPai.danPaiArray);
	
	
	var duiLianPaiArray = duiInfoInLianPai.lianPaiArray || [];
	for(var i = 0 , size = duiLianPaiArray.length; i < size; i ++){
		this.placeLianPai2LianInfoArray(duiLianInfoArray, duiLianPaiArray[i], 2);
	}
	
	var feiJiPaiArray = threeInfoInLianPai.lianPaiArray || [];
	for(var i = 0 , size = feiJiPaiArray.length; i < size; i ++){
		this.placeLianPai2LianInfoArray(feiJiInfoArray, feiJiPaiArray[i], 3);
	}	
		switch(validLianZiInfo.sameCount){
			case 1:
				danLianInfoArray.push(validLianZiInfo);break;
			case 2:
				duiLianInfoArray.push(validLianZiInfo);break;
			case 3:		
				feiJiInfoArray.push(validLianZiInfo);break;
		}
	
	
	return {
		danZhangArray:danZhangArray,
		danDuiArray:danDuiArray,
		sanZhangArray:sanZhangArray,
		
		danLianInfoArray : danLianInfoArray,
		duiLianInfoArray:duiLianInfoArray,
		feiJiInfoArray: feiJiInfoArray,				
			
		bombArray : data.aloneBomb,		
	}
}
/*

*/
Player.prototype.combineDanPaiInfo = function(danPaiArray1, danPaiArray2){
	var danPaiArray1 = danPaiArray1 || [], danPaiArray2 = danPaiArray2 || [];
	var size = danPaiArray1.length,	danPaiArray = [];
	for(var p = 0; p < size; p++){
		danPaiArray.push(danPaiArray1[p]);
	}
	size = danPaiArray2.length;
	for(var p = 0; p < size; p++){
		danPaiArray.push(danPaiArray2[p]);	
	}
	return danPaiArray;
}

Player.prototype.combineLianPaiInfo = function(lianPaiArray1, lianPaiArray1){
	var lianPaiArray1 = lianPaiArray1 || [], lianPaiArray2 = lianPaiArray2 ||[];
	
	var validLianPaiInfoArray = [] ,curLianPai =  lianPaiArray1[0];
	if(curLianPai){
		validLianPaiInfoArray.push(new ValidLianPaiInfo(curLianPai.cardSeq, lianPaiArray1.length));
	}
	curLianPai =  lianPaiArray2[0];
	if(curLianPai){
		validLianPaiInfoArray.push(new ValidLianPaiInfo(curLianPai.cardSeq, lianPaiArray2.length));
	}
		
	return validLianPaiInfoArray;
}

Player.prototype.doChaiPai = function(){
	var data = this.findAlonePaiBaseOnCardArray() || {},
		lianPaiInfoArray = data.lianPaiInfoArray;
	this.chaiPaiStack.length = 0;
	this.chaiPaiResultStack.length = 0;
	this.chaiPaiStack.push(data);
	for(var i = 0, size = lianPaiInfoArray.length; i < size; i++){
		this.doChaiLianPai(lianPaiInfoArray[i]);
	}
}

Player.prototype.doChaiPaiBasedOnSortedPaiInfoArray = function(paiInfoArray){
	var data = this.findAlonePaiBasedOnSortedPaiInfoArray(paiInfoArray) || {},
		lianPaiInfoArray = data.lianPaiInfoArray;
	this.chaiPaiStack.push(data);
	for(var i = 0, size = lianPaiInfoArray.length; i < size; i++){
		this.doChaiLianPai(lianPaiInfoArray[i]);
	}
}

/*
从大牌开始拆连牌
*/

Player.prototype.doChaiLianPai = function(lianPaiInfo){	
	var lianPaiInfo = lianPaiInfo || {}, lianPai = lianPaiInfo.lianPai || [],
		size = lianPai.length,
		curPaiInfo = null,arrayToUse = null,
		duizi = [], sanzhang =[], zhadan = [];
	if(size == 0) return;	
	
	var maxCount = size -5, paiSelected, selectedLength = 0,
		maxSelectedSeq, minSelectedSeq,
		minLianPaiSeq = lianPai[lianPai.length -1].cardSeq,
		maxLianPaiSeq = lianPai[0].cardSeq;
	for(var  j = 0; j <= maxCount; j++){
		paiSelected = this.selectSomePai4ChaiPai(lianPai, j);
		selectedLength = paiSelected.length;
		if(selectedLength >0){
			minSelectedSeq = (paiSelected[selectedLength - 1].cardSeq);
			maxSelectedSeq = (paiSelected[0].cardSeq);
			if(maxSelectedSeq > minLianPaiSeq + 4  || minSelectedSeq > maxLianPaiSeq -4){
				var curLianPai, curPaiInfoSelected, start = 0;
				for(var q = 0; q < selectedLength; q++){
					for(var p = start; p < size; p++){
						curLianPai = lianPai[p];
						curPaiInfoSelected = paiSelected[q];
						if(curLianPai.cardSeq == curPaiInfoSelected.cardSeq){
							start = p + 1;
							curLianPai.remainCards4ChaiPai = 0;
							break;
						}
					}
				}				
				
				this.doChaiPaiBasedOnSortedPaiInfoArray(lianPai);
				var top = this.chaiPaiStack[this.chaiPaiStack.length -1];
				if(top.lianPaiInfoArray.length != 0){
					// CommonUtil.print('拆拍Ok');
					// console.log(this.chaiPaiStack);
				}
				else{
					// CommonUtil.print('拆拍error');
					this.chaiPaiStack.pop();
					// console.log(paiSelected);
					break;
				}
				/*
				var paiInfoAfterChaiPai = this.findAlonePaiBasedOnSortedPaiInfoArray(lianPai);
				if(paiInfoAfterChaiPai.lianPaiInfoArray.length != 0)
					CommonUtil.print('拆拍Ok');
				else{
					CommonUtil.print('拆拍error');
					//发生一次错误后就不用继续拆牌了
					break;
					}
					
				this.computeWeight4ChaiPai(paiInfoAfterChaiPai);	
				
				//恢复lianPai中的remainCards4ChaiPai字段				
				for(var q = 0; q < selectedLength; q++){
					paiSelected[q].remainCards4ChaiPai = curPaiInfoSelected.array[0].cardSeq;
				}
				*/
				
				
			}else{
				// CommonUtil.print('拆拍error');
				// console.log(paiSelected);
			}
		}else{
			
		}
	}
	
	this.extractChaiPaiResult();
		
}

/*
从chaiPaiStack中提取拆牌方案,现在先实现最简单的（直接从从chaiPaiStack[0]中提取）
*/
Player.prototype.extractChaiPaiResult = function(){
	var chaiPaiStack = this.chaiPaiStack || [], paiInfoAfterChaiPai = null;
	
	//for(var i = 0, size  = 1; i < size; i++){
		paiInfoAfterChaiPai = chaiPaiStack[0];
		var aloneBomb = paiInfoAfterChaiPai.aloneBomb,
		lianDuiArray = paiInfoAfterChaiPai.lianDuiArray[0] || [],
		lianPaiInfoArray = paiInfoAfterChaiPai.lianPaiInfoArray,
		oneArray = paiInfoAfterChaiPai.oneArray,
		twoArray = paiInfoAfterChaiPai.twoArray,
		threeArray = paiInfoAfterChaiPai.threeArray;	
		
		//只拆牌一次，故而每次清空this.chaiPaiResultStack
		this.chaiPaiResultStack.length = 0;
		var  length = lianPaiInfoArray.length, chupaiShouShu = 0;
		for(var t = 0; t < length; t++){			
			var ret = this.extractLianZiFromlianPaiInfoArray(lianPaiInfoArray[t]);
			
			for(var p = 0, q = oneArray.length; p < q; p++){
				ret.danPai.push(oneArray[p].cardSeq);
			}
			
			for(var p = 0, q = twoArray.length; p < q; p++){
				ret.danDui.push(twoArray[p].cardSeq);
			}
			
			for(var p = 0, q = threeArray.length; p < q; p++){
				ret.sanZhang.push(threeArray[p].cardSeq);
			}
			
			var lianDui = [];
			for(var p = 0, q = lianDuiArray.length; p < q; p++){
				lianDui.push(lianDuiArray[p].cardSeq);
			}
			if(lianDui.length != 0)
				ret.lianDuiArray.push(lianDui);
			
			this.chaiPaiResultStack.push(ret);
		}
		
		/*
		var innerPaiInfoAfterChaiPai = null;
		for(var j = i - 1; j >= 0; j--){
			innerPaiInfoAfterChaiPai = chaiPaiStack[j];
			
		}
		*/
	//}	
}


/*
从连牌中提取符合规则的连牌或者连对
*/
Player.prototype.extractLianZiFromlianPaiInfoArray = function(lianPaiInfo){
	lianPaiInfo = lianPaiInfo || {};
	var lianPai = lianPaiInfo.lianPai, minCards = lianPaiInfo.minCards, curPaiInfo, remainCards = 0;
	var oneArray = [], twoArray = [], threeArray = [], lianZi = [];//肯能是单连，也可能是连对,还有可能是飞机	
	
	for(var i = 0 , size = lianPai.length; i < size; i++){
		curPaiInfo = lianPai[i];
		remainCards = curPaiInfo.array.length - minCards;
		lianZi.push(curPaiInfo);
		switch(remainCards){			
			case 1:{
				oneArray.push(curPaiInfo);break;
			}
			case 2:{
				twoArray.push(curPaiInfo);break;
			}
			case 3:{
				threeArray.push(curPaiInfo);break;
			}
		}
	}
	
	var duiInfo = this.extractDuiInfoFromTwoArray(twoArray);
	
	var threeInfo = this.extractThreeInfoFromThreeArray(threeArray);	
	
	var startLianPai = lianZi[0], validLianZiInfo = [];
	if(startLianPai){
		validLianZiInfo = new ValidLianPaiInfo(lianZi, minCards);
	}
	
	
	return {
		oneArray:oneArray,
		duiInfo:duiInfo,
		threeInfo:threeInfo,
		validLianZiInfo:validLianZiInfo
	};	
}

/*
计算拆牌方案时的权重，最后会选择权重最大的一次拆牌方案为最佳
*/
Player.prototype.computeWeight4ChaiPai = function(paiInfoAfterChaiPai){
	
}

Player.prototype.selectSomePai4ChaiPai = function(lianPaiInfoArray, count){
	lianPaiInfoArray = lianPaiInfoArray || [];
	var paiSelected = [];
	for(var i = 0, size = lianPaiInfoArray.length; i < size; i++ ){
		curPaiInfo = lianPaiInfoArray[i];
		if(curPaiInfo.remainCards4ChaiPai > 1 && paiSelected.length < count){			
			paiSelected.push(curPaiInfo);
		}		
	}
	return paiSelected;
}

Player.prototype.findPaiCmpFunction = function(pai1, pai2){	
	if(pai1[0].cardSeq > pai2[0].cardSeq){
		return 1;
	}else{
		return -1;
	}	
}

Player.prototype.cardCmpFunction = function(card1, card2){
	if (card1.cardSeq > card2.cardSeq){
		return 1;
	}else if(card1.cardSeq == card2.cardSeq){
		if(card1.cardType > card2.cardType){
			return 1;
		}
	}else{
		return -1;
	}
}

Player.prototype.chupaiCmpFunction = function(pai1, pai2){
	if (pai1.length > pai2.length){
		return 1;
	}else if(pai1.length == pai2.length){
		if(pai1[0].cardSeq > pai2[0].cardSeq){
			return 1;
		}
	}else{
		return -1;
	}
}

Player.prototype.placeCards = function(type){
	var  shouPaiAreaWidth = this.shouPaiAreaObj.clientWidth,left = 0,
		xOffset = (shouPaiAreaWidth-this.cardWidth)/(this.shouPaiCount -1); //减100是因为每张卡片宽度为100	
	xOffset = (xOffset > 50 ? 50 : xOffset);
	var	tStr, htmls = [],template = "<div class='card_img {0}' index={1} style='position:absolute;left:{3}px'></div>";
		
	var curPlayer = this.cardArray;	
		
	for(var i = 0, j = curPlayer.length; i < j; i++){
		if(!curPlayer[i].dead){
			tStr = CommonUtil.format.call(template,curPlayer[i].className, i, top, left);
			htmls.push(tStr);
			left+= xOffset;	
		}		
	}
	var cardsHtml = htmls.join('');	
	if(this.isDiZhu){
		
	}
	this.shouPaiAreaObj.innerHTML = cardsHtml;
	
	
	this.mapImg2Card();	
}

Player.prototype.displayShouPaiAfterFaPai = function(){
	
}

Player.prototype.placeCardSelected = function(){
	var selectedCardArray = this.selectedCardArray || [];	
	var paopaoArea = this.chuPaiObj.paopaoArea;	
	if(  (size = selectedCardArray.length ) > 0){
		var tStr, htmls = [],template = "<div class='card_img {0}' index={1} style='position:absolute;left:{2}px'></div>";
		var  cardContainerWidth = this.cardContainerObj.clientWidth,left = 0,
		xOffset = (cardContainerWidth-this.cardWidth)/(size -1); //减100是因为每张卡片宽度为100	
		xOffset = (xOffset > 50 ? 50 : xOffset);
		
		for(var i = 0, j = selectedCardArray.length; i < j; i++){		
				tStr = CommonUtil.format.call(template,selectedCardArray[i].className, i, left);
				htmls.push(tStr);
				left+= xOffset;				
		}
		var cardsHtml = htmls.join('');	
		
		var paiType = ddz.chuPaiInfo.paiType;
		switch(paiType){			
			case 'siZhang':{
				ddz.ElemObj.siZhangEffectArea.style.display='block';
				ddz.showSiZhangEffect(ddz.bombEffectPositionXArray.concat());break;
			}
			case 'shuangWang':{
				ddz.showShuangWangEffect();break;
			}
			case 'feiJi':
			case 'feiJiDai1':
			case 'feiJiDai2':{
				ddz.showFeiJiEffect();break;
			}
			case 'lianPai':
			case 'lianDui':{
					paiWidth = left - xOffset + this.cardWidth;
					paiHeight = this.cardHeight;
					left = (paiWidth- 190)/2;//190文字顺子的宽度,参看.lianpai css.
					xtop = (paiHeight-92)/2;
					template = "<div class='{0}' style='left:{1}px;top:{2}px'></div>";
					tStr = CommonUtil.format.call(template,paiType, left,xtop);
					cardsHtml += tStr;
					break;
				}
		}
	
		this.cardContainerObj.innerHTML = cardsHtml;
		var shouPaiNumArea = this.shouPaiNumArea;
		shouPaiNumArea && (shouPaiNumArea.innerText = this.shouPaiCount);
	}else{		
		paopaoArea && (paopaoArea.style.display = 'block');
	}
	
	
	var clockArea = this.chuPaiObj.clockArea;
	clockArea && (clockArea.style.display = 'none');
	
	
	this.selectedCardArray.length = 0;
	
}


/*
cardType 指明牌的类型
cardSeq 指明某种牌型内的序号
*/	
var Card = function(index){
	if(index < 0 || index > 53){
		throw "非法序号的牌";
	}
	this.index = index;
	
	var divide = Math.floor(index / 13), remain = index % 13,  type = '', cardChar = '';
	switch(divide){
		case 0: 
			type='fangkuai';break;
		case 1: 
			type='meihua';break;
		case 2: 
			type='hongxin';break;
		case 3: 
			type='heitao';break;
		case 4:
			type = 'wang';break;
		default:
			type='unknow';
	}
	
	this.cardType = divide;
	
	if(divide === 4){
		switch(remain){
		case 0:
			cardChar = 'xiaowang';break;			
		case 1:
			cardChar = 'dawang';break;			
		default:
			throw '非法序号的牌';
		}
		//为了便于把王牌在最大
		remain += 16;
	}else{
		switch(remain){
			case 10: 
				cardChar = 'J';break;
			case 11: 
				cardChar = 'Q';break;
			case 12: 
				cardChar = 'K';break;
			case 0: 
				cardChar = 'A';remain = 13; break;
			case 1://2的牌
				cardChar = '2';remain = 15; break; 
			default:
				cardChar = remain + 1;
		}	
		
	}
	this.cardSeq = remain;
	if(type == 'wang'){
		this.cardSrc = cardChar + '.png';
		this.className = cardChar;	
	}else{
		this.cardSrc = type + '/' + cardChar + '.png';
		this.className = type + cardChar;	
	}	
}


var JIAO_DIZHU = 0, QIANG_DIZHU = 1, GIVE_UP = -1, FA_PAI = 0, CHU_PAI = 1;

var ddz = {	
	chuPaing:false,
	playerArray:[],
	dipai:[],
	diZhuIndex: -1,
	qiangDiZhuIndex: -1,
	fapaiIndex:0,
	qiangDiZhuStatus:JIAO_DIZHU,
	qiangDiZhuCount:0,
	negativeActionNum:0,
	bombEffectPositionXArray:['-40px','-592px','-1180px','-1744px','-2366px'],
	ElemObj:{
		mulEff:null
	},
	chuPaiInfo : {
		isOver : false
	}
	
};
/*
 定义一个拥有54个元素的一维数，依次赋值为1------53， 随机54次，每次随机出一个数字，和第i个位置的数字交换
*/
ddz.createRandomCards = function(){
	var d = [], ranPos, t;
	for(var i = 0; i < 54; i++){
		d.push(i);		
	}
	
	for(var i = 0; i < 54; i++){
		ranPos = Math.floor(Math.random() * 54);
		t = d[i];
		d[i] = d[ranPos];
		d[ranPos] = t;
	}
	this.cards = d;
	return d;	
}

ddz.assignCardsControl = function(){
	var cards = this.cards, fapaiIndex = this.fapaiIndex++,
		playerSelected = null;
	
	if(fapaiIndex < 51){
		curCard =  new Card(cards[fapaiIndex]);
		switch(fapaiIndex % 3){
			case 0:playerSelected = this.player1;break;
			case 1:playerSelected = this.player2;break;
			case 2:playerSelected = this.player3;break;
		}
		playerSelected.pushOneCard(curCard);
	}else{
	dipai = this.dipai;
	dipai.push(new Card(cards[51])), 
	dipai.push(new Card(cards[52])), 
	dipai.push(new Card(cards[53]));
	var dipaiDomArray = CommonUtil.$queryAll('#invisible_dipai_area .invisible_dipai');
	
	dipaiDomArray[0].className += ' invisible_dipai_left_animate';
	dipaiDomArray[2].className += ' invisible_dipai_right_animate';	
	
	
		
	
		setTimeout(function(){
			ddz.initQiangDiZhuEnv();
			ddz.qiangDiZhuControl()
		}, 1000);	
		
	
	}
}

ddz.initQiangDiZhuEnv = function(){

	
	
	this.qiangDiZhuIndex = Math.floor(Math.random() * 3);
	this.ElemObj.mulEff = CommonUtil.$id('mul_eff_div');
	this.ElemObj.totalMulEffArea = CommonUtil.$id('total_mul_value_container');
	this.ElemObj.visibleDiPaiArea = CommonUtil.$id('visible_dipai_area');
	this.ElemObj.invisibleDiPaiArea = CommonUtil.$id('invisible_dipai_area');
	
	this.ElemObj.siZhangEffectArea = CommonUtil.$id('sizhang_effect_area');
	this.ElemObj.shuangWangEffectArea = CommonUtil.$id('shuangwang_effect_area');
	this.ElemObj.feijiEffectArea = CommonUtil.$id('feiji_effect_area');
	
	this.player1.initSortedPaiInfoArray();
	this.player2.initSortedPaiInfoArray();
	this.player3.initSortedPaiInfoArray();
	
	this.player1.placeCards();
	this.player2.placeCards();
	this.player3.placeCards();
	
	this.player3.registeChupaiAction();	
	this.player3.registeQiangDiZhuAction();
}

ddz.initPlayers = function(){
	var player1 = new Player({					
					//chupaiId:'chupai',	
					cardArray:[],
					shouPaiAreaId:'player1_shoupai_area',
					cardContainerId:'player1_card_container',
					playerId:'player1',
					buChuContainerClass:'buchu_container',
					shouPaiNumClass:'role_shouPaiNum',
					index:0
				});	
	var player2 = new Player({						
					// chupaiId:'chupai',		
					cardArray:[],
					shouPaiAreaId:'player1_shoupai_area',
					cardContainerId:'player2_card_container',
					playerId:'player2',
					buChuContainerClass:'buchu_container',
					shouPaiNumClass:'role_shouPaiNum',					
					index:1					
				});	
	
	var player3 = new Player({					
					chupaiId:'chupai_btn',
					buchuId:'buchu_btn',
					chongxuanId:'chongxuan_btn',
					tishiId:'tishiId',
					AIPlayer:false,
					cardArray:[],	
					playerId:'player3',
					shouPaiAreaId:'player3_shoupai_area',
					cardContainerId:'player3_card_container',
					buChuContainerClass:'buchu_container',					
					index:2				
				});	
	
	this.player1 = player1, this.player2 = player2, this.player3 = player3;
	this.playerArray.push(player1);
	this.playerArray.push(player2);
	this.playerArray.push(player3);
}


ddz.prepareUIBeforeStartGame = function(){
	this.ElemObj.invisibleDiPaiArea.className ='fadeOut';
	this.showDiPai();
	var playerArray = this.playerArray || [];
	playerArray.forEach( function(player){
		player.qiangDiZhuObj.area.style.display ='none';
		player.chuPaiObj.area.style.display ='block';
		if(player === ddz.diZhu){
			player.chuPaiObj.clockArea.style.display ='block';
			player.clearSelectedCards();
			player.placeCards();
		}
		player.showMyFigure();
	});	
}

ddz.showDiPai = function(){
	var dipai = this.dipai, html = '';
	dipai.forEach(function(card){
		t = "<div class='card_img " + card.className + "'></div>";
		html += t;
	});
	
	this.ElemObj.visibleDiPaiArea.innerHTML = html;
	
	this.ElemObj.visibleDiPaiArea.className = 'fadeInUpBigWithScale';
	
}	

ddz.showSiZhangEffect = function(positionXArray){	
	var curPositionX = positionXArray.shift();
	var style = this.ElemObj.siZhangEffectArea.style;
	if(curPositionX){		
		style.backgroundPositionX = curPositionX;
		setTimeout(function(){
			ddz.showSiZhangEffect(positionXArray);
		}, 400)
	}else{
		style.display = 'none';
	}
}
ddz.showShuangWangEffect = function(){
this.ElemObj.shuangWangEffectArea.className = 'pai_effect_area';
	ddz.ElemObj.siZhangEffectArea.style.display='block';
	ddz.showSiZhangEffect(ddz.bombEffectPositionXArray.concat());
	
	
	setTimeout(function(){
		ddz.ElemObj.shuangWangEffectArea.className = 'pai_effect_area cancel_animate';
	}, 2000);
}

ddz.showFeiJiEffect = function(){
	this.ElemObj.feijiEffectArea.className = 'pai_effect_area';
	setTimeout(function(){
		ddz.ElemObj.feijiEffectArea.className = 'pai_effect_area cancel_animate';
	}, 2000);
}
ddz.showTotalMulValue = function(){
	var qiangDiZhuCount = this.qiangDiZhuCount,
		totalMulValue = 15, array =[];;
	
	while(qiangDiZhuCount--)
		totalMulValue += totalMulValue;
	
	while(totalMulValue > 0){
		remain = totalMulValue % 10;
		totalMulValue = Math.floor(totalMulValue / 10);
		array.push(remain);
	}
	var html = '';
	array.reverse().forEach(function(digit){
		t = "<div class='digital_img digital_" + digit + "'></div>";
		html += t;
	});
	
	this.ElemObj.totalMulEffArea.innerHTML = html;
	
}	

ddz.startGame = function(){
	//this.curIndex = this.diZhuIndex;	
	this.diZhu.assignDiPai();
	this.prepareUIBeforeStartGame();	
	this.chuPaing = true;
	
	ddz.player3.registeSelectCardAction();
	 //this.gameControl();	
}

ddz.initEnv = function(){
	this.initPlayers();	
	this.createRandomCards();
	this.assignCardsControl();
}

ddz.qiangDiZhuControl = function(){
	var diZhuIndex = this.diZhuIndex || -1,
		playerArray = this.playerArray || [],
		playerLength = playerArray.length, curIndex;	
		curIndex = (this.qiangDiZhuIndex++) % playerLength;
	if(ddz.diZhuIndex == -1){		
		playerArray[curIndex].startQiangDiZhuTimer();
	}else{
		//ddz.diZhu.qiangDiZhuSuccess();
	}
}

ddz.gameControl = function(){
	var notOver = !this.chuPaiInfo.isOver,	
		playerArray = this.playerArray || [],
		playerLength = playerArray.length, curIndex;	
		if(notOver){
			curIndex = ( this.diZhuIndex++) % playerLength;
			//nextIndex = (this.curIndex + 1) % playerLength;
			//ddz.nextPlayer = playerArray[nextIndex];
			// playerArray[curIndex].doChuPai();					
			playerArray[curIndex].startChuPaiTimer();
			
			//ddz.chuPaiInfo.isOver = true;
		}else{
			var player = this.chuPaiInfo.curChuPaiPlayer,
				resultObj = CommonUtil.$id('result');
				style = resultObj.style;				
			if(player.isDiZhu){		
				style.backgroundPositionY = '0px';
			}
			style.display = 'block';		
		}		
}
