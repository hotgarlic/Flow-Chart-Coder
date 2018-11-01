cc.Class({
    extends: cc.Component,

    properties: {

        step_show: {
            type: cc.Label,
            default: null,
        },

        state_show: {
            type: cc.Label,
            default: null,
        },


        forward_: {
            type: cc.Button,
            default: null,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        
        this.nexts = [1];// 即将执行的序列号，初始值是1
        // 如果当前步函数有多个，那么他们执行完毕后，就会发送多个下一步的序列号

        this.step = null;
        this.lasts = [];

        this.lasts_transfer = [];

        this.forward_.interactable = true;
        
    
        // 获取所有的函数节点
        this.funcs = null;

        this.state_show.string = '请先初始化';
        this.step_show.string = 0;

        this.node.off('error');
        this.node.on('error', function (event) {
            var state = event.detail['state'];
            this.state_show.string = state;

        }, this)

    },

    hide_states: function () {// 清空前一个步骤中，函数框内的进度条（已经满的）
        if (this.lasts.length > 0) {
            for (var idx in this.lasts) {
                var last = this.lasts[idx].getChildByName('state');
                var bar = last.getChildByName('bar');
                bar.scaleX = 0;
                last.scale = 0;
            }
        }
        
    },

    hide_states_tansfer: function () {// 清空前一个步骤中，函数框内的进度条（已经满的）
        if (this.lasts_transfer.length > 0) {
            for (var idx in this.lasts_transfer) {
                var last_transfer = this.lasts_transfer[idx].getChildByName('state');
                var bar = last_transfer.getChildByName('bar');
                bar.scaleX = 0;
                last_transfer.scale = 0;
            }
        }
        
    },

    confirm: function () {

        // 涉及到子节点的互相引用的命令，在总控节点（父节点）进行管理
        // 但是各自的属性初始化，还是在各自脚本中运行比较简洁
        this.onLoad();


        this.step = 0;
        this.state_show.string = '点击前进开始';
        this.step_show.string = '0';
        this.forward_.interactable = true;
        // 初始化所有的对象
        this.funcs = this.node.getChildByName('functions').children;
        var vars = this.node.getChildByName('variables').children;
        var tools = this.node.parent.getChildByName('tools').getComponent('ui_tools');
        var goto = this.node.getChildByName('control').getChildByName('goto').getComponent('goto');
        var FC_mode = this.node.getChildByName('control').getChildByName('FC_mode').getComponent('FC_mode');
        

        //cc.log(this.funcs);
        for (var idx in vars) {
            vars[idx].getComponent('Variable').confirm();
            vars[idx].getComponent('ui_variable').confirm();
        }
        //cc.log(vars);

        for (var idx in this.funcs) {
            this.funcs[idx].getComponent('Function').confirm();
            this.funcs[idx].getComponent('ui_function').confirm();
        }

        //this.get_initials_names();

        tools.confirm();
        goto.confirm();
        FC_mode.confirm();

        this.node.off('shine_end');
        this.node.on('shine_end', function (event) {

            for (var idx in this.nexts) {
                var next = this.nexts[idx];
                for (var idx_ in this.funcs) {
                    var func = this.funcs[idx_].getComponent('Function');
                    if (func.serial.initial == next) {
                        // 在闪烁结束后，将每一个next上的进度框（空）显示出来，表示准备运行
                        var bg = this.funcs[idx_].getChildByName('name').getChildByName('bg');
                        
                        var change = cc.tintTo(0.5, 165, 204, 41);
                        //bg.runAction(change);

                        var state = this.funcs[idx_].getChildByName('state');
                        //state.getComponent(cc.Label).string = '等待';
                        //var standby_show = cc.scaleTo(0, 1);
                        //state.runAction(standby_show);
                        var bar = state.getChildByName('bar');
                        state.scale = 1;
                        bar.scaleX = 0;
                    }
                }
            }

        }, this);

    
        this.node.off('high_light');
        this.node.on('high_light', function(event) {
            var transfer_to = event.detail['transfer_to'];
            var next = event.detail['next'];

            // 调用所指的函数的闪烁方法t
            for (var idx in this.funcs) {
                var Function_ = this.funcs[idx].getComponent('Function');
                var ui_function = this.funcs[idx].getComponent('ui_function');
                if (Function_.serial.initial == transfer_to || Function_.serial.initial == next) {
                    ui_function.high_light();
                }
            }
        }, this)
        

        // 转向步只能是一个，不会是多个
        // 但是转向到一个并行步后，可能会发送多个即将步过来
        // 发一个，就运行一次get_current，
        // 因为没有单步执行，所以可以让系统自己按照并行方式运行下去，不需要保存到某个数组中
        this.node.off('shine_dash_end');
        this.node.on('shine_dash_end', function(event) {

            // 根据转向步的值，再次运行获取当前步号的函数
            var transfer_to = parseInt(event.detail['transfer_to']);
            var node = event.detail['node'];
            this.lasts_transfer.push(node);

            this.hide_states_tansfer();
            this.get_current([transfer_to]);

        }, this)


        // 当一步（包括并行的其他步）运行完后，会发送几个即将步的步号过来
        // 把这些即将步的步号存在一个数组里，然后遍历这个数组
        this.node.off('send_next');
        this.node.on('send_next', function (event) {
            //cc.log(event.target);// 发出这个事件的对象
            this.lasts.push(event.target);
            var next = parseInt(event.detail['next']);
            this.nexts.push(next);
            
        }, this)

        this.node.off('go_on');
        this.node.on('go_on', function (event) {
            // 何时解锁？？将来解决，应该是即将步的个数收集满时才解锁，但是个数是未知的
            this.go_on();
            //cc.log('gogog');
            
        }, this)
        
    },

    send_error: function (state) {
        this.node.emit('error', {'state': state});
    },

    get_current: function (nexts) {
        //this.nexts = [];
        for (var idx in nexts) {
            var next = nexts[idx];

            for (var idx_ in this.funcs) {
                
                var func = this.funcs[idx_].getComponent('Function');

                
                // 根据执行的序列号，去搜索函数的序列号，如果吻合，就执行搜索到的函数
                // 这个函数是一个事件发射函数，也就是说，可以很快运行完毕，但是响应可能会晚一点

                // 异步问题，在遍历到下一个元素前，this.next就发生了改变，所以第一步进入了if，第二步也进入了if

                
                if (func.serial.initial == next) {
                    // 触发每一个步号和next相符的函数块，但不是运行
                    // 也就是说，可以用很快的速度让大量的函数各自运行起来，而不需要等到先触发的运行完毕、
                    // 即便后触发的函数，只要他的计算量小，仍然有可能在先触发的函数运行完毕之前完成运行
                    func.run(this.step);
                }
            }
        }
        
    },
    
//化验结果药方,账单药方,账单
    forward: function () {

        this.hide_states();

        this.step += 1;
        this.step_show.string = this.step;
        this.standby();// 运行的同时，马上锁死，防止在没有执行完毕时继续走下一步
        var nexts = this.nexts;
        //cc.log('-----');
        //cc.log(nexts);
        //var name_f = this.name_f;
        // 在this.get_current函数运行过程中，this.next参数会改变，因为他们是异步的
        // 所以要定义新的参数传给这个函数
        this.get_current(nexts);
        this.nexts = [];// 清空，等这个一步完成后，添加进新的即将步
        this.lasts = [];
        this.lasts_transfer = [];
        
        

    },


    standby: function () {
        this.state_show.string = '等待执行完毕';
        this.forward_.interactable = false;

    },

    go_on: function () {
        this.state_show.string = '继续下一步';
        this.forward_.interactable = true;
    },


    start () {

    },

    // update (dt) {},
});
