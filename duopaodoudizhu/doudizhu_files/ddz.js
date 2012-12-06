//游戏启动入口
window.onload = function() {
	//Firefox,Safari下的setTimeout可以传参数而IE不可以，故改写此方法使得都可以传参数。
	var st = window.setTimeout;
	window.setTimeout = function(func, delay) {
		if (typeof func == 'function') {
			var args = Array.prototype.slice.call(arguments, 2);
			var f = function() {
				func.apply(null, args);
			};
			return st(f, delay);
		}
		return st(func, delay);
	}

	//延迟操作确保移除Safari的地址栏
	setTimeout(function() {
		ddz.startup( {
			container : document.getElementById("game")
		});
	}, 10);
}

ddz = {
	container : null,
	width : 0,
	height : 0,
	left : 0,
	top : 0,

	loader : null,

	canvas : null,
	conntext : null,
	stage : null,
	bgCanvas : null,
	bgContext : null,

	players : [],
	user : null,
	dizhu : null,

	menu : null,

	playerStage : null,
	pokerStage : null,
	controlStage : null,

	gambleBtns : null,
	controlBtns : null,

	//动画播放开关
	playTween : true,

	bgSound : null
};

ddz.startup = function(params) {
	this.params = params;
	this.removeNavBar();
	this.detectBrowser();

	//CSS设置
	this.container = params.container || document.body;
	this.container.style.backgroundColor = this.isAndroid ? "#08598c" : "#fff";
	this.container.style.width = window.innerWidth + "px";
	this.container.style.height = window.innerHeight + "px";
	this.container.ontouchstart = function() {
		ddz.removeNavBar();
		event.preventDefault();
	};
	if (this.isMobile) {
		document.body.style.WebkitTouchCallout = "none";
		document.body.style.WebkitUserSelect = "none";
		document.body.style.WebkitTextSizeAdjust = "none";
		document.body.style.WebkitTapHighlightColor = "rgba(0,0,0,0)";
	}

	//加载进度信息
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.width = (window.innerWidth > 550 ? 480 : window.innerWidth)
			+ "px";
	div.style.left = "0px";
	div.style.top = ((window.innerHeight > 400 ? 320 : window.innerHeight) * 0.35 >> 0)
			+ "px";
	div.style.textAlign = "center";
	div.style.color = this.isAndroid ? "#fff" : "#333";
	div.style.font = this.isMobile ? 'bold 16px 黑体' : 'bold 16px 宋体';
	div.style.textShadow = this.isAndroid ? "0 2px 2px #111" : "0 2px 2px #ccc";
	this.container.appendChild(div);
	this.loader = div;

	if (!document.createElement('canvas').getContext) {
		div.innerHTML = "对不起，游戏无法运行。<br>请用支持Canvas的浏览器。";
		return;
	}

	//加载图片
	var loader = new ImageLoader();
	loader.addEventListener("loaded", casual.delegate(this.onLoad, this));
	loader.addEventListener("complete", casual.delegate(this.onComplete, this));
	loader.load(R.sources);
	this.showProgress(0, loader.getTotalSize(), R.sources[0].src);
}

ddz.onLoad = function(e) {
	//trace("onLoad:", e.image.src, e.target.getLoadedSize(), e.target.getTotalSize());
	this.showProgress(e.target.getLoadedSize(), e.target.getTotalSize(),
			e.image.src);
}

ddz.showProgress = function(loaded, total, src) {
	this.loader.innerHTML = "正在加载资源中，请稍候...<br>";
	this.loader.innerHTML += "(" + Math.round(loaded / total * 100) + "%)";
	//this.loader.innerHTML += " " + src.substring(src.lastIndexOf("/") + 1);
}

ddz.onComplete = function(e) {
	//trace("onComplete:", e.images.length);
	e.target.removeEventListener("loaded", this.onLoad);
	e.target.removeEventListener("complete", this.onComplete);
	this.container.removeChild(this.loader);
	this.loader = null;

	//图片加载完成，初始化游戏
	R.init(e.images);
	this.adjustOrientation();
	if (this.supportOrient && window.orientation % 180 == 0) {
		this.showPortraitNotice(true);
	} else {
		this.initGame();
	}
}

