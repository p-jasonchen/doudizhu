 
/**
 * 浏览器判断,如果是PC使用mouse机制
 */
var START_EV = NC.browser.hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = NC.browser.hasTouch ? 'touchmove' : 'mousemove',
    END_EV = NC.browser.hasTouch ? 'touchend' : 'mouseup';
/*	
var START_EV = 'touchstart',
    MOVE_EV = 'touchmove',
    END_EV = 'touchend' ;
*/	
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




var  ChuPaiInfo = function(paiType, player){
	this.paiType = paiType;
	this.player = player;
}


var Player = function(opt){
	opt = opt || {};
	this.score = opt.score || 0;
	this.listenerMap = [];
	this.AIPlayer = ( typeof opt.AIPlayer  == 'undefined' ? true : opt.AIPlayer);	
	this.index = opt.index;
	this.cardArray = opt.cardArray;	
	this.shouPaiCount = this.cardArray.length;	
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
	
	var negativeBtn = CommonUtil.$query('#negative_btn', area);	
	var positiveBtn = CommonUtil.$query('#positive_btn', area);
	
	var showLevelArea = CommonUtil.$query('.player_name', area);
	
	var title = Level.getLevel(this.score).title;
	showLevelArea.innerHTML = title;
	
	
	htmlObj.area = area;
	htmlObj.timeRemain = timeRemain;
	htmlObj.clockArea = clockArea;
	htmlObj.paopaoArea = paopaoArea;
	htmlObj.textArea = textArea;
	htmlObj.positiveActionTextArea = positiveActionTextArea;
	htmlObj.negativeactionTextArea = negativeactionTextArea;
	htmlObj.negativeBtn = negativeBtn;
	htmlObj.positiveBtn = positiveBtn;
	htmlObj.showLevelArea = showLevelArea;
	
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
	var tiShiBtn = CommonUtil.$id('tishi_btn');
	var buChuBtn = CommonUtil.$id('buchu_btn');
	
	var showLevelArea = CommonUtil.$query('.player_name', area);
	var title = Level.getLevel(this.score).title;
	console.log(this.score);
	showLevelArea.innerHTML = title;
	
	htmlObj.area = area;
	htmlObj.timeRemain = timeRemain;
	htmlObj.clockArea = clockArea;
	htmlObj.paopaoArea = paopaoArea;
	htmlObj.textArea = textArea;
	htmlObj.chuPaiBtn = chuPaiBtn;
	htmlObj.chongXuanBtn = chongXuanBtn;
	htmlObj.tiShiBtn = tiShiBtn;
	htmlObj.buChuBtn = buChuBtn;	
	htmlObj.showLevelArea = showLevelArea;
	
	if(!this.AIPlayer){
		htmlObj.tipArea = CommonUtil.$id('player3_tip_area');
	}
	
	
	this.chuPaiObj = htmlObj;
}

Player.prototype.showQiangDiZhuArea = function(show){
	var show  = show ? 'block' : 'none', 
		obj = this.qiangDiZhuObj;
	obj.area.style.display = show;
	show = 'none';
	
	obj.clockArea.style.display= show;
	obj.paopaoArea.style.display= show;		
	
	obj.timer && obj.timer.stop();
	
}

Player.prototype.showChuPaiArea = function(show){
	var show = show ? 'block' : 'none';	
		obj = this.chuPaiObj;
	obj.area.style.display = show;
	show = 'none';
	
	obj.clockArea.style.display= show;
	obj.paopaoArea.style.display= show;
	
	
	this.shouPaiAreaObj.innerHTML = '';
	this.cardContainerObj.innerHTML = '';
	obj.timer && obj.timer.stop();
	
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
	
	
	avatarObj =  CommonUtil.$class('role_avatar', playerAreaObj)[0];
	bodyObj =  CommonUtil.$class('role_body', playerAreaObj)[0];
	var avatarX = '-117px', avatarY = '-381px';
	var bodyX = '-8px', bodyY = '-264px';	
		
	if(this.isDiZhu){
		avatarX = '-120px', avatarY = '-262px';
		bodyX = '-8px', bodyY = '-176px';
	}
	avatarObj.style.backgroundPositionX = avatarX;
	avatarObj.style.backgroundPositionY = avatarY;
	bodyObj.style.backgroundPositionX = bodyX;
	bodyObj.style.backgroundPositionY = bodyY;
	if(this.shouPaiNumClass){
		this.shouPaiNumArea = CommonUtil.$class(this.shouPaiNumClass, playerAreaObj)[0];
		this.shouPaiNumArea.innerText = this.shouPaiCount;
	}
	
}

