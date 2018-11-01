cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    

    
    onLoad: function () {

        //this.target = null;
        
        this.time_scale = 0.2;        
        this.time_move = 0.5

        this.target = null;
    },

    shot_var: function (ui_var) {

        var up = cc.scaleTo(0, 1);
        var bigger = cc.scaleBy(this.time_scale, 2);
        var smaller = cc.scaleBy(this.time_scale, 1/2);

        this.target = this.node.parent.convertToNodeSpaceAR(this.target);
        var move = cc.moveTo(this.time_move, this.target);
        //cc.log(this.time_move);

        var shot_var_end = cc.callFunc(function() {

            ui_var.recv_once();
            this.node.removeFromParent();
            
        }.bind(this));
        
        var seq = cc.sequence(up, bigger, smaller, move, shot_var_end);
        //var seq = cc.sequence(shot_var_end, up, bigger, smaller, move);// 用于不显示子弹的模式

        this.node.runAction(seq);

        

    },

    shot_func: function (ui_func) {

        var up = cc.scaleTo(0, 1);
        var bigger = cc.scaleBy(this.time_scale, 2);
        var smaller = cc.scaleBy(this.time_scale, 1/2);

        this.target = this.node.parent.convertToNodeSpaceAR(this.target);
        var move = cc.moveTo(this.time_move, this.target);


        var shot_func_end = cc.callFunc(function() {
            
            ui_func.recv_all();
            this.node.removeFromParent();
            
        }.bind(this));

        var seq = cc.sequence(up, bigger, smaller, move, shot_func_end);

        this.node.runAction(seq);


    },



    start () {

    },

    // update (dt) {},
});
