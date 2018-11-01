// 在测试阶段，直接将这个脚本拖到，function预制件上


cc.Class({
    extends: cc.Component,

    properties: {

        file: {
            type: cc.Node,
            default: null,
        },

        content: {
            type:cc.EditBox,
            default: null,
        },

        functions: {
            type: cc.Node,
            default: null,
        },

        variables: {
            type: cc.Node,
            default: null,
        },

        chart: {
            type: cc.Node,
            default: null,
        },
        
    },

    // LIFE-CYCLE CALLBACKS:


    
    save_local: function (data) {
        var data = JSON.stringify(data);
        cc.sys.localStorage.setItem("FCC_data", data);
    },
    

    load_local: function () {
        
        var data = cc.sys.localStorage.getItem("FCC_data");
        data = JSON.parse(data); 
        
    },
    
    remove_local: function () {
        cc.sys.localStorage.removeItem("baseData");
    },




    

    set_default: function (box) {
        //cc.log(box.length);
        if (box.length == 0) {
            return '-';
        }
        else {
            if (parseInt(box).toString() == box) {
                
                return parseInt(box);

            }
            else {
                return box;
            }
            
        }
    },

    arrows_save: function (node_func, data_f) {

        /*
        this.datas = {
            functions: {
                '0': {
                    position: ,
                    ...
                    lines_arrows: {
                        '0': {
                            pos_root: // 根节点的位置
                            angle:// body和头部的角度一样
                            ratio:// body的比例
                            pos_extend: // 头部的位置
                        },
                        ...
                    },
                    dash_arrows: {
                        '0': {
                            pos_root: 
                            angle:
                            ratio:
                            pos_extend:
                        },
                        ...
                    },
                }
            }
        }
        */

        //var data_f = this.datas.functions[idx];   某个函数节点
        
       
        var nodes_line = node_func.getChildByName('lines_arrows').children;

        for (var idx in nodes_line) {
            var node_line = nodes_line[idx];
            
            data_f['lines_arrows'][idx] = {};
            var data_d = data_f['lines_arrows'][idx];

            data_d['pos_root'] = cc.v2(node_line.x, node_line.y);

            //cc.log(nodes_line);
            data_d['angle'] = node_line.getChildByName('body').rotation;

            data_d['ratio'] = node_line.getChildByName('body').scaleY;

            data_d['pos_extend'] = 
                cc.v2(node_line.getChildByName('handle').x, node_line.getChildByName('handle').y);

        }

        var nodes_dash = node_func.getChildByName('dash_arrows').children;

        for (var idx in nodes_dash) {
            var node_dash = nodes_dash[idx];
            
            data_f['dash_arrows'][idx] = {};
            var data_d = data_f['dash_arrows'][idx];

            data_d['pos_root'] = cc.v2(node_dash.x, node_dash.y);

            //cc.log(nodes_line);
            data_d['angle'] = node_dash.getChildByName('body').rotation;

            data_d['ratio'] = node_dash.getChildByName('body').scaleY;

            data_d['pos_extend'] = 
                cc.v2(node_dash.getChildByName('handle').x, node_dash.getChildByName('handle').y);

        }


    },

    load_arrows: function (node_func, funcs_data) { // 层级中的节点， this.datas中正在读取的键值

        // 依次建立line_arrow, line, dash_arrow，同时修改参数
        var ui_function = node_func.getComponent('ui_function');
        var func_data = funcs_data['lines_arrows'];
        

        Object.keys(func_data).forEach(function (key) {

            var node_line_arrow = ui_function.add_line_arrow();

            var data_l = func_data[key];
            
            node_line_arrow.x = data_l['pos_root'].x;
            node_line_arrow.y = data_l['pos_root'].y;

            
            var handle = node_line_arrow.getChildByName('handle');
            var body = node_line_arrow.getChildByName('body');

            body.rotation = data_l['angle'];
            handle.rotation = data_l['angle'];
            body.scaleY = data_l['ratio'];
            
            handle.x = data_l['pos_extend'].x;
            handle.y = data_l['pos_extend'].y;

        }.bind(this));



        var func_data = funcs_data['dash_arrows'];
        
        Object.keys(func_data).forEach(function (key) {

            var node_dash_arrow = ui_function.add_dash_arrow();

            var data_d = func_data[key];
            
            node_dash_arrow.x = data_d['pos_root'].x;
            node_dash_arrow.y = data_d['pos_root'].y;

            
            var handle = node_dash_arrow.getChildByName('handle');
            var body = node_dash_arrow.getChildByName('body');

            body.rotation = data_d['angle'];
            handle.rotation = data_d['angle'];
            body.scaleY = data_d['ratio'];
            
            handle.x = data_d['pos_extend'].x;
            handle.y = data_d['pos_extend'].y;



        }.bind(this));
        
    },

    save: function () {

        this.onLoad();

        this.functions = this.node.getChildByName('chart').getChildByName('functions');
        this.variables = this.node.getChildByName('chart').getChildByName('variables');
        // 获取所有块的信息
        
        var nodes_func = this.functions.children;
        var nodes_var = this.variables.children;

        for (var idx in nodes_func) {
            var node_func = nodes_func[idx];// node
            
            this.datas.functions[idx] = {};
            var data_f = this.datas.functions[idx];
            

            data_f['position'] = cc.v2(node_func.x, node_func.y);

            // node_func是某个function预制件的实例
            var init = cc.find(this.direct['initial'], node_func).getComponent(cc.EditBox).string;
            data_f['initial'] = this.set_default(init);

            
            var name = cc.find(this.direct['name'], node_func).getComponent(cc.EditBox).string;
            data_f['name'] = this.set_default(name);


            var vs_in = cc.find(this.direct['vs_in'], node_func).getComponent(cc.EditBox).string;
            data_f['vs_in'] = this.set_default(vs_in);


            var vs_out = cc.find(this.direct['vs_out'], node_func).getComponent(cc.EditBox).string;
            data_f['vs_out'] = this.set_default(vs_out);


            var func_pre = cc.find(this.direct['func_pre'], node_func).getComponent(cc.EditBox).string;
            data_f['func_pre'] = this.set_default(func_pre);


            var func_main = cc.find(this.direct['func_main'], node_func).getComponent(cc.EditBox).string;
            data_f['func_main'] = this.set_default(func_main);


            var transfer_to = cc.find(this.direct['transfer_to'], node_func).getComponent(cc.EditBox).string;
            data_f['transfer_to'] = this.set_default(transfer_to);


            var next = cc.find(this.direct['next'], node_func).getComponent(cc.EditBox).string;
            data_f['next'] = this.set_default(next);

            var mode = node_func.getComponent('Function').trans_mode;
            data_f['mode'] = mode;

            //cc.log(mode);

            //
            data_f['lines_arrows'] = {};
            data_f['dash_arrows'] = {};
            //var lines_arrows = this.datas.functions['lines_arrows'];
            this.arrows_save(node_func, data_f);

        }
        
        for (var idx in nodes_var) {

            var node_var = nodes_var[idx];// node
            
            this.datas.variables[idx] = {};
            var data_v = this.datas.variables[idx];

            data_v['position'] = cc.v2(node_var.x, node_var.y);

            var name_v = node_var.getChildByName('name_').
                getChildByName('text').getComponent(cc.EditBox).string;
            data_v['name_v'] = this.set_default(name_v);

            var const_ = node_var.getChildByName('const').
                getChildByName('text').getComponent(cc.EditBox).string;
            data_v['const'] = this.set_default(const_);


            var values = node_var.getChildByName('value_').
                getChildByName('text').getComponent(cc.EditBox).string;
            data_v['values'] = this.set_default(values);

        }

        this.datas = JSON.stringify(this.datas);
        this.content.string = this.datas;

    },

    layout: function () {

        
        //cc.log(this.datas);

        var funcs = this.datas.functions;
        var vars = this.datas.variables;

        //cc.log(Object.keys(funcs));

        Object.keys(funcs).forEach(function (key) {
            
            if (parseInt(key).toString() == key) {
                this.tools.add_func();

                var node_func = this.node.getChildByName('chart').getChildByName('functions').children[key];
                
                node_func.x = funcs[key]['position'].x;
                node_func.y = funcs[key]['position'].y;

                cc.find(this.direct['initial'], node_func).getComponent(cc.EditBox).string
                    = funcs[key]['initial'];

                
                cc.find(this.direct['name'], node_func).getComponent(cc.EditBox).string
                    = funcs[key]['name'];
                

                cc.find(this.direct['vs_in'], node_func).getComponent(cc.EditBox).string
                    = funcs[key]['vs_in'];


                cc.find(this.direct['vs_out'], node_func).getComponent(cc.EditBox).string
                    = funcs[key]['vs_out'];
                

                if (funcs[key]['func_pre'] == '-') {
                    cc.find(this.direct['func_pre'], node_func).getComponent(cc.EditBox).string = '';
                }
                else {
                    cc.find(this.direct['func_pre'], node_func).getComponent(cc.EditBox).string = funcs[key]['func_pre'];
                }

                
                cc.find(this.direct['func_main'], node_func).getComponent(cc.EditBox).string = funcs[key]['func_main'];


                if (funcs[key]['transfer_to'] == '-') {
                    cc.find(this.direct['transfer_to'], node_func).getComponent(cc.EditBox).string = '';
                }
                else {
                    cc.find(this.direct['transfer_to'], node_func).getComponent(cc.EditBox).string = funcs[key]['transfer_to'];
                }
                
                //cc.log(funcs[key]['mode']);
                if (funcs[key]['mode']) {
                    cc.find(this.direct['mode'], node_func).getComponent(cc.Label).string = 'T'
                    node_func.getComponent('Function').trans_mode = true;
                }
                else {
                    cc.find(this.direct['mode'], node_func).getComponent(cc.Label).string = 'F'
                    node_func.getComponent('Function').trans_mode = false;
                }
                

                
                cc.find(this.direct['next'], node_func).getComponent(cc.EditBox).string
                    = funcs[key]['next'];

                
                node_func.getChildByName('menu').scale = 0;

            // 添加箭头数据
                this.load_arrows(node_func, funcs[key]);
                
            }
            //
            


        }.bind(this));

        Object.keys(vars).forEach(function (key) {
            
            //
            this.tools.add_var();

            var node_var = this.node.getChildByName('chart').getChildByName('variables').children[key];

            node_var.x = vars[key]['position'].x;
            node_var.y = vars[key]['position'].y;

            node_var.getChildByName('name_').
                getChildByName('text').getComponent(cc.EditBox).string
            = vars[key]['name_v'];


            if (vars[key]['const'] =='-') {
                node_var.getChildByName('const').
                    getChildByName('text').getComponent(cc.EditBox).string
                = '';
            }
            else {
                node_var.getChildByName('const').
                    getChildByName('text').getComponent(cc.EditBox).string
                = vars[key]['const'];
            }
            
            

            node_var.getChildByName('value_').
                getChildByName('text').getComponent(cc.EditBox).string
            = vars[key]['values'];


            node_var.getChildByName('value_').getChildByName('menu').scale = 0;

        }.bind(this));



    },

    load: function () {

        var state = '请先初始化';
        this.chart.getComponent('chart').send_error(state);

        // 首先清空桌面
        this.functions.removeAllChildren();
        this.variables.removeAllChildren();
        
        

        try {
            this.datas = JSON.parse(this.content.string);
        }
        catch (error) {
            var state = '错误：请粘贴正确的文件';
            this.chart.getComponent('chart').send_error(state);
        }

        this.layout();

        
        
    },

    onLoad: function () {

        this.datas = {
            functions: {},
            variables: {},
        };

        this.tools = this.node.getChildByName('tools').getComponent('ui_tools');

        this.direct = {
            // 函数块中的参数，下面的路径的根节点是Function
            'initial': 'init_/text', 
            'name': 'name/text',
            'vs_in': 'menu/vs_in/text',
            'vs_out': 'menu/vs_out/text',
            'func_pre': 'menu/func_pre/view/content/text',
            'func_main': 'menu/func_main/view/content/text',
            'transfer_to': 'menu/menu_more/current_other_/text',
            'next': 'menu/menu_more/serial/next/text',
            'mode': 'menu/menu_more/current_other_/trans_mode/Label',
        }
    },



    start () {},

    // update (dt) {},
});


