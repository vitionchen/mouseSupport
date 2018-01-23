/* 
    Vson
    create in 2018-01-23
 */
function mouseInit(){
    
}


mouseInit.prototype.startTop = 0;   //记录鼠标触发相对页面位置

mouseInit.prototype.startPos = 0;   //记录鼠标触发相对屏幕位置
mouseInit.ifDown = false;           //记录是否触发滑动

mouseInit.prototype.ifSupportTouch = function(){
    return "ontouchend" in document ? true : false;
}

mouseInit.prototype.mouseAttach = function(){
    var self = this;

    if(this.ifSupportTouch())return;
/* 
     在this上绑定事件
    -------
     */
    function bind(method, context) {
        return function() { return method.apply(context, arguments); };
    }
    var methods = ['onMouse','onClick'];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
        context[methods[i]] = bind(context[methods[i]], context);
    }

    var targetEle = document.getElementById(arguments[0]);
    targetEle.addEventListener('click',this.onClick,true);
    
// 触发鼠标按下
    targetEle.addEventListener('mousedown',function(event){
        self.ifDown = true;
        self.startTop = this.scrollTop+event.clientY;
        self.startPos = event.screenY;
    })
// 触发鼠标移动
    targetEle.addEventListener('mousemove',function(event){
        if(self.ifDown){
            this.scrollTop=self.startTop-event.clientY;
        }
    })
// 触发鼠标离开
    targetEle.addEventListener('mouseup',function(event){
        self.ifDown = false;
        // 如果鼠标屏幕位置位移小于10
        if(Math.abs(event.screenY-self.startPos)<10){
            self.onMouse(event,self);
        }
        self.startTop = 0;
        self.startPos = 0;
    },false)
}

// 虚拟点击事件
mouseInit.prototype.myClick = function(event){
    var clickEvent;
    var targetElement = event.target;
/*     
    创建event事件
    此处initMouseEvent部分机型已经淘汰，需用MouseEvent兼容
     */
    try{
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, window, 1, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
    }catch(e){
        var initEvent = {
            "screenX":event.screenX,
            "screenY":event.screenY,
            "clientX":event.clientX,
            "clientY":event.clientY,
            "ctrlKey":false,
            "shiftKey":false,
            "altKey":false,
            "metaKey":false,
            "button":0
        }
        clickEvent = new MouseEvent('click',initEvent)
    }
    clickEvent.isMyClick=true;   //识别是否进入自带点击事件
    targetElement.dispatchEvent(clickEvent);    //立即触发事件
}


// 鼠标弹起事件
mouseInit.prototype.onMouse = function(event,self){
    self.myClick(event);
}


// 点击事件
mouseInit.prototype.onClick = function(event){
    if(!event.isMyClick){
        event.stopPropagation();
        return;
    }
}


/* 
    用法
    var myTry = new mouseInit();
    myTry.mouseAttach('scrollTap');  传入ID
 */