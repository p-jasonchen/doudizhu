ddz.initSingleGame = function() {
	//设置游戏背景
	this.bgContext.globalAlpha = 1;
	this.setBackground(R.mainbg);
	//设置顶部工具条背��?
	var topBg = R.toolbar;
	topBg.x = this.width - topBg.width >> 1;
	topBg.y = -2;
	topBg._render(this.bgContext);

	//添加叫牌出牌等信息的画布
	var infoCanvas = this.createCanvas("info", {
		width : this.width,
		height : this.height - 100
	});
	this.infoStage = new Stage(infoCanvas.getContext("2d"));
	this.infoStage.setFrameRate(0);
	this.infoStage.usePixelTrace = false;
	this.container.appendChild(infoCanvas);
	this.infoStage.addEventListener("mousedown", function(e) {
		ddz.removeNavBar();
		if (!e.target || e.target.name != "exit")
			UI.showPopup(false);
	});
	this.infoStage.addChild(UI.toolbar.container);

	//添加玩家牌的画布
	var pokerCanvas = this.createCanvas("poker", {
		width : this.width,
		height : 100,
		top : this.height - 100
	});
	this.pokerStage = new Stage(pokerCanvas.getContext("2d"));
	this.pokerStage.setFrameRate(0);
	this.pokerStage.usePixelTrace = false;
	this.container.appendChild(pokerCanvas);

	//模拟swipe功能一次可选择多个牌相邻牌
	this.isSwiping = false;
	this.swipePokers = [];
	this.pokerStage.addEventListener("mousedown", casual.delegate(
			this.pokerHandler, this));
	this.pokerStage.addEventListener("mousemove", casual.delegate(
			this.pokerHandler, this));
	this.pokerStage.addEventListener("mouseup", casual.delegate(
			this.pokerHandler, this));

	//添加控制按钮的画��?
	var controlCanvas = this.createCanvas("control", {
		width : this.width - 100,
		height : 45,
		left : 50,
		top : this.height - 150
	});
	this.controlStage = new Stage(controlCanvas.getContext("2d"));
	this.controlStage.setFrameRate(0);
	this.controlStage.usePixelTrace = false;
	this.container.appendChild(controlCanvas);

	//清空舞台
	this.playerStage.removeAllChildren();
	//初始化玩��?
	this.initSinglePlayers();
	//初始化舞��?
	this.playerStage.render();

	//开始游戏按��?
	var startBtn = UI.startBtn;
	startBtn.x = this.controlStage.getStageWidth() - startBtn.width >> 1;
	this.controlStage.addChild(startBtn);
	startBtn.fastRender(this.controlStage.context);
	startBtn.onMouseUp = function(e) {
		this.fastClear();
		setTimeout(casual.delegate(ddz.startSingleGame, ddz), 1000);
	};
}

ddz.pokerHandler = function(e) {
	switch (e.type) {
	case "mousedown":
		this.isSwiping = true;
		this.swipePokers.length = 0;
		var obj = this.pokerStage
				.getObjectUnderPoint(e.mouseX, e.mouseY, false);
		if (obj && (obj instanceof Poker)) {
			var index = this.user.pokers.indexOf(obj);
			this.swipePokers.start = this.swipePokers.end = index;
			this.swipePokers.push(obj);
		}
		break;
	case "mouseup":
		this.isSwiping = false;
		var len = this.swipePokers.length;
		if (len > 0) {
			for ( var i = 0; i < this.swipePokers.length; i++) {
				var poker = this.swipePokers[i];
				Poker.select(poker, !poker.selected);
				poker.setMask(false);
			}
			this.pokerStage.render();
			this.swipePokers.start = -1;
			this.swipePokers.end = -1;
			this.swipePokers.length = 0;
		}
		break;
	case "mousemove":
		if (!this.isSwiping)
			return;
		var obj = this.pokerStage
				.getObjectUnderPoint(e.mouseX, e.mouseY, false);
		if (obj && (obj instanceof Poker)) {
			var index = this.user.pokers.indexOf(obj);
			var start = this.swipePokers.start, end = this.swipePokers.end;
			//在选取范围没有改变的情况下，不做任何操��?
			if (index == end && index != start)
				return;
			//记录当前选择的牌为结束点
			if (start < 0)
				start = index;
			end = index;
			var min = start, max = end;
			if (start > end) {
				min = end;
				max = start;
			}

			//加入在范围之内的��?		
			for ( var i = min; i <= max; i++) {
				var poker = this.user.pokers[i];
				if (this.swipePokers.indexOf(poker) == -1) {
					this.swipePokers.push(poker);
				}
			}

			//取消不在范围之内的牌
			for ( var i = 0; i < this.swipePokers.length; i++) {
				var poker = this.swipePokers[i];
				var pindex = this.user.pokers.indexOf(poker);
				if (pindex < min || pindex > max) {
					poker.setMask(false);
					this.swipePokers.splice(i, 1);
					i--;
				} else {
					poker.setMask(true);
				}
			}

			this.swipePokers.start = start;
			this.swipePokers.end = end;
			this.pokerStage.render();
		}
		break;
	}
}

