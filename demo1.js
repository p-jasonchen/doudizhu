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
		//alert(text);
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
	this.judger.doJudge(this);
}

var ShuangWang = {
	doJudge: function(paiTypeJudger){		
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 2 && (paiArray[0][0].cardSeq + paiArray[1][0].cardSeq == 29)){
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
		var paiArray = paiTypeJudger.sortedPaiArray, length = paiArray.length, paiType;
		if(length == 1 && paiArray[0].length == 4){
			paiType = 'siZhang';
			CommonUtil.print(PaiTypeConstants[paiType]);
			paiTypeJudger.paiType = paiType;
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
			paiTypeJudger.paiType = paiType;
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
			}
		}else{
			paiType = -1;			
		}
		if(paiType == -1){
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


var Player = function(opt){
	opt = opt || {};
	this.cardArray = opt.cardArray;	
	this.areaObj = CommonUtil.$id(opt.areaId);
	this.chupaiId = opt.chupaiId;
	this.selectPaiArray = [];
	this.chaiPaiStack = [];
	this.chaiPaiResultStack = [];
}

Player.prototype.registeSelectCardAction = function(){
	var cardImgs = CommonUtil.$class('card_img', this.areaObj), curImg;	
	for(var i = 0, j = cardImgs.length; i < j; i++){
		curCard = this.cardArray[i];		
		curImg = cardImgs[i];		
		curImg.mapCard = this.cardArray[parseInt(curImg.getAttribute('index'))];
		curImg.mapCard.mapImg = curImg;
		curImg.addEventListener('click', function(){
			var s = this.style, selectOffset = 10, top;
			if(this.selected){
				top = parseFloat(s.top) + selectOffset + 'px';
				this.selected = false;
			}else{
				this.selected = true;
				top = parseFloat(s.top) - selectOffset + 'px';
			}
			s.top = top;
		});
	}
}

Player.prototype.registeChupaiAction = function(){
	var that = this,  chupaiBtn = CommonUtil.$id(this.chupaiId);	
	chupaiBtn && chupaiBtn.addEventListener('click', function(){		
		// that.judgeChupaiType();		
		// ddz.placeCards();		
		p = ddz.player3;
		p.doSimpleChaiPai();
		//console.log(p.findAlonePai());
		
	});
}

Player.prototype.getSelectedCards = function(){
	var selectCards = [];
	var cardImgs = CommonUtil.$class('card_img', this.areaObj), curImg;
	for(var i = 0, j = cardImgs.length; i < j; i++){
		curImg = cardImgs[i];
		if(curImg.selected){
			selectCards.push(curImg.mapCard);
		}
	}
	return selectCards;
}


Player.prototype.getSortedPaiInfo = function(cardArray, cmpFunction){
	var cards = cardArray || [];
	if(cards.length == 0) return;
	var curCard = cards[0], curSeq = curCard.cardSeq;
	var cardCount = cards.length, mapCardArray = [curCard], paiArray = [mapCardArray];	
	
	curCard.dead = true;
	for(var i = 1; i < cardCount; i++){
		curCard = cards[i];
		curCard.dead = true;
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
	var selectCards = this.getSelectedCards();
	var sortedInfo = this.getSortedPaiInfo(selectCards, this.chupaiCmpFunction), 
		sortedArray = sortedInfo.sortedArray;
	var judger = new PaiTypeJudger(sortedArray);
	return judger.doJudge(sortedArray);
}


Player.prototype.findAlonePaiBasedOnSortedPaiInfoArray = function(sortedPaiInfoArray){
	var array = sortedPaiInfoArray || [];
	var i = 0, size = array.length;
	if(size <= 2) return ;
	
	//minCardsInlianPaiElem用于记录连牌中牌数最小的那个值，以便后来从lianPaiInfoArray中提取符合规则的连牌或连对。
	var aloneArray = [], lianPaiInfoArray = [], aloneBomb = [], minCardsInlianPaiElem = 0;
	var curPaiInfo = array[0], pai0Seq = curPaiInfo.cardSeq;
	//大王
	if(pai0Seq == 15){
		i++;
		if(array[1].cardSeq == 14){
			i++;
			aloneBomb.push([ array[0], array[1] ]);
		}else{
			aloneArray.push(curPaiInfo);			
		}
	}else if(pai0Seq == 14){
		i++;
		aloneArray.push(curPaiInfo);
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
	
	//从低于5连的aloneArray中找出单张，三张
	var oneArray = [], threeArray = []
	for(i = 0, size = aloneArray.length; i < size; i++){
		curPaiInfo = aloneArray[i];		
		remainCards = curPaiInfo.remainCards4ChaiPai,
		cards = (remainCards == 0) ? curPaiInfo.array.length : remainCards;
		switch(cards){
			case 1:
				oneArray.push(curPaiInfo);break;
			case 3:			
				threeArray.push(curPaiInfo);break;
			case 4:
				aloneBomb.push(curPaiInfo);break;
		}
	}
	
	
	//从低于5连的aloneArray中找出低于3连的对子
	lianxuCount = 0, twoArray = [], lianDuiArray = [];
	for(i = 0, size = aloneArray.length; i < size; i++){
		curPaiInfo = aloneArray[i];
		remainCards = curPaiInfo.remainCards4ChaiPai,
		cards = (remainCards == 0) ? curPaiInfo.array.length : remainCards;
		if(cards == 2){
			lianxuCount++, i++;
			preSeq = curPaiInfo.cardSeq;
			break;
		}
	}
	if(lianxuCount == 1){
		tmp = [curPaiInfo];
		for(; i < size; i++){
			curPaiInfo = aloneArray[i];		
			remainCards = curPaiInfo.remainCards4ChaiPai,
			cards = (remainCards == 0) ? curPaiInfo.array.length : remainCards;			
			if(cards == 2){
				curSeq = curPaiInfo.cardSeq;
				if(preSeq == (curSeq + 1)){
					lianxuCount++;
					tmp.push(curPaiInfo);
				}else{					
					if(lianxuCount < 3){
						arrayToUse = twoArray;
					}else{
						arrayToUse = [];
					}
					for(var p = 0, q = tmp.length; p < q; p++){				
						arrayToUse.push(tmp[p]);
					}					
					if(arrayToUse !== twoArray){
						lianDuiArray.push(arrayToUse);
					}
					tmp = [curPaiInfo];
					lianxuCount = 1;
				}
			}				
			preSeq = curSeq;				
		}
		
		
		if(lianxuCount < 3){
			arrayToUse = twoArray;
		}else{
			arrayToUse = [];
		}
		for(var p = 0, q = tmp.length; p < q; p++){				
			arrayToUse.push(tmp[p]);
		}	
		if(arrayToUse !== twoArray){
			lianDuiArray.push(arrayToUse);
		}		
	}
	aloneArray = null, tmp = null;
	return {
		oneArray:oneArray, 
		twoArray: twoArray, 
		threeArray: threeArray, 
		aloneBomb:aloneBomb,
		lianPaiInfoArray:lianPaiInfoArray, 
		lianDuiArray:lianDuiArray		
	};
	
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
	var paiType = ddz.chuPaiInfo.paiType;
	var ret = this.doSimpleChaiPai();
	switch(paiType){
		case 'feiJiDaiDui':{
		}
		case 'feiJiDai1':{
		}
		case 'feiJi':{
			
		}
		case 'sanDaiDui':{
		}
		case 'sanDai1':{
		}
		case 'sanZhang':{
		}
		case 'lianDui':{
		}
		case 'lianPai':{
		}case 'danDui':{
		}		
		case 'danZhang':{
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
	
	
}

/*
主动出牌
*/
Player.prototype.positiveChuPai = function(){
	this.doSimpleChaiPai();
}


Player.prototype.doSimpleChaiPai = function(){
	var data = this.findAlonePaiBaseOnCardArray() || {},
		lianPaiInfoArray = data.lianPaiInfoArray;
	
	if(lianPaiInfoArray.length == 0) return;
	
	var ret = this.extractLianZiFromlianPaiInfoArray(lianPaiInfoArray[0]);
	
	var aloneBomb = data.aloneBomb,
		lianDuiArray = data.lianDuiArray[0] || [],		
		oneArray = data.oneArray,
		twoArray = data.twoArray,
		threeArray = data.threeArray;	
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
		this.chaiPaiResult = ret;	
	return ret;
	
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
	var danPai = [], danDui = [], sanZhang = [], lianZi = [], lianDui = [];//肯能是单连，也可能是连对,还有可能是飞机
	var lianToUse = lianZi;
	if(minCards == 2){
		lianToUse = lianDui;
	}
	
	for(var i = 0 , size = lianPai.length; i < size; i++){
		curPaiInfo = lianPai[i];
		remainCards = curPaiInfo.array.length - minCards;
		lianToUse.push(curPaiInfo.cardSeq);
		switch(remainCards){			
			case 1:{
				danPai.push(curPaiInfo.cardSeq);break;
			}
			case 2:{
				danDui.push(curPaiInfo.cardSeq);break;
			}
			case 3:{
				sanZhang.push(curPaiInfo.cardSeq);break;
			}
		}
	}
	
	var lianDuiArray = (lianDui.length != 0) ? [lianDui]  : lianDui;
	
	return {
		danPai:danPai,
		danDui:danDui,
		sanZhang:sanZhang,
		lianZi:lianZi,
		lianDuiArray:lianDuiArray
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
			this.cardSrc = 'xiaowang.png';break;
		case 1:
			this.cardSrc = 'dawang.png'; break;
		default:
			throw '非法序号的牌';
		}
		//为了便于把王牌在最大
		remain += 14;
	}else{
		switch(remain){
			case 10: 
				cardChar = 'J.png';break;
			case 11: 
				cardChar = 'Q.png';break;
			case 12: 
				cardChar = 'K.png';break;
			case 0: 
				cardChar = 'A.png';remain = 13; break;
			default:
				cardChar = remain + 1 + '.png';
		}	
		this.cardSrc = type + '/' + cardChar;
	}
	this.cardSeq = remain;
	
}


var ddz = {
	playerArray:[],
	diZhuIndex: 0
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
	return d;	
}

ddz.assignCards = function(){
	var cards = this.createRandomCards(), t = 0;
	var player1_card = [], player2_card = [], player3_card = [], dipai = [];
	for(var i = 0; i < 51; i++){
		t = i % 3;
		switch(t){
			case 0 :
				player1_card.push(new Card(cards[i]) )
				// player3_card.push(new Card(cards[i]));
				break;
			case 1 :
				player2_card.push(new Card(cards[i]));
				// player3_card.push(new Card(cards[i]));
				break;
			case 2 :
				player3_card.push(new Card(cards[i]));break;			
		}
	}
	
	// dipai.push(new Card(cards[51])), 
	// dipai.push(new Card(cards[52])), 
	// dipai.push(new Card(cards[53]));
	
	player3_card.push(new Card(cards[51])), 
	player3_card.push(new Card(cards[52])), 
	player3_card.push(new Card(cards[53]));
	
	
	
	this.player1_card = player1_card, 
	this.player2_card = player2_card, 
	this.player3_card = player3_card, 
	this.dipai = dipai;
	
	player1_card = null,
	player2_card = null,
	player3_card = null, 
	dipai = null;	
	
	this.initPlayers();
}

ddz.initPlayers = function(){
	var player1 = new Player({
					cardArray:ddz.player1_card					
				});	
	var player2 = new Player({
					cardArray:ddz.player2_card					
				});	
	
	var player3 = new Player({
					cardArray:ddz.player3_card,
					chupaiId:'chupai',
					areaId:'player3_area'
				});	
	
	CommonUtil.bubbleSort(player1.cardArray, player1.cardCmpFunction);
	CommonUtil.bubbleSort(player2.cardArray, player2.cardCmpFunction);
	CommonUtil.bubbleSort(player3.cardArray, player3.cardCmpFunction);
	
	this.player1 = player1, this.player2 = player2, this.player3 = player3;
	this.playerArray.push(player1);
	this.playerArray.push(player2);
	this.playerArray.push(player3);
	player1 = null, player2 = null, player3 = null;
}

ddz.placeCards = function(){	
	var curPlayer = this.player1_card,  xOffset = 20, yOffset = 100, top=xOffset, left = 0,
		tStr, htmls = [],template = "<img class='card_img' index={3} src='{0}'style='position:absolute;top:{1}px;left:{2}px'>";
	var d = document, player_area = d.getElementById('player1_area');	
		
	for(var i = 0, j = curPlayer.length; i < j; i++){
		if(!curPlayer[i].dead){
			tStr = CommonUtil.format.call(template,curPlayer[i].cardSrc, top, left, i);
			htmls.push(tStr);
			left+= xOffset;	
		}		
	}
	player_area.innerHTML = htmls.join('');
	
	curPlayer = this.player2_card, 
	top += yOffset, left = 0;
	htmls = [], 
	player_area = d.getElementById('player2_area');	
	for(var i = 0, j = curPlayer.length; i < j; i++){
		if(!curPlayer[i].dead){
			tStr = CommonUtil.format.call(template,curPlayer[i].cardSrc, top, left, i);
			htmls.push(tStr);
			left+= xOffset;		
		}
	}
	player_area.innerHTML = htmls.join('');
	
	curPlayer = this.player3_card, 
	top += yOffset, left = 0;
	htmls = [], 
	player_area = d.getElementById('player3_area');	
	for(var i = 0, j = curPlayer.length; i < j; i++){
		if(!curPlayer[i].dead){
			tStr = CommonUtil.format.call(template,curPlayer[i].cardSrc, top, left, i);
			htmls.push(tStr);
			left+= xOffset;	
		}		
	}
	
	left = left - xOffset + 60;
	var btnTemplate = "<button id='chupai' style='position:absolute;top:{0}px;left:{1}px'>出牌</button>";
	tStr = CommonUtil.format.call(btnTemplate, top, left);
	player_area.innerHTML = htmls.join('')+ tStr;	
	
	this.player3.registeSelectCardAction();
	this.player3.registeChupaiAction();
}



ddz.startGame = function(){
	var diZhuIndex = this.diZhuIndex, 
		playerArray = this.playerArray || [],
		playerLength = playerArray.length,
		curIndex = diZhuIndex;
	for(var i = 0 ; i < playerLength; i ++){
		curIndex = ( diZhuIndex + i ) % playerLength;
		playerArray[curIndex].doSimpleChaiPai();
	}
}
/*
54个随机数生成算法
*/
var ddz1 = {};

/*
用链表，从0到53依次插入链表中的随机位置
*/
ddz1.createRandomCard = function(){
	var card = [], rPos;
	for(var i = 0; i < 53; i++){
		rPos = Math.floor(Math.random() * 54);
		list.push();
	}
}


var ddz2 = {};
/*
1.如果需要将已有的vector数组重新排序，直接从原数组中随机抽签，顺序添加到新数组，并删除原数组中被抽到的元素

2..或者直接从原vector数组顺序抽取元素，放置到新动态数组中的随机位置
*/
ddz2.createRandomCard = function(){
}

