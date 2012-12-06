ddz.startPlay = function() {
	this.turnWinner = null; //本局赢家
	this.turnInterval = 1500; //每局出牌的时间间��?

	this.playTurn = this.players.indexOf(this.dizhu); //地主开始出��?
	this.lastPokers = null; //当前轮次中最后出的牌
	this.lastType = null; //当前轮次中的牌型
	this.lastWinner = null; //当前轮次中牌最大的玩家
	this.lastRect = []; //玩家最后出牌的矩形范围，用于清除画��?
	this.lastTip = null; //当前轮次的玩家所有出牌提��?
	this.lastTipIndex = 0; //当前轮次的玩家出牌提示索引位��?

	this.nextTurn(false);
}

ddz.getNextTurn = function() {
	return this.playTurn < (this.players.length - 1) ? (this.playTurn + 1) : 0;
}

ddz.nextTurn = function(next) {
	if (next) {
		var lastPlayer = this.players[this.playTurn];
		this.playTurn = this.getNextTurn();
	}
	var player = this.players[this.playTurn];
	player.clearLastPokers();
	player.addGlow(); //高亮用户的头��?
	player.fastRender(this.playerStage.context);

	//其他玩家没有大于当前玩家的牌，本轮出牌结束，玩家可以任意出牌
	if (player == this.lastWinner) {
		this.lastPokers = null;
		this.lastType = null;
		this.freePlayer = null;
	}

	if (lastPlayer) {
		//删除上用户的高亮效果
		lastPlayer.fastClear(new Rectangle(lastPlayer.x - 7, lastPlayer.y - 7,
				lastPlayer.width + 15, lastPlayer.height + 22));
		this.playerStage.addChild(lastPlayer);
		lastPlayer.fastRender(this.playerStage.context);
	}

	//清除上次所出的牌或者其他出牌信��?
	var rect = this.lastRect[this.playTurn];
	if (rect) {
		var stage = this.playTurn == 0 ? this.playerStage : this.infoStage;
		stage.clear(rect.x, rect.y, rect.width, rect.height);
	}

	if (player == this.user) {
		this.lastTip = null;
		this.lastTipIndex = 0;
		this.showControlButtons(true);
	} else {
		setTimeout(casual.delegate(this.processTurn, this), this.turnInterval);
	}
}