Player.prototype.assignDiPai = function(){
	var diPai = ddz.dipai;
	AI.sort1(diPai);	
	this.cardArray = this.cardArray.concat(diPai);
	AI.sort1(this.cardArray);
	this.shouPaiCount  = this.cardArray.length;
}

Player.prototype.autoSelectReleativeCard = function(cardImg){
	var selectedCards= this.getSelectedCards();
	//排除三带牌的 带牌 时的选牌行为
	if(selectedCards.length > 0) return;
	var chuPaiInfo = ddz.chuPaiInfo,
		strongPlayer = chuPaiInfo.strongPlayer, 
		cardSelected = cardImg.mapCard,
		selectStatus = !cardImg.selected;	
	var autoSelectedCards;
	if(strongPlayer != this){
		if(cardSelected.cardSeq > chuPaiInfo.cardArray[0].cardSeq){
			var selectedPos = this.cardArray.indexOf(cardSelected);
			if(chuPaiInfo.paiType == GroupType.对子 || chuPaiInfo.paiType == GroupType.三张 
				||chuPaiInfo.paiType == GroupType.三带一 || chuPaiInfo.paiType == GroupType.三带二){
				var firstPos = 0, size =  this.cardArray.length
				for(; firstPos < size; firstPos++ ){
					if(this.cardArray[firstPos].cardSeq == cardSelected.cardSeq){
						break;
					}
				}				
				var diff = selectedPos- firstPos, yOffset = selectStatus ?  -ddz.selectOffset : ddz.selectOffset;
				if(chuPaiInfo.paiType == GroupType.对子){					
						var otherCard = (diff == 0 ? this.cardArray[selectedPos + 1] : this.cardArray[selectedPos-1]);
						if(otherCard.cardSeq == cardSelected.cardSeq){
							otherCard.mapImg.selected = selectStatus;
							var s = otherCard.mapImg.style;
							s.top = parseFloat(s.top || 0) + yOffset + 'px';
							autoSelectedCards = [otherCard];
						}						
				}else{					
					var otherCard1, otherCard2;
					if(diff == 0){
						otherCard1 = this.cardArray[selectedPos+1];
						otherCard2 = this.cardArray[selectedPos+2];
					}else if(diff == 1){
						otherCard1 = this.cardArray[selectedPos-1];
						otherCard2 = this.cardArray[selectedPos+1];
					}else{
						otherCard1 = this.cardArray[selectedPos-1];
						otherCard2 = this.cardArray[selectedPos-2];
					}
					if(otherCard1.cardSeq == cardSelected.cardSeq &&
						otherCard2.cardSeq == cardSelected.cardSeq){
						otherCard1.mapImg.selected = selectStatus;
						otherCard2.mapImg.selected = selectStatus;
						var s = otherCard1.mapImg.style;
						s.top = parseFloat(s.top || 0) + yOffset + 'px';
						var s = otherCard2.mapImg.style;
						s.top = parseFloat(s.top || 0) + yOffset + 'px';
						autoSelectedCards = [otherCard1, otherCard2];
					}
					
				}				
			}
		}
	}
	return autoSelectedCards;
}
Player.prototype.mapImg2Card = function(){
	var cardImgs = CommonUtil.$class('card_img', this.shouPaiAreaObj), curCard;	
		that  = this;
	for(var i = 0, j = cardImgs.length; i < j; i++){				
		curCard = cardImgs[i];		
		curCard.mapCard = this.cardArray[parseInt(curCard.getAttribute('index'))];
		curCard.mapCard.mapImg = curCard;	
	
	}
}

