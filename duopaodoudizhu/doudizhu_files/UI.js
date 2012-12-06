UI = {};

UI.init = function() {
	this.initButtons();
	this.initToolBar();
}

UI.initButtons = function() {
	//因为舞台设置帧频为0，需要手动渲染按钮，采用局部渲染提高效率
	var onMouseEvent = Button.prototype.onMouseEvent;
	Button.prototype.onMouseEvent = function(e) {
		onMouseEvent.call(this, e);
		if (e.type == "mousemove")
			return;
		var stage = this.getStage();
		if (!stage)
			return;
		this.fastRender(stage.context);
	}

	//出牌按钮
	var upState = R.orgBtnUp;
	var downState = R.orgBtnDown;
	downState.x = 0;
	downState.y = 0;
	var disabledState = R.btnDisabled;
	disabledState.alpha = 0.8;
	var label = R.txtPlay;
	label.x = 13;
	label.y = 9;
	btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	btn.width = upState.width;
	btn.height = upState.height;
	this.playBtn = btn;

	//提示按钮
	upState = R.blueBtnUp;
	downState = R.blueBtnDown;
	label = R.txtTip;
	label.x = 13;
	label.y = 9;
	btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.tipBtn = btn;

	//重选按钮
	label = R.txtReset;
	label.x = 15;
	label.y = 9;
	btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.resetBtn = btn;

	//不出按钮
	label = casual.copy(R.txtNoPlay);
	label.x = 14;
	label.y = 9;
	btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.skipBtn = btn;

	//开始按钮
	label = R.txtStart;
	label.x = 13;
	label.y = 9;
	var btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.startBtn = btn;

	//不叫按钮
	label = casual.copy(R.txtNoGamble);
	label.x = 13;
	label.y = 9;
	var btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.noGambleBtn = btn;

	//三分按钮
	label = new GroupBitmap(R.button);
	label.addSlice(R.txtThree, 16, 11);
	label.addSlice(R.txtFen, 33, 9);
	var btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.gambleBtn3 = btn;

	//二分按钮
	label = new GroupBitmap(R.button);
	label.addSlice(R.txtTwo, 16, 11);
	label.addSlice(R.txtFen, 33, 9);
	var btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.gambleBtn2 = btn;

	//一分按钮
	label = new GroupBitmap(R.button);
	label.addSlice(R.txtOne, 23, 10);
	label.addSlice(R.txtFen, 33, 8);
	var btn = new Button(upState, null, downState, disabledState);
	btn.addChild(label);
	this.gambleBtn1 = btn;
}

UI.renderNumber = function(context, bmp, number, notAddZero, white) {
	this.getNumber(bmp, number, notAddZero, white);
	bmp.fastRender(context, false, true);
}

UI.getNumber = function(bmp, number, notAddZero, white) {
	bmp.clear();
	var str = number;
	if (typeof (number) != "string") {
		var zero = notAddZero ? "" : "0";
		str = number >= 10 ? number.toString() : zero + number.toString();
	}
	for ( var i = 0, gap = 0, left = 0; i < str.length; i++) {
		var slice = white ? R.white[str[i]] : R.gold[str[i]];
		var dx = left, dy = str[i] == "-" ? 4 : 0;
		if (white && str.length == 1 && str[0] == "1")
			dx = left = left + 2;
		bmp.addSlice(slice, dx, dy);
		left += slice[2] + gap;
	}
	bmp.width = left;
	bmp.height = white ? 12 : 15;
	return bmp;
}

UI.showBubble = function(show, type, flip, stage, x, y) {
	if (!this.bubble) {
		this.bubble = new Sprite();
		var bg = R.bubble;
		bg.regX = 42;
		this.bubble.addChild(bg);
	}

	if (!show)
		return;

	this.bubble.getChildAt(0).scaleX = flip ? -1 : 1;
	while (this.bubble.getNumChildren() > 1)
		this.bubble.removeChildAt(1);

	var text;
	switch (type) {
	case "gamble0":
		text = R.txtNoGamble;
		text.x = flip ? -28 : -19;
		text.y = 13;
		break;

	case "gamble1":
		text = new GroupBitmap(R.button);
		text.addSlice(R.txtOne, 2, 2);
		text.addSlice(R.txtFen, 12);
		text.x = flip ? -22 : -17;
		text.y = 13;
		break;

	case "gamble2":
		text = new GroupBitmap(R.button);
		text.addSlice(R.txtTwo, 2, 2);
		text.addSlice(R.txtFen, 19);
		text.x = flip ? -28 : -18;
		text.y = 13;
		break;

	case "gamble3":
		text = new GroupBitmap(R.button);
		text.addSlice(R.txtThree, 2, 2);
		text.addSlice(R.txtFen, 19);
		text.x = flip ? -28 : -18;
		text.y = 13;
		break;

	case "noplay":
		text = R.txtNoPlay;
		text.x = flip ? -28 : -17;
		text.y = 13;
		break;
	}
	this.bubble.addChild(text);

	this.bubble.x = x;
	this.bubble.y = y;
	stage.addChild(this.bubble);

	this.bubble.fastRender(stage.context);
}