ddz.initGame = function() {
	//初始化游戏尺寸
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	this.width = this.params.width || 480;
	this.height = this.params.height
			|| (this.winH > this.winW ? Math.min(this.winW - 18, 320) : Math
					.min(this.winH + 2, 320));
	//this.left = this.params.left || 0;
	//this.top = this.params.top || 0;
	this.left = this.params.left
			|| ((this.winW < 550 && this.winW > 480 && this.isMobile) ? (this.winW - 480 >> 1)
					: 0);
	this.top = this.params.top
			|| ((this.winH < 400 && this.winH > 320 && this.isMobile) ? (this.winH - 320 >> 1)
					: 0);
	trace("GameSize:", this.winW, this.winH, this.width, this.height,
			this.left, this.top);

	//游戏背景
	this.bgCanvas = this.createCanvas("bg");
	this.bgContext = this.bgCanvas.getContext("2d");
	this.container.appendChild(this.bgCanvas);

	//游戏玩家画布,设置帧频为0，手动渲染模式
	var playerCanvas = this.createCanvas("player");
	this.playerStage = new Stage(playerCanvas.getContext("2d"));
	this.playerStage.setFrameRate(0);
	this.playerStage.usePixelTrace = false;
	this.container.appendChild(playerCanvas);
	playerCanvas.ontouchstart = function() {
		ddz.removeNavBar();
	};

	//初始化UI
	UI.init();

	//显示主菜单界面
	this.showMenu();
}

ddz.setBackground = function(image) {
	var context = this.bgContext;
	context.clearRect(0, 0, this.width, this.height);
	var top = this.height < image.height ? (image.height - this.height >> 1)
			: 0;
	context.drawImage(image, 0, top, this.width, this.height, 0, 0, this.width,
			this.height);
	/*/
	context.fillStyle = context.createPattern(image, "repeat");
	context.beginPath();
	context.rect(0, 0, this.width, this.height);
	context.closePath();
	context.fill();
	//*/
}

ddz.showMenu = function() {
	if (!this.menu) {
		this.menu = new Menu();
		this.menu.spBtn.onMouseUp = function(e) {
			this.fastClear();
			this.stage = null;
			ddz.initSingleGame();
			//ddz.selectSingleGame();
			//延迟播放背景音乐，保证主代码正常运行
			//ddz.playBgSound();
			//setTimeout(ddz.playBgSound, 100);
		};
	}
	this.setBackground(R.startbg);
	this.playerStage.removeAllChildren();
	this.playerStage.addChild(this.menu);
}

ddz.selectSingleGame = function() {
	//对背景使用渐变转换效果
	var me = this;
	TweenUtil.to(this.bgContext, (this.playTween ? 200 : 0), {
		globalAlpha : 0.5,
		onUpdate : function() {
			var alpha = this.count / this.total;
			me.bgContext.fillStyle = "rgba(0,0,0," + alpha + ")";
			me.bgContext.fillRect(0, 0, me.width, me.height);
		},
		onComplete : function() {
			me.initSingleGame();
		}
	});
}

ddz.createCanvas = function(id, params) {
	var canvas = document.createElement("canvas");
	if (id)
		canvas.id = id;
	if (!params)
		params = {};
	canvas.width = params.width || this.width;
	canvas.height = params.height || this.height;
	canvas.style.position = "absolute";
	canvas.style.left = (this.left + (params.left || 0)) + "px";
	canvas.style.top = (this.top + (params.top || 0)) + "px";
	canvas.oncontextmenu = function() {
		return false;
	}; //关闭鼠标右键行为
	//canvas.ontouchstart = function(){event.preventDefault();}; //阻止默认的移动画布行为
	return canvas;
}

ddz.adjustOrientation = function() {
	if (!this.supportOrient)
		return;
	window.onorientationchange = function(e) {
		ddz.removeNavBar();
		switch (window.orientation) {
		//portrait mode
		case 0:
		case 180:
			ddz.showPortraitNotice(true);
			break;

		//landscape mode
		case 90:
		case -90:
			ddz.showPortraitNotice(false);
			if (!ddz.bgCanvas)
				ddz.initGame();
			break;
		}
	}
}

ddz.showPortraitNotice = function(visible) {
	this.container.style.display = visible ? "none" : "block";
	var msg = document.getElementById("msg");
	msg.style.display = visible ? "block" : "none";
	var w = window.innerWidth, h = window.innerHeight;
	ddz.container.style.width = w + "px";
	ddz.container.style.height = h + "px";
	if (!visible)
		return;
	if (w > h) {
		var temp = w;
		w = h;
		h = w;
	}
	msg.style.width = w + "px";
	msg.style.height = h + "px";
	msg.ontouchstart = function() {
		ddz.removeNavBar();
		event.preventDefault();
	};
}

ddz.playBgSound = function() {
	if (typeof (Audio) == "undefined") {
		trace("The browser does not support Audio");
		return;
	}
	var bgSound = this.isFirefox ? R.bgSound[1] : R.bgSound[0];
	var audio = new Audio(R.soundPath + bgSound);
	audio.autoPlay = true;
	audio.play();
	audio.addEventListener("ended", function() {
		audio.play();
	}, false);
	this.bgSound = audio;
}

ddz.removeNavBar = function() {
	window.scrollTo(0, 1);
}