Player.prototype.registeSelectCardAction = function(){		

	if(!this.AIPlayer){
		var that = this, listener;	
		listener = function(evt){		
			evt.preventDefault();
			evt.stopPropagation();
			console.log(START_EV);
			var e = evt;
			 var event = evt.touches ? evt.touches[0] : evt;			
				that.touchstartCrood.x = event.clientX ;
				that.touchstartCrood.y = event.clientY;
				that.touchSelectedCardImgs = [];
				that.touching  = true;			
			that.autoSelectStartTarget = evt.target;
		}
		this.registeListener(this.shouPaiAreaObj, listener, START_EV);	
		
		listener = function(evt){	
			evt.preventDefault();
			evt.stopPropagation();
			if(!that.touching) return;
			var touchSelectedCardImgs = that.touchSelectedCardImgs;
			console.log(MOVE_EV);
			var event = evt.changedTouches ? evt.changedTouches[0] : evt;
			var touchendX = event.clientX, touchendY = event.clientY;
			
			//console.log(touchendX);
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
				cardOffset *= ddz.scale;
				//console.log('cardOffset:' + cardOffset);	
				for(var i = 0, j = curCardImgs.length; i < j; i++){
					curImg = curCardImgs[i];			 
					
					var s = curImg.style, rect = curImg.getBoundingClientRect(),
						curImgLeft = rect.left * ddz.scale;
					if(curImgLeft + cardOffset >= startLeft && curImgLeft  <= endLeft){					
						s.webkitBoxShadow='0 0 0 100px rgba(0, 0, 0, 0.31)inset';
						if(touchSelectedCardImgs.indexOf(curImg) == -1){
							touchSelectedCardImgs.push(curImg);
						}
					}else{
						s.webkitBoxShadow='';
						if(touchSelectedCardImgs.indexOf(curImg) != -1){
							touchSelectedCardImgs.pop();
						}
					}					
					
				}	
			}				

		}
		this.registeListener(this.shouPaiAreaObj, listener, MOVE_EV);	
		
		
		listener = function(evt){		
			evt.preventDefault();
			evt.stopPropagation();		
		
			console.log(END_EV);
			var touchSelectedCardImgs = that.touchSelectedCardImgs, selectOffset = ddz.selectOffset;
			var curImg = evt.target;
			if(touchSelectedCardImgs.indexOf(curImg) == -1 && curImg != that.shouPaiAreaObj){			
				touchSelectedCardImgs.push(curImg);
			}			
			
			var autoSelectedCards = [];
			if(curImg === that.autoSelectStartTarget){
				autoSelectedCards = (that.autoSelectReleativeCard(curImg) || autoSelectedCards);				
			}
			
			for(var i = 0, j = touchSelectedCardImgs.length; i < j; i++){
				curImg = touchSelectedCardImgs[i];	
				var s = curImg.style,top;				
					s.webkitBoxShadow = '';				
				if(autoSelectedCards.indexOf(curImg.mapCard) != -1) {					
					continue;
				}
					
					if(curImg.selected){					
						top = parseFloat(s.top || 0) + selectOffset + 'px';
						curImg.selected = false;
					}else{				
						curImg.selected = true;
						top = parseFloat(s.top || 0) - selectOffset + 'px';
					}
						s.top = top;
			}	

			that.touching = false;			
			that.updateChuPaiActionUI();
		};
	this.registeListener(this.shouPaiAreaObj, listener, END_EV);	
	
	}
	
	
}

Player.prototype.unregisteListeners = function(){
	var listenerMap = this.listenerMap;
	listenerMap.forEach(function(item){
		var elem = item.elem, l = item.listener, type = item.type;
		elem.removeEventListener(type,l);
	})
}

Player.prototype.registeListener = function(elem, listener, type){	
	type = type || 'click';
	elem.addEventListener(type, listener);
	this.listenerMap.push({
		elem:elem,
		type:type,
		listener:listener
	});
}
Player.prototype.registeChupaiAction = function(){
	var that = this, listener;
	
	var chuPaiBtn = this.chuPaiObj.chuPaiBtn;
	if(chuPaiBtn){
		listener = function(){
			if(!that.chuPaiObj.chuPaiBtn.disabled)
				that.nonAIChuPai();
		}
		this.registeListener(chuPaiBtn, listener);
		
	}
	
	var buChuBtn = this.chuPaiObj.buChuBtn;
	if(buChuBtn){
		listener = function(){
			if(!that.chuPaiObj.buChuBtn.disabled)
				that.buChuPai();	
		}
		this.registeListener(buChuBtn, listener);		
	}
	
	var chongXuanBtn = this.chuPaiObj.chongXuanBtn;
	if(chongXuanBtn){
		listener = function(){
			if(!that.chuPaiObj.chongXuanBtn.disabled)
				that.doChongXuan();		
		}
		this.registeListener(chongXuanBtn, listener);
		
	}
	
	var tiShiBtn = this.chuPaiObj.tiShiBtn;
	if(tiShiBtn){
		listener = function(){
			if(!that.chuPaiObj.tiShiBtn.disabled)
				that.doTiShi();	
		}
		this.registeListener(tiShiBtn, listener);
		
	}
}
	

