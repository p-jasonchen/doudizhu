Player = function(id, name, sex) {
	Sprite.call(this);

	this.id = id;
	this.name = name;
	this.sex = sex || Player.MALE;
	this.portrait = null;
	this.defaultPortrait = null;

	this.score = 0;
	this.level = Level.getLevel(this.score);

	this.pokers = null;

	this.twoking = [];
	this.bomb = [];
	this.triple = [];
	this.pair = [];
	this.single = [];

	this.pokerScore = 0;

	this.mouseChildren = false;

	this.init();
}
casual.inherit(Player, Sprite);

Player.prototype.init = function() {
	//人物头像像框
	var frame = casual.copy(R.playerFrame);
	this.addChild(frame);
	this.frame = frame;
	this.width = frame.width;
	this.height = frame.height;

	//玩家剩余牌的统计数字
	var count = new GroupBitmap(R.number);
	count.x = frame.x + 2;
	count.y = frame.y + frame.height + 32;
	if (this.id == 0)
		count.y -= 30;
	this.addChild(count);
	this.pokerCount = count;
}

Player.prototype.reset = function() {
	this.twoking.length = 0;
	this.bomb.length = 0;
	this.single.length = 0;
	this.triple.length = 0;
	this.pair.length = 0;

	this.pokerScore = 0;
	this.pokers = null;
	this.lastPokers = null;
}

Player.prototype.getSelectedPokers = function() {
	var result = [];
	for ( var i = 0; i < this.pokers.length; i++) {
		if (this.pokers[i].selected)
			result.push(this.pokers[i]);
	}
	return result;
}

Player.prototype.deletePokers = function(pokers) {
	//注意：这里不会删除single, pair，triple，bomb里保存的引用，它们在AI调用时会自动重新估值
	for ( var i = 0; i < pokers.length; i++) {
		var poker = pokers[i];
		var index = this.pokers.indexOf(poker);
		if (index >= 0)
			this.pokers.splice(index, 1);
		poker.mouseEnabled = false;
	}
}

Player.prototype.clearLastPokers = function() {
	if (!this.lastPokers)
		return;
	for ( var i = 0; i < this.lastPokers.length; i++) {
		var poker = this.lastPokers[i];
		if (poker.parent)
			poker.parent.removeChild(poker);
	}
	this.lastPokers = null;
}

Player.prototype.setPortrait = function(image) {
	if (image && !this.defaultPortrait)
		this.defaultPortrait = image;
	else if (!image && this.defaultPortrait)
		image = this.defaultPortrait;
	if (this.portrait)
		this.removeChild(this.portrait);
	this.portrait = image;
	this.portrait.x = 6;
	this.portrait.y = 7;
	this.addChild(this.portrait);
}

Player.prototype.toString = function() {
	return this.name;
}

Player.prototype.addGlow = function() {
	if (!Player.glow) {
		//init glow
		Player.glow = R.playerGlow;
		Player.glow.x = -4;
		Player.glow.y = -4;
	}
	this.addChildAt(Player.glow, 0);
}

Player.DEFAULT = {
	title : "default",
	names : [ "小毡帽" ]
};

Player.DIZHU = {
	title : "dizhu",
	names : [ "地主" ]
};

Player.MALE = {
	title : "male",
	names : [ "韦小宝" ]
};

Player.FEMALE = {
	title : "female",
	names : [ "小萝莉" ]
};

Player.randomData = [];
Player.getRandomUser = function(sex) {
	if (!sex)
		sex = Math.random() > 0.5 ? Player.MALE : Player.FEMALE;
	var index = Math.floor(Math.random() * sex.names.length);
	var name = sex.names[index];
	if (Player.randomData.indexOf(name) == -1) {
		Player.randomData.push(name);
		return {
			sex : sex,
			name : name,
			portrait : sex.portraits[index]
		};
	}
	return Player.getRandomUser(sex);
}

Player.getRandomName = function() {
	var rnd = Math.floor(Math.random() * Player.ROBOT_NAMES.length);
	return Player.ROBOT_NAMES[rnd];
}