AI = {};
AI.findBestCards = function(player, type, compareTarget, includeBomb) {
	this.analyzePlayerCards(player);

	//若未指定牌型，自由选择最佳出牌
	if (!type)
		return this.freeFindCards(player);

	//查找符合指定牌型的所有结果
	var result = this.findAllByType(player, type, compareTarget, includeBomb);
	for ( var i = result.length - 1; i >= 0; i--) {
		var group = result[i];
		if (!(group instanceof Array))
			group = [ group ];

		if (group.length == type.numPokers) {
			return group;
		} else if (Rule.compare(group, compareTarget)) {
			//数目不相等的且能出牌的情况，只能是炸弹或双王
			return group;
		}
	}
	return null;
}

//电脑自由出牌
AI.freeFindCards = function(player) {
	var i, p = [], cardArray = player.cardArray, len = cardArray.length;
	if (len == 0)
		return null;

	//第一优先考虑把所有牌都出去
	var type = Rule.getType(cardArray);
	if (type) {
		//如果有双王或炸弹，则忽略
		if (player.shuangwang.length == 0 && player.bomb.length == 0)
			return cardArray;
	}

	//飞机带翅膀
	len = player.sanzhang.length;
	if (len >= 5)
		p = this.findAllByType(player, GroupType.五连飞机带翅膀);
	if (len >= 4 && !p.length)
		p = this.findAllByType(player, GroupType.四连飞机带四对);
	if (len >= 4 && !p.length)
		p = this.findAllByType(player, GroupType.四连飞机带翅膀);
	if (len >= 3 && !p.length)
		p = this.findAllByType(player, GroupType.三连飞机带三对);
	if (len >= 3 && !p.length)
		p = this.findAllByType(player, GroupType.三连飞机带翅膀);
	if (len >= 2 && !p.length)
		p = this.findAllByType(player, GroupType.飞机带二对);
	if (len >= 2 && !p.length)
		p = this.findAllByType(player, GroupType.飞机带翅膀);
	if (len >= 5 && !p.length)
		p = this.findAllByType(player, GroupType.五连飞机);
	if (len >= 4 && !p.length)
		p = this.findAllByType(player, GroupType.四连飞机);
	if (len >= 3 && !p.length)
		p = this.findAllByType(player, GroupType.三连飞机);
	if (len >= 2 && !p.length)
		p = this.findAllByType(player, GroupType.二连飞机);
	if (p.length) {
		var group = p[p.length - 1];
		return group;
	}

	//连对
	len = player.sanzhang.length + player.duizi.length;
	if (len >= 10)
		p = this.findAllByType(player, GroupType.十连对);
	if (len >= 9 && !p.length)
		p = this.findAllByType(player, GroupType.九连对);
	if (len >= 8 && !p.length)
		p = this.findAllByType(player, GroupType.八连对);
	if (len >= 7 && !p.length)
		p = this.findAllByType(player, GroupType.七连对);
	if (len >= 6 && !p.length)
		p = this.findAllByType(player, GroupType.六连对);
	if (len >= 5 && !p.length)
		p = this.findAllByType(player, GroupType.五连对);
	if (len >= 4 && !p.length)
		p = this.findAllByType(player, GroupType.四连对);
	if (len >= 3 && !p.length)
		p = this.findAllByType(player, GroupType.三连对);
	if (p.length) {
		var group = p[p.length - 1];
		return group;
	}

	//顺子
	p = this.findAllByType(player, GroupType.十二张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.十一张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.十张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.九张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.八张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.七张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.六张顺子);
	if (!p.length)
		p = this.findAllByType(player, GroupType.五张顺子);
	if (p.length) {
		var group = p[p.length - 1];
		return group;
	}

	//从最小的牌开始出
	var group = this.findSmallestType(player, cardArray);
	if (group)
		return group;

	//太幸福了！手上只有炸弹和双王了
	len = player.bomb.length;
	if (len)
		return player.bomb[len - 1];
	len = player.shuangwang.length;
	if (len)
		return player.shuangwang[0];

	//不能运行到这里，否则算法存在bug
	return null;
}

