Poker = function(point, type, size) {
	Sprite.call(this);

	this.point = point;
	this.type = type;
	this.size = size || "b";

	this.init();
}
casual.inherit(Poker, Sprite);

Poker.prototype.init = function() {
	this.mouseChildren = false;
	this.selected = false;

	//background
	var bg = new Bitmap(R.poker, R.pokerfg[this.size]);
	this.addChild(bg);
	this.width = bg.width;
	this.height = bg.height;

	//point on left-top
	var frame, pointR = R.pokerPoint[this.point][this.size];
	if (this.type == Poker.FANGKUAI || this.type == Poker.HONGTAO
			|| this.point == 17) {
		frame = pointR.r;
	} else {
		frame = pointR.b;
	}
	var pointImg = new Bitmap(R.poker, frame);
	pointImg.x = pointR.x;
	pointImg.y = pointR.y;
	this.addChild(pointImg);

	//type on left-top
	var typeR = R.pokerType[this.type.name][this.size];
	var typeImg = new Bitmap(R.poker, typeR.r);
	typeImg.x = typeR.x;
	typeImg.y = typeR.y;
	this.addChild(typeImg);

	//right-bottom
	if (this.point < 16 && this.size != "s") {
		var pointImg2 = new Bitmap(R.poker, frame);
		pointImg2.scaleX = pointImg2.scaleY = -1;
		pointImg2.x = bg.width - pointR.x;
		pointImg2.y = bg.height - pointR.y - 1;
		this.addChild(pointImg2);

		var typeImg2 = new Bitmap(R.poker, typeR.r);
		typeImg2.scaleX = typeImg2.scaleY = -1;
		typeImg2.x = bg.width - typeR.x;
		typeImg2.y = bg.height - typeR.y;
		this.addChild(typeImg2);
	}

	//mask for selection
	if (this.size == "b") {
		var mask = new Shape();
		mask.graphics.setSize(this.width, this.height);
		mask.graphics.beginFill("#000").drawRoundRect(0, 0, this.width,
				this.height, 8).endFill();
		mask.alpha = 0.3;
		this.mask = mask;
	}
}

Poker.prototype.setMask = function(visible) {
	if (visible)
		this.addChild(this.mask);
	else
		this.removeChild(this.mask);
}

Poker.prototype.select = function(selected) {
	if (!this.mouseEnabled || this.selected == selected)
		return;
	this.selected = selected;
	this.y += this.selected ? -12 : 12;
	ddz.onPokerSelect(this);
}

Poker.prototype.toString = function() {
	return this.point;
}

Poker.shuffle = function(pokers) {
	for ( var i = 0, len = pokers.length; i < len; i++) {
		var rnd = Math.random() * (len - 1) >> 0;
		var temp = pokers[i];
		pokers[i] = pokers[rnd];
		pokers[rnd] = temp;
	}
	return pokers;
}

Poker.newPack = function() {
	var pack = [];
	for ( var i = 3; i <= 15; i++) {
		pack.push(new Poker(i, Poker.FANGKUAI));
		pack.push(new Poker(i, Poker.MEIHUA));
		pack.push(new Poker(i, Poker.HONGTAO));
		pack.push(new Poker(i, Poker.HEITAO));
	}
	pack.push(new Poker(17, Poker.JOKERA));
	pack.push(new Poker(16, Poker.JOKERB));
	return pack;
}

Poker.select = function(pokers, selected) {
	if (pokers instanceof Poker) {
		pokers.select(selected);
	} else {
		for ( var i = 0; i < pokers.length; i++) {
			pokers[i].select(selected);
		}
	}
}

Poker.TOTAL = 54;
Poker.START = 3;
Poker.END = 17;

//types
Poker.FANGKUAI = {
	name : "fangkuai",
	rank : 1,
	frame : [ 138, 27, 16, 16 ],
	offsetX : 0,
	offsetY : 0,
	bmpdata : null
};
Poker.MEIHUA = {
	name : "meihua",
	rank : 2,
	frame : [ 122, 27, 16, 16 ],
	offsetX : 0,
	offsetY : 0,
	bmpdata : null
};
Poker.HONGTAO = {
	name : "hongtao",
	rank : 3,
	frame : [ 128, 13, 16, 14 ],
	offsetX : 0,
	offsetY : 0,
	bmpdata : null
};
Poker.HEITAO = {
	name : "heitao",
	rank : 4,
	frame : [ 166, 27, 16, 16 ],
	offsetX : 0,
	offsetY : 0,
	bmpdata : null
};
Poker.JOKERA = {
	name : "jokera",
	black : [ 199, 59, 29, 66 ],
	red : [ 170, 59, 29, 66 ],
	offsetX : 20,
	offsetY : 8
};
Poker.JOKERB = {
	name : "jokerb",
	black : [ 199, 59, 29, 66 ],
	red : [ 170, 59, 29, 66 ],
	offsetX : 20,
	offsetY : 8
};

