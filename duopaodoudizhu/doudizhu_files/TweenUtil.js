TweenUtil = function(target, duration, props) {
	this.target = target;
	this.newProps = props;
	this.oldProps = {};
	//save old properties
	for ( var p in this.newProps) {
		if (p == "onStart" || p == "onComplete" || p == "onUpdate")
			this[p] = this.newProps[p];
		else if (this.target[p] !== undefined)
			this.oldProps[p] = this.target[p];
	}

	this.duration = duration;
	this.interval = TweenUtil.interval;
	this.total = this.duration / this.interval;
	this.count = 0;
	this.timerID = null;
};

TweenUtil.prototype.start = function() {
	TweenUtil.addTween(this);
	TweenUtil.activate();
	if (this.onStart)
		this.onStart();
}

TweenUtil.prototype.stop = function() {
	TweenUtil.removeTween(this);
}

TweenUtil.prototype._trigger = function() {
	this.count++;

	if (this.onUpdate)
		this.onUpdate();

	if (this.count >= this.total) {
		for ( var p in this.newProps) {
			this.target[p] = this.newProps[p];
		}
		this._finish();
	} else {
		for ( var p in this.newProps) {
			this.target[p] += (this.newProps[p] - this.oldProps[p])
					/ this.total;
		}
	}
}

TweenUtil.prototype._finish = function() {
	this.stop();
	if (this.onComplete)
		this.onComplete();
	this.target = null;
	this.oldProps = null;
	this.newProps = null;
}

TweenUtil.timerID = null;
TweenUtil.interval = 1000 / 30; //30fps
TweenUtil.tweens = [];

TweenUtil.addTween = function(tween) {
	if (TweenUtil.tweens.indexOf(tween) == -1)
		TweenUtil.tweens.push(tween);
}

TweenUtil.removeTween = function(tween) {
	var index = TweenUtil.tweens.indexOf(tween);
	if (index != -1)
		TweenUtil.tweens.splice(index, 1);
	if (TweenUtil.tweens.length == 0)
		TweenUtil.deactivate();
}

TweenUtil.isActive = function() {
	return TweenUtil.timerID != null;
}

TweenUtil.activate = function() {
	if (TweenUtil.timerID != null)
		return;
	TweenUtil.timerID = setInterval(TweenUtil._trigger, TweenUtil.interval);
}

TweenUtil.deactivate = function() {
	if (TweenUtil.timerID != null) {
		clearInterval(TweenUtil.timerID);
		TweenUtil.timerID = null;
	}
}

TweenUtil._trigger = function() {
	var i = TweenUtil.tweens.length;
	while (--i >= 0)
		TweenUtil.tweens[i]._trigger();
	if (TweenUtil.onTrigger)
		TweenUtil.onTrigger();
}

TweenUtil.onTrigger = null;

TweenUtil.to = function(target, duration, props) {
	var tween = new TweenUtil(target, duration, props);
	tween.start();
}

TweenUtil.from = function(target, duration, props) {
	var tween = new TweenUtil(target, duration, props);
	var tmp = tween.oldProps;
	tween.oldProps = tween.newProps;
	tween.newProps = tmp;

	for ( var p in tween.oldProps) {
		if (tween.target[p] !== undefined)
			tween.target[p] = tween.oldProps[p];
	}

	tween.start();
}