//查找用户手里的最小的一个牌组
AI.findSmallestType = function(player, cardArray) {
	var len = cardArray.length, last = cardArray[len - 1];
	if (len == 0)
		return null;

	//最小的是单张
	if (len == 1)
		return last;
	if (len > 1 && cardArray[len - 2].cardSeq != last.cardSeq
			&& (last.cardSeq != 16 || cardArray[len - 2].cardSeq != 17)) {
		return last;
	}
	//最小的是对子
	if (len >= 2 && cardArray[len - 2].cardSeq == last.cardSeq
			&& (len == 2 || cardArray[len - 3].cardSeq != last.cardSeq)) {
		return [ cardArray[len - 2], last ];
	}
	//最小的是三张
	if (len >= 3 && cardArray[len - 2].cardSeq == last.cardSeq
			&& cardArray[len - 3].cardSeq == last.cardSeq
			&& (len == 3 || cardArray[len - 4].cardSeq != last.cardSeq)) {
		var group = [ cardArray[len - 3], cardArray[len - 2], last ];
		var group1 = this.findPlusPoker(player, group, 1, false);
		var group2 = this.findPlusPoker(player, group, 2, true);
		var lastp1 = (group1 && group1.length == group.length + 1) ? group1[group1.length - 1].cardSeq
				: 15;
		var lastp2 = (group2 && group2.length == group.length + 2) ? group2[group2.length - 1].cardSeq
				: 15;
		if (lastp1 >= 14 && lastp2 >= 14) {
			return group;
		} else if (lastp2 <= lastp1) {
			return group2;
		} else {
			return group1;
		}
	}

	//跳过最小的4张炸弹继续往前查找
	return this.findSmallestType(player, cardArray.slice(0, len - 4));
}

//获取用户指定牌型的所有可能的组合结果
AI.findAllByType = function(player, type, compareTarget, includeBomb) {
	var i, group, len = player.cardArray.length, num = type.numPokers, result = [];

	if (type == GroupType.双王) {
		return player.shuangwang;
	} else if (type == GroupType.炸弹) {
		result = player.bomb;
	} else if (type == GroupType.单张) {
		result = result.concat(player.danzhang);
		this._slicePokerFromList(player.duizi, result, 1);
		this._slicePokerFromList(player.sanzhang, result, 1);
	} else if (type == GroupType.对子) {
		result = result.concat(player.duizi);
		this._slicePokerFromList(player.sanzhang, result, 2);
	} else if (type == GroupType.三张) {
		result = result.concat(player.sanzhang);
	} else {
		switch (type) {
		case GroupType.三带一:
			result = this.findTarget(player, 3, 1, 1);
			break;
		case GroupType.三带二:
			result = this.findTarget(player, 3, 1, 2);
			break;
		case GroupType.四带二:
			result = this.findTarget(player, 4, 1, 2);
			break;
		case GroupType.四带二对:
			result = this.findTarget(player, 4, 1, 4);
			break;
		case GroupType.三连对:
		case GroupType.四连对:
		case GroupType.五连对:
		case GroupType.六连对:
		case GroupType.七连对:
		case GroupType.八连对:
		case GroupType.九连对:
		case GroupType.十连对:
			result = this.findTarget(player, 2, type.numPokers / 2, 0);
			break;
		case GroupType.二连飞机:
		case GroupType.三连飞机:
		case GroupType.四连飞机:
		case GroupType.五连飞机:
		case GroupType.六连飞机:
			result = this.findTarget(player, 3, type.numPokers / 3, 0);
			break;
		case GroupType.飞机带翅膀:
			result = this.findTarget(player, 3, 2, 2);
			break;
		case GroupType.飞机带二对:
			result = this.findTarget(player, 3, 2, 4);
			break;
		case GroupType.三连飞机带翅膀:
			result = this.findTarget(player, 3, 3, 3);
			break;
		case GroupType.三连飞机带三对:
			result = this.findTarget(player, 3, 3, 6);
			break;
		case GroupType.四连飞机带翅膀:
			result = this.findTarget(player, 3, 4, 4);
			break;
		case GroupType.四连飞机带四对:
			result = this.findTarget(player, 3, 4, 8);
			break;
		case GroupType.五连飞机带翅膀:
			result = this.findTarget(player, 3, 5, 5);
			break;
		default:
			result = this.findTarget(player, 1, type.numPokers, 0);
			break;
		}
	}

	if (includeBomb)
		result = player.shuangwang.concat(player.bomb, result);

	if (compareTarget) {
		for (i = 0; i < result.length; i++) {
			var group = result[i];
			if (!(group instanceof Array))
				group = [ group ];
			if (!Rule.compare(group, compareTarget)) {
				result.splice(i, 1);
				i--;
			}
		}
	}

	return result;
}

