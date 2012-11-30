(function(w){
    if (typeof w.NC == "undefined") {
        var NC = function(){
            //名字空间
            this.namespace = function(name){
                var i, ni, nis = name.split("."), ns = {};
                for (i = 0; i < nis.length; i = i + 1) {
                    ni = nis[i];
                    ns[ni] = ns[ni] ||
                    {};
                    ns = ns[nis[i]];
                }
                
                return ns;
            };
            //对象属性扩展
            this.mix = function(target, source,override){
                if (!source || !target) 
                    return target;
                var i, p, l;
                
                for (p in source) {
                    if (!(p in target)) {
                        target[p] = source[p];
                    }else{
						if(override){
							target[p] = source[p];
						}
					}
                }
                
                return target;
            }
            this.add = function(name,dependencies, fn){
                var self = this;
                if(arguments.length==2 && this.isFunction(dependencies)){
                    fn=dependencies;
                    dependencies=null;
                }
                // override mode
                self.Env.mods[name] = {
                    name: name,
                    fn: fn
                };
                if(dependencies && this.isArray(dependencies)){
                    forEach(dependencies,function(index,i){
                        if(!self.Env.mods[index]){
                            throw '依赖项未加载';
                        }
                    });
                }
                if(dependencies && typeof (dependencies)=='string'){
                    if(!self.Env.mods[dependencies]){
                        throw '依赖项未加载';
                    }
                }
                // call entry point immediately
                fn(self);
                
                // chain support
                return self;
            }
        };
        w.NC = new NC();
        w.NC.mix(w.NC, {
            Config: {
                debug: true,
                version: '0.4.7'
            },
            Env: {
                mods: {},
                guid: 1000
            },
            guid: function(pre){
                var id = this.Env.guid++ + '';
                return pre ? pre + id : id;
            },
			BrowserFeatures: {
                XPath: !!document.evaluate,
                ElementExtensions: !!window.HTMLElement,
                SpecificElementExtensions:(document.createElement('div').__proto__ &&document.createElement('div').__proto__ !==document.createElement('form').__proto__)
            },
            random: function(min, max){
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            now: function(){
                return +new Date();
            },
			
            oop: function(source,proto){
				if(arguments.length==1){
					proto=source;
					source=function(){};
				}
                function Class(){
					if(typeof this.init==='function'){
						this.init.apply(this,arguments);
					}
				}
				Class.prototype=new source();
				this.mix(Class.prototype,proto);
				Class.constructor=Class;
				return Class;
            },
            forIn: function(obj, callback){
                for (var x in obj) {
                    callback(obj[x], x);
                }
            },
			map:function(obj, callback){
				for (var x in obj) {
                   obj[x] = callback(obj[x], x);
                }
				return obj;
			},
            forEach: function(arr, callback, start){
                var cancelled;
                if (arr) {
                    arr = arr instanceof Array ||
                    (typeof(arr.length) === 'number' && (typeof(arr.callee) === "function" || (arr.item && typeof(arr.nodeType) === "undefined") && !arr.addEventListener && !arr.attachEvent)) ? arr : [arr];
                    for (var i = start || 0, l = arr.length; i < l; i++) {
                        if (callback(arr[i], i)) {
                            cancelled = true;
                            break;
                        }
                    }
                }
                return !cancelled;
            },
            callIf: function(obj, name, args){
                var fn = obj[name], exists = typeof(fn) === "function";
                if (exists) 
                    fn.call(obj, args);
                return exists;
            },
            //todo:test case
            indexOf: function(array, item, start){
                if (typeof(item) === "undefined") 
                    return -1;
                var length = array.length;
                if (length !== 0) {
                    start = start - 0;
                    if (isNaN(start)) {
                        start = 0;
                    }
                    else {
                        if (isFinite(start)) {
                            start = start - (start % 1);
                        }
                        if (start < 0) {
                            start = Math.max(0, length + start);
                        }
                    }
                    
                    for (var i = start; i < length; i++) {
                        if ((typeof(array[i]) !== "undefined") && (array[i] === item)) {
                            return i;
                        }
                    }
                }
                return -1;
            },
            isFunction: function(obj){
                return Object.prototype.toString.call(obj) === "[object Function]";
            },
            isObject: function(obj){
                return !!(obj && Object.prototype.toString.call(obj).slice(8, -1) === "Object" && obj.constructor === Object)
            },
            isArray: function(o){
                return Object.prototype.toString.call(o) === '[object Array]';
            },
            slice: function(){
                var item = arguments[0] || [], method = Array.prototype.slice;
                if (!(item instanceof Object)) {
                    var i = item.length, ret = [];
                    while (i--) {
                        ret[i] = item[i]
                    }
                    item = ret;
                }
                return method.apply(item, method.call(arguments, 1));
            }
        });
        
        
        
    }
    return w.NC;
})(window)
if (window.NC) {
    NC.add('browser', function(S){
        var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
        (/trident/i).test(navigator.userAgent) ? 'ms' :
        'opera' in window ? 'O' : '',toString = Object.prototype.toString, ua = navigator.userAgent.toLowerCase(), check = function(r){
            return r.test(ua);
        }, DOC = document;
        
        S.browser = {
            isStrict: DOC.compatMode == "CSS1Compat",
            isOpera: check(/opera/),
            isChrome: check(/chrome/),
            isWebKit: check(/webkit/),
            isSafari: !this.isChrome && check(/safari/),
            isSafari2: this.isSafari && check(/applewebkit\/4/), // unique to Safari 2
            isSafari3: this.isSafari && check(/version\/3/),
            isSafari4: this.isSafari && check(/version\/4/),
            isIE: !this.isOpera && check(/msie/),
            isIE7: this.isIE && check(/msie 7/),
            isIE8: this.isIE && check(/msie 8/),
            isIE6: this.isIE && !this.isIE7 && !this.isIE8,
            isGecko: !this.isWebKit && check(/gecko/),
            isGecko2: this.isGecko && check(/rv:1\.8/),
            isGecko3: this.isGecko && check(/rv:1\.9/),
            isBorderBox: this.isIE && !this.isStrict,
            isWindows: check(/windows|win32/),
            isMac: check(/macintosh|mac os x/),
            isAir: check(/adobeair/),
            isLinux: check(/linux/),
            isSecure: /^https/i.test(window.location.protocol),
            isAndroid : (/android/gi).test(navigator.appVersion),
            isiPhone: check(/iPhone/gi),
            isIDevice : (/iphone|ipad/gi).test(navigator.appVersion),
            isPlaybook : (/playbook/gi).test(navigator.appVersion),
            isTouchPad : (/hp-tablet/gi).test(navigator.appVersion),
            has3d : 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
            hasTouch : 'ontouchstart' in window && !this.isTouchPad,
            hasTransform : vendor + 'Transform' in document.documentElement.style,
            hasTransitionEnd : this.isIDevice || this.isPlaybook,
            vendor:vendor
        };
        S.nextFrame = (function() {
            return window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function(callback) { return setTimeout(callback, 1); }
        })();
        S.cancelFrame = (function () {
            return window.cancelRequestAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.webkitCancelRequestAnimationFrame
                || window.mozCancelRequestAnimationFrame
                || window.oCancelRequestAnimationFrame
                || window.msCancelRequestAnimationFrame
                || clearTimeout
        })();
        if (S.browser.isIE6) {
            try {
                DOC.execCommand("BackgroundImageCache", false, true);
            } 
            catch (e) {
            }
        }
    })
}
NC.add('event', function(S){
	var addEventListener,
		removeEventListener,
		onDomReady,
		isDomReady;
	
	// From: David Flanagan.
	// In DOM-compliant browsers, our functions are trivial wrappers around
	// addEventListener( ) and removeEventListener( ).
	if (document.addEventListener) {
		/**
		 * 
		 * 添加事件监听器
		 * 
		 * @method addEventListener
		 * @memberOf Event
		 * 
		 * @param element 元素
		 * @param eventType 事件类型，不含on
		 * @param handler 事件处理器
		 * @return {Element} 返回元素
		 */
		addEventListener = function(element, eventType, handler) {
			//var id = $E._uid( );  // Generate a unique property name
			var isExist = false;
			if(!element._eventTypes){
				element._eventTypes = {};
			}
			if (!element._eventTypes[eventType]){
				element._eventTypes[eventType] = [];
			}
	        element.addEventListener(eventType, handler, false);
	        
	        var handlers= element._eventTypes[eventType];
	        for(var i=0; i<handlers.length; i++){
	        	if(handlers[i] == handler){
	        		isExist = true;
	        	}
	        }
	        if(!isExist){
	        	handlers.push(handler);
	        }
		};
		
		/**
		 * 
		 * 移除事件监听器
		 * 
		 * @memberOf event
		 * @method removeEventListener
		 * 
		 * @param element 元素
		 * @param eventType 事件类型，不含on
		 * @param handler 事件处理器
		 * @return {Element} 返回元素
		 */
		removeEventListener = function(element, eventType, handler) {
			if(eventType){
				if(handler){
					element.removeEventListener(eventType, handler, false);
					if(element._eventTypes && element._eventTypes[eventType]){
						var handlers = element._eventTypes[eventType];
						for(var i=0; i<handlers.length; i++){
							if(handlers[i] === handler){
								handlers.splice(i, 1);
							}
						}
					}
				}else{
					
					if(element._eventTypes && element._eventTypes[eventType]){
						var handlers = element._eventTypes[eventType];
						
						for(var i=0; i<handlers.length; i++){
							element.removeEventListener(eventType, handlers[i], false);
						}
						element._eventTypes[eventType] = [];
					}
					
				}
			}else{
				if(element._eventTypes){
					var eventTypes = element._eventTypes;
					for(var p in eventTypes){
						var handlers = element._eventTypes[p];
						for(var i=0; i<handlers.length; i++){
							element.removeEventListener(p, handlers[i], false);
						}
					}
					eventTypes = {};
				}
			}
	        
			
		};
	}
	/**
	 * 
	 * 文档加载完成时事件监听器
	 * 
	 * @method onDomReady
	 * @memberOf event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	onDomReady = function( f ) {
	    // If the DOM is already loaded, execute the function right away
	    if ( onDomReady.done ) {
	    	return f();
	    }
	
	    // If we’ve already added a function
	    if ( onDomReady.timer ) {
	        // Add it to the list of functions to execute
	        onDomReady.ready.push( f );
	    } else {
	        // 初始化onDomReady后要执行的function的数组
	        onDomReady.ready = [ f ];
	        
	        // Attach an event for when the page finishes  loading,
	        // just in case it finishes first. Uses addEvent.
	        S.event.addEventListener(window, "load", isDomReady);
	
	        //  Check to see if the DOM is ready as quickly as possible
	        onDomReady.timer = window.setInterval( isDomReady, 300 );
	    }
	}
	
	/**
	 * 
	 * 判断文档加载是否完成
	 * 
	 * @method isDomReady
	 * @memberOf event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	// Checks to see if the DOM is ready for navigation
	isDomReady = function() {
	    // If we already figured out that the page is ready, ignore
	    if ( onDomReady.done ) {
	    	return true;
	    }
	
	    // Check to see if a number of functions and elements are
	    // able to be accessed
	    if ( document && document.getElementsByTagName && document.getElementById && document.body ) {
	    	// Remember that we’re now done
			onDomReady.done = true;
			
	        // If they’re ready, we can stop checking
	        window.clearInterval( onDomReady.timer );
	        onDomReady.timer = null;
	
	        // Execute all the functions that were waiting
	        for ( var i = 0; i < onDomReady.ready.length; i++ ){
	            onDomReady.ready[i]();
	        }

	        onDomReady.ready = null;
	        
	        return true;
	    }
	}
	S.event={
		'addEventListener':addEventListener,
		'removeEventListener':removeEventListener,
		'onDomReady':onDomReady,
		'on':addEventListener,
		'off':removeEventListener
	};
});
NC.add('Pages', function(S) {
	var _pageList = {},
		_guideList = {},
		_pageRun={},
		_currentPage;
	var _SwitchStyleEnum = {
		'NONE': 'None',
		'CUBE': 'Cube',
		'SLIDE': 'Slide'
	};
	S.SwitchStyleEnum = _SwitchStyleEnum;
	var _option = {
		switchStyle: _SwitchStyleEnum.NONE,
		defaultPage: 'index',
		hash: !0
	};
	var namedParam = /:([\w\d]+)/g;
	var splatParam = /\*([\w\d]+)/g;
	var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

	function _switchBehavior(current, target, style) {
		switch (style) {
			/*
			case _SwitchStyleEnum.CUBE:
				var targetDom=target.getPageDom(),currDom=current.getPageDom();
                targetDom.style['display']='block';
                targetDom.style['opacity']='1';
                targetDom.style[S.browser.vendor + 'Transform'] = 'rotate(-90deg)';
                setTimeout(function(){
                    targetDom.style[S.browser.vendor + 'TransitionProperty'] = '-' + S.browser.vendor.toLowerCase() + '-transform opacity';
                    targetDom.style[S.browser.vendor + 'TransitionDuration'] = '0.5s';
                    targetDom.style[S.browser.vendor + 'TransformOrigin'] = '100% 100%';
                    targetDom.style[S.browser.vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
                    targetDom.style[S.browser.vendor + 'Transform'] = 'rotate(0deg)';  
                },100);

                currDom.style[S.browser.vendor + 'TransitionProperty'] = '-' + S.browser.vendor.toLowerCase() + '-transform opacity';
                currDom.style[S.browser.vendor + 'TransitionDuration'] = '0.5s';
                currDom.style['opacity'] = '0';
                currDom.style[S.browser.vendor + 'TransformOrigin'] = '100% 100%';
                currDom.style[S.browser.vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
                currDom.style[S.browser.vendor + 'Transform'] = 'rotate(90deg)';
				break;
			case _SwitchStyleEnum.SLIDE:
				var targetDom=target.getPageDom(),currDom=current.getPageDom();
                targetDom.style['display']='block';
                targetDom.style[S.browser.vendor + 'Transform'] = 'translate(480px,0)';
                setTimeout(function(){
                    targetDom.style[S.browser.vendor + 'TransitionProperty'] = '-' + S.browser.vendor.toLowerCase() + '-transform opacity';
                    targetDom.style[S.browser.vendor + 'TransitionDuration'] = '0.5s';
                    targetDom.style[S.browser.vendor + 'TransformOrigin'] = '0 0';
                    targetDom.style[S.browser.vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
                    targetDom.style[S.browser.vendor + 'Transform'] = 'translate(0px,0)';  
                },100);

                currDom.style[S.browser.vendor + 'TransitionProperty'] = '-' + S.browser.vendor.toLowerCase() + '-transform';
                currDom.style[S.browser.vendor + 'TransitionDuration'] = '0.5s';
                currDom.style[S.browser.vendor + 'TransformOrigin'] = '0 0';
                currDom.style[S.browser.vendor + 'TransitionTimingFunction'] = 'cubic-bezier(0.33,0.66,0.66,1)';
                currDom.style[S.browser.vendor + 'Transform'] = 'translate(-480px,0)';

				break;
			*/
		case _SwitchStyleEnum.NONE:
			current && (current.getPageDom().style.display = 'none');
			target.getPageDom().style.display = 'block';
			break;
		default:
			break;
		}
		
	}
	S.pages = {
		// 将路由名转换成可匹配当前hash的正则表达式
		_routeToRegExp: function(route) {
			route = route.replace(escapeRegExp, "\\$&").replace(namedParam, "([^\/]*)").replace(splatParam, "(.*?)");
			return new RegExp('^' + route + '$');
		},
		// 利用路由名和它匹配的url片段，返回提取的参数数组
		_extractParams: function(route, fragment) {
			return route.exec(fragment).slice(1);
		},
		config: function(opt) {
			var that = this;
			this.opt = S.mix(_option, opt, true);
			if (this.opt.hash) {
				//this.opt.defaultPage=null;
				_pageRun={"page":this.opt.defaultPage,"__params":{}};
				this.hash = [];
				for (var i = 0; i < this.opt.hash.length; i++) {
					if (this.opt.hash[i].partten) {
						this.hash.push({
							partten: that._routeToRegExp(this.opt.hash[i].partten),
							impl: this.opt.hash[i].impl
						})
					}
				};
				window.addEventListener('hashchange', function() {
					that._initHash();
				});
				this._initHash();
			}
		},
		_initHash: function() {
			var hashValue = location.hash;
			if (!hashValue) {
				return;
			}
			for (var i = 0; i < this.hash.length; i++) {
				var _regex = new RegExp(this.hash[i].partten);
				var _result = _regex.exec(hashValue);
				if (_result) {
					_pageRun={"page":this.hash[i].impl,"__params":_result.slice(1)};
					this.goPage(this.hash[i].impl, {__params:_result.slice(1)});
				}
			};

			return hashValue;
		},
		_resetPage: function() {

		},
		get: function(pageName) {
			return _pageList[pageName] || null;
		},
		goPage: function(pageName, opt) {
			/*
			if ( (_pageRun.page && pageObj.name==_pageRun.page) || pageObj.name == this.opt['defaultPage']) {
				_currentPage = pageObj.name;
				pageObj.getPageDom().style.display = 'block';
				if (pageObj.pageLoad) {

					pageObj.pageLoad.call(pageObj, opt);
					pageObj.inited = true;
				}
			}
			*/
			
			var _currPage = _currentPage ? _pageList[_currentPage] : null,
				_targetPage = _pageList[pageName];
			if (!_targetPage) {
				throw '没有对应页面';
			}
			/*if (_currPage && (_currPage.name == _targetPage.name)) {
				return true;
			}*/
			if(pageName==_pageRun.page){
				opt=opt||{};
				opt.__params=_pageRun.__params;
			}
			//执行切换效果
			_switchBehavior(_currPage, _targetPage, this.opt.switchStyle);
			_currPage && _currPage.distory();
			if (this.opt.switchStyle == _SwitchStyleEnum.NONE) {
				if ((!_targetPage.inited || _targetPage.refreshAlways) && _targetPage.pageLoad) {
					_targetPage.pageLoad.call(_targetPage, opt);
					_targetPage.inited = true;
				}
			} else {
				var fn = function() {
						_targetPage.getPageDom().style.opacity = "1";
						//_targetPage.getPageDom().style.webkitAnimation = "";
						_currPage && (_currPage.getPageDom().style['display'] = 'none');
						_targetPage.getPageDom().removeEventListener('webkitTransitionEnd', fn);
						if ((!_targetPage.inited || _targetPage.refreshAlways) && _targetPage.pageLoad) {
							_targetPage.pageLoad.call(_targetPage, opt);
							_targetPage.inited = true;
						}
					}
				if (this.opt.switchStyle != _SwitchStyleEnum.NONE) _targetPage.getPageDom().addEventListener('webkitTransitionEnd', fn);
			}
			_currentPage = pageName;
		},
		/**
		 * pageObj 页面实体
		 * @pageName
		 *
		 */
		register: function(pageObj, opt) {
			if (_pageList[pageObj.name]) {
				throw '页面名称已存在';
				return false;
			}
			_pageList[pageObj.name] = pageObj;
			if (pageObj) {
				pageObj._init && (pageObj._init.call(pageObj, opt));
			}
			if (this.opt && !this.opt.hash && this.opt.defaultPage==pageObj.name) {
				this.goPage(this.opt.defaultPage, {});
			}
		},
		unRegister: function(pageName) {
			if (_pageList[pageName]) {
				delete _pageList[pageName];
			} else {
				throw '没有对应页面';
			}
		}
	};
});
NC.add('Page', 'Pages', function(S) {
	function Page(opt) {
		if (!opt.name) {
			throw "页面文件必须定义名称";
		}
		this.refreshAlways = true;
		NC.mix(this, opt, true);
	}
	Page.prototype.getPageDom = function() {
		return document.getElementById(this.name + '_page');
	}
	Page.prototype.distory = function() {
		//this.getPageDom().innerHTML='';
		//this.init(this.opt_Config);
	}
	Page.prototype._init = function(opt) {
		this.opt_Config = opt;
		this.init && this.init(opt);
	}
	Page.prototype.pageLoad = function(opt) {

	}
	S.Page = Page;
});
/*
 模板引擎，使用freemark语法，目前已知最快的
 作者：陈鑫
 */
