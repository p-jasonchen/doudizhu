﻿/*
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
	

	
	AI.sort1(this.player1.cardArray);
	AI.sort1(this.player2.cardArray);
	AI.sort1(this.player3.cardArray);
	
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
	this.gameControl();	
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
			this.playTurn = curIndex;
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
