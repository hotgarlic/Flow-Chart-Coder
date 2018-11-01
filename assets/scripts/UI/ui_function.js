var ui_block = require('./ui_block.js');

cc.Class({
    extends: ui_block,
    

    properties: {
        

        menu: {
            visible: true,
            type: cc.Node,
            default: null,
            override: true,
        },

        menu_more: {
            type: cc.Node,
            default: null,
        },

        handle: {
            visible: true,
            type: cc.Node,
            default: null,
            override: true,
        },

        dash_arrow: {
            type: cc.Prefab,
            default: null,
        },

        line_arrow: {
            type: cc.Prefab,
            default: null,
        },

        name_: {
            type: cc.Node,
            default: null,
        },

        step: {
            type: cc.Label,
            default: null,
        },

        i_: {
            type: cc.Label,
            default: null,
        },

        bullet: {
            type: cc.Prefab,
            default: null,
        },

        init_: {
            type: cc.Node,
            default: null,
        },

        state_: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        
        this.init();
        this.select_listen();
        this.drag_listen();

        this.time_fade_shine_name = 0.8
        this.time_fade_recv_all = 0.5;

        this.time_move = 0.3;
        this.time_scale = 0.3;

        this.loc_bullet = null; // 发射点当地坐标，也是接收子弹的地点
        
        this.bullets = this.node.getChildByName('bullets');
        

        this.recv_bullet = 0;
        
        this.uis_var_out = null;

        this.transfer_to = null;
        this.next = null;

        this.menu_more.scale = 0;
        this.menu.scale = 0;

        this.bg = this.node.getChildByName('name').getChildByName('bg');

        this.state_.scale = 0;

    },

    tradition_FC: function () {
        this.bullets.scale = 0;// 用于关闭自动动画
        this.time_fade_recv_all = 0;
        this.time_move = 0;
        this.time_scale = 0;
        
    },

    variable_FC: function () {
        this.bullets.scale = 1;// 用于关闭自动动画
        this.time_fade_recv_all = 0.5;
        this.time_move = 0.3;
        this.time_scale = 0.3;
        
    },

    send_high_light: function (event_btn, data_btn) {
        var event = new cc.Event.EventCustom('high_light', true);
        if (data_btn == 0) {
            event.detail = ({'transfer_to': this.transfer_to});
        }
        else {
            event.detail = ({'next': this.next});
        }
        this.node.dispatchEvent(event);
    },

    swith_more: function () {
        if (this.menu_more.scale == 0) {
            this.menu_more.scale = 1;
        }
        else {
            this.menu_more.scale = 0;
        }
    },

    


    confirm: function () {
        
        this.loc_bullet = this.node.convertToWorldSpaceAR(cc.v2(-90, 45));// 转换到世界坐标
        
        //var name = this.node.getComponent('Function').name_f;
        
        this.uis_var_out = this.node.getComponent('Function').uis_var_out;


        this.transfer_to = this.node.getComponent('Function').transfer_to;
        this.next = this.node.getComponent('Function').serial.next;
        
        this.variable_FC();
        //this.bg.color = new cc.Color(0, 0, 255);
        this.state_.scale = 0;

        var bar = this.state_.getChildByName('bar');
        bar.scaleX = 0;
    },

    shine_name: function (pre_or_main) {

        //var back = cc.tintTo(0, 0, 0, 255);
        //this.bg.runAction(back);

        //this.state_.getComponent(cc.Label).string = '运行';
        this.state_.scale = 1;
        var fill = cc.scaleTo(this.time_fade_shine_name, 1, 1);
        var bar = this.state_.getChildByName('bar');


        //var show_run = cc.scaleTo(this.time_fade_shine_name, 1);
        //var end_run = cc.scaleTo(this.time_fade_shine_name, 0);
        //var seq1 = cc.sequence(show_run, end_run);
        
        //var seq_fill = cc.sequence(fill, full_fill);
        
        bar.runAction(fill);

        var up = cc.fadeTo(this.time_fade_shine_name, 255);
        var down = cc.fadeTo(this.time_fade_shine_name, 255);

        var seq = cc.sequence(up, down, pre_or_main);
        this.name_.runAction(seq);
        
    },


    update_i: function (i) {
        this.i_.string = i;
    },

    update_step: function (step) {
        this.step.string = step;
    },


    



    shot_var: function () {

        for (var idx in this.uis_var_out) {
            var bullet = cc.instantiate(this.bullet);
            
            this.bullets.addChild(bullet);

            var ui_bullet = bullet.getComponent('ui_bullet');

            var loc_bullet = this.uis_var_out[idx].loc_bullet;
            ui_bullet.target = loc_bullet;
            
            ui_bullet.time_move = this.time_move;
            ui_bullet.time_scale = this.time_scale;

            //cc.log(this.time_scale, this.time_move);

            ui_bullet.shot_var(this.uis_var_out[idx]);

            
        }

        

    },



    // 注意，如果输入变量有多个，那么这个方法会运行多次
    recv_all: function (no_in) {// no_in是没有输入变量时的快速通道，直接闪烁变量，然后发射子弹给输出变量
        //cc.log(this.recv_bullet);
        this.recv_bullet -= 1;
        if (this.recv_bullet == 0 || no_in) {
            // 保证了，不是每个子弹收到后都产生闪烁效果
            // 不论这个函数有多少个输入变量，最后函数生成子弹的事件只发射一次
            var up = cc.fadeTo(this.time_fade_recv_all, 100);
            var down = cc.fadeTo(this.time_fade_recv_all, 255);

            var recv_all_end = cc.callFunc(function() {
                this.shot_var();
            }.bind(this));

            var seq = cc.sequence(up, down, recv_all_end);
            this.name_.runAction(seq);


            //cc.log(this.name_.getChildByName('text').getComponent(cc.EditBox).string, 'recv allll');
        }

    },

    high_light: function () {
        
        this.node.on()
        var up = cc.fadeTo(0.3, 100);
        var down = cc.fadeTo(0.3, 255);

        var seq = cc.sequence(up, down);
        this.node.runAction(seq);
    },

    select_listen: function () {
        // 选中操作
        this.handle.on(cc.Node.EventType.TOUCH_START, function (event) {

            this.tools.dealing = this.node;
            this.tools.push_up();

        }, this);

        this.menu.on(cc.Node.EventType.TOUCH_START, function (event) {

            this.tools.dealing = this.node;
            this.tools.push_up();

        }, this);
    },

    drag_listen: function () {
        this.handle.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

            var delta = event.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;

        }, this);

        this.menu.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

            var delta = event.getDelta();
            this.node.x += delta.x;
            this.node.y += delta.y;

        }, this);
    },
    /*
    add_line: function () {
        var line = cc.instantiate(this.line);
        this.node.getChildByName('lines_arrows').addChild(line);
        return line;
    },
    */
    add_line_arrow: function () {
        var line_arrow = cc.instantiate(this.line_arrow);
        this.node.getChildByName('lines_arrows').addChild(line_arrow);
        return line_arrow;
    },
    
    add_dash_arrow: function () {
        var dash_arrow = cc.instantiate(this.dash_arrow);
        this.node.getChildByName('dash_arrows').addChild(dash_arrow);
        return dash_arrow;
    },
    

    start () {

    },

    // update (dt) {},
});