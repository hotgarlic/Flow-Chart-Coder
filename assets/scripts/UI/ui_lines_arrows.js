cc.Class({
    extends: cc.Component,

    properties: {



    },

    // LIFE-CYCLE CALLBACKS:



    onLoad: function () {
        this.time_fade = 0.1;
    },


    shine: function () {
        var up = cc.fadeTo(this.time_fade, 60);
        var down = cc.fadeTo(this.time_fade, 255);

        var shine_end = cc.callFunc(function() {
            
            var event = new cc.Event.EventCustom('shine_end', true);
            this.node.dispatchEvent(event);

        }.bind(this));
        
        var seq = cc.sequence(up, down, up, down, up, down, shine_end);
        this.node.runAction(seq);
    },

    start () {

    },

    // update (dt) {},
});
