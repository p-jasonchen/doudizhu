GroupType = function(name, numPokers) {
	this.name = name;
	this.numPokers = numPokers;
	GroupType[name] = this;
};
GroupType.prototype.toString = function() {
	return this.name
};

//所有牌型
new GroupType("单张", 1);
new GroupType("对子", 2);
new GroupType("双王", 2);
new GroupType("三张", 3);
new GroupType("炸弹", 4);
new GroupType("三带一", 4);
new GroupType("五张顺子", 5);
new GroupType("三带二", 5);
new GroupType("六张顺子", 6);
new GroupType("三连对", 6);
new GroupType("四带二", 6);
new GroupType("二连飞机", 6);
new GroupType("七张顺子", 7);
new GroupType("八张顺子", 8);
new GroupType("四连对", 8);
new GroupType("飞机带翅膀", 8);
new GroupType("四带二对", 8);
new GroupType("九张顺子", 9);
new GroupType("三连飞机", 9);
new GroupType("十张顺子", 10);
new GroupType("五连对", 10);
new GroupType("飞机带二对", 10);
new GroupType("十一张顺子", 11);
new GroupType("十二张顺子", 12);
new GroupType("六连对", 12);
new GroupType("四连飞机", 12);
new GroupType("三连飞机带翅膀", 12);
new GroupType("七连对", 14);
new GroupType("五连飞机", 15);
new GroupType("三连飞机带三对", 15);
new GroupType("八连对", 16);
new GroupType("四连飞机带翅膀", 16);
new GroupType("九连对", 18);
new GroupType("六连飞机", 18);
new GroupType("十连对", 20);
new GroupType("四连飞机带四对", 20);
new GroupType("五连飞机带翅膀", 20);

Rule = {};

//比较两手牌的大小
Rule.compare = function(pa, pb) {
	var ta = Rule.getType(pa);
	var tb = Rule.getType(pb);
	if (!ta || !tb)
		return false;
	//牌型相同，则比较牌型的第一张牌即可（前提是已经排序）
	if (ta == tb)
		return pa[0].cardSeq > pb[0].cardSeq;
	//牌型不同，则只有双王和炸弹能跨牌型比较
	if (ta == GroupType.双王)
		return true;
	else if (ta == GroupType.炸弹 && tb != GroupType.双王)
		return true;
	return false;
}

//获取指定牌的牌型
Rule.getType = function(cardArray) {
	//从大到小排序，便于牌型判断
	AI.sort1(cardArray);

	var len = cardArray.length;
	switch (len) {
	case 1:
		return GroupType.单张;

	case 2:
		if (Rule.isSame(cardArray, 2))
			return GroupType.对子;
		else if (cardArray[0].cardSeq == 17 && cardArray[1].cardSeq == 16)
			return GroupType.双王;
		return false;

	case 3:
		if (Rule.isSame(cardArray, 3))
			return GroupType.三张;
		return false;

	case 4:
		if (Rule.isSame(cardArray, 4))
			return GroupType.炸弹;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.三带一;
		return false;

	case 5:
		if (Rule.isStraight(cardArray))
			return GroupType.五张顺子;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.三带二;
		return false;

	case 6:
		if (Rule.isStraight(cardArray))
			return GroupType.六张顺子;
		else if (Rule.isPairLink(cardArray))
			return GroupType.三连对;
		else if (Rule.isSame(cardArray, 4)) {
			//排序，比如：863333 -> 333386
			var start = -1, count = 0;
			for ( var i = 0; i < len - 1; i++) {
				if (cardArray[i].cardSeq == cardArray[i + 1].cardSeq) {
					count++;
					if (count >= 3)
						start = i - 2;
				} else
					count = 0;
			}
			if (start > 0) {
				var four = cardArray.splice(start, 4);
				cardArray.unshift.apply(cardArray, four);
			}
			return GroupType.四带二;
		} else if (Rule.isTripleLink(cardArray))
			return GroupType.二连飞机;
		return false;

	case 7:
		if (Rule.isStraight(cardArray))
			return GroupType.七张顺子;
		return false;

	case 8:
		if (Rule.isStraight(cardArray))
			return GroupType.八张顺子;
		else if (Rule.isPairLink(cardArray))
			return GroupType.四连对;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.飞机带翅膀;
		else if (Rule.isSame(cardArray, 4)) {
			var pair = [];
			for (i = 1; i < cardArray.length; i++) {
				var p = cardArray[i].cardSeq;
				if (cardArray[i - 1].cardSeq == p) {
					if ((i >= 2 && cardArray[i - 2].cardSeq == p)
							|| (i < len - 1 && cardArray[i + 1].cardSeq == p))
						continue;
					pair.push( [ cardArray[i - 1], cardArray[i] ]);
					i++;
				}
			}
			if (pair.length == 2)
				return GroupType.四带二对;
		}
		return false;

	case 9:
		if (Rule.isStraight(cardArray))
			return GroupType.九张顺子;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.三连飞机;
		return false;

	case 10:
		if (Rule.isStraight(cardArray))
			return GroupType.十张顺子;
		else if (Rule.isPairLink(cardArray))
			return GroupType.五连对;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.飞机带二对;
		return false;

	case 11:
		if (Rule.isStraight(cardArray))
			return GroupType.十一张顺子;
		return false;

	case 12:
		if (Rule.isStraight(cardArray))
			return GroupType.十二张顺子;
		else if (Rule.isPairLink(cardArray))
			return GroupType.六连对;
		else {
			var num = Rule.isTripleLink(cardArray);
			if (num == 3)
				return GroupType.三连飞机带翅膀;
			else if (num == 4)
				return GroupType.四连飞机;
		}
		return false;

	case 13:
		return false;

	case 14:
		if (Rule.isPairLink(cardArray))
			return GroupType.七连对;
		return false;

	case 15:
		if (Rule.isTripleLink(cardArray))
			return GroupType.五连飞机;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.三连飞机带三对;
		return false;

	case 16:
		if (Rule.isPairLink(cardArray))
			return GroupType.八连对;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.四连飞机带翅膀;
		return false;

	case 17:
		return false;

	case 18:
		if (Rule.isPairLink(cardArray))
			return GroupType.九连对;
		else if (Rule.isTripleLink(cardArray))
			return GroupType.六连飞机;
		return false;

	case 19:
		return false;

	case 20:
		if (Rule.isPairLink(cardArray))
			return GroupType.十连对;
		else {
			var num = Rule.isTripleLink(cardArray);
			if (num == 5)
				return GroupType.五连飞机带翅膀;
			else if (num == 4) {
				var pair = [];
				for (i = 1; i < cardArray.length; i++) {
					var p = cardArray[i].cardSeq;
					if (cardArray[i - 1].cardSeq == p) {
						if ((i >= 2 && cardArray[i - 2].cardSeq == p)
								|| (i < len - 1 && cardArray[i + 1].cardSeq == p))
							continue;
						pair.push( [ cardArray[i - 1], cardArray[i] ]);
						i++;
					}
				}
				if (pair.length == 4)
					return GroupType.四连飞机带四对;
			}
		}
		return false;
	}
	return false;
}

