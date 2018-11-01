cc.Class({
    extends: cc.Component,

    properties: {



    },

    // LIFE-CYCLE CALLBACKS:



    onLoad: function () {

        this.time_fade = 0.1;
        
    },




    shine: function (i, transfer_to, node) {
        //cc.log(this.time_fade);
        var up = cc.fadeTo(this.time_fade, 60);
        var down = cc.fadeTo(this.time_fade, 255);

        
        var shine_dash_end = cc.callFunc(function() {

            var ui_func = this.node.parent.getComponent('ui_function');
            ui_func.update_i(i);

            var event = new cc.Event.EventCustom('shine_dash_end', true);
            event.detail = ({'transfer_to': transfer_to, 'node': node});
            this.node.dispatchEvent(event);
            // chart节点收到这个事件，触发chart再次获取当前步的步号

        }.bind(this));



        var seq = cc.sequence(up, down, up, down, up, down, shine_dash_end);
        this.node.runAction(seq);
    },

    start () {

    },

    // update (dt) {},
});