//从玩家牌里找出指定规则的牌型(相同牌的数量,顺子的数量,附加牌的数量)
AI.findTarget = function(player, groupNum, linkNum, plusNum) {
	var result = [];

	if (groupNum == 1) {
		//获取所有除炸弹外的单张
		var danzhang = [].concat(player.danzhang);
		this._slicePokerFromList(player.duizi, danzhang, 1);
		this._slicePokerFromList(player.sanzhang, danzhang, 1);

		if (linkNum >= 5) {
			//从大到小排序方便查找顺子
			this.sort1(danzhang);
			for (i = danzhang.length - linkNum; i >= 0; i--) {
				var temp = danzhang.slice(i, i + linkNum);
				var valid = true;
				for ( var j = temp.length - 1; j >= 1; j--) {
					var a = temp[j], b = temp[j - 1];
					if (temp[j].cardSeq == 15 || temp[j - 1].cardSeq == 15
							|| temp[j].cardSeq != temp[j - 1].cardSeq - 1) {
						valid = false;
						break;
					}
				}
				if (valid)
					result.unshift(temp);
			}
			return result;
		} else {
			return danzhang;
		}
	}

	var basic = groupNum == 2 ? player.duizi : groupNum == 3 ? player.sanzhang
			: groupNum == 4 ? player.bomb : [];
	result = result.concat(basic);

	//只考虑对子情况下去拆开三张，炸弹不拆开	
	if (groupNum == 2 && player.sanzhang.length > 0) {
		for ( var i = 0; i < player.sanzhang.length; i++) {
			var group = player.sanzhang[i];
			result.push( [ group[0], group[1] ]);
		}
	}

	//连对和飞机
	this.sort3(result);
	if (linkNum > 1) {
		if (result.length < linkNum)
			result.length = 0;

		var temp = [];
		for ( var i = 0; i < result.length; i++) {
			if (i + linkNum - 1 >= result.length)
				break;
			var linked = true;
			for ( var j = 1; j < linkNum; j++) {
				if (result[i + j - 1][0].cardSeq != result[i + j][0].cardSeq + 1
						|| result[i + j - 1][0].cardSeq >= 15) {
					linked = false;
					break;
				}
			}
			if (linked) {
				var group = result[i];
				for ( var j = 1; j < linkNum; j++)
					group = group.concat(result[i + j]);
				temp.push(group);
			}
		}
		result = temp;
	}

	//附带的牌，如三带一，三带二，飞机带翅膀，四带二等
	if (plusNum > 0) {
		var needPair = groupNum == 3 ? plusNum / linkNum == 2
				: plusNum == groupNum;
		for ( var i = 0; i < result.length; i++) {
			var temp = this.findPlusPoker(player, result[i], plusNum, needPair);
			if (temp) {
				result[i] = temp;
			} else {
				result.splice(i, 1);
				i++;
			}
		}
	}
	return result;
}

//为三张和三连查找附加的单牌或对子
AI.findPlusPoker = function(player, target, plusNum, duizi) {
	var temp = [], plus;
	if (duizi) {
		this._slicePokerFromList(player.sanzhang, temp, 2);
		temp = temp.concat(player.duizi);
	} else {
		temp = temp.concat(player.sanzhang, player.duizi, player.danzhang);
	}
	temp = this._normalizeList(temp, target);

	if (temp.length >= plusNum) {
		this.sort1(temp);
		plus = temp.slice(temp.length - plusNum, temp.length);
		return target.concat(plus);
	}
	return null;
}

//把嵌套数组里的牌转化成单一数组，并过滤
AI._normalizeList = function(list, filter, result) {
	result = result || [];
	for ( var i = 0; i < list.length; i++) {
		var item = list[i];
		if (item instanceof Array) {
			this._normalizeList(item, filter, result);
		} else {
			if (filter.indexOf(item) == -1)
				result.push(item);
		}
	}
	return result;
}

//从一个牌组序列中截取指定长度的牌
AI._slicePokerFromList = function(source, target, num) {
	for ( var i = source.length - 1; i >= 0; i--) {
		var group = source[i];
		var sliced = group.slice(0, num);
		if (num == 1)
			sliced = sliced[0];
		target.unshift(sliced);
	}
}

//分析用户的牌型(保证唯一性，如三张不会拆成对子)
AI.analyzePlayerCards = function(player){
	var danzhang = [], duizi = [], sanzhang = [], bomb = [], shuangwang = [];
	var i, p, cards = player.cardArray, len = cards.length;

	this.sort1(cards);
	
	if (len >= 2 && cards[0].cardSeq == 17 && cards[1].cardSeq == 16) {
		shuangwang = [ [ cards[0], cards[1] ] ];
	}
	

	//炸弹
	for (i = 3; i < len; i++) {
		p = cards[i].cardSeq;
		if (cards[i - 3].cardSeq == p && cards[i - 2].cardSeq == p
				&& cards[i - 1].cardSeq == p) {
			bomb.push( [ cards[i - 3], cards[i - 2], cards[i - 1], cards[i] ]);
			i += 3;
		}
	}
	//trace("bomb:", player, bomb);

	//三张
	for ( var i = 2; i < len; i++) {
		p = cards[i].cardSeq;
		if (cards[i - 2].cardSeq == p && cards[i - 1].cardSeq == p) {
			if ((i >= 3 && cards[i - 3].cardSeq == p)
					|| (i < len - 1 && cards[i + 1].cardSeq == p))
				continue;
			sanzhang.push( [ cards[i - 2], cards[i - 1], cards[i] ]);
			i += 2;
		}
	}
	//trace("sanzhang:", player, sanzhang);

	//对子
	for (i = 1; i < len; i++) {
		p = cards[i].cardSeq;
		if (cards[i - 1].cardSeq == p) {
			if ((i >= 2 && cards[i - 2].cardSeq == p)
					|| (i < len - 1 && cards[i + 1].cardSeq == p))
				continue;
			duizi.push( [ cards[i - 1], cards[i] ]);
			i++;
		}
	}
	//trace("duizi:", player, duizi);

	//单张
	for (i = 0; i < len; i++) {
		p = cards[i].cardSeq;
		if (len >= 2 && p == 17 && cards[i + 1].cardSeq == 16) {
			i++;
			continue;
		}
		if ((i >= 1 && cards[i - 1].cardSeq == p)
				|| (i < len - 1 && cards[i + 1].cardSeq == p))
			continue;
		danzhang.push(cards[i]);
	}
	//trace("danzhang:", player, danzhang);

	player.shuangwang = shuangwang;
	player.bomb = bomb;
	player.sanzhang = sanzhang;
	player.duizi = duizi;
	player.danzhang = danzhang;
}

