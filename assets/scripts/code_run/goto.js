cc.Class({
    extends: cc.Component,

    properties: {

        functions: {
            type: cc.Node,
            default: null,
        },

        variables: {
            type: cc.Node,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        //this.script_chart = this.chart.getComponent('chart');

        // ui_function, ui_variable, ui_dash_arrows

        this.quick = false;
        

        this.uis_func = [];
        this.uis_dash = [];
        this.uis_solid = [];

        this.uis_var = [];
        
        
    },



    confirm: function () {

        for (var idx in this.functions.children) {
            var ui_func = this.functions.children[idx].getComponent('ui_function');
            this.uis_func.push(ui_func);

            
            var parent = this.functions.children[idx].getChildByName('dash_arrows');
            var ui_dash = parent.getComponent('ui_dash_arrows');
            this.uis_dash.push(ui_dash);

            var parent = this.functions.children[idx].getChildByName('lines_arrows');
            var ui_solid = parent.getComponent('ui_lines_arrows');
            this.uis_solid.push(ui_solid);
        }

        for (var idx in this.variables.children) {
            var ui_var = this.variables.children[idx].getComponent('ui_variable');
            this.uis_var.push(ui_var);
        }
        //this.set_time(0.1, 1, 0.3);

    },

    //this.time_fade_shine_name = 0.8
    //this.time_fade_recv_all = 0.5;

    //this.time_move = 0.3;
    //this.time_scale = 0.3;

    set_time: function (time_fade_shine_name, time_fade_recv_all, time_move, time_scale, 
        time_fade_var, time_fade_line) {

        //cc.log(this.uis_func, this.uis_var, this.uis_dash);

        for (var idx in this.uis_func) {
            var ui_func = this.uis_func[idx];
            ui_func.time_fade_shine_name = time_fade_shine_name;
            ui_func.time_fade_recv_all = time_fade_recv_all;
            ui_func.time_move = time_move;
            ui_func.time_scale = time_scale;
        }

        for (var idx in this.uis_var) {
            var ui_var = this.uis_var[idx];
            ui_var.time_fade = time_fade_var;
            ui_var.time_move = time_move;
            ui_var.time_scale = time_scale;
        }

        for (var idx in this.uis_solid) {
            var ui_solid = this.uis_solid[idx];
            ui_solid.time_fade = time_fade_line;
        }

        for (var idx in this.uis_dash) {
            var ui_dash = this.uis_dash[idx];
            ui_dash.time_fade = time_fade_line;
        }
        

    },

    goto: function () {

        this.quick = !this.quick;
        if (this.quick) {
            this.set_time(0, 0, 0, 0, 0, 0);

            var event = new cc.Event.EventCustom('error', true);
            event.detail = ({'state': '快速'});
            this.node.dispatchEvent(event);
        }
        else {
            this.set_time(0.8, 0.5, 0.3, 0.3, 0.1, 0.1);

            var event = new cc.Event.EventCustom('error', true);
            event.detail = ({'state': '慢速'});
            this.node.dispatchEvent(event);
        }

        
        /*

        // 自动触发n次,this.destination次
        if (this.destination.string != '') {
            this.schedule(function () {
                this.script_chart.forward();
            }.bind(this), 2, parseInt(this.destination.string), 0.1);// 1秒触发一次，触发10次，0.1秒以后开始
        }
        */
        
    },


    start () {

    },

    // update (dt) {},
});
