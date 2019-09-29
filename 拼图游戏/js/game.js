/**
 * 创建一个对象用来游戏配置 方便在后面使用 
*/
var gameConfig = {
    // 把完整图片的宽高设置为整个游戏界面的宽高 图片改变后游戏界面的宽高也需要改变
    width: 500,
    height: 500,
    // 判断游戏是都结束
    isOver: false,
    // 行数
    rows: 3,
    // 列数
    cols: 3,
    // 图片地址 相对index的路径
    imgurl: 'img/熊猫.jpg',
    // 游戏的dom对象
    dom: document.querySelector('.game')
}

// 使用计算值的好处是 在以后需要更改的时候 只需要改变很少的指就可以了
// 设置单独一个小图片的的宽度
gameConfig.pieceWidth = gameConfig.width / gameConfig.cols;
// 设置单独一个小图片的的高度
gameConfig.pieceHeight = gameConfig.height / gameConfig.rows;
// 小块的数量
gameConfig.pieceNumber = gameConfig.cols * gameConfig.row

// 初始化游戏 给游戏界面设置css属性
/**
 * 写一个构造函数 用于创建每个小方块的对象
 * @param {*} left div小方块横坐标
 * @param {*} top div小方块纵坐标
 * @param {*} isValue div小方块是否可见
 */
function Block(left, top, isValue) {
    // 刚创建时 - 当前的横、纵坐标
    this.left = left;
    this.top = top;
    // 正确的横坐标、纵坐标
    this.correctLeft = this.left;
    this.correctTop = this.top;

    // 为每个小方块设置属性
    this.dom = document.createElement('div');
    this.dom.style.width = gameConfig.pieceWidth + 'px';
    this.dom.style.height = gameConfig.pieceHeight + 'px';
    this.dom.style.background = `url('${gameConfig.imgurl}') -${this.correctLeft}px -${this.correctTop}px`;
    this.dom.style.position = 'absolute';
    this.dom.style.border = '1px solid #999999';
    this.dom.style.boxSizing = 'border-box';
    // 表示在css属性变化时 在0.5秒中内完成
    this.dom.style.transition = '.5s';
    this.dom.style.cursor = "pointer";

    if (!isValue) {
        this.dom.style.display = "none"
    }

    // 把生成的小方块div加入游戏界面中
    gameConfig.dom.appendChild(this.dom);

    this.show = function () {
        // 根据当前位置的left、top值重新设置小方块div的位置
        this.dom.style.left = this.left + 'px';
        this.dom.style.top = this.top + 'px';
    }

    this.show();

    // 判断当前位置是否与正确位置一致
    this.isCorrect = function () {
        return isEqual(this.left, this.correctLeft) && isEqual(this.top, this.correctTop);
    }

}

/**
 * 初始化游戏 / 游戏的进程编写 
*/
function init() {
    // 1.初始化游戏容器
    initGameDom();
    // 2.1 初始化小方块
    // 2.2 准备好一个数组，数组的每一项都是一个对象，记录了每一个小方块的信息 要使用时直接循环数组就行了
    initBlocksArray();
    // 2.3 写一个函数打乱数组的位置 让小方块随机出现
    shuffle();
    // 3. 注册点击事件
    regEvent();

    /**
     * 初始化游戏容器函数 
    */
    function initGameDom() {
        gameConfig.dom.style.width = gameConfig.width + 'px';
        gameConfig.dom.style.height = gameConfig.height + 'px';
        gameConfig.dom.style.border = "2px solid #ccc";

        // 每个小块在页面的移动 肯定是要设置为绝对定位的 所有要给父元素设置为相对定位    
        gameConfig.dom.style.position = "relative"
    }
    /**
     * 初始化一个小方块数组 - 由多个div小方块对象构成
    */
    function initBlocksArray() {
        // i 表示行数 j 表示列数
        blocks = [];
        for (var i = 0; i < gameConfig.rows; i++) {
            for (var j = 0; j < gameConfig.cols; j++) {
                var isValue = true;
                // 使最后一个小方块的 display 值为 none
                if (i === gameConfig.rows - 1 && j === gameConfig.cols - 1) {
                    isValue = false;
                }
                var b = new Block(j * gameConfig.pieceWidth, i * gameConfig.pieceHeight, isValue)
                blocks.push(b);
            }
        }
    }
    /**
     * 给block数组-洗牌 
    */
    function shuffle() {
        // blocks.length -1 / -2 的目的是为了不改变最后的空白小块的位置
        for (var i = 0; i < blocks.length - 1; i++) {
            // 随机产生一个下标
            var index = getRandom(0, blocks.length - 2);
            // 然后将当前的下标的数组项与随机产生数的数组项交换left与top值
            exchange(blocks[i], blocks[index]);
        }
    }
    /**
     * 注册点击事件 
    */
    function regEvent() {
        // 获取空白方块
        var isValueBlock = blocks.find(function (b) {
            return b.dom.style.display === 'none';
        });
        blocks.forEach(function (n) {
            n.dom.onclick = function () {
                // 判断游戏是否结束
                if (gameConfig.isOver) {
                    return;
                }
                // 判断要与空白小块交换的小快是不是相邻的 - 
                // 规则 同一行相邻 top值相等 left的差的绝对值为一个方块的宽度 
                //      同一列相邻 left值相等 height的差的绝对值为一个方块的高度                                           
                if (n.top === isValueBlock.top &&
                    isEqual(Math.abs(n.left - isValueBlock.left), gameConfig.pieceWidth)
                    || n.left === isValueBlock.left &&
                    isEqual(Math.abs(n.top - isValueBlock.top), gameConfig.pieceHeight)) {
                    // 点击事件 点击空白方块周围的方块就会交换空白方块与点击方块的位置
                    exchange(n, isValueBlock);
                    // 每次移动一次做一次胜利判断
                    isWinner();
                }
            }
        })
    }
}
// 需要使用的辅助函数
/**
    * 在最大值与最小值之间产生一个随机数 
    * @param {*} min 最小值
    * @param {*} max 最大值
*/
   function getRandom(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
/**
    * 交换两个方块的left值与top值 
    * @param {*} b1 b1方块
    * @param {*} b2 b2方块
*/
function exchange(b1, b2) {
    // 1. 交换left值
    var templeft = b1.left;
    b1.left = b2.left;
    b2.left = templeft;
    // 2. 交换top值
    var temptop = b1.top;
    b1.top = b2.top;
    b2.top = temptop;

    // 每次交换完毕后 都需要重新显示一下页面
    b1.show();
    b2.show();
}
/**
    * 判断两个小数是否相等 
    * @param {*} n1 要比较的小数1
    * @param {*} n2 要比较的小数2
*/
function isEqual(n1, n2) {
    return parseInt(n1) === parseInt(n2);
}
/**
 * 判断是否胜利
*/
function isWinner() {
    var wrongs = blocks.filter(function (item) {
        return !item.isCorrect();
    })
    if (wrongs.length === 0) {
        gameConfig.isOver = true;
        // 游戏结束  去掉所有的边框
        blocks.forEach(function (b) {
            b.dom.style.border = 'none';
            b.dom.style.display = 'block';
        })
    }
}
init();