//points
Poker[3] = {
	black : [ 90, 27, 10, 14 ],
	red : [ 186, 13, 10, 14 ],
	offsetX : 1
};
Poker[4] = {
	black : [ 206, 13, 10, 14 ],
	red : [ 16, 27, 10, 14 ],
	offsetX : 1
};
Poker[5] = {
	black : [ 176, 13, 10, 14 ],
	red : [ 70, 27, 10, 14 ],
	offsetX : 1
};
Poker[6] = {
	black : [ 60, 27, 10, 14 ],
	red : [ 40, 27, 10, 14 ],
	offsetX : 1
};
Poker[7] = {
	black : [ 78, 13, 10, 14 ],
	red : [ 196, 13, 10, 14 ],
	offsetX : 1
};
Poker[8] = {
	black : [ 0, 13, 10, 14 ],
	red : [ 156, 13, 10, 14 ],
	offsetX : 1
};
Poker[9] = {
	black : [ 6, 27, 10, 14 ],
	red : [ 166, 13, 10, 14 ],
	offsetX : 1
};
Poker[10] = {
	black : [ 20, 13, 16, 14 ],
	red : [ 216, 13, 16, 14 ],
	offsetX : -2
};
Poker[11] = {
	black : [ 246, 13, 8, 14 ],
	red : [ 232, 13, 8, 14 ],
	offsetX : 0
};
Poker[12] = {
	black : [ 154, 27, 12, 16 ],
	red : [ 110, 27, 12, 16 ],
	offsetX : 0
};
Poker[13] = {
	black : [ 144, 13, 12, 14 ],
	red : [ 116, 13, 12, 14 ],
	offsetX : 0
};
Poker[14] = {
	black : [ 50, 13, 14, 14 ],
	red : [ 88, 13, 14, 14 ],
	offsetX : -1
};
Poker[15] = {
	black : [ 100, 27, 10, 14 ],
	red : [ 50, 27, 10, 14 ],
	offsetX : 1
};
Poker[16] = {
	black : [ 228, 59, 11, 69 ],
	red : [ 228, 59, 11, 69 ],
	offsetX : 0
};
Poker[17] = {
	black : [ 239, 59, 11, 69 ],
	red : [ 239, 59, 11, 69 ],
	offsetX : 0
};

Poker.createPokerBitmap = function(point, type) {
	var poker = new Poker(point, type);

	//background
	var bg = new Bitmap(Poker.image, Poker.foreground.b);
	poker.addChild(bg);

	poker.width = bg.width;
	poker.height = bg.height;

	//point on left-top
	var pointImg = new Bitmap(Poker.image, Poker[poker.point].frame);
	if (this.type == Poker.FANGKUAI || this.type == Poker.HONGTAO) {
		pointImg.frame = pointImg.frame.slice(0);
		pointImg.frame[1] += 20;
		trace(type, pointImg.frame);
	}
	pointImg.x = 6 + Poker[poker.point].offsetX;
	pointImg.y = 5;
	poker.addChild(pointImg);

	//type on left-top
	if (poker.type != Poker.JOKER) {
		var typeImg = new Bitmap(Poker.image, poker.type.frame);
		typeImg.x = 4;
		typeImg.y = 22;
		poker.addChild(typeImg);
	}

	//point on right-bottom
	var pointImg2 = new Bitmap(Poker.image, pointImg.frame);
	pointImg2.scaleX = pointImg2.scaleY = -1;
	pointImg2.x = bg.width - 6;
	pointImg2.y = bg.height - 7;
	poker.addChild(pointImg2);

	//type on right-bottom
	if (poker.type != Poker.JOKER) {
		var typeImg2 = new Bitmap(Poker.image, poker.type.frame);
		typeImg2.scaleX = typeImg2.scaleY = -1;
		typeImg2.x = bg.width - 5 + Poker[poker.point].offsetX;
		typeImg2.y = bg.height - 25;
		poker.addChild(typeImg2);
	}

	var canvas = document.createElement("canvas");
	canvas.width = poker.width;
	canvas.height = poker.height;
	var context = canvas.getContext("2d");
	poker.render(context);
	poker = null;
	return canvas;
}