//按从大到小排序
AI.sort1 = function(cards) {
	if( ! cards  instanceof Array) cards = [cards];
	cards.sort(function(a, b) {
		var p = b.cardSeq - a.cardSeq;
		if (p == 0)
			return b.cardType - a.cardType;
		return p;
	});
	return cards;
}

//按从多到少并从大到小排序(双王除外，始终排在第一位)
AI.sort2 = function(cards) {
	var count = {}, kingNum = 0;
	for ( var i = 0; i < cards.length; i++) {
		var p = cards[i];
		if (p.cardSeq == 17 || p.cardSeq == 16)
			kingNum++;
		count[p.cardSeq] == undefined ? count[p.cardSeq] = 1 : ++count[p.cardSeq];
	}
	cards.sort(function(a, b) {
		var ca = count[a.cardSeq], cb = count[b.cardSeq];
		if (ca == cb || (kingNum == 2 && (a.cardSeq == 17 || a.cardSeq == 16)))
			return b.cardSeq - a.cardSeq;
		else
			return cb - ca;
	});
	count = null;
	return cards;
}

//对嵌套数组里的牌组进行从大到小排序
AI.sort3 = function(list) {
	list.sort(function(a, b) {
		return a[0].cardSeq < b[0].cardSeq;
	});
}

//根据评估打分，简单的AI叫牌
AI.gamble = function(player) {
	var score = this.scorePlayerPokers(player);
	if (score < 20)
		return 0;
	else if (score <= 30)
		return 1;
	else if (score > 30 && score <= 45)
		return 2;
	else
		return 3;
}

//给用户的牌评估打分
AI.scorePlayerPokers = function(player) {
	this.analyzePlayerCards(player);

	var i, p, score = 0;

	for (i = 0; i < player.danzhang.length; i++) {
		p = player.danzhang[i].cardSeq;
		if (p == 17)
			score += 10;
		else if (p == 16)
			score += 8;
		else if (p > 10)
			score += p - 10;
	}

	for (i = 0; i < player.duizi.length; i++) {
		p = player.duizi[i][0].cardSeq;
		if (p == 15)
			score += 10;
		else if (p == 14)
			score += 8;
		else if (p > 10)
			score += (p - 10) * 1.2 * (1 + (p - 10) / 10);
	}

	for (i = 0; i < player.sanzhang.length; i++) {
		p = player.sanzhang[i][0].cardSeq;
		if (p == 15)
			score += 15;
		else if (p == 14)
			score += 12;
		else if (p > 10)
			score += (p - 10) * 2 * (1 + (p - 10) / 10);
	}

	for (i = 0; i < player.bomb.length; i++) {
		p = player.bomb[i][0].cardSeq;
		if (p == 15)
			score += 30;
		else if (p == 14)
			score += 24;
		else if (p > 10)
			score += 17 * (1 + (p - 10) / 10);
		else
			score += 16;
	}

	if (player.shuangwang.length > 0)
		score += 30;

	return player.pokerScore = Math.round(score);
}

//过滤牌组
AI.filterPokers = function(cardArray, filter) {
	var result = [];
	for ( var i = 0; i < cardArray.length; i++) {
		var poker = cardArray[i];
		if (filter instanceof Array) {
			if (filter.indexOf(poker) == -1)
				result.push(poker);
		} else {
			if (filter != poker)
				result.push(poker);
		}
	}
	return result;
}

//为了让游戏产生更多的随机性，此函数给出一定几率执行某项动作(0-100)
AI.hasChance = function(chance) {
	var rnd = Math.round(Math.random() * 100 + 1);
	if (rnd <= chance)
		return true;
	return false;
}