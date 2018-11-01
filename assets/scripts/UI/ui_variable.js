var ui_block = require('./ui_block.js');

cc.Class({
    extends: ui_block,
    

    properties: {
        

        menu: {
            visible: false,
            type: cc.Node,
            default: null,
            override: true,
        },

        handle: {
            visible: true,
            type: cc.Node,
            default: null,
            override: true,
        },

        bullets: {
            type: cc.Node,
            default: null,
        },

        bullet: {
            type: cc.Prefab,
            default: null,
        },

        i_node: {
            type: cc.Node,
            default: null,
        },

        i_: {
            type: cc.Label,
            default: null,
        },

        result: {
            type: cc.EditBox,
            default: null,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        
        this.init();
        this.select_listen();
        this.drag_listen();

        this.loc_bullet = null;
        this.time_fade = 0.5;
        this.time_move = 0.3;
        this.time_scale = 0.3;

        this.i_node.scale = 0;

        this.i = 0;

    },

    tradition_FC: function () {
        this.bullets.scale = 0;// 用于关闭自动动画
        this.time_move = 0;
        this.time_scale = 0;
    },

    variable_FC: function () {
        this.bullets.scale = 1;// 用于关闭自动动画
        this.time_move = 0.3;
        this.time_scale = 0.3;
    },


    confirm: function () {

        this.loc_bullet = this.node.convertToWorldSpaceAR(cc.v2(0, 0));// 转换到世界坐标
        this.Variable = this.node.getComponent('Variable');

        this.i_.string = this.Variable.i;
        this.i = this.Variable.i;
        this.variable_FC();
        
    },

    show_i: function () {

        if (this.i_node.scale == 0) {
            this.i_node.scale = 1;
        }
        else {
            this.i_node.scale = 0;
        }
         
    },

    shot: function (ui_func) {
        //cc.log('shot!!');
        var bullet = cc.instantiate(this.bullet);
        
        this.bullets.addChild(bullet);

        var ui_bullet = bullet.getComponent('ui_bullet');

        var loc_bullet = ui_func.loc_bullet;
        ui_bullet.target = loc_bullet;
            
        ui_bullet.time_move = this.time_move;
        ui_bullet.time_scale = this.time_scale;

        ui_bullet.shot_func(ui_func);

        // 简易计数器递减
        this.i -= 1;
        this.i_.string = this.i;

        // shot的同时闪烁实线箭头
        //cc.log('solid line')
        var ui_lines_arrows = ui_func.node.getChildByName('lines_arrows').getComponent('ui_lines_arrows');
        ui_lines_arrows.shine();
        
    },

    recv_once: function () {
        var up = cc.fadeTo(this.time_fade, 100);
        var down = cc.fadeTo(this.time_fade, 255);

        var update_values = cc.callFunc(function() {
            this.result.string = this.Variable.result;
        }.bind(this));

        // 简易计数器递增
        var update_i = cc.callFunc(function() {
            if (!this.Variable.diff_values) {
                this.i += 1;
                this.i_.string = this.i;
            }
            else {
                this.i = 1;
                this.i_.string = 1;
            }
        }.bind(this));

        var go_on = cc.callFunc(function() {

            var event = new cc.Event.EventCustom('go_on', true);
            this.node.dispatchEvent(event);
            
        }.bind(this));

        

        var seq = cc.sequence(up, down, update_values, update_i, go_on);
        this.node.runAction(seq);

        
    },

    start () {

    },

    // update (dt) {},
});