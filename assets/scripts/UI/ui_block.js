cc.Class({
    extends: cc.Component,

    properties: {

        menu: {
            type: cc.Node,
            default: null,
        },

        handle: {// 用于移动拖拉的把手，在隐藏菜单时，把手不会被隐藏
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    deal_menu: function () {

        var hide = cc.scaleTo(0.2, 0);
        var show = cc.scaleTo(0.2, 1);

        if (!this.hide_menu) {
            this.menu.runAction(hide);
        }
        else {
            this.menu.runAction(show);
        }
        this.hide_menu = !this.hide_menu;
    },

    select_listen: function () {
        // 选中操作
        this.handle.on(cc.Node.EventType.TOUCH_START, function (event) {

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
    },

    init: function () {
        this.hide_menu = false;
        this.tools = this.node.parent.parent.parent.getChildByName('tools').getComponent('ui_tools');
    },

    onLoad: function () {
        
        this.init();
        this.select_listen();
        this.drag_listen();
    },



    start () {

    },

    // update (dt) {},
});