if (window.NC) {
    NC.add('reMarker', function(S){
        var r = {};
        r.regRuler = {
            ruler: function(str){
                var listArr = r.util.removeEmpty(str.split(' '));
                //import,include
                var ruler = {
                    "list": this.rulerList,
                    "if": this.rulerIf,
                    "break": this.rulerBreak,
                    '/#list': this.rulerEndList,
                    'else': this.rulerElse,
                    "/#if": this.rulerEndIf,
                    'elseif': this.rulerElseIf,
                    'switch': this.rulerSwitch,
                    'case': this.rulerCase,
                    'default': this.rulerDefault,
                    '/#switch': this.rulerEndSwitch,
                    'assign': this.rulerAssign,
                    'return': this.rulerReturn
                };
                return (ruler[listArr[0]]).call(this, listArr);
                
            },
            rulerAssign: function(arr){
                var result=[],count;
                var rt;
                rt=findKeyValuepairs(arr.slice(1));
                count=rt.length;
                for (j = 0; j < count; j += 2) {
                    name = rt[j];
                    result.push('var ');
                    result.push(name + '=' + rt[j + 1] + ';');
                }
                return result.join('');
            },
            rulerEndSwitch: function(arr){
                return '}';
            },
            rulerCase: function(arr){
                return ('case ' + arr[1] + ':');
            },
            rulerDefault: function(){
                return 'default:';
            },
            rulerSwitch: function(arr){
                return 'switch(' + arr.join('').replace('switch', '') + '){';
            },
            rulerElseIf: function(arr){
                if (arr.length < 2) {
                    return false;
                }
                return '}else if(' + arr.slice(1).join('') + '){';
            },
            rulerBreak: function(){
                return 'break;';
            },
            rulerElse: function(arr){
                return '}else{';
            },
            rulerEndIf: function(arr){
                return '}';
            },
            rulerIf: function(arr){
                if (arr.length < 2) {
                    return false;
                }
                return 'if(' + arr.slice(1).join('') + '){';
            },
            rulerEndList: function(arr){
                return '}})();';
            },
            rulerList: function(arr){
                var listName, loopName, loopIndexName, loopHasNextName, result = [];
                if (arr.length != 4) {
                    return;
                }
                loopName = arr[3];
                listName = arr[1];
                loopIndexName = loopName + '_index';
                loopHasNextName = loopName + '_has_next';
                
                result.push('(function(){');
                if (!/^\w+$/.test(listName)) {
                    result.push('var _list=' + listName + ';');
                    listName = '_list';
                }
                result.push(['var _i=0', '_count=' + listName + '.length', loopName, loopIndexName, loopHasNextName + ';'].join(','));
                result.push('for(;_i<_count;_i++){');
                result.push(loopName + '=' + listName + '[_i];');
                result.push(loopIndexName + '=_i;');
                result.push(loopHasNextName + '=_i!==_count-1;');
                return result.join('');
            }
        };
        r.util = {
            trim: function(str){
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            lTrim: function(str){
                return str.replace(/(^\s*)/g, "");
            },
            rTrim: function(str){
                return str.replace(/(\s*$)/g, "");
            },
            removeEmpty: function(arr){
                return arr.join(',').replace(',,', ',').split(',');
            }
        };
        
        //find out key-value pairs from string/array
        //arrya:[key1,value1,key2,key3]
        //string:name1=value1 name2 ... nameN=valueN
        function findKeyValuepairs(value){
            var cache = [];
            if (typeof value == 'object') {
                for (var i = 0; i < value.length; i++) {
                    if (value[i].indexOf('=') > 1) {
                        cache = cache.concat(value[i].split('='));
                    }
                }
            }
            else {
            }
            return cache;
        }
        function _proc(html, data){
            var chunks = [], replaced = [], compiled;
            var printPrefix = "__buf__.push(";
            var lastIndex = 0;
            var ss = /<#.+?>|\${.+?}|<\/#.+?>|<@.+?>/ig;
            function _pushStr(str){
                str = str.replace(/'/g, "\\'");
                if (str !== '') {
                    replaced.push(printPrefix + '\'' + str + '\');');
                }
            }
            html.replace(ss, function(match, index){
                //the last match index of all template
                if (lastIndex != index) {
                    _pushStr(html.substring(lastIndex, index));
                    chunks.push(html.substring(lastIndex, index));
                }
                if (match[0] == '$') {
                    replaced.push(printPrefix + match.substring(2, match.length - 1) + ');');
                }
                else {
                
                    if (match[0] == '<' && match[1] == '#' && match[2] == '-') {
                    
                    }
                    else {
                        if (match[0] == '<' && match[1] == '#') {
                            replaced.push(r.regRuler.ruler(match.substring(2, match.length - 1)));
                        }
                        else 
                            if (match[1] == '/' && match[2] == '#') {
                                replaced.push(r.regRuler.ruler(match.substring(1, match.length - 1)));
                            }
                            else {
                            }
                        chunks.push(match);
                    }
                    
                }
                //set the last match index as current match index plus matched value length
                lastIndex = index + match.length;
            });
            //add the end string for replaced string
            if(lastIndex<html.length){
                _pushStr(html.substring(lastIndex));
            }
            //if no match replace
            if(!replaced.length){
                _pushStr(html);
            }

            var util = {};
            if (r.util) {
                var _util = r.util;
                for (var key in _util) {
                    util[key] = _util[key];
                }
            }
            replaced = ["var __buf__=[],$index=null;$util.print=function(str){__buf__.push(str);};with($data){", replaced.join(''), "} return __buf__.join('');"].join('');
            try {
                compiled = new Function("$data", "$util", replaced);
            } 
            catch (e) {
                throw "error";
            }
            return compiled.call(window, data, util)
        }
        
        S.reMarker = {
            proc: _proc
        };
       
    });
}
NC.add('LazyLoader', function(S) {
	var lazyImgs = [],
		threshold, dataSrc, src, placeholder = '',
		that;
	var MANUAL = 'manual',
		NONE = null,
		DATASRC = 'data-src',
		SRC = 'src',
		SELECTOR = 'img[data-src]';

	function inScreenView(obj) {
		try {
			var _objBottom, _rect, _height, _objTop, f;
			typeof obj == "string" ? _rect = document.getElementById(obj).getBoundingClientRect() : _rect = obj.getBoundingClientRect();
			_height = window.innerHeight;
			_objTop = _rect.top, _objBottom = _rect.bottom;
			return _objTop<_height;
			//return _objTop <= 0 && _objBottom >= _height ? true : (_objBottom >= 0 && _objBottom <= _height) ? true : (_objTop >= 0 && _objTop <= _height) ? true : false;
		} catch (err) {
			return console.error("try.catch:" + err.toString());
		}
	}
	function LazyLoader(opt) {
		that = this;
		NC.event.on(window, 'scroll', function(){that.doScroll.call(that);});
		NC.event.on(window, 'resize', function(){that.doScroll.call(that);});
	}
    function _setAttri (obj) {
        obj.onload=function(evt){
            this.removeAttribute(DATASRC);
            this.removeAttribute('ori-src');
        }
        obj.onerror=function(evt){
            this.setAttribute(SRC,this.getAttribute('ori-src'));
            this.removeAttribute('ori-src');
            this.removeAttribute(DATASRC);
        }
    }
	LazyLoader.prototype._excutor = function(){
		var imgs = document.querySelectorAll(SELECTOR);
		for (var i = 0; i < imgs.length; i++) {
			img = imgs[i];
			dataSrc = img.getAttribute(DATASRC);
			src = img.getAttribute(SRC);
			if (dataSrc && inScreenView(img) ) {
				img.setAttribute('ori-src', src);
				img.setAttribute(SRC, dataSrc);
                _setAttri(img);
				
			}
		}
		var that=this;
		this._getExtraImages();
		if (this.images.length == 0) {
			NC.event.off(window, 'scroll', function(){that.doScroll.call(that);});
			NC.event.off(window, 'resize', function(){that.doScroll.call(that);});
		}
		this.timer=null;
	}

	LazyLoader.prototype._getExtraImages=function() {
		var unFlagImg = [];
		var imgs = document.querySelectorAll(SELECTOR);
		for (var i = 0; i < imgs.length; i++) {
			var img = imgs[i];
			src = img.getAttribute(SRC);
			dataSrc = img.getAttribute(DATASRC);
			if (dataSrc && !src) {
				unFlagImg.push(img);
			}
		}
		this.images = unFlagImg;
	}

	LazyLoader.prototype.doScroll=function(){
		if(this.timer){
			clearTimeout(this.timer);
			this.timer=null;
		}
		var that=this;
		this.timer=setTimeout(function(){
			that._excutor.call(that);
		}, 200);
	}

	S.LazyLoader = LazyLoader;
});