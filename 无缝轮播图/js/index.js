/**
 * 用于保存下面需要计算的数值 和各种dom
*/
var config = {
    imgWidth: 520, // 图片的宽度
    dotwidth: 12, // 小圆点的宽度
    dom: {
        divBanner : document.querySelector('.banner'),
        divImgs: document.querySelector(".banner .imgs"),
        divdots: document.querySelector(".banner .dots"),
        divArrows: document.querySelector(".banner .arrows")
    },
    currentIndex: 0,// 实际的图片索引 0 ~ imgNumber.length - 1
    // 设置计时器的配置
    timer: { // 点击运动
        duration: 16, // 运动间隔的事件  浏览的刷新频率为16.6666666ms 
        totla: 300, // 运动的总时间 毫秒
        id: null // 计时器的编号
    },
    autoTimer : null // 自动运动陪着

}
// 图片数量
config.imgNumber = config.dom.divImgs.children.length;
/**
 * 初始化函数 
*/
function init() {
    /**
      * 初始化页面中的元素尺寸 imgs的宽度 与 dots的宽度
      * +2是为了无缝切换留下第一幅图与最后一幅图的位置
    */
    function initSize() {
        // imgs的宽度
        config.dom.divImgs.style.width = config.imgWidth * (config.imgNumber + 2) + 'px';
        // dots的宽度
        config.dom.divdots.style.width = config.dotwidth * config.imgNumber + 'px';
    }
    /**
     * 初始化元素  
    */
    function initElement() {
        // 创建小圆点 - 根据图片的数量来动态生成
        for (var i = 0; i < config.imgNumber; i++) {
            var span = document.createElement('span');
            config.dom.divdots.appendChild(span);
        }
        // 复制图片 - 把最后一张图放在第一张的前面 第一张图放在最后一张图的后面 制作无缝切换效果
        var children = config.dom.divImgs.children;
        var first = children[0], last = children[children.length - 1];
        var newImg = first.cloneNode(true); // 表示深度克隆
        config.dom.divImgs.appendChild(newImg);
        newImg = last.cloneNode(true);
        config.dom.divImgs.insertBefore(newImg, first);
    }
    /**
     * 初始化图片的位置 
    */
    function initPositionImg() {
        var left = (-config.currentIndex - 1) * config.imgWidth;
        config.dom.divImgs.style.marginLeft = left + 'px';
    }

    initSize();
    initElement();
    initPositionImg();
    setActiveSpan();
}
/**
 * 设置小圆点的状态 被选中的状态
*/
function setActiveSpan() {
    for (var i = 0; i < config.dom.divdots.children.length; i++) {
        var dot = config.dom.divdots.children[i];
        if (config.currentIndex === i) {
            dot.className = 'active';
        } else {
            dot.className = '';
        }
    }
}

init();
/**
 * 切换图片的函数 - 切换到某个图片的索引 
 * left、right 都是指图片的移动方向
 * @param {*} index 要切换的图片的索引
 * @param {*} direction 方向 向left、right切换
*/
function switchTo(index, direction) {
    // 当要切换的图片索引与当前位于的索引一致时，结束
    if (index === config.currentIndex) {
        return;
    }
    // 默认图片移动为向左移动 在页面表现为点击right移动键
    if (!direction) {
        direction = 'left';
    }

    // 最终要移动的left的值
    var newLeft = (-index - 1) * config.imgWidth;
    // config.dom.divImgs.style.marginLeft = newLeft + "px";
    animatsSwitch();
    // 重新设置当前索引
    config.currentIndex = index;
    setActiveSpan();

    /**
     * 设置图片的切换动画 - 逐步改变margin-left 
    */
    function animatsSwitch() {
        // 结束之前的动画
        stopAnimate();
        // 计算运动次数 总时间/运动间隔时间
        var number = Math.ceil(config.timer.totla / config.timer.duration);
        var currNumber = 0; // 计算当前的运动次数
        // 计算每次改变的距离
        // 计算总距离
        var distance,
            marginLeft = parseFloat(getComputedStyle(config.dom.divImgs).marginLeft),
            totalImgsWidth = config.imgWidth * config.imgNumber;
        // 点击向右移动
        if (direction === 'left') {
            // 要跳转的图在目前的右边
            if (newLeft < marginLeft) {
                distance = newLeft - marginLeft; // 加上之间的距离
            } else {
                distance = -(totalImgsWidth - Math.abs(newLeft - marginLeft));
            }
        }
        // 点击向左跳转
        else {
            // 要跳转的图在目前的右边
            if (newLeft > marginLeft) {
                distance = newLeft - marginLeft; // 加上之间的距离
            } else {
                distance = totalImgsWidth - Math.abs(newLeft - marginLeft);
            }
        }
        // 计算每次改变的距离
        var everyDistance = distance / number;
        config.timer.id = setInterval(function () {
            // 每次改变margin-left多少 与 运动的次数
            marginLeft += everyDistance;

            // 设置无缝效果 给移动距离设置范围
            if(direction === 'left' && Math.abs(marginLeft) > totalImgsWidth){
                marginLeft += totalImgsWidth;
            }else if(direction === 'right' && Math.abs(marginLeft) < config.imgWidth){
                marginLeft -= totalImgsWidth;
            }
            config.dom.divImgs.style.marginLeft = marginLeft + 'px';
            currNumber++;
            if (currNumber === number) {
                stopAnimate();
            }
        }, config.timer.duration);
    }

    /**
     * 停止动画 
    */
    function stopAnimate() {
        clearInterval(config.timer.id);
        config.timer.id = null;
    }
}

// 设置左右键的绑定事件
config.dom.divArrows.onclick = function(e) {
    if(e.target.classList.contains('left')){
        toLeft();
    }else if(e.target.classList.contains('right')){
        toRight();
    }
}

function toLeft() {
    var index = config.currentIndex - 1;
    if(index < 0){
        index = config.imgNumber - 1;
    }
    switchTo(index,'right');
}

function toRight(){
    var index = (config.currentIndex + 1) % config.imgNumber;
    switchTo(index,'left');
}

// 点击图片的小点来跳转
config.dom.divdots.onclick = function(e){
    if(e.target.tagName === 'SPAN'){
        var index = Array.from(this.children).indexOf(e.target);
        switchTo(index, index > config.currentIndex ? 'left' : 'right');
    }
}

config.autoTimer = setInterval( toRight, 1500);

config.dom.divBanner.onmouseenter = function(){
    clearInterval(config.autoTimer);
    config.autoTimer = null;
}

config.dom.divBanner.onmouseleave = function(){
    if(config.autoTimer){
        return;
    }
    config.autoTimer = setInterval( toRight, 1500);
}

