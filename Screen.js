/**
 * ScreenAdapter
 * User: simon
 * Date: 12-12-10
 * 延时监听手机屏幕的全屏缩放等事件，处理正确全屏尺寸并赋给pageBody元素，则后期的计算可以以该元素作为参考
 * uc,qq手机浏览器在切换时可能取不到正常的屏幕尺寸，
 */
(function(root){
    //resize事件延时器
    var _resizeTimer;
    var ScreenAdapter=root.ScreenAdapter={
        Vertical:1,
        Horizontal:0,
        cb:[],
        pageContHeight:window.innerHeight+window.scrollY,
        orientation:0,
        register:function(func,host){
            func&&this.cb.push({cb:func,delegate:host||window});
        },
        publish:function(){
            //window.log('resize callback length:'+this.cb.length);
            for(var i=0;i<this.cb.length;i++){
                if(this.cb[i]){
                    this.cb[i].cb.call(this.cb[i].delegate);
                }
            }
        }
    };

    function _setPageBody() {
        ScreenAdapter.pageContHeight = window.innerHeight+window.scrollY;

        if((window.innerHeight+window.scrollY)>window.innerWidth){
            ScreenAdapter.orientation=ScreenAdapter.Vertical;
        }else{
            ScreenAdapter.orientation=ScreenAdapter.Horizontal;
        }
        var container=document.getElementById('pageBody');
        if(container){
            container.style.minHeight = ScreenAdapter.pageContHeight + 'px';
            container.style.minWidth = window.innerWidth+ 'px';
        }
        root.ScreenAdapter.publish();
        //window.log && window.log('resize window:'+( ScreenAdapter.pageContHeight));

    }
    window.addEventListener('DOMContentLoaded', function() {		
        _setPageBody();
        setTimeout(_hideNavi, 10);
    });
    function _hideNavi() {
        window.scrollTo(0, 0);
    }
    function _resize(){				
        if(_resizeTimer){clearTimeout(_resizeTimer);_resizeTimer=null;}
        _resizeTimer=setTimeout(function(){_setPageBody();},500);
    }
    window.addEventListener('resize', _resize);
    window.addEventListener('orientationchange',_resize);
    _setPageBody();
})(window);