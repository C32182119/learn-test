function AI(board) {

    if (!canMoveRight(board) &&
        !canMoveUp(board) &&
        !canMoveDown(board)) {
        return 0;
    }

    var array = new Array(2, 3, 1);
    var value = array[Math.round(Math.random() * (array.length - 1))]; //随机抽取一个值
    return value;
    //   var string = "right, right, right, down, down, up"; //原始数据
    //   var array = string.split(","); //转化为数组
    //   var value = array[Math.round(Math.random() * (array.length - 1))]; //随机抽取一个值
    //   return value;

}