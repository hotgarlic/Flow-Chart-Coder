cc.Class({
    extends: cc.Component,

    properties: {


        Variable: {
            type: cc.Prefab,
            default: null,
        },

        Function: {
            type: cc.Prefab,
            default: null,
        },

        trash: {
            type: cc.Node,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:



    add_var: function () {
        var variable = cc.instantiate(this.Variable);
        this.variables.addChild(variable);
    },

    add_func: function () {
        var function_ = cc.instantiate(this.Function);
        this.functions.addChild(function_);
    },

    confirm: function () {
        // 整理zorder
        this.functions.zIndex = 0;
        this.variables.zIndex = 1;

        for (var idx in this.functions.children) {
            this.functions.children[idx].zIndex = parseInt(idx);
        }

        for (var idx in this.variables.children) {
            this.variables.children[idx].zIndex = parseInt(idx);
        }

        
    },

    clear_all: function () {
        var functions = cc.find('main/chart/functions');
        var variables = cc.find('main/chart/variables');

        functions.removeAllChildren();
        variables.removeAllChildren();
    },

    push_up: function () {

        // 先将dealing的父节点推前，再将自己在兄弟节点范围内推前
        var parent = this.dealing.parent;
        
        if (parent == this.functions) {
            this.functions.zIndex = 1;
            this.variables.zIndex = 0;

            var z = this.dealing.zIndex;
            
            
            var funcs = this.functions.children;
            var len = funcs.length;

            // 把被选中的z改成最大的值
            this.dealing.zIndex = len - 1;
            // 把原来最大的z改成被选中的原来的z
            funcs[len - 1].zIndex = z;
            
        
        }
        else {
            this.functions.zIndex = 0;
            this.variables.zIndex = 1;

            var z = this.dealing.zIndex;
            
            
            var vars = this.variables.children;
            var len = vars.length;

            // 把被选中的z改成最大的值
            this.dealing.zIndex = len - 1;
            // 把原来最大的z改成被选中的原来的z
            vars[len - 1].zIndex = z;
            
        }
        
    


    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.Delete:
                this.remove();
                //cc.log('delete');
                break;
        }
    },

    onLoad: function () {

        var chart = this.node.parent.getChildByName('chart');
        this.functions = chart.getChildByName('functions');
        this.variables = chart.getChildByName('variables');

        this.dealing = null;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);


        // 销毁拖进垃圾桶的对象
        this.trash.on(cc.Node.EventType.MOUSE_ENTER, function (event) {

            this.trash.on(cc.Node.EventType.MOUSE_UP, function (event) {
                
                this.remove();
    
            }, this);            

        }, this);

        
        this.trash.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
            this.trash.off(cc.Node.EventType.MOUSE_UP, null, this);
        }, this);
        
    },


    remove: function () {


        var disapear = cc.scaleTo(0.3, 0);

        var remove = cc.callFunc(function () {
            this.dealing.removeFromParent();
        }.bind(this));


        var seq = cc.sequence([disapear, remove]);
        this.dealing.runAction(seq);
        

    },

    start () {

    },

    // update (dt) {},
});
