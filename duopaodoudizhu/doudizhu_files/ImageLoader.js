/**
 * Image Loader
 */
ImageLoader = function(source) {
	casual.EventDispatcher.call(this);
	if (source)
		this._addSource(source);
	this._loaded = -1;
	this.isLoading = false;
	this._images = [];

	this._totalSize = 0;
}
casual.inherit(ImageLoader, casual.EventDispatcher);

ImageLoader.prototype.load = function(source) {
	if (source)
		this._addSource(source);
	if (!this.isLoading)
		this._loadNext();
}

ImageLoader.prototype._addSource = function(source) {
	source = (source instanceof Array) ? source : [ source ];
	for ( var i = 0; i < source.length; i++) {
		this._totalSize += source[i].size || 0;
	}
	if (!this._source)
		this._source = source;
	else
		this._source = this._source.concat(source);
}

ImageLoader.prototype._loadNext = function() {
	this._loaded++;
	if (this._loaded >= this._source.length) {
		this.dispatchEvent( {
			type : "complete",
			target : this,
			images : this._images
		});
		this._source = [];
		this.isLoading = false;
		return;
	}

	var img = new Image();
	img.onload = casual.delegate(this._loadHandler, this);
	img.src = this._source[this._loaded].src;
	this.isLoading = true;
}

ImageLoader.prototype._loadHandler = function(e) {
	var image = this._source[this._loaded];
	image.image = e.target;
	this._images.push(image);
	this.dispatchEvent( {
		type : "loaded",
		target : this,
		image : image
	});
	this._loadNext();
}

ImageLoader.prototype.getLoaded = function() {
	return this._images.length;
}

ImageLoader.prototype.getTotal = function() {
	return this._source.length;
}

ImageLoader.prototype.getLoadedSize = function() {
	var size = 0;
	for ( var i = 0; i < this._images.length; i++) {
		size += this._images[i].size || 0;
	}
	return size;
}

ImageLoader.prototype.getTotalSize = function() {
	return this._totalSize;
}