//电脑AI出牌
ddz.processTurn = function() {
	var player = this.players[this.playTurn];
	var lastPlayer = this.playTurn == 0 ? this.players[2]
			: this.playTurn == 1 ? this.players[0] : this.players[1];
	var nextPlayer = this.playTurn == 0 ? this.players[1]
			: this.playTurn == 1 ? this.players[2] : this.players[0];
	var againstPlayer = player != this.dizhu ? this.dizhu
			: lastPlayer.pokers.length < nextPlayer.pokers.length ? lastPlayer
					: nextPlayer;

	if (this.lastType) {
		//跟随出牌
		var selectedPokers = AI.findBestPokers(player, this.lastType,
				this.lastPokers, true);
		trace("findBestPokers:", player, this.lastType, selectedPokers,
				this.lastPokers);
		if (selectedPokers && selectedPokers.length < player.pokers.length) {
			//如果上次出牌的是同盟玩家，则考虑是否要出��?
			if (player != this.dizhu && this.lastWinner != this.dizhu) {
				//如果上家没有压同盟玩家的牌且同盟玩家为自由出牌者，则放弃出牌让其获得牌��?
				if (nextPlayer == this.lastWinner
						&& nextPlayer == this.freePlayer) {
					this.skipPlay(player);
					return;
				}

				//如果下家除开炸弹外没有能大起上家的牌，则放弃出牌				
				var nextPokers = AI.findBestPokers(nextPlayer, this.lastType,
						this.lastPokers, false);
				if ((!nextPokers || nextPokers.length == 0) && AI.hasChance(95)) {
					this.skipPlay(player);
					return;
				}

				//如果同盟玩家的牌大于A，则不出��?			
				var sorted = AI.sort1(selectedPokers);
				if ((this.lastPokers[0].point >= 15 || sorted[0].point >= 16)
						&& (player.pokers.length - sorted.length > 4)
						&& AI.hasChance(80)) {
					this.skipPlay(player);
					return;
				}

				//如果出了点数大于A的牌(非单��?后还比同盟玩家牌多，则放弃出��?
				if (sorted.length > 1
						&& sorted[0].point >= 14
						&& player.pokers.length - sorted.length > this.lastWinner.pokers.length
						&& AI.hasChance(80)) {
					this.skipPlay(player);
					return;
				}

				//三张2在对家所剩牌数还比较多的时候不��?
				if (sorted.length >= 3 && sorted[0].point == 15
						&& sorted[1].point == 15 && sorted[2].point == 15
						&& againstPlayer.pokers.length > 5) {
					this.skipPlay(player);
					return;
				}
			}

			//在对家还��?张牌以上时，如果剩余牌数大于一定数目的时候，不出炸弹或双��?
			var type = Rule.getType(selectedPokers);
			if (type == GroupType.炸弹 || type == GroupType.双王) {
				//如果是单张且只有双王，则拆开出小��?
				if (this.lastType == GroupType.单张 && type == GroupType.双王
						&& player.bomb.length == 0
						&& againstPlayer.pokers.length < 10) {
					selectedPokers = selectedPokers[1];
				} else if (againstPlayer.pokers.length > 5) {
					if (player.pokers.length - selectedPokers.length > 8
							&& AI.hasChance(90)) {
						this.skipPlay(player);
						return;
					} else if (player.pokers.length - selectedPokers.length > 5
							&& AI.hasChance(60)) {
						this.skipPlay(player);
						return;
					}
				}
			}

			//当对手只剩下1��?张牌时，则从最大的开始出
			if (againstPlayer.pokers.length == 1
					&& this.lastType == GroupType.单张) {
				var singles = AI.findAllByType(player, GroupType.单张,
						this.lastPokers, false);
				if (singles.length > 0)
					selectedPokers = singles[0];
			} else if (againstPlayer.pokers.length == 2
					&& this.lastType == GroupType.对子
					&& Rule.getType(againstPlayer.pokers) == GroupType.对子) {

				var pairs = AI.findAllByType(player, GroupType.对子,
						this.lastPokers, false);
				if (pairs.length > 0)
					selectedPokers = pairs[0];
			}

			//准备出牌
			Poker.select(selectedPokers, true);
			this.playPoker(player);
		} else if (selectedPokers) {
			Poker.select(selectedPokers, true);
			this.playPoker(player);
		} else {
			this.skipPlay(player);
		}
	} else {
		//自由出牌		
		var bestPokers = AI.findBestPokers(player, null, null, true), bestPokers2;
		if (bestPokers.length != player.pokers.length) {
			AI.analyzePlayerPokers(againstPlayer);
			var leftPokers = AI.filterPokers(player.pokers, bestPokers);
			if (Rule.getType(leftPokers)
					&& leftPokers[0].point >= againstPlayer.pokers[0].point) {
				//当玩家只剩下2手牌的时候，如果对手最大的牌都大不过则出最大的��?
				bestPokers2 = leftPokers;
			} else {
				//当对手的牌少��?个的时候，则出其没有或者打不起的牌��?对子或三��?
				if (againstPlayer.pokers.length <= 5) {
					var pairs2 = AI.findAllByType(againstPlayer, GroupType.对子);
					var pairs1 = AI.findAllByType(player, GroupType.对子,
							pairs2[0]);
					var triples2 = AI
							.findAllByType(againstPlayer, GroupType.三张);
					var triples1 = AI.findAllByType(player, GroupType.三张,
							triples2[0]);
					if (triples1.length > 0) {
						var triple = triples1[triples1.length - 1];
						bestPokers2 = AI.findPlusPoker(player, triple, 2, true);
						if (!bestPokers2
								|| bestPokers2[bestPokers2.length - 1].point >= 14)
							bestPokers2 = AI.findPlusPoker(player, triple, 1,
									false);
						if (!bestPokers2
								|| bestPokers2[bestPokers2.length - 1].point >= 15)
							bestPokers2 = triple;
					} else if (pairs1.length > 0) {
						bestPokers2 = pairs1[pairs1.length - 1];
					}
				}

				//freePlayer标记一个正在自由出��?againstPlayer无法打过)的电��?
				if (bestPokers2)
					this.freePlayer = player;

				//当对手只剩下1��?张牌且无对子或三张可出，则从最大的单张开始出
				if (!bestPokers2
						&& (againstPlayer.pokers.length == 1 || againstPlayer.pokers.length == 2)) {
					var singles = AI.findAllByType(player, GroupType.单张);
					if (singles.length > 0)
						bestPokers2 = singles[0];
				}
			}
		}

		var pokers = bestPokers2 || bestPokers;
		Poker.select(pokers, true);
		this.playPoker(player);
	}
}