ddz.detectBrowser = function() {
	this.ua = navigator.userAgent;
	this.isIE = (/msie/i).test(this.ua);
	this.isFirefox = (/firefox/i).test(this.ua);
	this.isChrome = (/chrome/i).test(this.ua);
	this.isSafari = (/safari/i).test(this.ua) && !this.isChrome;
	this.isMobile = (/mobile/i).test(this.ua);
	this.isIOS = (/ios/i).test(this.ua);
	this.isIpad = (/ipad/i).test(this.ua);
	this.isIpod = (/ipod/i).test(this.ua);
	this.isIphone = (/iphone/i).test(this.ua) && !this.isIpod;
	this.isAndroid = (/android/i).test(this.ua);
	this.supportStorage = window.localStorage != undefined;
	this.supportOrient = "orientation" in window;
}

//快速渲染方法，实现局部渲染以提高速度，适合动画场景，但需和其他物体无重叠，元素为舞台的第一级子元素（可选：设置oldx和oldy）
DisplayObject.prototype.fastRender = function(context, noTransform,
		globalTransform) {
	var stage = this.getStage();
	if (!stage)
		return;
	var rect = this.getRect(stage);
	rect.x = Math.floor(this.oldx || rect.x) - this.regX;
	rect.y = Math.floor(this.oldy || rect.y) - this.regY;
	rect.width++;
	rect.height++;
	if (this.oldx != undefined)
		this.oldx = this.x;
	if (this.oldy != undefined)
		this.oldy = this.y;
	//trace("fastRender:", this, stage, rect.x, rect.y, rect.width, rect.height);
	stage.context.clearRect(rect.x, rect.y, rect.width, rect.height);
	this._render.call(this, context, noTransform, globalTransform);
}

//快速清除方法，只清除显示对象所在矩形范围
DisplayObject.prototype.fastClear = function(rect, keep) {
	var stage = this.getStage();
	if (!stage)
		return;
	if (!rect) {
		rect = this.getRect(stage);
		rect.x = Math.floor(this.oldx || rect.x) - this.regX;
		rect.y = Math.floor(this.oldy || rect.y) - this.regY;
		rect.width++;
		rect.height++;
	}
	//trace("fastClear:", this, rect.x, rect.y, rect.width, rect.height);
	stage.context.clearRect(rect.x, rect.y, rect.width, rect.height);
	if (!keep && this.parent)
		this.parent.removeChild(this);
}

ddz.grayscale = function(image, rect) {
	var w = image.width, h = image.height;
	if (rect) {
		w = rect[2];
		h = rect[3];
	}
	var canvas = this.createCanvas(null, {
		width : w,
		height : h
	});
	var context = canvas.getContext("2d");
	if (image instanceof DisplayObject) {
		var stage = new Stage(context);
		stage.setFrameRate(0);
		clearInterval(stage.__intervalID);
		stage.addChild(image);
		image.fastRender(context);
		stage.removeChild(image);
	} else {
		context
				.drawImage(image, rect[0], rect[1], rect[2], rect[3], 0, 0, w,
						h);
	}
	var imgData = context.getImageData(0, 0, w, h);
	var pixels = imgData.data;
	for ( var i = 0, len = pixels.length; i < len; i += 4) {
		//var grayscale = pixels[i]*0.3 + pixels[i+1]*0.59 + pixels[i+2]*0.11;
		var grayscale = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
		pixels[i] = grayscale;
		pixels[i + 1] = grayscale;
		pixels[i + 2] = grayscale;
	}
	context.putImageData(imgData, 0, 0);
	return canvas;
}

//用字符串形式给指定玩家生成一手指定的牌，比如showMeMagicPokers(0, "SSS99")
ddz.showMeMagicPokers = function(id, pokerStr) {
	var pack = Poker.shuffle(Poker.newPack());
	var pokers = [];
	for ( var i = 0; i < pokerStr.length; i++) {
		var point = pokerStr[i];
		if (point == "S")
			point = 10;
		else if (point == "J")
			point = 11;
		else if (point == "Q")
			point = 12;
		else if (point == "K")
			point = 13;
		else if (point == "A")
			point = 14;
		else if (point == "2")
			point = 15;
		else if (point == "w")
			point = 16;
		else if (point == "W")
			point = 17;
		point = Number(point);
		for ( var j = 0; j < pack.length; j++) {
			var p = pack[j];
			if (p.point == point) {
				pokers.push(p);
				pack.splice(j, 1);
				break;
			}
		}
	}

	var splice = Array.prototype.splice;
	if (id == 0) {
		pokers = pokers.concat(pack);
	} else if (id == 1) {
		splice.apply(pack, [ 17, 0 ].concat(pokers));
		pokers = pack;
	} else if (id == 2) {
		splice.apply(pack, [ 34, 0 ].concat(pokers));
		pokers = pack;
	}
	return pokers;
}
