ddz.startGamble = function(stage, pokers) {
	this.baseScore = 1; //底分
	this.scoreRate = 1; //倍数
	this.dizhu = null; //地主

	if (!this.gambleData)
		this.gambleData = {};
	this.gambleData.interval = 1500; //叫牌的时间间隔
	this.gambleData.stage = stage; //叫牌时底牌的渲染舞台
	this.gambleData.pokers = pokers; //叫牌时的最后三张底牌
	this.gambleData.player = null; //当前叫牌的玩家
	this.gambleData.score = 0; //当前叫牌分数
	this.gambleData.turn = -1; //当前叫牌的用户索引序号
	this.gambleData.count = 0; //已叫牌的次数
	this.gambleData.total = 3; //可叫牌的总次数，应和玩家总数相等
	this.gambleData.rect = []; //储存叫牌提示元素的矩形范围		

	//按照从大到小的顺序排序玩家的牌，方便玩家评估叫牌
	AI.sort1(this.user.pokers);
	this.resortPokers(true, false);
	this.pokerStage.render();

	//设置开始叫分的玩家
	this.determineGambleStart();
	//玩家轮流叫牌
	this.processGamble();
}

//确定叫牌开始的用户
ddz.determineGambleStart = function() {
	//系统随机选定第一个叫牌的的人
	this.gambleData.turn = Math.floor(Math.random() * this.players.length);
	this.gambleData.turn = 1; //for testing
}

//叫分循环流程
ddz.processGamble = function() {
	//所有玩家都已叫牌， 或已叫出最大分数，则叫牌结束
	if (this.gambleData.count >= this.gambleData.total
			|| this.gambleData.score >= 3) {
		this.onGambleComplete();
	} else {
		var player = this.players[this.gambleData.turn];
		var score = AI.gamble(player);

		if (this.gambleData.turn == 0) {
			//显示玩家的叫分按钮
			this.showGambleButtons(true, this.gambleData.score);
		} else {
			//电脑AI叫牌						
			this.onGambleResult(player, score);
		}
	}
}

//叫分结果处理
ddz.onGambleResult = function(player, score) {
	trace("gamble:", player, score, player.pokerScore, player.pokers);

	//叫分成功
	var success = score > this.gambleData.score;
	if (success) {
		this.gambleData.player = player;
		this.gambleData.score = score;
	} else {
		score = 0;
	}

	//叫分完成，隐藏玩家的叫分按钮，或显示其他玩家的叫分
	switch (this.gambleData.turn) {
	case 0:
		this.showGambleButtons(false);
		break;
	case 1:
		UI.showBubble(true, "gamble" + score, true, this.infoStage, this.width - 100, 40);
		this.gambleData.rect[1] = new Rectangle(this.width - 100 - 42, 40, 84, 48);
		break;
	case 2:
		UI.showBubble(true, "gamble" + score, false, this.infoStage, 100, 40);
		this.gambleData.rect[2] = new Rectangle(100 - 42, 40, 84, 48);
		break;
	}

	if ((player == this.user && score >= 3)||(this.gambleData.count == this.gambleData.total - 1)) {
		//如果玩家叫出最高分或是最后一个叫牌者，不停顿直接完成叫牌
		this.onGambleComplete();
	} else {
		//继续下一个玩家叫分	
		this.gambleData.turn = this.gambleData.turn < (this.gambleData.total - 1) ? ++this.gambleData.turn
				: 0;
		this.gambleData.count++;
		setTimeout(casual.delegate(this.processGamble, this),
				this.gambleData.interval);
	}
}