//判断给定的牌中是否存在相同的指定数量的牌（已从大到小排序）
Rule.isSame = function(cardArray, amount) {
	var count = 0;
	for ( var i = 0; i < cardArray.length - 1; i++) {
		if (cardArray[i].cardSeq == cardArray[i + 1].cardSeq) {
			count++;
		} else {
			count = 0;
		}
		if (count >= amount - 1)
			return true;
	}
	return false;
}

//判断给定的牌是否为顺子（已从大到小排序）
Rule.isStraight = function(cardArray) {
	//不能包含2、小王、大王
	if (cardArray[0].cardSeq >= 15)
		return false;

	for ( var i = 0; i < cardArray.length - 1; i++) {
		if (cardArray[i].cardSeq != cardArray[i + 1].cardSeq + 1)
			return false;
	}
	return true;
}

//判断给定的牌是否为连对（已从大到小排序）
Rule.isPairLink = function(cardArray) {
	//不能包含2、小王、大王
	if (cardArray[0].cardSeq >= 15)
		return false;

	for ( var i = 0; i < cardArray.length - 2; i += 2) {
		if (cardArray[i].cardSeq != cardArray[i + 1].cardSeq
				|| cardArray[i].cardSeq != cardArray[i + 2].cardSeq + 1
				|| cardArray[i + 2].cardSeq != cardArray[i + 3].cardSeq)
			return false;
	}
	return true;
}

//判断是否为连续三张牌,飞机,飞机带翅膀
Rule.isTripleLink = function(cardArray) {
	var num = 0, len = cardArray.length, triples = [], others = [], flag = 0;

	//先找出所有的三张，并从大到小排序
	for ( var i = 2; i < len; i++) {
		if (cardArray[i].cardSeq == cardArray[i - 1].cardSeq
				&& cardArray[i].cardSeq == cardArray[i - 2].cardSeq) {
			if (flag == 0) {
				flag++;
				num++;
				triples.push(cardArray[i - 2], cardArray[i - 1], cardArray[i]);
			}
		} else {
			flag = 0;
		}
	}
	if (num == 0)
		return false;
	AI.sort1(triples);

	//三张以外的牌，也从大到小排序
	for (i = 0; i < len; i++) {
		var p = cardArray[i];
		if (triples.indexOf(p) == -1)
			others.push(p);
	}
	AI.sort1(others);

	//最后组合出适合比较的牌型，比如89555444 -> 55544489
	var temp = triples.concat(others);

	if (num > 1) //当牌组为飞机时
	{
		for ( var i = 0; i < triples.length - 3; i += 3) {
			//2不能当飞机出, 且飞机之间的点数相差1
			if (triples[i].cardSeq == 15
					|| triples[i].cardSeq != triples[i + 3].cardSeq + 1)
				return false;
		}
	}

	var plus = others.length;
	if (plus == num * 2) //或者相同数量的对子
	{
		var numPair = 0;
		for ( var j = 0; j < others.length - 1; j++) {
			if (others[j].cardSeq == others[j + 1].cardSeq)
				numPair++;
		}
		if (num != numPair)
			return false;
	} else if (!(plus == 0 || plus == num)) //飞机只能带相同数量的单牌（或者不带任何牌）
	{
		return false;
	}

	//把原来的牌组进行排序
	for ( var i = 0; i < len; i++)
		cardArray[i] = temp[i];
	return num;
}