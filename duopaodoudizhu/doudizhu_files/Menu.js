var Menu = function() {
	casual.Sprite.call(this);
	this.name = NameUtil.createUniqueName("Menu");
	this.init();
}
casual.inherit(Menu, casual.Sprite);

Menu.prototype.init = function() {
	var top = ddz.height - 150 >> 1;
	var width = ddz.width;

	/*/
	var logo = R.logo;
	logo.x = 25;
	logo.y = top + 50;
	this.addChild(logo);	
	
	var dizhu = R.dizhu;
	dizhu.x = logo.x + 160;
	dizhu.y = top + 15;
	this.addChild(dizhu);
	//*/

	var upState = R.bigBtnUp;
	var downState = R.bigBtnDown;
	var disabledState = R.bigBtnDisabled;
	downState.x = 3;
	downState.y = 1;

	//单机游戏
	var label = R.txtSingleGame;
	label.x = 19;
	label.y = 9;
	btn = new Button(upState, null, downState);
	btn.addChild(label);
	btn.width = upState.width;
	btn.height = upState.height;
	btn.x = width - btn.width - 45;
	btn.y = top + 50;
	this.addChild(btn);
	this.spBtn = btn;

	//联机游戏
	label = R.txtMultiGame;
	label.x = 19;
	label.y = 9;
	btn = new Button(upState);
	btn.addChild(label);
	btn = new Bitmap(ddz.grayscale(btn));
	btn.width = upState.width;
	btn.height = upState.height;
	btn.x = width - btn.width - 45;
	btn.y = top;
	//this.addChild(btn);
	//btn.setEnabled(false);

	//帮助
	label = R.txtHelp;
	label.x = 38;
	label.y = 9;
	btn = new Button(upState);
	btn.addChild(label);
	btn = new Bitmap(ddz.grayscale(btn));
	btn.width = upState.width;
	btn.height = upState.height;
	btn.x = width - btn.width - 45;
	btn.y = top + 100;
	//this.addChild(btn);
	//btn.setEnabled(false);
}