ddz.playPoker = function(player) {
	//获得玩家要出的牌
	var pokers = player.getSelectedPokers();
	var type = Rule.getType(pokers);
	var len = pokers.length;
	if (type == null || len == 0)
		return;
	trace("playPoker:", player, type, pokers);

	this.lastType = type;
	this.lastPokers = pokers;
	this.lastWinner = player;

	player.lastPokers = pokers;
	player.deletePokers(pokers);

	var gap = 15;
	if (player == this.user) {
		//本机玩家出牌
		this.showControlButtons(false);
		var px = this.width - R.pokerfg.m[2] >> 1;
		var py = this.height - R.pokerfg.m[3] - 100 >> 0;
		var center = (len % 2 == 0) ? (len - 1) * 0.5 : Math.floor(len * 0.5);
		for ( var i = 0; i < len; i++) {
			var poker = pokers[i];
			this.pokerStage.removeChild(poker);
			poker = new Poker(poker.point, poker.type, "m");
			poker.x = px + (i - center) * gap >> 0;
			poker.y = py;
			if (i == 0)
				var startx = poker.x;
			poker._render(this.playerStage.context);
		}
		this.lastRect[0] = new Rectangle(startx, py, Math.round(gap * (len - 1)
				+ poker.width), poker.height);
		this.resortPokers(false, true);
		this.pokerStage.render();
	} else {
		var index = this.players.indexOf(player), line = len >= 19 ? 10 : 9;
		if (index == 1) {
			//右上玩家
			var left = this.width - 46 - R.pokerfg.m[2] - Math.min(len, line)
					* gap >> 0;
			for ( var i = 0; i < len; i++) {
				var poker = pokers[i];
				poker = new Poker(poker.point, poker.type, "m");
				poker.x = left + (i % line) * gap;
				poker.y = i < line ? 45 : 60;
				if (i == 0)
					var startx = poker.x;
				poker._render(this.infoStage.context);
			}
			this.lastRect[1] = new Rectangle(startx, 45, Math.round(gap
					* (Math.min(len, line) - 1) + R.pokerfg.m[2]), Math
					.round(R.pokerfg.m[3] + (len > line ? 18 : 0)));
		} else if (index == 2) {
			//左上玩家
			for ( var i = 0; i < len; i++) {
				var poker = pokers[i];
				poker = new Poker(poker.point, poker.type, "m");
				poker.x = 62 + (i % line) * gap;
				poker.y = i < line ? 45 : 60;
				if (i == 0)
					var startx = poker.x;
				poker._render(this.infoStage.context);
			}
			this.lastRect[2] = new Rectangle(startx, 45, Math.round(gap
					* (Math.min(len, line) - 1) + R.pokerfg.m[2]), Math
					.round(R.pokerfg.m[3] + (len > line ? 18 : 0)));
		}
	}

	//如果是双王或炸弹，则倍数翻��?
	if (type == GroupType.双王 || type == GroupType.炸弹) {
		this.scoreRate = this.scoreRate * 2;
		this.setBaseScoreAndRate(null, this.scoreRate);
	}

	//更新用户的牌��?
	if (player != this.user) {
		player.pokerCount.fastClear(null, true);
		UI.renderNumber(this.playerStage.context, player.pokerCount,
				player.pokers.length);
	}

	if (player.pokers.length <= 0) {
		//玩家已经出玩所有的牌，游戏结束
		//alert(player);//==================================================================小毡��?��?,韦小��?右上),小萝��?右上)
		this.turnWinner = player;
		//
		setTimeout(casual.delegate(this.gameOver, this), this.turnInterval);
	} else {
		this.nextTurn(true);//下一个玩家开始出��?
	}
}

ddz.skipPlay = function(player) {
	trace("skipPlay:", player, this.lastType);

	//显示不出的提��?
	switch (this.playTurn) {
	case 0:
		this.showControlButtons(false);
		UI.showBubble(true, "noplay", false, this.playerStage, 100,
				this.height - 160);
		this.lastRect[0] = new Rectangle(100 - 42, this.height - 160, 84, 48);
		break;
	case 1:
		UI.showBubble(true, "noplay", true, this.infoStage, this.width - 100,
				40);
		this.lastRect[1] = new Rectangle(this.width - 100 - 42, 40, 84, 48);
		break;
	case 2:
		UI.showBubble(true, "noplay", false, this.infoStage, 100, 40);
		this.lastRect[2] = new Rectangle(100 - 42, 40, 84, 48);
		break;
	}
	player.clearLastPokers();
	this.pokerStage.render();

	//下一个玩家开始出��?
	this.nextTurn(true);
}

