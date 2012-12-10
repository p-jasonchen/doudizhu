/**
 * 资源管理器
 */
;
;
(function () {
    var ResourceManager = function () {
        this.resources = [];
        this.callback = [];
        this.countLoaded = 0;
        this._idx = 0;
    }
    ResourceManager.prototype.next = function (jRes) {
        if (this._idx <= (this.resObj.resArray.length - 1)) {
            this._loadByOne(this.resObj.type, this._idx++);
        }
    };
    ResourceManager.prototype.stop = function () {
        this.resObj && (this.resObj.resArray = []);
    };
    ResourceManager.prototype._loadByOne = function (type, idx) {
        var that = this, one = this.resObj.resArray[idx];
        var e = document.createElement(type);
        e.id = 'e_' + Math.random();
        this.resources.push(e);
        var _src = '';
        if (typeof one == 'object') {
            _src = one.src;
        } else {
            _src = one;
        }
        e.src = this.resObj.path + _src;
        if (type === 'script') document.head.appendChild(e);
        e.onload = function (evt) {
            that.countLoaded++;
            that.fire({
                type:'loading',
                args:[that.countLoaded, that.resources.length, false, one]
            });
        };
        e.onerror = function (evt) {
            that.countLoaded++;
            that.fire({
                type:'error',
                args:[that.countLoaded, that.resources.length, false, one]
            });
        };
        //this._idx=idx;
    }
    ResourceManager.prototype.loadRes = function (jRes) {
        if (jRes instanceof Array) {
            for (var i = jRes.length - 1; i >= 0; i--) {
                arguments.callee.call(this, jRes[i]);
            };
        } else {
            this.resObj = jRes;
            var type = jRes.type;
            var resArray = jRes.resArray;
            if (this.resObj.single) {
                this.next();
            } else {
                for (var i = 0; i < resArray.length; i++) {
                    this._loadByOne(type, i);
                }
            }
        }

    };

    ResourceManager.prototype.bind = function (callback) {
        if (callback) {
            this.callback.push(callback);
        }
    };

    ResourceManager.prototype.fire = function (jData) {
        for (var i = 0; i < this.callback.length; i++) {
            this.callback[i].call(this, jData);
        }
    }
    window.ResourceManager = ResourceManager;
})();
;

function loadRes() {
    
    var imgRes = {
        type: 'img',
        path: 'img/',
        resArray: ["btn.png","bg.jpg","bg_cell.jpg","ani_bomb.png","interface_a.png","interface_b.jpg","interface_c.png","mul_eff.png","2.png","p_j.png","poker.png",
		"ani_role_parts.png","interface_d_12082415.png"]
    };    
    
    var current = 0,
        total = imgRes.resArray.length;
    var setProgress = function(jData) {
            if (jData) {
                current = jData.args[0];
                var barwidth = (current / total);              
				if(barwidth == 1){
					ddz.initElemObj();
				}
            }
        }
   
    var rm = new ResourceManager();
    rm.bind(setProgress);
    rm.loadRes(imgRes);
}