ddz.resetGame = function() {
	this.clearGambleStage();
	this.infoStage.clear();
	this.infoStage.removeAllChildren();
	this.pokerStage.clear();
	this.pokerStage.removeAllChildren();
	this.playerStage.clear();
	UI.toolbar.lastPokers.removeAllChildren();

	if (UI.bubble && UI.bubble.parent)
		UI.bubble.parent.removeChild(UI.bubble);
	if (Player.glow && Player.glow.parent)
		Player.glow.parent.removeChild(Player.glow);
	if (this.dizhu)
		this.dizhu.setPortrait();
	for ( var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		if (player == this.user) {
			player.x = this.width - player.width >> 1;
			player.y = this.height - player.height - 50;
			this.showText("score" + i, true, this.user.score);
		}
		player.reset();
		player.pokers = null;
		player.pokerCount.clear();
		this.playerStage.addChild(player);
		player.fastRender(this.playerStage.context);

		this.showText("name" + i, true, player.name);//========================================================控制显示名字和等��?
		//alert(player.name);
		this.showText("level" + i, true, player.level.title);
		if (i == 0) {
			this.showText("score0", true, "财富:" + this.user.score,
					this.user.x + 5, this.top + player.y + player.height + 30,
					"#54eaef");
		}

		var handup;
		if (i == 0) {
			handup = R.handup;
			handup.x = this.width - handup.width >> 1;
			handup.y = player.y - 35;
		} else if (i == 1) {
			handup = casual.copy(R.handup);
			handup.x = player.x - handup.width - 5;
			handup.y = player.y + 40;
		} else if (i == 2) {
			handup = casual.copy(R.handup);
			handup.x = player.x + player.width + handup.width + 5;
			handup.y = player.y + 40;
			handup.scaleX = -1;
		}
		this.infoStage.addChild(handup);
	}
	UI.toolbar.container.removeChild(UI.toolbar.scoreText);
	UI.toolbar.container.removeChild(UI.toolbar.baseText);
	this.infoStage.addChild(UI.toolbar.container);
	this.infoStage.render();

	this.showControlButtons(false);
	this.controlStage.addChild(UI.startBtn);
	UI.startBtn.fastRender(this.controlStage.context);
}

ddz.initSinglePlayers = function() {
	Player.randomData.length = 0;
	this.players = [];

	for ( var i = 0; i < 3; i++) {
		var player;
		if (i == 0) {
			player = new Player(i, Player.DEFAULT.names[0], Player.DEFAULT);
			player.setPortrait(R.playerDefault);
			player.x = this.width - player.width >> 1;
			player.y = this.height - player.height - 50;
			this.user = player;
			this.getLocalData();
			this.showText("name0", true, player.name, this.left + player.x + 5,
					this.top + player.y + player.height + 1, "#fff");
			this.showText("level0", true, player.level.title, this.left
					+ player.x + 5, this.top + player.y + player.height + 16,
					"#54eaef");
			this.showText("score0", true, "财富:" + this.user.score,
					this.user.x + 5, this.top + player.y + player.height + 30,
					"#54eaef");

			var handup = R.handup;
			handup.x = this.width - handup.width >> 1;
			handup.y = player.y - 35;
			this.infoStage.addChild(handup);
		} else if (i == 1) {
			player = new Player(i, Player.MALE.names[0], Player.MALE);
			player.setPortrait(R.playerMale);
			player.x = this.width - player.width - 2;
			player.y = 2;
			player.level = Level.getRandom(6);
			player.score = player.level.score;
			this.showText("name1", true, player.name, this.left + player.x + 2,
					this.top + player.y + player.height + 1, "#fff");
			this.showText("level1", true, player.level.title, this.left
					+ player.x + 2, this.top + player.y + player.height + 16,
					"#54eaef");

			var handup = casual.copy(R.handup);
			handup.x = player.x - handup.width - 5;
			handup.y = player.y + 40;
			this.infoStage.addChild(handup);
		} else if (i == 2) {
			player = new Player(i, Player.FEMALE.names[0], Player.FEMALE);
			player.setPortrait(R.playerFemale);
			player.x = 2;
			player.y = 2;
			player.level = Level.getRandom(6);
			player.score = player.level.score;
			this.showText("name2", true, player.name, this.left + player.x + 2,
					this.top + player.y + player.height + 1, "#fff");
			this.showText("level2", true, player.level.title, this.left
					+ player.x + 2, this.top + player.y + player.height + 16,
					"#54eaef");

			var handup = casual.copy(R.handup);
			handup.x = player.x + player.width + handup.width + 5;
			handup.y = player.y + 40;
			handup.scaleX = -1;
			this.infoStage.addChild(handup);
		}
		this.players[i] = player;
		this.playerStage.addChild(player);
	}
}