ddz.gameOver = function() {//==========================================game over
	//显示玩家剩余的牌	
	var gap = 15;
	for ( var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		var rect = this.lastRect[i];
		if (rect) {
			var stage = i == 0 ? this.playerStage : this.infoStage;
			if (player != this.turnWinner || (player == this.user && rect.x == 100 - 42)) {
				stage.clear(rect.x, rect.y, rect.width, rect.height);
			}
		}
		if (player == this.turnWinner || player == this.user){
			continue;
		}

		var len = player.pokers.length, line = len >= 19 ? 10 : 9;
		if (i == 1) {
			var left = this.width - 46 - R.pokerfg.m[2] - Math.min(len, line)
					* gap >> 0;
			for ( var j = 0; j < len; j++) {
				var poker = player.pokers[j];
				poker = new Poker(poker.point, poker.type, "m");
				poker.x = left + (j % line) * gap;
				poker.y = j < line ? 45 : 60;
				//alert(this.infoStage.context+"........");
				poker._render(this.infoStage.context);
			}
		} else if (i == 2) {
			for ( var j = 0; j < len; j++) {
				var poker = player.pokers[j];
				poker = new Poker(poker.point, poker.type, "m");
				poker.x = 62 + (j % line) * gap;
				poker.y = j < line ? 45 : 60;
				//alert(this.infoStage.context+"....");
				poker._render(this.infoStage.context);
			}
		}
	}

	//计算分数
	var score = this.baseScore * this.scoreRate, scores = [];
	for ( var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		if (player == this.turnWinner || (this.turnWinner != this.dizhu && player != this.dizhu)) {
			//地主获得双倍积��?
			if (player == this.dizhu){
				scores[i] = score * 2;
			}else{
				scores[i] = score;
			}
		} else {
			//输家失分
			if (player == this.dizhu){
				scores[i] = -score * 2;
			}else{
				scores[i] = -score;
			}
		}
		player.score = parseInt(player.score);
		player.score += parseInt(scores[i]);
		this.saveLocalData();

		if (i == 0) {
			this.showText("score0", false);
			if (Gamehub1) {
				//alert(this.user.score);
				//alert(score[i]);//=======================================================undefined
				Gamehub.Score.submitHide(this.user.score);
				//Gamehub1.achi_DouDiZhu();
			}
		}

		//检查玩家等级是否改��?
		var level = Level.getLevel(player.score);
		if (level != player.level) {
			if (player == this.user) {
				var upgrade = Level.compare(level, player);
				if (upgrade) {
					Gamehub1.Level.update(level.title);
					//TODO: 玩家升级动画��?
					trace("upgrade", player, level);
				}
			}
			player.level = level;
		}
	}
	trace("gameOver:", "winner:", this.turnWinner, "myScore:", this.user.score);
	setTimeout(casual.delegate(this.playAnimation, this), 1000, scores);
}

//播放结束动画
ddz.playAnimation = function(scores) {
	//让画面变暗的半透明��?
	var modalCanvas = this.createCanvas("modal", {
		width : this.width,
		height : this.height
	});
	var modalContext = modalCanvas.getContext("2d");
	modalContext.globalAlpha = 0.5;
	modalContext.fillStyle = "#000000";
	modalContext.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
	this.container.appendChild(modalCanvas);

	var resultCanvas = this.createCanvas("result", {
		width : this.width,
		height : this.height
	});
	var resultContext = resultCanvas.getContext("2d");
	var resultStage = new Stage(resultContext);
	resultStage.setFrameRate(0);
	resultStage.mouseEnabled = false;
	this.container.appendChild(resultCanvas);

	var bmp = this.turnWinner == this.dizhu ? R.dizhuWin : R.poolWin;
	bmp.alpha = 1;
	bmp.oldx = bmp.x = resultCanvas.width - bmp.width >> 1;
	bmp.oldy = bmp.y = resultCanvas.height;
	resultStage.addChild(bmp);
	bmp.fastRender(resultContext);

	//从下往上渐显动��?
	TweenUtil.to(bmp, 200, {
		y : (resultCanvas.height - bmp.height >> 1) - 20,
		onUpdate : function() {
			bmp.fastRender(resultContext);
		},
		onComplete : function() {
			bmp.fastRender(resultContext);
			ddz.playScoreAnimation(scores);

			//从下往上渐消动��?
		setTimeout(function() {
			TweenUtil.to(bmp, 200, {
				y : -bmp.height,
				alpha : 0,
				onUpdate : function() {
					bmp.fastRender(resultStage.context);
				},
				onComplete : function() {
					bmp.fastClear();
					bmp.stage = null;
					ddz.container.removeChild(resultCanvas);
					ddz.container.removeChild(modalCanvas);

					//清除显示玩家积分动画的计时器
				for ( var i = 0; i < ddz.players.length; i++) {
					var player = ddz.players[i];
					if (player.scoreInterval != undefined) {
						clearInterval(player.scoreInterval);
						delete player.scoreInterval;
					}
				}
				ddz.resetGame();
			}
			})
		}, 2500);
	}
	});
}