UI.initToolBar = function() {
	if (!this.toolbar) {
		this.toolbar = {};

		//三张底牌容器
		var pokers = new Sprite();
		pokers.width = 72;
		pokers.height = 32;
		pokers.x = (ddz.width - pokers.width >> 1) - 25;
		pokers.y = 2;
		this.toolbar.lastPokers = pokers;

		//静态元素容器
		var container = new Sprite();
		this.toolbar.container = container;

		//分隔线
		var vline = R.vline;
		vline.x = pokers.x - 18;
		vline.y = 3;
		container.addChild(vline);
		vline = casual.copy(vline, null, {
			x : vline.x + 155
		});
		container.addChild(vline);

		//图标
		var btn = R.configBtn;
		btn.x = pokers.x - 65;
		btn.y = 6;
		//btn.mouseEnabled = false;
		btn.name = "config";
		container.addChild(btn);
		btn.onMouseUp = function() {
			window.open("http://m.edianyou.com");
			return;

		}

		btn = R.exitBtn;
		btn.x = pokers.x + 155;
		btn.y = 4;
		btn.name = "exit";
		container.addChild(btn);

		btn.onMouseUp = function() {
			history.go(-1);
			//this.stage = null;
			//UI.showPopup(!R.popupBg.isPopuped);
		}
		//倍数标题
		var text = R.txtScore;
		text.x = pokers.x + pokers.width + 6;
		text.y = 3;
		this.toolbar.scoreText = text;
		//container.addChild(text);

		//底分标题
		var text = R.txtBase;
		text.x = pokers.x + pokers.width + 6;
		text.y = 18;
		this.toolbar.baseText = text;
		//container.addChild(text);

		//倍数
		var rate = new GroupBitmap(R.number);
		rate.x = text.x + text.width + 3;
		rate.y = 5;
		rate.width = 15;
		rate.height = 12;
		this.toolbar.scoreRate = rate;

		//底分
		var score = new GroupBitmap(R.number);
		score.x = text.x + text.width + 3;
		score.y = 19;
		score.width = 15;
		score.height = 12;
		this.toolbar.baseScore = score;
	} else {
		this.toolbar.lastPokers.removeAllChildren();
	}
}

UI.showPopup = function(visible) {
	if (!visible && R.popupBg.isPopuped) {
		//删除弹出窗口
		this.popupStage.removeAllChildren();
		ddz.container.removeChild(this.popupStage.canvas);
		ddz.container.removeChild(this.popupBgCanvas);
		this.popupBgCanvas = null;
		this.popupCanvas = null;
		R.popupBg.isPopuped = false;
	} else if (visible && !R.popupBg.isPopuped) {
		//创建弹出窗口
		var size = {
			width : R.popupBg.width,
			height : 140,
			left : R.exitBtn.x - R.popupBg.width + 38,
			top : R.exitBtn.y + 30
		};
		var popupBgCanvas = ddz.createCanvas("popupbg", size);
		ddz.container.appendChild(popupBgCanvas);
		this.popupBgCanvas = popupBgCanvas;
		R.popupBg._render(popupBgCanvas.getContext("2d"));
		R.popupBg.isPopuped = true;

		//创建控件舞台
		var popupCanvas = ddz.createCanvas("popup", size);
		ddz.container.appendChild(popupCanvas);
		var popupStage = new Stage(popupCanvas.getContext("2d"));
		popupStage.setFrameRate(0);
		this.popupStage = popupStage;

		//排行榜按钮
		var upState = casual.copy(R.bigBtnUp, null, {
			scaleX : 0.9,
			scaleY : 0.9
		});
		var downState = casual.copy(R.bigBtnDown, null, {
			scaleX : 0.9,
			scaleY : 0.9
		});
		var restartLabel = R.labelRestart;
		restartLabel.x = upState.getCurrentWidth() - restartLabel.width >> 1;
		restartLabel.y = 9;
		var restartBtn = new Button(upState, null, downState);
		restartBtn.addChild(restartLabel);
		restartBtn.x = R.popupBg.x + 20;
		restartBtn.y = R.popupBg.y + 26;
		popupStage.addChild(restartBtn);
		restartBtn.onMouseUp = function() {
			location.href = "/stat/DouDiZhu";
			return;
			this.stage = null;
			UI.showPopup(false);
			ddz.resetGame();
		}

		//退出游戏按钮
		var exitLabel = R.labelExit;
		exitLabel.x = restartLabel.x;
		exitLabel.y = restartLabel.y;
		var exitBtn = new Button(upState, null, downState);
		exitBtn.addChild(exitLabel);
		exitBtn.x = restartBtn.x;
		exitBtn.y = restartBtn.y + 46;
		popupStage.addChild(exitBtn);
		exitBtn.onMouseUp = function() {
			window.location.href = "http://game.weibo.cn";
			return;
			this.stage = null;
			UI.showPopup(false);
			window.location.reload();
		}
	}
}