Player.prototype.registeQiangDiZhuAction = function(){
	var that = this,listener;	
		
	var negativeBtn = this.qiangDiZhuObj.negativeBtn;
	if(negativeBtn){
		listener = function(){
			var className = 'text bujiao';
			if(ddz.qiangDiZhuStatus == JIAO_DIZHU){
					className = 'text bujiao';				
			}else{
				className = 'text buqiang';			
			}
			that.qiangDiZhuObj.textArea.className = className;				
			that.buQiangDiZhu();
		}
		this.registeListener(negativeBtn, listener);
	}
	
	var positiveBtn = this.qiangDiZhuObj.positiveBtn;
	if(positiveBtn){
		listener = function(){
			that.doAIQiangDiZhu();
		}
		this.registeListener(positiveBtn, listener);
	}	
	
}


Player.prototype.doTiShi = function(){	
	var pokers = this.tiShiPokers || [];	
	var length  =  pokers.length;
	if(length > 0){		
		this.placeCards();
		this.setCards2SelectedStatus(pokers[this.tiShiIndex++ % length], true);
		this.updateChuPaiActionUI();
	}else{
		this.skipPlay();		
		var timer = this.chuPaiObj.timer;
		timer && timer.stop();		
		setTimeout( function(){ddz.gameControl()}, 0);
	}	
}

Player.prototype.setCards2SelectedStatus = function(cards, selected){	
	if(cards){
		if( ! (cards instanceof Array) ) cards = [cards];
		for(var i = cards.length -1; i >=0; i-- ){
				curImg = cards[i].mapImg;
				
				var s = curImg.style, top = '';
				if(curImg.selected != selected){
					if(selected){
						top = parseFloat(s.top || 0) - ddz.selectOffset + 'px';
					}else{
						top = parseFloat(s.top || 0) + ddz.selectOffset + 'px';
					}
					s.top = top;
					curImg.selected = selected;
				}
		}
	}
}
Player.prototype.nonAIChuPai = function(){
	var selectCards = this.getSelectedCards() || [];
	this.selectedCardArray = selectCards;
	if(selectCards.length == 0)return;	
	
	var	chuPaiInfo = ddz.chuPaiInfo;
	var strongPlayer = chuPaiInfo.strongPlayer, ok = false;
	var type = Rule.getType(selectCards);
	if(type){
		if(strongPlayer == this){
			ok = true;
		}else{		
			if(type == GroupType.双王 || type == GroupType.炸弹){
				ok = true;
			}else if(chuPaiInfo.paiType == type && chuPaiInfo.cardArray[0].cardSeq < selectCards[0].cardSeq){
				ok = true;
			}
		}
	}
	
		
	if(ok){
		chuPaiInfo.paiType = type;
		this.selectCards(selectCards);	
		var timer = this.chuPaiObj.timer;
		timer && timer.stop();	
			
		ddz.chuPaiInfo.isOver  = (this.cardArray.length == 0);
		setTimeout( function(){ddz.gameControl()}, 0);		
	}else{
		var className = 'paitype_error';
		if(type){
			//牌型不对
			if(chuPaiInfo.paiType != type){
				className = 'paitype_error';
			}else if(chuPaiInfo.cardArray[0].cardSeq >= selectCards[0].cardSeq){
				className = 'bugouda_after_action';
			}
			
		}else{
			//牌型不对
			className = 'paitype_error';
		}
		this.showActionTip(className);
		this.doChongXuan();
	}
	
}