ddz.playScoreAnimation = function(scores) {
	var stage = this.playerStage;

	for ( var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		var bmp = player.pokerCount;
		bmp.fastClear(null, true);
		var score = player.score, oldScore = score - scores[i], stepInterval = 100, count = 0;
		bmp = UI.getNumber(bmp, oldScore, true);
		if (i == 1 && bmp.width > 50)
			bmp.x = Math.min(bmp.x, 50 - bmp.width);
		bmp.fastRender(stage.context, false, true);

		player.scoreInterval = setInterval(function(obj) {
			if (obj.start != obj.end) {
				obj.start < obj.end ? obj.start++ : obj.start--;
				obj.target.fastClear(null, true);
				if (obj.id == 1)
					obj.target.x = Math
							.min(obj.target.x, 50 - obj.target.width);
				UI.renderNumber(stage.context, obj.target, obj.start, true);
			} else {
				obj.target.fastClear(null, true);
				if (obj.id == 1)
					obj.target.x = Math
							.min(obj.target.x, 50 - obj.target.width);
				UI.renderNumber(stage.context, obj.target, obj.start, true);
				obj.target.x = 2;
				var player = ddz.players[obj.id];
				clearInterval(player.scoreInterval);
				delete player.scoreInterval;
				//if(++count >= 3) ddz.clearScoreStage();
			}
		}, stepInterval, {
			id : i,
			target : bmp,
			start : oldScore,
			end : score
		});
	}
}

//用户牌被选中或取消选中的处理函��?
ddz.onPokerSelect = function(poker) {
	if (this.playTurn != 0)
		return;
	var hasSelected = poker.selected
			|| (this.user.getSelectedPokers().length > 0);
	var state = hasSelected ? Button.state.UP : Button.state.DISABLED;
	if (this.controlBtns.resetBtn.state != state) {
		this.controlBtns.resetBtn.setState(state);
		this.controlBtns.resetBtn.fastRender(this.controlStage.context);
	}
	if (this.controlBtns.playBtn.state != state) {
		this.controlBtns.playBtn.setState(state);
		this.controlBtns.playBtn.fastRender(this.controlStage.context);
	}
}

//重新排序和刷新显示玩家的��?
ddz.resortPokers = function(resortAll, mouseEnabled) {
	AI.sort1(this.user.pokers);
	var maxGap = 30, minGap = 21, num = this.user.pokers.length;
	var pokerGap = Math
			.floor((this.pokerStage.getStageWidth() - 20 - R.pokerWidth)
					/ (num - 1));
	pokerGap = Math.max(minGap, Math.min(maxGap, pokerGap));
	var sx = this.pokerStage.getStageWidth() - pokerGap * (num - 1)
			- R.pokerWidth >> 1;
	var sy = this.pokerStage.getStageHeight() - R.pokerHeight - 2;
	for ( var i = 0; i < num; i++) {
		var poker = this.user.pokers[i];
		poker.x = sx + pokerGap * i;
		poker.y = sy;
		poker.mouseEnabled = mouseEnabled;
		//TODO: 重新排序，这里需要优��?
		if (resortAll) {
			this.pokerStage.removeChild(poker);
			this.pokerStage.addChild(poker);
		}
	}
}

