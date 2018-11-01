cc.Class({
    extends: cc.Component,

    properties: {

        init_: {
            type: cc.EditBox,
            default: null,
        },

        next_: {
            type: cc.EditBox,
            default: null,
        },


        // 调用次数i，这个应该是只读的，如果函数被调用一次，次数应该累进1
        // i可以作为参数使用
        i_: {
            type: cc.Label,
            default: null,
        },

        show: {
            type: cc.Label,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {

        this.initial = null;
        this.i = null;// 第几次调用，如果是-1表示从未被使用
        this.next = null;
        
    },


    confirm: function () {

        this.initial = parseInt(this.init_.string);

        
        // cocos引擎的输入框可以是数字
        if (this.next_.string.toString() != '') {
            this.next = parseInt(this.next_.string);
        }
        else {
            this.next = this.initial + 1;
            this.next_.string = this.next;
        }
        
        this.i = 0;
        
        this.show.string = '-';
        this.i_.string = 0;// 

    },




    display: function (step) {
        
        this.show.string = step.toString();
        this.i_.string = this.i.toString();
    },

    


    start () {

    },

    // update (dt) {},
});
