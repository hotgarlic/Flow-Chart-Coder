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

        handle: {// 拖动用的把手
            visible: true,
            type: cc.Node,
            default: null,
            override: true,
        },

        body: {// 用于变形的图像
            type: cc.Node,
            default: null,
        },


        handle_extend_rot: {// 用于延伸和旋转的把手
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:



    init: function () {
        this.hide_menu = false;
        this.tools = 
        this.node.parent.parent.parent.parent.parent.getChildByName('tools').getComponent('ui_tools');
    },

    extend_rot_listen: function () {
        this.handle_extend_rot.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

            //var delta = event.getDelta();
            var pos_world = event.getLocation();
            var x = pos_world.x;
            var y = pos_world.y;

            var pos_local = this.node.convertToNodeSpaceAR(cc.v2(x, y));
            var x_loc = pos_local.x;
            var y_loc = pos_local.y;
            
            var ratio = pos_local.mag() / this.len_body;

            var angle = Math.atan(y_loc / x_loc) * 57.3;
     
            if (x_loc < 0) {
                angle = 180 + angle;
            }

            //angle = parseInt((-angle + 90)/30) * 30;            

            angle = -angle + 90;

            // 4个参数需要保存，
            // 根节点的位置，body的角度（头部的角度），body的比例，头部的位置
            this.body.rotation = angle;
            this.handle_extend_rot.rotation = angle;

            this.body.scaleY = ratio;

            this.handle_extend_rot.x = x_loc;
            this.handle_extend_rot.y = y_loc;

        }, this)

    },

    onLoad: function () {
        this.len_body = 50;

        this.init();
        this.select_listen();
        this.drag_listen();
        this.extend_rot_listen();

        this.initial = null;

        // 监听,并显示序列号
    

    },



    start () {

    },

    // update (dt) {},
});