ddz.getLocalData = function() {
	if (this.supportStorage && localStorage.hasOwnProperty("webddz_score")) {
		var score = Number(localStorage.getItem("webddz_score"));
	}

	if (typeof Gamehub1 != "undefined") {
		this.user.score = Gamehub1.Score.get();
	} else {
		this.user.score = !isNaN(score) ? score : 0;
	}
	this.user.level = Level.getLevel(this.user.score);
}

ddz.saveLocalData = function() {
	if (this.supportStorage) {
		//在ipad上如果直接setItem会报错QUOTA_EXCEEDED_ERR 
		if (this.isIpad)
			localStorage.removeItem("webddz_score");
		localStorage.setItem("webddz_score", this.user.score);
	}
}

ddz.showText = function(id, visible, text, x, y, color) {
	//context.fillText在ios3.2及以下的ipad和iphone存在bug，故用dom来处理文字��?
	var span = document.getElementById(id);
	if (!span) {
		span = document.createElement("span");
		if (id)
			span.id = id;
		span.style.position = "absolute";
		span.style.font = this.isMobile ? 'bold 12px 黑体' : '12px 宋体';
		span.style.display = 'inline-block';
		span.style.whiteSpace = 'nowrap';
		span.style.zIndex = 10;	//=========================================================================================================
		if (this.isMobile)
			span.style.textShadow = "1px 1px 1px #000";
		span.style.MozUserSelect = "none";
		span.style.MozUserFocus = "ignore";
		span.style.MozUserInput = "disabled";
		span.onselectstart = function(e) {
			return false;
		};
		this.container.appendChild(span);
	}

	span.style.display = visible ? "block" : "none";
	if(span.style.display){//span.style.display=='block'=======================================================================================
		span.style.zIndex = 10;	
	}
	
	if (x != undefined)
		span.style.left = x + "px";
	if (y != undefined)
		span.style.top = y + "px";
	if (color != undefined)
		span.style.color = color;
	span.innerHTML = text;
}

ddz.startSingleGame = function() {
	trace("startSingleGame:", this.user, this.user.score,
			this.players[1].score, this.players[2].score);

	//清除举手图标
	this.infoStage.removeAllChildren();
	this.infoStage.clear();
	this.infoStage.addChild(UI.toolbar.container);
	this.infoStage.render();

	//设置用户头像位置
	this.user.x = 2;
	this.user.y = this.height - this.user.height - 105;
	this.playerStage.render();
	this.showText("name0", false);
	this.showText("level0", false);
	this.showText("score0", true, "财富:" + this.user.score, this.user.x + 2,
			this.height - 105, "#54eaef");

	//随机生成一副洗好的新牌
	var pokers = Poker.shuffle(Poker.shuffle(Poker.newPack()));
	//给指定玩家分发指定的牌，测试��?
	//pokers = this.showMeMagicPokers(2, "Ww222AAAKQJS9876543");

	//把牌分发给玩家和电脑
	var num = 17;
	for ( var i = 0; i < 3; i++) {
		var player = this.players[i];
		var p = pokers.slice(i * num, (i + 1) * num);
		if (player != this.user)
			AI.sort1(p);
		player.pokers = p;
	}

	//定位玩家的牌
	var pokerGap = 24;
	var sx = this.pokerStage.getStageWidth() - pokerGap * (num - 1)
			- R.pokerWidth >> 1;
	var sy = this.pokerStage.getStageHeight() - R.pokerHeight - 2;
	for ( var i = 0; i < num; i++) {
		var poker = this.players[0].pokers[i];
		poker.x = sx + pokerGap * i;
		poker.y = sy;
		poker.mouseEnabled = false;
		this.pokerStage.addChild(poker);
	}

	//最后三张为底牌
	var gamblePokers = pokers.slice(num * 3);
	//开始发牌动��?
	setTimeout(casual.delegate(this.dealPokers, this), 100, gamblePokers);
}