//叫牌完成处理
ddz.onGambleComplete = function() {
	trace("onGambleComplete:", this.gambleData.player, this.gambleData.score);
	if (this.gambleData.player == null) {
		//没人叫牌，重新开始
		trace("no gamble, restart");
		this.resetGame();
		return;
	}

	//删除叫分按钮和叫分提示
	this.showGambleButtons(false);
	var rect = this.gambleData.rect[1];
	if (rect)
		this.infoStage.clear(rect.x, rect.y, rect.width, rect.height);
	rect = this.gambleData.rect[2];
	if (rect)
		this.infoStage.clear(rect.x, rect.y, rect.width, rect.height);
	this.gambleData.rect = null;

	//设置底分
	this.baseScore = this.gambleData.score;
	//设置地主
	this.setDiZhu(this.gambleData.player);

	//三张底牌移动到顶部工具栏里
	var stages = this.gambleData.stage;
	this.gambleData.pcount = 0;
	for ( var i = 0; i < 3; i++) {
		var stage = stages[i];
		TweenUtil.to(stage.canvas, (this.playTween ? 200 : 0), {
			y : -60,
			onUpdate : function() {
				this.target.style.left = this.target.x + "px";
				this.target.style.top = this.target.y + "px";
			},
			onComplete : function() {
				this.target.style.left = this.target.x + "px";
				this.target.style.top = this.target.y + "px";
				if (++ddz.gambleData.pcount >= 3) {
					ddz.clearGambleStage();
					delete ddz.gambleData.pcount;
					//玩家可以开始出牌
					ddz.startPlay();
				}
			}
		});
	}

	//显示三张底牌到顶部工具栏中
	for ( var i = 0, len = this.gambleData.pokers.length; i < len; i++) {
		var p = this.gambleData.pokers[i];
		var poker = new Poker(p.point, p.type, "s");
		poker.x = i * poker.width + 2;
		poker.y = 1;
		poker.mouseEnabled = false;
		UI.toolbar.lastPokers.addChild(poker);
	}
	this.infoStage.addChild(UI.toolbar.lastPokers);
	UI.toolbar.lastPokers.fastRender(this.infoStage.context);

	//显示底分和倍率
	//this.infoStage.addChild(UI.toolbar.container);
	UI.toolbar.container.addChild(UI.toolbar.scoreText);
	UI.toolbar.container.addChild(UI.toolbar.baseText);
	this.infoStage.addChild(UI.toolbar.scoreRate);
	this.infoStage.addChild(UI.toolbar.baseScore);
	UI.toolbar.container.fastRender(this.infoStage.context);
	this.setBaseScoreAndRate(this.baseScore, this.scoreRate);

	//清空叫分数据
	this.gambleData.turn = -1;
	this.gambleData.count = 0;
	this.gambleData.score = 0;
	this.gambleData.player = null;
}

//删除临时创建的显示底牌的画布
ddz.clearGambleStage = function() {
	var stages = this.gambleData ? this.gambleData.stage : null;
	if (!stages)
		return;
	for ( var i = 0; i < 3; i++) {
		var stage = stages[i];
		stage.removeAllChildren();
		this.container.removeChild(stage.canvas);
		stage = null;
	}
	ddz.gambleData.stage = null;
	stages = null;
}

//设置底分和倍数
ddz.setBaseScoreAndRate = function(baseScore, scoreRate) {
	if (scoreRate) {
		UI.renderNumber(this.infoStage.context, UI.toolbar.scoreRate,
				scoreRate, true, true);
	}
	if (baseScore) {
		UI.renderNumber(this.infoStage.context, UI.toolbar.baseScore,
				baseScore, true, true);
	}
}

//设置地主
ddz.setDiZhu = function(player) {
	trace("setDiZhu:", player);
	this.dizhu = player;
	//设置地主头像
	player.setPortrait(R.playerDizhu);
	player.fastRender(this.playerStage.context);
	//地主获得三张底牌
	player.pokers = player.pokers.concat(this.gambleData.pokers);
	//把玩家的牌重新排序	
	this.resortPokers(true, true);
	this.pokerStage.render();

	if (player != this.user) {
		//地主的牌要重新排序
		AI.sort1(player.pokers);
		//设置用户的牌数
		UI.renderNumber(this.playerStage.context, player.pokerCount,
				player.pokers.length);
	}
}

//显示或隐藏叫牌按钮
ddz.showGambleButtons = function(visible, minScore) {
	if (!this.gambleBtns) {
		var gambleBtns = new Sprite();
		this.gambleBtns = gambleBtns;

		var noGambleBtn = UI.noGambleBtn;
		noGambleBtn.x = 20;
		noGambleBtn.id = 0;

		var gambleBtn3 = UI.gambleBtn3;
		gambleBtn3.x = this.controlStage.getStageWidth() - gambleBtn3.width;
		gambleBtn3.id = 3;

		var gambleBtn2 = UI.gambleBtn2;
		gambleBtn2.x = gambleBtn3.x - gambleBtn2.width - 10;
		gambleBtn2.id = 2;

		var gambleBtn1 = UI.gambleBtn1;
		gambleBtn1.x = gambleBtn2.x - gambleBtn1.width - 10;
		gambleBtn1.id = 1;

		gambleBtns.addChild(noGambleBtn);
		gambleBtns.addChild(gambleBtn1);
		gambleBtns.addChild(gambleBtn2);
		gambleBtns.addChild(gambleBtn3);

		//叫牌的按钮事件
		noGambleBtn.onMouseUp = gambleBtn1.onMouseUp = gambleBtn2.onMouseUp = gambleBtn3.onMouseUp = function(
				e) {
			this.stage = null;
			ddz.onGambleResult(ddz.user, e.target.id);
		};
	}

	if (visible) {
		if (minScore > 0) {
			//只有大于最小分数的按钮才能点击
			for ( var i = 1, num = this.gambleBtns.getNumChildren(); i < num; i++) {
				var btn = this.gambleBtns.getChildAt(i);
				if (btn.id <= minScore)
					btn.setState(Button.state.DISABLED);
			}
		}
		this.controlStage.addChild(this.gambleBtns);
		this.gambleBtns.fastRender(this.controlStage.context);
	} else {
		this.controlStage.removeChild(this.gambleBtns);
		this.controlStage.clear();
	}
}
