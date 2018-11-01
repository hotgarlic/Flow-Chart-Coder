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

        this.tradition = false;
        this.uis_func = [];
        this.uis_var = [];
        
    },



    confirm: function () {

        for (var idx in this.functions.children) {
            var ui_func = this.functions.children[idx].getComponent('ui_function');
            this.uis_func.push(ui_func);
        }

        for (var idx in this.variables.children) {
            var ui_var = this.variables.children[idx].getComponent('ui_variable');
            this.uis_var.push(ui_var);
        }
        this.tradition = false;
        this.change_mode();

    },

    change_mode: function () {

        if (!this.tradition) {
            for (var idx in this.uis_func) {
                this.uis_func[idx].tradition_FC();
                
            }
            for (var idx in this.uis_var) {
                this.uis_var[idx].tradition_FC();
            }

            var event = new cc.Event.EventCustom('error', true);
            event.detail = ({'state': '过程模式'});
            this.node.dispatchEvent(event);
        }
        else {
            for (var idx in this.uis_func) {
                this.uis_func[idx].variable_FC();
                
            }
            for (var idx in this.uis_var) {
                this.uis_var[idx].variable_FC();
            }

            var event = new cc.Event.EventCustom('error', true);
            event.detail = ({'state': '对象+过程模式'});
            this.node.dispatchEvent(event);
        }
        
        this.tradition = !this.tradition;

    },


    start () {

    },

    // update (dt) {},
});