ddz.dealPokers = function(gamblePokers) {
	//创建用于显示发牌动画的临时画布舞��?
	var tmpCanvas = this.createCanvas("deal", {
		height : this.height - 100,
		top : 40
	});
	var tmpStage0 = new Stage(tmpCanvas.getContext("2d"));
	tmpStage0.setFrameRate(0);
	this.container.appendChild(tmpCanvas);

	for ( var i = 0; i < 6; i++) {
		var poker = new Bitmap(R.poker, R.pokerbg.m);
		poker.x = this.width - poker.width >> 1;
		poker.y = this.height - 260;
		poker.index = i;

		//发牌的动画，每个玩家��?张作为示��?
		tmpStage0.addChild(poker);
		poker.visible = true;
		poker.oldx = poker.x;
		poker.oldy = poker.y;
		var tx = i < 2 ? poker.x : i < 4 ? this.width - 80 : 30;
		var ty = i < 2 ? this.height - 160 : poker.y;
		var delay = 500 * 3 * (i % 2) + 500 * (Math.floor(i / 2));
		setTimeout(TweenUtil.to, delay, poker, (this.playTween ? 200 : 90), {
			x : tx,
			y : ty,
			onUpdate : function() {
				this.target.fastRender(tmpStage0.context);
			},
			onComplete : function() {
				if (this.target.index >= 5)
					ddz.container.removeChild(tmpStage0.canvas);
				else
					this.target.fastClear();
			}
		});
	}

	//创建3个现实最��?张底牌动画的临时画布
	var tmpStage1, tmpStage2, tmpStage3, count = 0;
	for ( var i = 0; i < gamblePokers.length; i++) {
		var poker = new Bitmap(R.poker, R.pokerbg.m);
		var x = this.width - poker.width >> 1;
		var y = this.height - 220 - i * 5;
		var canvas = this.createCanvas("gamble" + i, {
			width : R.pokerbg.m[2],
			height : R.pokerbg.m[3],
			left : x,
			top : y
		});
		var stage = new Stage(canvas.getContext("2d"));
		stage.setFrameRate(0);
		stage.addChildAt(poker);
		this.container.appendChild(canvas);
		canvas.x = x;
		canvas.y = y;
		canvas.index = i;
		if (i == 0)
			tmpStage1 = stage;
		else if (i == 1)
			tmpStage2 = stage;
		else
			tmpStage3 = stage;

		var tx = i == 1 ? x - 45 : i == 2 ? x + 45 : x;
		var ty = this.height - 220;
		var delay = 6 * 500 + i * 200;
		setTimeout(TweenUtil.to, delay, canvas, (this.playTween ? 200 : 0), {
			x : tx,
			y : ty,
			onUpdate : function() {
				this.target.style.left = this.target.x + "px";
				this.target.style.top = this.target.y + "px";
			},
			onComplete : function() {
				this.target.style.left = this.target.x + "px";
				this.target.style.top = this.target.y + "px";
				if (++count >= 3) {
					//发牌完毕，开始叫��?
					setTimeout(casual.delegate(ddz.startGamble, ddz), 500, [
							tmpStage1, tmpStage2, tmpStage3 ], gamblePokers);
				}
			}
		});
	}

	//逐个显示玩家的牌
	var i = 0;
	var interval = setInterval(function() {
		if (i >= 17) {
			clearInterval(interval);
			return;
		}
		//渲染玩家的牌
			var p = ddz.players[0].pokers[i];
			p._render(ddz.pokerStage.context);
			i++;

			//渲染其他玩家的牌��?
			for ( var j = 1; j < 3; j++) {
				var pokerCount = ddz.players[j].pokerCount;
				pokerCount.fastClear(null, true);
				UI.renderNumber(ddz.playerStage.context, pokerCount, i);
			}

		}, 200);
}
