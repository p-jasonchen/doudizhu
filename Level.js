Level = function(score, title) {
	this.score = score;
	this.title = title;
	Level[score] = this;
};
Level.prototype.toString = function() {
	return this.title + "_" + this.score
};

//等级列表
Level.list = [];
Level.list.push(new Level(0, "包身工"));
Level.list.push(new Level(10, "短工"));
Level.list.push(new Level(25, "长工"));
Level.list.push(new Level(40, "佃户"));
Level.list.push(new Level(80, "贫农"));
Level.list.push(new Level(140, "渔夫"));
Level.list.push(new Level(230, "猎人"));
Level.list.push(new Level(365, "中农"));
Level.list.push(new Level(500, "富农"));
Level.list.push(new Level(700, "掌柜"));
Level.list.push(new Level(1000, "商人"));
Level.list.push(new Level(1500, "衙役"));
Level.list.push(new Level(2200, "小财主"));
Level.list.push(new Level(3000, "大财主"));
Level.list.push(new Level(4000, "小地主"));
Level.list.push(new Level(5500, "大地主"));
Level.list.push(new Level(7700, "知县"));
Level.list.push(new Level(10000, "通判"));
Level.list.push(new Level(14000, "知府"));
Level.list.push(new Level(20000, "总督"));
Level.list.push(new Level(30000, "巡抚"));
Level.list.push(new Level(45000, "丞相"));
Level.list.push(new Level(70000, "帝王"));

//根据积分返回相应的等级
Level.getLevel = function(score) {
	var list = this.list;
	if (score <= 0)
		return list[0];
	for ( var i = 0, len = list.length; i < len - 1; i++) {
		if (score >= list[i].score && score < list[i + 1].score) {
			return list[i];
		}
	}
	return list[len - 1];
}

//比较两个等级
Level.compare = function(level1, level2) {
	return this.list.indexOf(level1) >= this.list.indexOf(level2);
}

//返回一个不小于指定参数的随机等级
Level.getRandom = function(min) {
	var rnd = Math.floor(Math.random() * (this.list.length - min)) + min;
	return this.list[rnd];
}