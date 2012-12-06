GroupBitmap = function(image) {
	casual.DisplayObject.call(this);
	this.name = NameUtil.createUniqueName("GroupBitmap");

	this.image = image;
	this.group = [];
	this.pos = [];
}
casual.inherit(GroupBitmap, casual.DisplayObject);

GroupBitmap.prototype.addSlice = function(slice, x, y) {
	this.pos.push( [ x || 0, y || 0 ]);
	this.group.push(slice);
}

GroupBitmap.prototype.clear = function() {
	this.group.length = 0;
	this.pos.length = 0;
}

GroupBitmap.prototype.render = function(context) {
	for ( var i = 0; i < this.group.length; i++) {
		var s = this.group[i];
		context.drawImage(this.image, s[0], s[1], s[2], s[3], this.pos[i][0],
				this.pos[i][1], s[2], s[3]);
	}
}