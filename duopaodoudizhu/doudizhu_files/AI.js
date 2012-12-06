AI = {};

AI.findBestPokers = function(player, type, compareTarget, includeBomb) {
	this.analyzePlayerPokers(player);

	//若未指定牌型，自由选择最佳出牌
	if (!type)
		return this.freeFindPokers(player);

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
AI.freeFindPokers = function(player) {
	var i, p = [], pokers = player.pokers, len = pokers.length;
	if (len == 0)
		return null;

	//第一优先考虑把所有牌都出去
	var type = Rule.getType(pokers);
	if (type) {
		//如果有双王或炸弹，则忽略
		if (player.twoking.length == 0 && player.bomb.length == 0)
			return pokers;
	}

	//飞机带翅膀
	len = player.triple.length;
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
	len = player.triple.length + player.pair.length;
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
	var group = this.findSmallestType(player, pokers);
	if (group)
		return group;

	//太幸福了！手上只有炸弹和双王了
	len = player.bomb.length;
	if (len)
		return player.bomb[len - 1];
	len = player.twoking.length;
	if (len)
		return player.twoking[0];

	//不能运行到这里，否则算法存在bug
	return null;
}

//查找用户手里的最小的一个牌组
AI.findSmallestType = function(player, pokers) {
	var len = pokers.length, last = pokers[len - 1];
	if (len == 0)
		return null;

	//最小的是单张
	if (len == 1)
		return last;
	if (len > 1 && pokers[len - 2].point != last.point
			&& (last.point != 16 || pokers[len - 2].point != 17)) {
		return last;
	}
	//最小的是对子
	if (len >= 2 && pokers[len - 2].point == last.point
			&& (len == 2 || pokers[len - 3].point != last.point)) {
		return [ pokers[len - 2], last ];
	}
	//最小的是三张
	if (len >= 3 && pokers[len - 2].point == last.point
			&& pokers[len - 3].point == last.point
			&& (len == 3 || pokers[len - 4].point != last.point)) {
		var group = [ pokers[len - 3], pokers[len - 2], last ];
		var group1 = this.findPlusPoker(player, group, 1, false);
		var group2 = this.findPlusPoker(player, group, 2, true);
		var lastp1 = (group1 && group1.length == group.length + 1) ? group1[group1.length - 1].point
				: 15;
		var lastp2 = (group2 && group2.length == group.length + 2) ? group2[group2.length - 1].point
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
	return this.findSmallestType(player, pokers.slice(0, len - 4));
}

//获取用户指定牌型的所有可能的组合结果
AI.findAllByType = function(player, type, compareTarget, includeBomb) {
	var i, group, len = player.pokers.length, num = type.numPokers, result = [];

	if (type == GroupType.双王) {
		return player.twoking;
	} else if (type == GroupType.炸弹) {
		result = player.bomb;
	} else if (type == GroupType.单张) {
		result = result.concat(player.single);
		this._slicePokerFromList(player.pair, result, 1);
		this._slicePokerFromList(player.triple, result, 1);
	} else if (type == GroupType.对子) {
		result = result.concat(player.pair);
		this._slicePokerFromList(player.triple, result, 2);
	} else if (type == GroupType.三张) {
		result = result.concat(player.triple);
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
		result = player.twoking.concat(player.bomb, result);

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
		var single = [].concat(player.single);
		this._slicePokerFromList(player.pair, single, 1);
		this._slicePokerFromList(player.triple, single, 1);

		if (linkNum >= 5) {
			//从大到小排序方便查找顺子
			this.sort1(single);
			for (i = single.length - linkNum; i >= 0; i--) {
				var temp = single.slice(i, i + linkNum);
				var valid = true;
				for ( var j = temp.length - 1; j >= 1; j--) {
					var a = temp[j], b = temp[j - 1];
					if (temp[j].point == 15 || temp[j - 1].point == 15
							|| temp[j].point != temp[j - 1].point - 1) {
						valid = false;
						break;
					}
				}
				if (valid)
					result.unshift(temp);
			}
			return result;
		} else {
			return single;
		}
	}

	var basic = groupNum == 2 ? player.pair : groupNum == 3 ? player.triple
			: groupNum == 4 ? player.bomb : [];
	result = result.concat(basic);

	//只考虑对子情况下去拆开三张，炸弹不拆开	
	if (groupNum == 2 && player.triple.length > 0) {
		for ( var i = 0; i < player.triple.length; i++) {
			var group = player.triple[i];
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
				if (result[i + j - 1][0].point != result[i + j][0].point + 1
						|| result[i + j - 1][0].point >= 15) {
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
AI.findPlusPoker = function(player, target, plusNum, pair) {
	var temp = [], plus;
	if (pair) {
		this._slicePokerFromList(player.triple, temp, 2);
		temp = temp.concat(player.pair);
	} else {
		temp = temp.concat(player.triple, player.pair, player.single);
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
AI.analyzePlayerPokers = function(player) {
	var single = [], pair = [], triple = [], bomb = [], twoking = [];
	var i, p, pokers = player.pokers, len = pokers.length;

	this.sort1(pokers);

	//双王
	if (len >= 2 && pokers[0].point == 17 && pokers[1].point == 16) {
		twoking = [ [ pokers[0], pokers[1] ] ];
	}
	//trace("twoking:", player, twoking);

	//炸弹
	for (i = 3; i < len; i++) {
		p = pokers[i].point;
		if (pokers[i - 3].point == p && pokers[i - 2].point == p
				&& pokers[i - 1].point == p) {
			bomb
					.push( [ pokers[i - 3], pokers[i - 2], pokers[i - 1],
							pokers[i] ]);
			i += 3;
		}
	}
	//trace("bomb:", player, bomb);

	//三张
	for ( var i = 2; i < len; i++) {
		p = pokers[i].point;
		if (pokers[i - 2].point == p && pokers[i - 1].point == p) {
			if ((i >= 3 && pokers[i - 3].point == p)
					|| (i < len - 1 && pokers[i + 1].point == p))
				continue;
			triple.push( [ pokers[i - 2], pokers[i - 1], pokers[i] ]);
			i += 2;
		}
	}
	//trace("triple:", player, triple);

	//对子
	for (i = 1; i < len; i++) {
		p = pokers[i].point;
		if (pokers[i - 1].point == p) {
			if ((i >= 2 && pokers[i - 2].point == p)
					|| (i < len - 1 && pokers[i + 1].point == p))
				continue;
			pair.push( [ pokers[i - 1], pokers[i] ]);
			i++;
		}
	}
	//trace("pair:", player, pair);

	//单张
	for (i = 0; i < len; i++) {
		p = pokers[i].point;
		if (len >= 2 && p == 17 && pokers[i + 1].point == 16) {
			i++;
			continue;
		}
		if ((i >= 1 && pokers[i - 1].point == p)
				|| (i < len - 1 && pokers[i + 1].point == p))
			continue;
		single.push(pokers[i]);
	}
	//trace("single:", player, single);

	player.twoking = twoking;
	player.bomb = bomb;
	player.triple = triple;
	player.single = single;
	player.pair = pair;
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
	this.analyzePlayerPokers(player);

	var i, p, score = 0;

	for (i = 0; i < player.single.length; i++) {
		p = player.single[i].point;
		if (p == 17)
			score += 10;
		else if (p == 16)
			score += 8;
		else if (p > 10)
			score += p - 10;
	}

	for (i = 0; i < player.pair.length; i++) {
		p = player.pair[i][0].point;
		if (p == 15)
			score += 10;
		else if (p == 14)
			score += 8;
		else if (p > 10)
			score += (p - 10) * 1.2 * (1 + (p - 10) / 10);
	}

	for (i = 0; i < player.triple.length; i++) {
		p = player.triple[i][0].point;
		if (p == 15)
			score += 15;
		else if (p == 14)
			score += 12;
		else if (p > 10)
			score += (p - 10) * 2 * (1 + (p - 10) / 10);
	}

	for (i = 0; i < player.bomb.length; i++) {
		p = player.bomb[i][0].point;
		if (p == 15)
			score += 30;
		else if (p == 14)
			score += 24;
		else if (p > 10)
			score += 17 * (1 + (p - 10) / 10);
		else
			score += 16;
	}

	if (player.twoking.length > 0)
		score += 30;

	return player.pokerScore = Math.round(score);
}

//过滤牌组
AI.filterPokers = function(pokers, filter) {
	var result = [];
	for ( var i = 0; i < pokers.length; i++) {
		var poker = pokers[i];
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

//按从大到小排序
AI.sort1 = function(pokers) {
	pokers.sort(function(a, b) {
		var p = b.point - a.point;
		if (p == 0)
			return b.type.rank - a.type.rank;
		return p;
	});
	return pokers;
}

//按从多到少并从大到小排序(双王除外，始终排在第一位)
AI.sort2 = function(pokers) {
	var count = {}, kingNum = 0;
	for ( var i = 0; i < pokers.length; i++) {
		var p = pokers[i];
		if (p.point == 17 || p.point == 16)
			kingNum++;
		count[p.point] == undefined ? count[p.point] = 1 : ++count[p.point];
	}
	pokers.sort(function(a, b) {
		var ca = count[a.point], cb = count[b.point];
		if (ca == cb || (kingNum == 2 && (a.point == 17 || a.point == 16)))
			return b.point - a.point;
		else
			return cb - ca;
	});
	count = null;
	return pokers;
}

//对嵌套数组里的牌组进行从大到小排序
AI.sort3 = function(list) {
	list.sort(function(a, b) {
		return a[0].point < b[0].point;
	});
}

//为了让游戏产生更多的随机性，此函数给出一定几率执行某项动作(0-100)
AI.hasChance = function(chance) {
	var rnd = Math.round(Math.random() * 100 + 1);
	if (rnd <= chance)
		return true;
	return false;
}