Player.prototype.showActionTip = function(className){
	var that = this;
	if(!this.AIPlayer){
		tipArea = this.chuPaiObj.tipArea;
		tipArea.style.display='block';
		tipArea.className = className;
		setTimeout(function(){
			tipArea = that.chuPaiObj.tipArea;
			tipArea.className='cancel_animate';
			tipArea.style.display='none';
		},3000)
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
	
	this.selectedCardArray.length = 0;
}



Player.prototype.doChongXuan = function(){	
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
			if(rand == 2 && ddz.qiangDiZhuCount < 5){
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
	
	ddz.chuPaiInfo.isOver = (this.cardArray.length == 0);
	// this.selectedCardArray.length = 0;
	/*
	var clockArea = this.clockAreaObj, that = this;
	clockArea && (clockArea.style.display = 'none');
	*/
	
	var timer = this.chuPaiObj.timer;
		timer && timer.stop();
	setTimeout( function(){ddz.gameControl()}, 0);
}




Player.prototype.positiveChuPai = function(){
	var cards = this.positiveSelectCards();
	this.selectCards(cards);
}

Player.prototype.positiveSelectCards = function(){

	var lastPlayer = this.index == 0 ? ddz.playerArray[2]
			: this.index == 1 ? ddz.playerArray[0] : ddz.playerArray[1];
	var nextPlayer = this.index == 0 ? ddz.playerArray[1]
			: this.index == 1 ? ddz.playerArray[2] : ddz.playerArray[0];
	var againstPlayer =  !this.isDiZhu ? ddz.diZhu
			: lastPlayer.cardArray.length < nextPlayer.cardArray.length ? lastPlayer
					: nextPlayer;
					
	var bestPokers = AI.findBestCards(this, null, null, true), bestPokers2;
		if (bestPokers.length != this.cardArray.length) {
			AI.analyzePlayerCards(againstPlayer);
			var leftPokers = AI.filterPokers(this.cardArray, bestPokers);
			if (Rule.getType(leftPokers)
					&& leftPokers[0].cardSeq >= againstPlayer.cardArray[0].cardSeq) {
				//当玩家只剩下2手牌的时候，如果对手最大的牌都大不过则出最大的��?
				bestPokers2 = leftPokers;
			} else {
				//当对手的牌少��?个的时候，则出其没有或者打不起的牌��?对子或三��?
				if (againstPlayer.cardArray.length <= 5) {
					var pairs2 = AI.findAllByType(againstPlayer, GroupType.对子);
					var pairs1 = AI.findAllByType(this, GroupType.对子,
							pairs2[0]);
					var triples2 = AI
							.findAllByType(againstPlayer, GroupType.三张);
					var triples1 = AI.findAllByType(this, GroupType.三张,
							triples2[0]);
					if (triples1.length > 0) {
						var triple = triples1[triples1.length - 1];
						bestPokers2 = AI.findPlusPoker(this, triple, 2, true);
						if (!bestPokers2
								|| bestPokers2[bestPokers2.length - 1].cardSeq >= 14)
							bestPokers2 = AI.findPlusPoker(this, triple, 1,
									false);
						if (!bestPokers2
								|| bestPokers2[bestPokers2.length - 1].cardSeq >= 15)
							bestPokers2 = triple;
					} else if (pairs1.length > 0) {
						bestPokers2 = pairs1[pairs1.length - 1];
					}
				}

				//freePlayer标记一个正在自由出��?againstPlayer无法打过)的电��?
				if (bestPokers2)
					ddz.freePlayer = this;

				//当对手只剩下1��?张牌且无对子或三张可出，则从最大的单张开始出
				if (!bestPokers2
						&& (againstPlayer.cardArray.length == 1 || againstPlayer.cardArray.length == 1)) {
					var singles = AI.findAllByType(this, GroupType.单张);
					if (singles.length > 0)
						bestPokers2 = singles[0];
				}
			}
		}

		var cardArray = bestPokers2 || bestPokers;
		return cardArray;
			
}

Player.prototype.negativeChuPai = function(){
	var cards = this.negativeSelectCards();
	if(cards){
		this.selectCards(cards);
	}else{
		this.skipPlay();
	}

}
Player.prototype.negativeSelectCards  = function(){

	var lastPlayer = this.index == 0 ? ddz.playerArray[2]
			: this.index == 1 ? ddz.playerArray[0] : ddz.playerArray[1];
	var nextPlayer = this.index == 0 ? ddz.playerArray[1]
			: this.index == 1 ? ddz.playerArray[2] : ddz.playerArray[0];
	var againstPlayer =  !this.isDiZhu ? ddz.diZhu
			: lastPlayer.cardArray.length < nextPlayer.cardArray.length ? lastPlayer
					: nextPlayer;
					
	var chuPaiInfo = ddz.chuPaiInfo, chuPaiArray = chuPaiInfo.cardArray, chuPaiType = chuPaiInfo.paiType;
	var selectedPokers = AI.findBestCards(this, chuPaiType,
				chuPaiArray, true);
		
		if (selectedPokers && selectedPokers.length < this.cardArray.length) {
			//如果上次出牌的是同盟玩家，则考虑是否要出��?
			if (!this.isDiZhu && ddz.chuPaiInfo.strongPlayer != ddz.diZhu) {
				//如果上家没有压同盟玩家的牌且同盟玩家为自由出牌者，则放弃出牌让其获得牌��?
				if (nextPlayer == chuPaiInfo.strongPlayer
						&& nextPlayer == ddz.freePlayer) {
					//this.skipPlay();
					return;
				}

				//如果下家除开炸弹外没有能大起上家的牌，则放弃出牌				
				var nextPokers = AI.findBestCards(this, chuPaiType,	chuPaiArray, false);
				if ((!nextPokers || nextPokers.length == 0) && AI.hasChance(95)) {
					//this.skipPlay();
					return;
				}

				//如果同盟玩家的牌大于A，则不出��?			
				var sorted = AI.sort1(selectedPokers);
				if ((chuPaiArray.cardSeq >= 15 || sorted[0].cardSeq >= 16)
						&& (this.cardArray.length - sorted.length > 4)
						&& AI.hasChance(80)) {
					//this.skipPlay();
					return;
				}

				//如果出了点数大于A的牌(非单��?后还比同盟玩家牌多，则放弃出��?
				if (sorted.length > 1
						&& sorted[0].cardSeq >= 14
						&& this.cardArray.length - sorted.length > ddz.chuPaiInfo.strongPlayer.cardArray.length
						&& AI.hasChance(80)) {
					//this.skipPlay();
					return;
				}

				//三张2在对家所剩牌数还比较多的时候不��?
				if (sorted.length >= 3 && sorted[0].cardSeq == 15
						&& sorted[1].cardSeq == 15 && sorted[2].cardSeq == 15
						&& againstPlayer.cardArray.length > 5) {
					//this.skipPlay();
					return;
				}
			}

			//在对家还��?张牌以上时，如果剩余牌数大于一定数目的时候，不出炸弹或双��?
			var type = Rule.getType(selectedPokers);
			if (type == GroupType.炸弹 || type == GroupType.双王) {
				//如果是单张且只有双王，则拆开出小��?
				if (chuPaiType == GroupType.单张 && type == GroupType.双王
						&& this.bomb.length == 0
						&& againstPlayer.cardArray.length < 10) {
					selectedPokers = selectedPokers[1];
				} else if (againstPlayer.cardArray.length > 5) {
					if (this.cardArray.length - selectedPokers.length > 8
							&& AI.hasChance(90)) {
						this.skipPlay();
						return;
					} else if (this.cardArray.length - selectedPokers.length > 5
							&& AI.hasChance(60)) {
						//this.skipPlay();
						return;
					}
				}
			}

			//当对手只剩下1��?张牌时，则从最大的开始出
			if (againstPlayer.cardArray.length == 1
					&& chuPaiType == GroupType.单张) {
				var singles = AI.findAllByType(this, GroupType.单张,
						chuPaiArray, false);
				if (singles.length > 0)
					selectedPokers = singles[0];
			} else if (againstPlayer.cardArray.length == 2
					&& chuPaiType == GroupType.对子
					&& Rule.getType(againstPlayer.cardArray) == GroupType.对子) {

				var pairs = AI.findAllByType(this, GroupType.对子,
						chuPaiArray, false);
				if (pairs.length > 0)
					selectedPokers = pairs[0];
			}

			//准备出牌
			//Poker.select(selectedPokers, true);
			//this.selectCards(selectedPokers);
			//return selectedPokers;		
		} 
		return selectedPokers;
}

Player.prototype.skipPlay = function(){
	this.selectedCardArray.length = 0;
	this.placeCardSelected();
	this.placeCards();
}

Player.prototype.selectCards = function(cards){	
	if( ! (cards instanceof Array) ) cards = [cards];
	this.selectedCardArray = [].concat(cards);
	this.cardArray = AI.filterPokers(this.cardArray, cards);
	this.shouPaiCount = this.cardArray.length;
	
	var type = Rule.getType(cards);
	var len = cards.length;
	if (type == null || len == 0)
		return;
	
	ddz.chuPaiInfo.cardArray = [].concat(cards);
	ddz.chuPaiInfo.strongPlayer = this;
	ddz.chuPaiInfo.paiType = type;
	
	this.placeCardSelected();
	this.placeCards();
}


Player.prototype.buChuPai = function(){
	var chuPaiInfo = ddz.chuPaiInfo;
	
	
	if(!chuPaiInfo.paiType || chuPaiInfo.strongPlayer === this){
		this.forceChuPaiWhenTimeout();
	}else{
		this.clearSelectedCards();
		var timer = this.chuPaiObj.timer;
		timer && timer.stop();			
		this.skipPlay();
		setTimeout( function(){ddz.gameControl()}, 0);
	}
}

Player.prototype.forceChuPaiWhenTimeout = function(){
	this.clearSelectedCards();
	this.doChuPai();
	
}
Player.prototype.updateChuPaiActionUI = function(){	
	var selectedCards = this.getSelectedCards();	
	var className, chuPaiInfo = ddz.chuPaiInfo, disabled = (chuPaiInfo.strongPlayer == this);
	
	this.chuPaiObj.buChuBtn.disabled = disabled;
	this.chuPaiObj.tiShiBtn.disabled = disabled;		
	this.chuPaiObj.buChuBtn.className = disabled ? 'action_btn gray_btn' : 'action_btn green_btn';
	this.chuPaiObj.tiShiBtn.className = disabled ? 'action_btn gray_btn' : 'action_btn red_btn';
	
	
	disabled = (selectedCards.length == 0)
	this.chuPaiObj.chuPaiBtn.disabled = disabled;
	this.chuPaiObj.chongXuanBtn.disabled = disabled;
	className = disabled ? 'action_btn gray_btn' : 'action_btn red_btn';
	this.chuPaiObj.chuPaiBtn.className = className;	
	this.chuPaiObj.chongXuanBtn.className = className;	
	
}

Player.prototype.showBeforeChuPaiUI = function(){
	var htmlObj = this.chuPaiObj;
	var clockArea = htmlObj.clockArea;
	clockArea && (clockArea.style.display = 'block');		
	this.cardContainerObj.innerHTML = '';	
	var paopaoArea = htmlObj.paopaoArea;	
	paopaoArea && (paopaoArea.style.display = 'none');		
	if(!this.AIPlayer){
		this.updateChuPaiActionUI();
	}
}

Player.prototype.showBeforeQiangDiZhuUI = function(){
	if(!this.AIPlayer){
		if(ddz.qiangDiZhuStatus == QIANG_DIZHU){
			this.qiangDiZhuObj.positiveActionTextArea.className = 'text_3char qiang_dizhu';
			
			this.qiangDiZhuObj.negativeactionTextArea.className = 'text_2char buqiang';
		}else{
			this.qiangDiZhuObj.positiveActionTextArea.className = 'text_3char jiao_dizhu';
			
			this.qiangDiZhuObj.negativeactionTextArea.className = 'text_2char bujiao';
		}
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
		setTimeout(function(){that.doQiangDiZhu()}, 2000);		
	}else{
	}	
}
Player.prototype.startChuPaiTimer = function(){
	if(!this.AIPlayer){
		var chuPaiInfo = ddz.chuPaiInfo;
		var strongPlayer = chuPaiInfo.strongPlayer;
		if(strongPlayer != this){
			AI.analyzePlayerCards(this);
			var chuPaiArray = chuPaiInfo.cardArray, 
			chuPaiType = chuPaiInfo.paiType,
			pokers = AI.findAllByType(ddz.player3, chuPaiType,
				chuPaiArray, true) || [];			
			this.tiShiPokers = pokers.reverse();
			this.tiShiIndex = 0;
			if(pokers.length == 0){
				this.showActionTip('bugouda_before_action');
				this.cardContainerObj.innerHTML = '';	
				this.chuPaiObj.paopaoArea.style.display='none';
				//this.showBeforeChuPaiUI();
				ddz.gameControl();
				return;
			}
			
		}
	}
	var vt = 1000 * 30, that = this;
	
    var timer = new CommonUtil.CountDown({overTime:vt, runCallBack:function (remainSec) {
			that.chuPaiObj.timeRemain.innerText = remainSec;
        }, overTimeCallback:function () {               
				// that.clearSelectedCards();
				// that.doChuPai();
    }});
	this.chuPaiObj.timer = timer;	
	this.showBeforeChuPaiUI();
	if(this.AIPlayer){
		setTimeout(function(){that.doChuPai()}, 2000);		
	}else{
		
	}	
	
}



Player.prototype.placeCards = function(type){
	var  shouPaiAreaWidth = this.shouPaiAreaObj.clientWidth,left = 0,
		xOffset = (shouPaiAreaWidth-this.cardWidth)/(this.shouPaiCount -1); //减100是因为每张卡片宽度为100	
	xOffset = (xOffset > 50 ? 50 : xOffset);
	var	tStr, htmls = [],template = "<div class='card_img {0}' index={1} style='position:absolute;left:{3}px'></div>";
		
	var curPlayer = this.cardArray;	
		
	for(var i = 0, j = curPlayer.length; i < j; i++){		
			tStr = CommonUtil.format.call(template,curPlayer[i].className, i, top, left);
			htmls.push(tStr);
			left+= xOffset;			
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
		var tStr, htmls = [],template = "<div class='card_img {0}' index={1} style='position:absolute;left:{2}px;top:{3}px;'></div>";
		var  cardContainerWidth = this.cardContainerObj.clientWidth,left = 0, top = 0,
		xOffset = (cardContainerWidth-this.cardWidth)/(size -1); //减100是因为每张卡片宽度为100	
		xOffset = (xOffset > 50 ? 50 : xOffset);
		
		if(xOffset < 30){
			xOffset = 30;			
		}
		for(var i = 0, j = selectedCardArray.length; i < j; i++){
			if(left + this.cardWidth > cardContainerWidth){
					left = xOffset;
					top = 40;
			}		
			tStr = CommonUtil.format.call(template,selectedCardArray[i].className, i, left, top);
			htmls.push(tStr);
			left+= xOffset;	
				
		}
		var cardsHtml = htmls.join('');	
		
		var paiType = ddz.chuPaiInfo.paiType, classType = undefined;
		switch(paiType){			
			case GroupType.炸弹:{
				ddz.mulEffectPai++;
				ddz.ElemObj.siZhangEffectArea.style.display='block';
				ddz.showSiZhangEffect(ddz.bombEffectPositionXArray.concat());break;
			}
			case GroupType.双王:{
				ddz.mulEffectPai++;
				ddz.showShuangWangEffect();break;
			}
			case GroupType.二连飞机:
			case GroupType.三连飞机:
			case GroupType.四连飞机:
			case GroupType.五连飞机:
			case GroupType.六连飞机:
			case GroupType.飞机带翅膀:
			case GroupType.飞机带二对:
			case GroupType.三连飞机带翅膀:
			case GroupType.三连飞机带三对:
			case GroupType.四连飞机带翅膀:
			case GroupType.四连飞机带四对:
			case GroupType.五连飞机带翅膀:
			{
				ddz.showFeiJiEffect();break;
			}
			case GroupType.十二张顺子:
			case GroupType.十一张顺子:
			case GroupType.十张顺子:
			case GroupType.九张顺子:
			case GroupType.八张顺子:
			case GroupType.七张顺子:
			case GroupType.六张顺子:
			case GroupType.五张顺子:{
				classType = 'lianPai';
			}
			
			case GroupType.三连对:
			case GroupType.四连对:
			case GroupType.五连对:
			case GroupType.六连对:
			case GroupType.七连对:
			case GroupType.八连对:
			case GroupType.九连对:
			case GroupType.十连对:{
					classType = classType || 'lianDui';
					paiWidth = left - xOffset + this.cardWidth;
					paiHeight = this.cardHeight;
					left = (paiWidth- 190)/2;//190文字顺子的宽度,参看.lianpai css.
					xtop = (paiHeight-92)/2;
					template = "<div class='{0}' style='left:{1}px;top:{2}px'></div>";
					tStr = CommonUtil.format.call(template,classType, left,xtop);
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