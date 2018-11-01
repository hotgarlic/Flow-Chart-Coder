/*
String.prototype.format = function() {
    if(arguments.length == 0) return this;
    var param = arguments[0];
    var s = this;
    if(typeof(param) == 'object') {
     for(var key in param)
      s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
     return s;
    } else {
     for(var i = 0; i < arguments.length; i++)
      s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
     return s;
    }
   }
*/

cc.Class({
    extends: cc.Component,

    properties: {

        serial_: {// 这是一个对象所在的节点
            type: cc.Node,
            default: null,
        },

        name_f_: {
            type: cc.EditBox,
            default: null,
        },

        names_in: {// 输入变量，可以是多个
            type: cc.EditBox,
            default: null,
        },

        names_out: {// 输出变量，只需输入一个就可以了，如果要多变量输出，可以分成多个函数实例，串行或者并行
            type: cc.EditBox,// 将来改掉
            default: null,
        },

        current_other_: {
            type: cc.EditBox,
            default: null,
        },

        codes_pre_: {
            type: cc.EditBox,
            default: null,
        },

        codes_main_: {
            type: cc.EditBox,
            default: null,
        },

        trans_mode_: {
            type: cc.Label,
            default: null,
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {



        this.serial = null;
        
        this.vars_in = [];
        this.vars_out = [];

        this.uis_var_in = [];
        this.uis_var_out = [];

        this.transfer_to = null;// 跳转栏里只输入一个编号，-1代表停止
        
        this.dash_arrows = null;

        this.step = null;

        this.ui_func = this.node.getComponent('ui_function');
        this.trans_mode = true;
        
        
        
    },

    get_objs_var: function (variables, names, instances, uis) {
        for (var idx in names) {

            var name = names[idx];

            for (var idx_ in variables) {

                var var_instance = variables[idx_].getComponent('Variable');
                var ui_var = variables[idx_].getComponent('ui_variable');
                var name_var = var_instance.name_v;
                if (name == name_var) {
                    instances.push(var_instance);
                    uis.push(ui_var);
                }
            }
        }
    },

    get_vars: function () {
        // 导入输入，输出变量（对象）组，这两个组中的元素都是variable对象
        var names_in = this.names_in.string.split(',');
        var names_out = this.names_out.string.split(',');
        var variables = this.node.parent.parent.getChildByName('variables').children;

        if (this.names_in.string != '' && this.names_out.string != '') {
            this.get_objs_var(variables, names_in, this.vars_in, this.uis_var_in);
            this.get_objs_var(variables, names_out, this.vars_out, this.uis_var_out);
        }
        else if (this.names_in.string == '') {// 输入变量框为空
            this.get_objs_var(variables, names_out, this.vars_out, this.uis_var_out);
        }
    },

    get_serial: function () {
        this.serial = this.serial_.getComponent('Serial');
        this.serial.confirm();
    },

    
    get_lines_arrows: function () {
        this.dash_arrows = this.node.getChildByName('dash_arrows');
    },
    confirm: function () {

        this.name_f = this.name_f_.string;
        this.onLoad();// 这是个大坑啊
        this.get_vars();
        
        //cc.log(this.trans_mode);


        this.get_serial();
        this.get_lines_arrows();
        this.get_transfer();
        this.get_trans_mode();// 重新获取跳转模式，因为在confirm时所有参数都复原了
        
        //this.send_name_f_chart();


        this.node.off('func_pre');// 防止重复监听
        this.node.on('func_pre', function () {

            

            var pre_or_main = cc.callFunc(function () {
                
                window['initial'] = this.serial.initial;
                window['i'] = this.serial.i;
                window['next'] = this.serial.next;
    
                for (var idx in this.vars_in) {
                    var x = this.vars_in[idx].name_v;
                    window[x] = this.vars_in[idx].values;
                };
                var order_trans;
                var result_code = eval(this.codes_pre_.string);
                if (this.trans_mode) {// 如果跳转模式为T，那么预函数的结果为真时可以跳转
                    order_trans = result_code;
                }
                else {// 如果跳转模式为F，那么预函数的结果为假是才可以跳转
                    order_trans = !result_code;
                }

                
                // 如果有转向
                if (order_trans) {
                    
                    this.serial.i = 0;// 把调用次数恢复成0，表示从未被调用，但ui界面上没有更新
                    // 播放虚箭头闪烁的动画
                    var ui_dash = 
                        this.node.getChildByName('dash_arrows').getComponent('ui_dash_arrows');
                    ui_dash.shine(this.serial.i, this.transfer_to, this.node);

                }
                else {// 直接执行就可以了
                    if (this.codes_main_.string != '') {
                        
                        this.serial.i += 1;// 在主函数运行前才更新i和step

                        // 在闪烁动画的同时将下一步发送给chart，这一步必须在函数内完成
                        // 可以保证一个函数发射一次next给chart
                        var event = new cc.Event.EventCustom('send_next', true);
                        event.detail = ({'next': this.serial.next});
                        this.node.dispatchEvent(event);

                        this.main();
                    }
                }
                
            }.bind(this));

            // 不管跳转与否，函数都是要闪烁的
            this.ui_func.shine_name(pre_or_main);
            // 闪烁的开始时就同步把next发送给了chart，但是当有转向时是不能发送的


        }, this)

    },

    run: function (step) {

        this.node.emit('func_pre');
        this.step = step;
        
    },

    shift_mode: function () {
        if (this.trans_mode_.string == 'T') {
            this.trans_mode_.string = 'F';
            this.trans_mode = false;
        }
        else {
            this.trans_mode_.string = 'T'
            this.trans_mode = true;
        }
        
    },

    get_trans_mode: function () {
        if (this.trans_mode_.string == 'T') {
            this.trans_mode = true;
        }
        else {
            this.trans_mode_.string = 'F'
            this.trans_mode = false;
        }
    },

    // 这个栏目里面只需要填1个值就可以了
    get_transfer: function () {
        this.transfer_to = parseInt(this.current_other_.string);
        

        if (!isNaN(this.transfer_to)) {

            try {
                var node_target = 
                this.dash_arrows.getChildByName('dash_arrow').getChildByName('handle').
                getChildByName('target').getComponent(cc.Label);

                node_target.string = this.transfer_to;
            }
            catch (error) {
                var event = new cc.Event.EventCustom('error', true);
                event.detail = ({'state': '错误：请查看虚线跳转箭头是否建立'});
                this.node.dispatchEvent(event);
            }

            
        }
        else {
            //node_target.string = this.serial.initial;
        }
    },

    
    main: function () {

        
        
        this.ui_func.recv_bullet = this.uis_var_in.length;
        // 首先显示新的step和i
        this.ui_func.update_i(this.serial.i);
        this.ui_func.update_step(this.step);

        // 将函数基本变量建立出来，供脚本输入界面使用
        window['initial'] = this.serial.initial;
        window['i'] = this.serial.i;
        window['next'] = this.serial.next;

        // 依次建立输入变量，供输入界面使用
        //cc.log(this.vars_in);
        //cc.log(this.vars_out);
        for (var idx in this.vars_in) {
            var x = this.vars_in[idx].name_v;
            window[x] = this.vars_in[idx].values;
        };

        // 依次建立输出变量，在主函数框内可以引用输出变量的值
        for (var idx in this.vars_out) {
            var x = this.vars_out[idx].name_v;
            window[x] = this.vars_out[idx].values;
        };
        
        

        // 把对话框中的文本当代码执行，结果就是对上面建立的一组变量的值进行更新
        try {
            eval(this.codes_main_.string);
        }
        catch (error) {
            var event = new cc.Event.EventCustom('error', true);
            event.detail = ({'state': '错误：请查看变量是否都定义了'});
            this.node.dispatchEvent(event);
        }
        

        
        // 在启动动画的同时，更改输出变量的值
        // 但显示的任务将在最后完成
        for (var idx in this.vars_out) {
            
            var x = this.vars_out[idx].name_v;
            this.vars_out[idx].update_values(eval(x));

            //this.ui_func.next = this.serial.next;
            //cc.log(this.serial.next);
            //this.uis_var_out[idx].name_f = this.name_f.string;// 仅仅用于调试
        };
        

        if (this.vars_in.length > 0) {
            for (var idx in this.uis_var_in) {

                var ui_var_in = this.uis_var_in[idx];
                ui_var_in.shot(this.ui_func);

            }
        }
        else {// 没有输入变量组
            var no_vars_in = true;
            this.ui_func.recv_all(no_vars_in);
        }
        

    },



    start () {

    },

    //update () {},
});
