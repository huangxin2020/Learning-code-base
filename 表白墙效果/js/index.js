// 实现小纸条拖拽功能
window.onmousedown = function (e) {
    var div = getMoveDiv(e.target);
    if (!div) {
        return
    }
    // 设置被点击的div会显示在最上面
    div.style.zIndex = zIndex;
    zIndex++;
    // 获取div的全部样式
    var style = getComputedStyle(div);
    // 记录当前div的left与top
    var divLeft = parseFloat(style.left);
    var divTop = parseFloat(style.top);

    var pageX = e.pageX;
    var pageY = e.pageY;
    // 注册鼠标移动事件
    window.onmousemove = function (e) {
        var disX = e.pageX - pageX;
        var disY = e.pageY - pageY;
        // div的left与top加上与鼠标的距离
        var newLeft = divLeft + disX;
        var newTop = divTop + disY;
        // 设置不能拖动窗口
        if(newLeft < 0 ){
            newLeft = 0;
        }
        if(newLeft > document.documentElement.clientWidth - paperWidth){
            newLeft = document.documentElement.clientWidth - paperWidth;
        }
        if(newTop < 0 ){
            newTop = 0;
        }
        if(newTop > document.documentElement.clientHeight - paperHeight - 70){
            newTop = document.documentElement.clientHeight - paperHeight - 70;
        }
        // 重新给div赋值left与top
        div.style.left = newLeft + 'px';
        div.style.top = newTop + 'px';
    }

    window.onmouseup = window.onmouseleave = function () {
        window.onmousemove = null;
    }
}

// 注册关闭事件
window.onclick = function(e){
    if(e.target.parentElement && e.target.parentElement.className === 'paper' && e.target.tagName === 'SPAN'){
        e.target.parentElement.remove();
    }
}

var inp = document.querySelector('input');
zIndex = 1;
var container = document.querySelector('#container');
var paperWidth = 170,
    paperHeight = 170;
// 记录视口的宽度与高度
var vWidth = document.documentElement.clientWidth;
var vHeight = document.documentElement.clientHeight;

createInintPapers();


// 给文本框设置事件
inp.onkeypress = function(e){
    if(e.key === 'Enter'){
        if(this.value){
            creatWish(this.value);
        }
    }
}

/**
 * 得到可移动的div
*/
function getMoveDiv(dom) {
    if (dom.className === 'paper') {
        return dom
    } else if (dom.parentElement && dom.parentElement.className === 'paper' && dom.tagName === "P") {
        return dom.parentElement;
    }
}

/**
 * 创建一个愿望 div 
*/
function creatWish(words) {
    var div = document.createElement('div');

    div.className = 'paper';
    div.innerHTML = `<p>${words}</p><span>X</span>`;
    // 设置随机颜色、位置
    div.style.backgroundColor = `rgb(${getRadom(10, 50)},${getRadom(100, 200)},${getRadom(100, 200)})`;

    // documentElement.clientWidth 视口宽度
    var maxLeft = document.documentElement.clientWidth - paperWidth;
    // -80是为了防止遮住文本输入框
    var maxTop = document.documentElement.clientHeight - paperHeight - 70;

    div.style.left = getRadom(0, maxLeft) + 'px';
    div.style.top = getRadom(0, maxTop) + 'px';
    container.appendChild(div);

    // 产生一个最大值与最小值之间的随机树
    function getRadom(min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }
}
/**
 * 初始化paper 一开始创建几个paper 
*/
function createInintPapers() {
    var arr = ['世界和平！！', "好好学习!!", "天天向上!!"];
    arr.forEach(function (item) {
        creatWish(item);
    })

}

// 改变视口后，paper的位置
window.onresize = function () {
    // 重新调整所有div.paper的位置
    // 计算当前的视口宽度/高度 与之前的视口尺寸的差值
    var disx = document.documentElement.clientWidth - vWidth;
    var disY = document.documentElement.clientHeight - vHeight;


    for (var i = 0; i < container.children.length; i++) {
        var paper = container.children[i];
        // 改变paper的left
        // 因为所有的paper都是有js生成 属性写在内联样式中 可这样直接获取
        var left = parseFloat(paper.style.left);
        var right = vWidth - paperWidth - left;
        var newLeft = left + left / (left + right) * disx;
        paper.style.left = newLeft + 'px';

        // 改变paper的height
        var top = parseFloat(paper.style.top);
        var bottom = vHeight - paperHeight - top;
        var newTop = top + top / (top + bottom) * disY;
        paper.style.top = newTop + 'px';
    }
    vWidth = document.documentElement.clientWidth;
    vHeight = document.documentElement.clientHeight;
}