ddz.showControlButtons = function(visible) {
	if (!this.controlBtns) {
		var controlBtns = new Sprite();
		this.controlBtns = controlBtns;

		var playBtn = UI.playBtn;
		playBtn.x = this.controlStage.getStageWidth() - playBtn.width;
		controlBtns.playBtn = playBtn;

		var tipBtn = UI.tipBtn;
		tipBtn.x = playBtn.x - tipBtn.width - 10;
		tipBtn.name = "tipBtn";
		controlBtns.tipBtn = tipBtn;

		var resetBtn = UI.resetBtn;
		resetBtn.x = tipBtn.x - resetBtn.width - 10;
		controlBtns.resetBtn = resetBtn;

		var skipBtn = UI.skipBtn;
		skipBtn.x = 20;
		controlBtns.skipBtn = skipBtn;

		controlBtns.addChild(playBtn);
		controlBtns.addChild(tipBtn);
		controlBtns.addChild(resetBtn);
		controlBtns.addChild(skipBtn);

		skipBtn.onMouseUp = function(e) {
			this.stage = null;
			var selected = ddz.user.getSelectedPokers();
			if (selected.length > 0) {
				Poker.select(selected, false);
			}
			ddz.skipPlay(ddz.user);
		}

		resetBtn.onMouseUp = function(e) {
			var selected = ddz.user.getSelectedPokers();
			if (selected.length > 0) {
				Poker.select(selected, false);
				ddz.pokerStage.render();
			}
		}

		tipBtn.onMouseUp = function(e) {
			//取消已经选择的牌
			var selectedPokers = ddz.user.getSelectedPokers();
			if (selectedPokers.length > 0) {
				Poker.select(selectedPokers, false);
			}

			var result;
			if (ddz.lastType) {
				if (ddz.lastTip == null) {
					AI.analyzePlayerPokers(ddz.user);
					ddz.lastTip = AI.findAllByType(ddz.user, ddz.lastType,
							ddz.lastPokers, true);
					ddz.lastTipIndex = ddz.lastTip.length - 1;
				} else {
					ddz.lastTipIndex = ddz.lastTipIndex > 0 ? ddz.lastTipIndex - 1
							: ddz.lastTip.length - 1;
				}
				result = ddz.lastTip[ddz.lastTipIndex];
			} else {
				var type = Rule.getType(ddz.user.pokers);
				if (type)
					result = ddz.user.pokers;
				else {
					AI.analyzePlayerPokers(ddz.user);
					result = AI.findSmallestType(ddz.user, ddz.user.pokers);
					if (!result && ddz.user.bomb.length)
						result = ddz.user.bomb[ddz.user.bomb.length - 1];
					if (!result && ddz.user.twoking.length)
						result = ddz.user.twoking[ddz.user.twoking.length - 1];
				}
			}
			if (result) {
				Poker.select(result, true);
				ddz.pokerStage.render();
			} else {
				this.stage = null;
				ddz.skipPlay(ddz.user);
			}
		}

		playBtn.onMouseUp = function(e) {
			var selectedPokers = ddz.user.getSelectedPokers();
			if (selectedPokers.length == 0)
				return;
			var type = Rule.getType(selectedPokers);
			if (!type) {
				//TODO: 提示玩家牌型无效?
				return;
			}

			if (ddz.lastPokers != null) {
				//比较选中的牌是否大于上一玩家出的��?
				if (Rule.compare(selectedPokers, ddz.lastPokers)) {
					this.stage = null;
					ddz.playPoker(ddz.user);
				} else {
					//TODO: 提示用户无法出牌?
				}
			} else {
				//玩家为本轮第一个出牌的人，可以出任意有效的牌型
				this.stage = null;
				ddz.playPoker(ddz.user);
			}
		}
	}

	if (visible) {
		this.controlBtns.skipBtn
				.setState(this.lastPokers != null ? Button.state.UP
						: Button.state.DISABLED);
		var selectedPokers = this.user.getSelectedPokers();
		if (selectedPokers.length > 0) {
			this.controlBtns.playBtn.setState(Button.state.UP);
			this.controlBtns.resetBtn.setState(Button.state.UP);
		} else {
			this.controlBtns.playBtn.setState(Button.state.DISABLED);
			this.controlBtns.resetBtn.setState(Button.state.DISABLED);
		}
		this.controlStage.addChild(this.controlBtns);
		this.controlBtns.fastRender(this.controlStage.context);
	} else {
		this.controlStage.removeChild(this.controlBtns);
		this.controlBtns.skipBtn.stage = null;
		this.controlBtns.resetBtn.stage = null;
		this.controlBtns.tipBtn.stage = null;
		this.controlBtns.playBtn.stage = null;
		this.controlStage.clear();
	}
}
