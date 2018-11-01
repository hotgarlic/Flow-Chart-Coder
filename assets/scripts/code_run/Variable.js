cc.Class({
    extends: cc.Component,

    properties: {

        name_: {
            type: cc.EditBox,
            default: null,
        },

        values_: {
            type: cc.EditBox,
            default: null,
        },

        const_: {
            type: cc.EditBox,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {


        this.values = [];
        this.name_v = null;
        this.const = false;  // 如果是常量，confirm以后不会被清空
        this.result = '';
        this.i = 0;
        this.diff_values = false;

    },

    
    get_values: function () {

        if (!this.const) {
            this.values_.string = '';// 输入框只能显示空字符（有长度的），而不能显示null类型数据
            this.values = [];
        }

        
        if (this.values_.string != '') {
            this.values = this.values_.string.split(',');
        }

    },

    confirm: function () {
        
        this.name_v = this.name_.string;

        if (this.const_.string == 'c') {
            this.const = true;
            this.i = 1;
        }
        else {
            this.const = false;
            this.i = 0;
        }
        
        this.get_values();
        //cc.log(this.values)
        
    },




    update_values: function (values) {

        // values 传入的是一个数组[a,b,c...]，而且元素都是字符类型
        var values_last = this.values;
        this.values = values;

        if (values.length > 1) {
            for (var idx in values) {
                this.result += values[idx] + ',';
            }
            this.result = this.result.substr(0, this.result.length - 1);// 删掉最后一个逗号
        }
        else {// 当只有一个元素时
            
            if (values[0] != null) {
                this.result = values[0].toString();
            }          
        }
        
        if (this.result == values_last) {
            this.diff_values = false;
        }
        else {
            this.diff_values = true;
        }

        //cc.log(this.name_v, this.result==values_last);

    },


    start () {

    },

    // update (dt) {},
});
