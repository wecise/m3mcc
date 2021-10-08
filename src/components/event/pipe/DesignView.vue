<template>
    <el-container style="height: calc(100vh - 225px);">
        <el-header style="height:auto;padding:0px;">
            <!-- <el-dropdown>
                <el-button type="text" icon="el-dropdown-link">
                    编辑 <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="onSave">保存</el-dropdown-item>
                <el-dropdown-item @click.native="onSave">另存为</el-dropdown-item>
                <el-dropdown-item  @click.native="onDeleate" divided>删除</el-dropdown-item>
                <el-dropdown-item  @click.native="onClose" divided>关闭</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-divider direction="vertical"></el-divider> -->
            <el-tooltip content="数据源" placement="top">
                <el-popover
                    title="选择数据源"
                    placement="right-start"
                    trigger="click"
                    :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
                    @show="onSideBarShow(config['source'],'sourceBar')"
                    popper-class="info-popper"
                    style="width:auto;">
                    <el-container style="height:12em;">
                        <el-main style="display:flex;" ref="sourceBar">
                            
                        </el-main>
                    </el-container>
                    <el-button slot="reference" type="text">数据源</el-button>
                </el-popover>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-tooltip content="数据规则" placement="top">
                <el-popover
                    title="选择数据规则"
                    placement="right-start"
                    width="400"
                    trigger="click"
                    :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
                    @show="onSideBarShowRule"
                    popper-class="info-popper">
                    <el-container>
                        <el-main ref="ruleBar">
                            <RuleTree :root="dialog.rule.ruleRoot" ref="ruleTreeView"></RuleTree>
                        </el-main>
                    </el-container>
                    <el-button slot="reference" type="text">数据规则</el-button>
                </el-popover>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <!-- <el-tooltip content="数据操作" placement="top">
                <el-popover
                    title="选择数据操作"
                    placement="right-start"
                    width="400"
                    trigger="click"
                    :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
                    @show="onSideBarShow(config['operate'],'operateBar')"
                    popper-class="info-popper">
                    <el-container>
                        <el-main ref="operateBar">
                            
                        </el-main>
                    </el-container>
                    <el-button slot="reference" type="text">数据操作</el-button>
                </el-popover>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider> -->
            <el-tooltip content="定时器" placement="top">
                <el-popover
                    title="选择定时器"
                    placement="right-start"
                    width="400"
                    trigger="click"
                    :popper-options="{ boundariesElement: 'body', gpuAcceleration: false }"
                    @show="onSideBarShow(config['cron'],'cronBar')"
                    popper-class="info-popper">
                    <el-container>
                        <el-main ref="cronBar">
                            
                        </el-main>
                    </el-container>
                    <el-button slot="reference" type="text">定时器</el-button>
                </el-popover>
            </el-tooltip>
            <el-divider direction="vertical"></el-divider>
            <el-dropdown>
                <el-button type="text" icon="el-dropdown-link">
                    视图 <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="onToggleView('log')">日志</el-dropdown-item>
                <el-dropdown-item @click.native="onToggleView('monitor')" divided>监控</el-dropdown-item>
                <el-dropdown-item @click.native="onToggleView('outline')" divided>预览</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            
            <div ref="toolbar">
                
                <el-tooltip content="保存" placement="top">
                    <el-button type="text" @click="onSave">
                        <svg-icon icon-class="save" style="font-size:14px;"/> 
                    </el-button>
                </el-tooltip>
                
                <el-tooltip content="放大" placement="top">
                    <el-button type="text"  @click="onZoomIn">
                        <i class="el-icon-zoom-in" style="font-size:14px;"></i>
                    </el-button>
                </el-tooltip>
                
                <el-tooltip content="缩小" placement="top">
                    <el-button type="text"  @click="onZoomOut">
                        <i class="el-icon-zoom-out" style="font-size:14px;"></i>
                    </el-button>
                </el-tooltip>
                
                <el-tooltip content="自适应大小" placement="top">
                    <el-button type="text"  @click="onFit">
                        <i class="el-icon-rank" style="font-size:14px;"></i>
                    </el-button>
                </el-tooltip>

                <el-tooltip content="收起所有" placement="top">
                    <el-button type="text" @click="editor.execute('collapseAll')">
                        <i class="el-icon-menu" style="font-size:14px;"></i>
                    </el-button>
                </el-tooltip>
                
                <el-tooltip content="展开所有" placement="top">
                    <el-button type="text" @click="editor.execute('expandAll')">
                        <i class="el-icon-s-grid" style="font-size:14px;"></i>
                    </el-button>
                </el-tooltip>
                
                <el-tooltip content="执行" placement="top">
                    <el-button type="text" @click="onExecute">
                        <span class="el-icon-caret-right" style="font-size:14px;color:#8BC34A;"></span>
                    </el-button>
                </el-tooltip>
            </div>

        </el-header>
        <el-main :id="model.id" ref="graphContainer" 
            style="width:100vw;height:100vh;min-width:100vw;position:releative;overflow:hidden;padding:0px;">
        </el-main>
        <div ref="outlineContainer"
            style="position:absolute;overflow:hidden;top:20px;right:20px;width:200px;height:140px;background:transparent;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
            v-show="control.outline.show">
        </div>
        <el-footer v-if="control.log.show || control.monitor.show" style="height: 200px;padding: 0px;">
            <el-tabs v-model="console.activeName" closable @tab-remove="onRemoveConsoleTab" type="border-card">
                <el-tab-pane label="日志" name="log" v-if="control.log.show">
                    <log-console></log-console>
                </el-tab-pane>
                <el-tab-pane label="监控" name="monitor" v-if="control.monitor.show">
                    <monitor-console></monitor-console>
                </el-tab-pane>
            </el-tabs>
        </el-footer>
        <el-dialog :title="dialog.jsonForm.base.fileContent.title" 
            :visible.sync="dialog.source.show" 
            v-if="dialog.source.show"
            width="40vw">
            <el-tabs value="form" type="border-card">
                <el-tab-pane name="form">
                    <span slot="label"> 配置 <i class="el-icon-date"></i></span>
                        <el-container style="height: calc(100vh - 300px);">
                            <el-header style="text-align:right;height:40px;line-height:40px;">
                                <el-button type="success" @click="onSaveCell('source',dialog.jsonForm)">
                                    提交
                                </el-button>
                            </el-header>
                            <el-main>
                                <el-form :model="form" label-position="top" :key="key" v-for="(form,key) in dialog.jsonForm.schema">
                                    <div>
                                        <h3>
                                            {{form.label}} 
                                            <el-popover
                                            placement="top-start"
                                            width="200"
                                            trigger="hover"
                                            :content="form.desc">
                                            <el-button type="text" icon="el-icon-question" slot="reference"></el-button>
                                        </el-popover></h3>
                                    </div>
                                    <el-form-item :label="item.label" :key="idx" v-for="(item,idx) in form.data">
                                        <el-input-number v-model="dialog.jsonForm.data[key][item.name]" :placeholder="item.label" v-if="item.type==='number'"></el-input-number>
                                        <el-input type="textarea" autosize v-model="dialog.jsonForm.data[key][item.name]" :placeholder="item.label" v-else-if="item.type==='textarea'"></el-input>
                                        <el-select v-model="dialog.jsonForm.data[key][item.name]" :placeholder="item.label" v-else-if="item.type==='select'"
                                            multiple
                                            filterable
                                            allow-create
                                            default-first-option>
                                            <el-option v-for="data in dialog.jsonForm.data[key][item.name]" :key="data">{{data}}</el-option>
                                        </el-select>
                                        <el-switch v-model="dialog.jsonForm.data[key][item.name]" v-else-if="item.type==='switch'"></el-switch>
                                        <template v-else-if="item.type==='object'">
                                            <el-form-item :label="subItem.label" :key="ix" v-for="(subItem,ix) in item.data" style="background: #f2f2f2;padding: 20px;">
                                                <el-input-number v-model="dialog.jsonForm.data[key][item.name][subItem.name]" :placeholder="subItem.label" v-if="subItem.type==='number'"></el-input-number>
                                                <el-switch v-model="dialog.jsonForm.data[key][item.name][subItem.name]" v-else-if="subItem.type==='switch'"></el-switch>
                                                <el-input v-model="dialog.jsonForm.data[key][item.name][subItem.name]" :placeholder="subItem.label" v-else></el-input>
                                            </el-form-item>
                                        </template>
                                        <el-input v-model="dialog.jsonForm.data[key][item.name]" :placeholder="item.label" v-else></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-main>
                        </el-container>
                </el-tab-pane>
                <el-tab-pane name="json">
                    <span slot="label">JSON</span>
                    <Editor
                        v-model="dialog.source.jsonEditor.data"
                        @init="onJsonEditorInit"
                        :lang="dialog.source.jsonEditor.lang.value"
                        :theme="dialog.source.jsonEditor.theme.value"
                        width="100%"
                        height="calc(100vh - 350px)"
                        style="border:1px solid #f2f2f2;"
                    ></Editor>
                </el-tab-pane>
                <el-tab-pane label="TOML" name="toml">
                    <Editor
                        v-model="dialog.source.tomlEditor.data"
                        @init="onTomlEditorInit"
                        :lang="dialog.source.tomlEditor.lang.value"
                        :theme="dialog.source.tomlEditor.theme.value"
                        width="100%"
                        height="calc(100vh - 370px)"
                        style="border:1px solid #f2f2f2;"
                    ></Editor>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <el-dialog :title="'规则 ' + dialog.rule.data.key" 
            :visible.sync="dialog.rule.show" 
            v-if="dialog.rule.show"
            width="40vw">
            <el-container style="width:100%;height:100%">
                <el-header style="text-align:right;height:40px;line-height:40px;">
                    <el-button type="success" @click="onSaveCell('rule',dialog.rule.data)">
                        提交
                    </el-button>
                </el-header>
                <el-main style="overflow:hidden;">
                    <el-tabs value="editor" type="border-card">
                        <el-tab-pane name="editor">
                            <span slot="label">规则 <i class="el-icon-date"></i></span>
                            <Editor
                                v-model="dialog.rule.data.value"
                                @init="onRuleEditorInit"
                                :lang="dialog.rule.editor.lang.value"
                                :theme="dialog.rule.editor.theme.value"
                                width="100%"
                                height="calc(100vh - 370px)"
                                style="border:1px solid #f2f2f2;"
                            ></Editor>
                        </el-tab-pane>
                        <el-tab-pane name="log">
                            <span slot="label">日志 <i class="el-icon-date"></i></span>
                            <LogView :fullname="model.key" logType="rule"></LogView> 
                        </el-tab-pane>
                        <el-tab-pane label="测试" name="debug">
                            <TestView :fullname="model.key"></TestView>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="数据" name="data">
                            
                        </el-tab-pane> -->
                    </el-tabs>
                </el-main>
            </el-container>
        </el-dialog>
        <el-dialog :title="'Cron ' + dialog.cron.data.title" 
            :visible.sync="dialog.cron.show" 
            v-if="dialog.cron.show">
            <el-container style="width:100%;height:100%">
                <el-header style="text-align:right;height:40px;line-height:40px;">
                    <el-button type="success" @click="onSaveCell('cron',dialog.cron)">
                        提交
                    </el-button>
                </el-header>
                <el-main style="overflow:hidden;">
                    <VueEditor
                        v-model="dialog.cron.data.value"
                        @init="onCronEditorInit"
                        :lang="dialog.cron.editor.lang.value"
                        :theme="dialog.cron.editor.theme.value"
                        width="100%"
                        height="calc(100vh - 350px)"
                        style="border:1px solid #f2f2f2;"
                    ></VueEditor>
                </el-main>
            </el-container>
        </el-dialog>
    </el-container>
</template>

<script>
    import _ from 'lodash';
    import RuleTree from '../rule/TreeView';
    import TestView from '../rule/TestView';
    import LogView from '../consolelog/LogView';
    import mxgraph from '../diagnosis/mxGraph.js';
    const {mxEditor,mxGraph,mxDivResizer,mxOutline,mxImage,mxRectangle,mxCell,mxGeometry,mxPerimeter,mxRubberband,mxConstants,mxClient,mxEdgeStyle,mxUtils,mxCodec,mxEvent,mxHierarchicalLayout,mxMorphing,mxFastOrganicLayout,mxCompactTreeLayout,mxCircleLayout} = mxgraph;
    const TOML = require('@iarna/toml');
    
    export default{
        name: "DesignView",
        props: {
            model: Object
        },
        components:{
            VueEditor: require("vue2-ace-editor"),
            RuleTree,
            LogView,
            TestView
        },
        data(){
            return {
                assetsPath: "/assets/graph/pipe",
                editor: null,
                config: null,
                layout: {
                    default: "tree_horizontal",
                    inst: null,
                    edgeStyle: 4
                },
                control: {
                    split: null,
                    log: {
                        show: false
                    },
                    monitor: {
                        show: false
                    },
                    outline: {
                        show: false
                    }
                },
                console: {
                    tabs: [],
                    activeName: "log"
                },
                dialog:{
                    jsonForm:{
                        base: null,
                        data: null,
                        schema: null
                    },
                    source: {
                        show: false,
                        data: {
                            jsonStr: null,
                            tomlStr: null
                        },
                        jsonEditor: {
                            data: {},
                            loading: false,
                            lang: {
                                value: "json",
                                list: []
                            },
                            theme: {
                                value: "monokai",
                                list: this.m3.EDITOR_THEME
                            }
                        },
                        tomlEditor: {
                            data: null,
                            loading: false,
                            lang: {
                                value: "toml",
                                list: []
                            },
                            theme: {
                                value: "monokai",
                                list: this.m3.EDITOR_THEME
                            }
                        }
                    },
                    rule: {
                        ruleRoot: ["",`${this.m3.auth.signedUser.Company.name}`,'rules'].join("/"),
                        show: false,
                        data: null,
                        editor: {
                            loading: false,
                            lang: {
                                value: "lua",
                                list: []
                            },
                            theme: {
                                value: "monokai",
                                list: this.m3.EDITOR_THEME
                            }
                        }
                    },
                    cron: {
                        show: false,
                        cell: null,
                        data: null,
                        editor: {
                            loading: false,
                            lang: {
                                value: "cron",
                                list: []
                            },
                            theme: {
                                value: "monokai",
                                list: this.m3.EDITOR_THEME
                            }
                        }
                    }
                }
            }
        },
        watch: {
            'dialog.jsonForm.data':{
                handler(val){
                    this.dialog.source.jsonEditor.data = JSON.stringify(val,null,2);
                },
                deep:true
            },
            'dialog.source.jsonEditor.data':{
                handler(val){
                    this.dialog.source.tomlEditor.data = TOML.stringify(JSON.parse(val));
                    this.dialog.jsonForm.data = JSON.parse(val);
                }
            },
            'dialog.source.tomlEditor.data':{
                handler(val){
                    this.dialog.source.jsonEditor.data = JSON.stringify(TOML.parse(val),null,2);
                }
            }

        },
        created(){
            // 初始化配置
            this.onInitConfig();
        },
        mounted(){
            
            // 初始化画布
            let container = this.$refs.graphContainer.$el;
            let outline = this.$refs.outlineContainer.$el;
            this.init(container,outline);

            // 初始化滚轮图缩放事件监听
            //this.addScrollListener(container, this.wheelHandle);
        },
        methods:{
            onJsonEditorInit(){
                require("brace/ext/language_tools"); //language extension prerequsite...
                require(`brace/mode/${this.dialog.source.jsonEditor.lang.value}`); //language
                require(`brace/snippets/${this.dialog.source.jsonEditor.lang.value}`); //snippet
                require(`brace/theme/${this.dialog.source.jsonEditor.theme.value}`); //language

                this.onShowSource();
            },
            onTomlEditorInit(){
                require("brace/ext/language_tools"); //language extension prerequsite...
                require(`brace/mode/${this.dialog.source.tomlEditor.lang.value}`); //language
                require(`brace/snippets/${this.dialog.source.tomlEditor.lang.value}`); //snippet
                require(`brace/theme/${this.dialog.source.tomlEditor.theme.value}`); //language
            },
            onRuleEditorInit(){
                require("brace/ext/language_tools"); //language extension prerequsite...
                require(`brace/mode/${this.dialog.rule.editor.lang.value}`); //language
                require(`brace/snippets/${this.dialog.rule.editor.lang.value}`); //snippet
                require(`brace/theme/${this.dialog.rule.editor.theme.value}`); //language
            },
            onCronEditorInit(){
                require("brace/ext/language_tools"); //language extension prerequsite...
                require(`brace/mode/${this.dialog.cron.editor.lang.value}`); //language
                require(`brace/snippets/${this.dialog.cron.editor.lang.value}`); //snippet
                require(`brace/theme/${this.dialog.cron.editor.theme.value}`); //language
            },
            onShowSource(){
                
                
            },
            // 初始化图容器
            init(container, outline) {
                
                if (!mxClient.isBrowserSupported()){
                    mxUtils.error('Browser is not supported!', 200, false);
                } else {
                    
                    // Workaround for Internet Explorer ignoring certain CSS directives
                    if (mxClient.IS_QUIRKS) {
                        document.body.style.overflow = 'hidden';
                        new mxDivResizer(container);
                        new mxDivResizer(outline);
                    }

                    // 初始化Graph
                    this.editor = new mxEditor();
                    var graph = this.editor.graph;
                    
                    // Disables some global features
                    graph.setConnectable(true);
                    graph.setCellsDisconnectable(false);
                    graph.setCellsCloneable(false);
                    graph.swimlaneNesting = false;
                    graph.dropEnabled = true;
                    // 容器大小自适应 
                    graph.setResizeContainer(false);


                    // Clones the source if new connection has no target
                    graph.connectionHandler.setCreateTarget(true);
                    
                    // Forces use of default edge in mxConnectionHandler
                    graph.connectionHandler.factoryMethod = null;

                    // Only tables are resizable
                    graph.isCellResizable = function(cell) {
                        return this.isSwimlane(cell);
                    };
                    
                    
                    // Disable highlight of cells when dragging from toolbar
                    graph.setDropEnabled(true);

                    // Uses the port icon while connections are previewed
                    graph.connectionHandler.getConnectImage = function(state)
                    {
                        return new mxImage(state.style[mxConstants.STYLE_IMAGE], 16, 16);
                    };

                    // Centers the port icon on the target port
                    graph.connectionHandler.targetConnectImage = true;

                    // Does not allow dangling edges
                    graph.setAllowDanglingEdges(false);

                    // Sets the graph container and configures the editor
                    this.editor.setGraphContainer(container);

                    var group = new mxCell('Group', new mxGeometry(), 'group');
                    group.setVertex(true);
                    group.setConnectable(false);
                    this.editor.defaultGroup = group;
                    this.editor.groupBorderSize = 20;

                    // Disables drag-and-drop into non-swimlanes.
                    graph.isValidDropTarget = function(cell)
                    {
                        return this.isSwimlane(cell);
                    };
                    
                    // Disables drilling into non-swimlanes.
                    graph.isValidRoot = function(cell)
                    {
                        return this.isValidDropTarget(cell);
                    }

                    // Does not allow selection of locked cells
                    graph.isCellSelectable = function(cell)
                    {
                        return !this.isCellLocked(cell);
                    };

                    // Returns a shorter label if the cell is collapsed and no
                    // label for expanded groups
                    graph.getLabel = function(cell)
                    {
                        var tmp = mxGraph.prototype.getLabel.apply(this, arguments); // "supercall"
                        
                        if (this.isCellLocked(cell))
                        {
                            // Returns an empty label but makes sure an HTML
                            // element is created for the label (for event
                            // processing wrt the parent label)
                            return '';
                        }
                        else if (this.isCellCollapsed(cell))
                        {
                            var index = tmp.indexOf('</h1>');
                            
                            if (index > 0)
                            {
                                tmp = tmp.substring(0, index+5);
                            }
                        }
                        
                        return tmp;
                    }

                    // Disables HTML labels for swimlanes to avoid conflict
                    // for the event processing on the child cells. HTML
                    // labels consume events before underlying cells get the
                    // chance to process those events.
                    //
                    // NOTE: Use of HTML labels is only recommended if the specific
                    // features of such labels are required, such as special label
                    // styles or interactive form fields. Otherwise non-HTML labels
                    // should be used by not overidding the following function.
                    // See also: configureStylesheet.
                    graph.isHtmlLabel = function(cell)
                    {
                        return !this.isSwimlane(cell);
                    }

                    // Enables new connections
                    graph.setConnectable(true);

                    // 首先禁用浏览器右键菜单
                    mxEvent.disableContextMenu(this.$el);
                    // 右键菜单
                    graph.popupMenuHandler.factoryMethod = (menu, cell, evt)=>{
                        this.createPopupMenu(this.editor, menu, cell, evt);
                    };

                    // 鼠标框选
                    new mxRubberband(graph);

                    // Adds all required styles to the graph (see below)
                    this.configureStylesheet(graph);

                    // Defines Delete action
                    this.editor.addAction('deleteAll',()=>{
                        this.onDeleteAllCells(true);
                    })
                    
                    // 图事件绑定
                    this.initGraphEvent(graph);

                    // 加载图内容
                    this.initGraph(graph);

                }
            },
            // 图事件绑定
            initGraphEvent(graph){
                // ADD_CELLS
                graph.addListener(mxEvent.ADD_CELLS, (sender,evt)=> {
                    
                    try{
                        let parent = evt.getProperty("parent");
        
                        if (parent != null) {
                            // 生成一个配置实例
                            this.newInstance(this.model, parent.getId());
                        }

                        evt.consume();
                    } catch(err){
                        console.error(sender,err);
                    }
                    
                });

                // 节点双节事件
                graph.dblClick = (evt, cell)=> {
                    // Do not fire a DOUBLE_CLICK event here as mxEditor will
                    // consume the event and start the in-place editor.
                    if (!mxEvent.isConsumed(evt) && cell != null) {
                        // this.dialog.source.jsonEditor.data = JSON.stringify(cell.value.fileContent.model,null,2);
                        // this.dialog.source.show = true;

                    }
                    // Disables any default behaviour for the double click
                    mxEvent.consume(evt);
                };

                

                // Overrides method to provide a cell label in the display
				graph.convertValueToString = (cell)=>{
                    try{
                        
                        if(typeof cell.value == 'object'){

                            // source
                            if(_.includes(['source','covert','operate','cron'],cell.value.type)){
                                let div = document.createElement('div');
                                div.style.margin = '10px';
                                div.style.padding = '10px 20px';
                                div.title = '拖拽到画图进行设计';


                                let img = document.createElement('img');
                                let url = [this.assetsPath,cell.value.fileContent.icon.url].join("/");
                                img.setAttribute('src', url);
                                img.style.width = '48px';
                                img.style.height = '48px';
                                div.appendChild(img);

                                let p = document.createElement('p');
                                let t = document.createTextNode(cell.value.fileContent.title);
                                p.style.fontSize = '14px';
                                p.appendChild(t);
                                div.appendChild(p);
    
                                return div;
                            }
                            // rule
                            else if(cell.value.type === 'rule'){
                                let div = document.createElement('div');
                                div.style.margin = '10px';
                                div.style.padding = '10px 20px';
                                div.title = '拖拽到画图进行设计';


                                let img = document.createElement('img');
                                let url = [this.assetsPath,cell.value.type+'.png'].join("/");
                                img.setAttribute('src', url);
                                img.style.width = '48px';
                                img.style.height = '48px';
                                div.appendChild(img);

                                let p = document.createElement('p');
                                let title = _.last(cell.value.title.split("/"));
                                let t = document.createTextNode(title);
                                p.style.fontSize = '14px';
                                p.appendChild(t);
                                div.appendChild(p);

                                return div;
                            }

                            
                        } else{
                            return cell.value;
                        }
                        
                    }catch(err){
                        console.error(err);
                        return '';
                    }
				};

                /* 监听拖入事件 Bgein */
                mxEvent.addListener(this.$refs.graphContainer.$el, 'dragover', function(evt){
                    if (graph.isEnabled()){
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                });

                mxEvent.addListener(this.$refs.graphContainer.$el, 'drop', (evt)=>{
                    
                    if (graph.isEnabled()){
                        evt.stopPropagation();
                        evt.preventDefault();

                        // Gets drop location point for vertex
                        var pt = mxUtils.convertPoint(graph.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
                        var tr = graph.view.translate;
                        var scale = graph.view.scale;
                        var x = pt.x / scale - tr.x;
                        var y = pt.y / scale - tr.y;
                        
                        // Converts local entity to graph cell
                        let addCellToGraph = (items)=>{
                            
                            graph.getModel().beginUpdate();

                            try{

                                graph.getModel();
                                let parent = graph.getDefaultParent();

                                _.forEach(items,(v)=>{
                                    
                                    let cell = graph.getModel().getCell(v.key);

                                    if(cell){
                                        this.$message({
                                            type: "info",
                                            message: "已有该规则"
                                        })
                                        return;
                                    }

                                    // normal
                                    let node = null;
                                    node = graph.insertVertex(parent, v.key, v, x, y, 120, 120);

                                    node.vertex = true;

                                    // 定位到cell
                                    graph.scrollCellToVisible(cell);
                                    graph.setSelectionCell(cell);

                                })
                            
                                
                            } finally {
                                graph.getModel().endUpdate();
                            }
                        };

                        let items = [JSON.parse(evt.dataTransfer.getData("Text"))];

                        addCellToGraph(items);
                    }
                });

                /* 监听拖入事件 End */

                /************************ 节点Hover菜单 Begin ************************/
                // Defines a new class for all icons
                let mxIconSet = (state)=>{
                    this.images = [];
                    
                    // Tip img
                    let size = 24;
                    var imgTip = mxUtils.createImage(`/assets/graph/tools/column.png`);
                    imgTip.setAttribute('title', '备注');
                    imgTip.style.position = 'absolute';
                    imgTip.style.cursor = 'pointer';
                    imgTip.style.width = size+'px';
                    imgTip.style.height = size+'px';
                    imgTip.style.left = (state.x + state.width) + 'px';
                    imgTip.style.top = (state.y - size) + 'px';
                    
                    mxEvent.addGestureListeners(imgTip,
                        mxUtils.bind(this, function(evt){
                            // Disables dragging the image
                            mxEvent.consume(evt);
                        })
                    );
                    // bind事件到备注按钮    
                    mxEvent.addListener(imgTip, 'click',
                        mxUtils.bind(this, (evt)=>{
                            
                            try{
                                // source
                                if(_.includes(['source','covert','operate'],state.cell.value.type)){

                                    let name = [this.model.name.split(".")[0],state.cell.getId()].join("/");
                                    let param = encodeURIComponent( JSON.stringify({name: name}) );
                                    this.m3.callFS("/matrix/m3event/pipe/getPipeCellByName.js",param).then(rtn=>{
                                        console.log(232323,rtn,state.cell.value)
                                        this.dialog.source.jsonEditor.data = rtn.message?rtn.message:state.cell.value.fileContent;

                                        this.dialog.jsonForm.cell = state.cell;
                                        this.dialog.jsonForm.base = state.cell.value;
                                        this.dialog.jsonForm.data = JSON.parse(this.dialog.source.jsonEditor.data);
                                        this.dialog.jsonForm.schema = state.cell.value.fileContent.schema;
                                    }).catch(err=>{
                                        console.log(err);
                                        this.dialog.source.jsonEditor.data = JSON.stringify(state.cell.value.fileContent.model,null,2);

                                        this.dialog.jsonForm.cell = state.cell;
                                        this.dialog.jsonForm.base = state.cell.value;
                                        this.dialog.jsonForm.data = JSON.parse(this.dialog.source.jsonEditor.data);
                                        this.dialog.jsonForm.schema = state.cell.value.fileContent.schema;
                                    })
                                    

                                    this.dialog.source.show = true;
                                }
                                // rule
                                else if(state.cell.value.type === 'rule'){
                                    this.m3.ruleGet(state.cell.value.name).then(rtn=>{
                                        this.dialog.rule.data = rtn.message;
                                        this.dialog.rule.show = true;
                                    })
                                }
                                // cron
                                else if(state.cell.value.type === 'cron'){
                                    let name = [this.model.name.split(".")[0],state.cell.getId()].join("/");
                                    let param = encodeURIComponent( JSON.stringify({name: name}) );
                                    this.m3.callFS("/matrix/m3event/pipe/getPipeCellByName.js",param).then( rtn=>{
                                        this.dialog.cron.cell = state.cell;
                                        this.dialog.cron.data = rtn.message?JSON.parse(rtn.message):state.cell.value.fileContent;
                                    }).catch(err=>{
                                        console.log(err);
                                        this.dialog.cron.data = state.cell.value.fileContent;
                                    })

                                    this.dialog.cron.show = true;
                                }

                                mxEvent.consume(evt);
                                // this.destroy();

                            } catch(err){
                                console.error(err);
                            }

                            
                        })
                    );
                    
                    state.view.graph.container.appendChild(imgTip);
                    this.images.push(imgTip);

                    // Info img
                    var imgInfo = mxUtils.createImage(`/assets/graph/tools/gear.png`);
                    imgInfo.setAttribute('title', '信息');
                    imgInfo.style.position = 'absolute';
                    imgInfo.style.cursor = 'pointer';
                    imgInfo.style.width = size+'px';
                    imgInfo.style.height = size+'px';
                    imgInfo.style.left = (state.x - size) + 'px';
                    imgInfo.style.top = (state.y - size) + 'px';
                    
                    mxEvent.addGestureListeners(imgInfo,
                        mxUtils.bind(this, function(evt){
                            mxEvent.consume(evt);
                        })
                    );
                    // bind事件到备注按钮    
                    mxEvent.addListener(imgInfo, 'click',
                        mxUtils.bind(this, (evt)=>{
                            // 点击查看实体信息
                            this.dialog.source.show = true;
                            mxEvent.consume(evt);
                            // this.destroy();
                        })
                    );
                    
                    state.view.graph.container.appendChild(imgInfo);
                    this.images.push(imgInfo);
                    
                }

                mxIconSet.prototype.destroy = ()=>{
                    if (this.images != null) {
                        for (var i = 0; i < this.images.length; i++) {
                            var img = this.images[i];
                            img.parentNode.removeChild(img);
                        }
                    }
                    
                    this.images = null;
                }
                // Defines the tolerance before removing the icons
                var iconTolerance = 20;

                // Shows icons if the mouse is over a cell
                graph.addMouseListener({
                    currentState: null,
                    currentIconSet: null,
                    mouseDown: function(sender, me){
                        // Hides icons on mouse down
                        if (this.currentState != null){
                            this.dragLeave(me.getEvent(), this.currentState);
                            this.currentState = null;
                        }
                    },
                    mouseMove: function(sender, me){
                        if (this.currentState != null && (me.getState() == this.currentState ||
                            me.getState() == null)){
                            var tol = iconTolerance;
                            let tmp = new mxRectangle(me.getGraphX() - tol,
                                me.getGraphY() - tol, 2 * tol, 2 * tol);

                            if (mxUtils.intersects(tmp, this.currentState)){
                                return;
                            }
                        }
                        
                        let tmp = graph.view.getState(me.getCell());
                        
                        // Ignores everything but vertices
                        if (graph.isMouseDown || (tmp != null && !graph.getModel().isVertex(tmp.cell))){
                            tmp = null;
                        }

                        if (tmp != this.currentState){
                            if (this.currentState != null){
                                this.dragLeave(me.getEvent(), this.currentState);
                            }
                        
                            this.currentState = tmp;
                        
                            if (this.currentState != null){
                                this.dragEnter(me.getEvent(), this.currentState);
                            }
                        }
                    },
                    mouseUp: function() { },
                    dragEnter: function(evt, state){
                        if (this.currentIconSet == null){
                            this.currentIconSet = new mxIconSet(state);
                        }
                    },
                    dragLeave: function(){
                        if (this.currentIconSet != null){
                            this.currentIconSet.destroy();
                            this.currentIconSet = null;
                        }
                    }
                })

                /************************ 节点Hover菜单 End ************************/


            },  
            // 加载画布内容
            initGraph(graph){
                let term = encodeURIComponent(JSON.stringify( this.model ));

                this.m3.callFS("/matrix/m3event/pipe/getPipeContentByName.js", term).then( (rtn)=>{
                    let doc = mxUtils.parseXml(rtn.message);
                    let codec = new mxCodec(doc);
                    codec.decode(doc.documentElement, graph.getModel());
                } )
            
            },
            // 初始化菜单项目
            onInitConfig(){
                this.m3.callFS("/matrix/m3event/pipe/getConfigList.js").then( (rtn)=>{
                    this.config = rtn.message;
                });
            },
            // 初始化滚轮图缩放
            addScrollListener(element, wheelHandle) {
                if (typeof element != 'object') return;
                if (typeof wheelHandle != 'function') return;

                // 监测浏览器
                if (typeof arguments.callee.browser == 'undefined') {
                    var user = navigator.userAgent;
                    var b = {};
                    b.opera = user.indexOf("Opera") > -1 && typeof window.opera == "object";
                    b.khtml = (user.indexOf("KHTML") > -1 || user.indexOf("AppleWebKit") > -1 || user.indexOf("Konqueror") > -1) && !b.opera;
                    b.ie = user.indexOf("MSIE") > -1 && !b.opera;
                    b.gecko = user.indexOf("Gecko") > -1 && !b.khtml;
                    arguments.callee.browser = b;
                }
                if (element == window)
                    element = document;
                if (arguments.callee.browser.ie)
                    element.attachEvent('onmousewheel', wheelHandle);
                else
                    element.addEventListener(arguments.callee.browser.gecko ? 'DOMMouseScroll' : 'mousewheel', wheelHandle, false);
            },
            // 初始化滚轮图缩放
            wheelHandle(e) {
                var upcheck;

                if (e.wheelDelta) {
                    upcheck = e.wheelDelta > 0 ? 1 : 0;
                } else {
                    upcheck = e.detail < 0 ? 1 : 0;
                }
                if (upcheck) {
                    this.editor.graph.zoomIn();
                }
                else {
                    this.editor.graph.zoomOut();
                }

                if (window.event) {
                    e.returnValue = false;
                    window.event.cancelBubble = true;
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                }
            },
            // 图视图切换  日志、监控、预览
            onToggleView(view){
                
                if(view == 'outline'){

                    this.control.outline.show = !this.control.outline.show;

                    if(this.control.outline.show){
                        new mxOutline(this.editor.graph, this.$refs.outlineContainer);
                    }

                } else {
                    this.control[view].show = !this.control[view].show;
                    this.console.activeName = view;
                }
            },
            // 右键菜单
            createPopupMenu(editor, menu, cell) {
                if (cell != null) {

                    menu.addItem('删除', null, function(){
                        editor.execute('delete', cell);
                    });
                    menu.addSeparator();
                }

                menu.addItem('撤销', null, function(){
                    editor.execute('undo', cell);
                });
                
                menu.addItem('重做', null, function(){
                    editor.execute('redo', cell);
                });

                menu.addSeparator();

                menu.addItem('清空', null, function(){
                    editor.execute('deleteAll');
                });
                
                menu.addSeparator();
                        
                var submenuLayout = menu.addItem('布局', null, null);

                var submenuLayoutHierarchical = menu.addItem('分层布局', null, null,submenuLayout);
                menu.addItem('上下', null, ()=>{
                    this.layout.default = 'hierarchical_vertical';
                    this.executeLayout();
                }, submenuLayoutHierarchical);
                menu.addItem('左右', null, ()=>{
                    this.layout.default = 'hierarchical_horizontal';
                    this.executeLayout();
                }, submenuLayoutHierarchical);

                
                var submenuLayoutTree = menu.addItem('树形布局', null, null,submenuLayout);

                menu.addItem('上下', null, ()=>{
                    this.layout.default = 'tree_vertical';
                    this.executeLayout();
                }, submenuLayoutTree);
                menu.addItem('左右', null, ()=>{
                    this.layout.default = 'tree_horizontal';
                    this.executeLayout();
                }, submenuLayoutTree);

                menu.addItem('随机布局', null, ()=>{
                    this.layout.default = 'organic';
                    this.executeLayout();
                }, submenuLayout);
                menu.addItem('圆形布局', null, ()=>{
                    this.layout.default = 'circle';
                    this.executeLayout();
                }, submenuLayout);
            },
            // 图布局
            executeLayout(){
                let graph = this.editor.graph;
                let parent = graph.getDefaultParent();
                let layout = this.layout;
                
                // 布局定义
                if(layout.default === 'hierarchical_vertical'){
                    // Layout hierarchical
                    graph.getModel().beginUpdate();
                    try {
                        layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
                        layout.inst.edgeStyle = layout.edgeStyle;
                        layout.inst.intraCellSpacing = 80;
                        layout.inst.interRankCellSpacing = 80;
                        
                        layout.inst.execute(parent, null);

                    } finally {
                        let morph = new mxMorphing(graph);  
                        morph.addListener(mxEvent.DONE, function(){  
                            graph.getModel().endUpdate();  
                        });  
                            
                        morph.startAnimation();  
                    }
                    
                } else if(layout.default === 'hierarchical_horizontal'){
                    // Layout hierarchical
                    graph.getModel().beginUpdate();
                    try {
                        layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                        layout.inst.edgeStyle = layout.edgeStyle;
                        layout.inst.intraCellSpacing = 80;
                        layout.inst.interRankCellSpacing = 80;
                        
                        layout.inst.execute(parent, null);
                    } finally {
                        let morph = new mxMorphing(graph);  
                        morph.addListener(mxEvent.DONE, function(){  
                            graph.getModel().endUpdate();  
                        });  
                            
                        morph.startAnimation();  
                    }
                    
                } else if(layout.default === 'organic'){
                    // Layout Organic
                    graph.getModel().beginUpdate();
                    try {
                        layout.inst = new mxFastOrganicLayout(graph);
                        layout.inst.forceConstant = 140;
                        //layout.inst.execute(parent);

                        layout.inst.execute(parent,null);
                    } finally {
                        graph.getModel().endUpdate();
                    }
                    
                } else if(layout.default === 'tree_vertical'){
                    /* Layout tree vertical */
                    graph.getModel().beginUpdate();
                    try {
                        var tmp = graph.getSelectionCell();
                        var roots = null;
                        var cells = [tmp];
                        
                        if ( tmp == null || graph.getModel().getChildCount(tmp) == 0 ) {
                            if (graph.getModel().getEdgeCount(tmp) == 0){
                                roots = graph.findTreeRoots(parent);
                            }
                        } else {
                            roots = graph.findTreeRoots(tmp);
                        }

                        if ( roots != null && roots.length > 0 ) {
                            cells = roots;
                        }
                        
                        if( cells.length > 0 ) {
                            _.forEach(cells,(v)=>{
                                layout.inst = new mxCompactTreeLayout(graph, false);
                                layout.inst.edgeRouting = false;
                                layout.inst.levelDistance = 30;
                                layout.inst.execute(parent, v);
                            })
                        }

                    } finally {
                        let morph = new mxMorphing(graph);  
                        morph.addListener(mxEvent.DONE, function(){  
                            graph.getModel().endUpdate();  
                        });  
                            
                        morph.startAnimation();  
                    }
                } else if(layout.default === 'tree_horizontal'){
                    /* Layout tree horizontal */
                    graph.getModel().beginUpdate();
                    try {
                        let tmp = graph.getSelectionCell();
                        let roots = null;
                        let cells = [tmp];
                        
                        if (tmp == null || graph.getModel().getChildCount(tmp) == 0){
                            if (graph.getModel().getEdgeCount(tmp) == 0){
                                roots = graph.findTreeRoots(parent);
                            }
                        } else {
                            roots = graph.findTreeRoots(tmp);
                        }

                        if (roots != null && roots.length > 0){
                            cells = roots;
                        }
                        
                        if( cells.length > 0 ) {
                            _.forEach(cells,(v)=>{
                                layout.inst = new mxCompactTreeLayout(graph, true);
                                layout.inst.edgeRouting = false;
                                layout.inst.levelDistance = 30;
                                layout.inst.execute(parent, v);
                            })
                        }
                        
                    } finally {
                        let morph = new mxMorphing(graph);  
                        morph.addListener(mxEvent.DONE, function(){  
                            graph.getModel().endUpdate();  
                        });  
                            
                        morph.startAnimation();  
                    }
                } else {
                    /* Layout Circle */
                    graph.getModel().beginUpdate();
                    try {
                        layout.inst = new mxCircleLayout(graph);
                        //layout.inst.execute(parent);
                        layout.inst.execute(parent, null);
                    } finally {
                        graph.getModel().endUpdate();
                    }
                }
                
                // 缓存最后一次布局
                localStorage.setItem("PIPE-GRAPH-LAYOUT",layout.default);

                
            },            
            // 图节点样式
            configureStylesheet(graph){
                var style = new Object();
                style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
                style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
                style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
                style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
                style[mxConstants.STYLE_GRADIENTCOLOR] = '#41B9F5';
                style[mxConstants.STYLE_FILLCOLOR] = '#8CCDF5';
                style[mxConstants.STYLE_STROKECOLOR] = '#1B78C8';
                style[mxConstants.STYLE_FONTCOLOR] = '#000000';
                style[mxConstants.STYLE_ROUNDED] = true;
                style[mxConstants.STYLE_OPACITY] = '80';
                style[mxConstants.STYLE_FONTSIZE] = '12';
                style[mxConstants.STYLE_FONTSTYLE] = 0;
                style[mxConstants.STYLE_IMAGE_WIDTH] = '48';
                style[mxConstants.STYLE_IMAGE_HEIGHT] = '48';
                graph.getStylesheet().putDefaultVertexStyle(style);

                style = new Object();
                style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
                style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
                style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
                style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
                style[mxConstants.STYLE_FILLCOLOR] = '#FF9103';
                style[mxConstants.STYLE_GRADIENTCOLOR] = '#F8C48B';
                style[mxConstants.STYLE_STROKECOLOR] = '#E86A00';
                style[mxConstants.STYLE_FONTCOLOR] = '#000000';
                style[mxConstants.STYLE_ROUNDED] = true;
                style[mxConstants.STYLE_OPACITY] = '80';
                style[mxConstants.STYLE_STARTSIZE] = '30';
                style[mxConstants.STYLE_FONTSIZE] = '16';
                style[mxConstants.STYLE_FONTSTYLE] = 1;
                graph.getStylesheet().putCellStyle('group', style);
                
                style = new Object();
                style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
                style[mxConstants.STYLE_FONTCOLOR] = '#774400';
                style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
                style[mxConstants.STYLE_PERIMETER_SPACING] = '6';
                style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_LEFT;
                style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
                style[mxConstants.STYLE_FONTSIZE] = '10';
                style[mxConstants.STYLE_FONTSTYLE] = 2;
                style[mxConstants.STYLE_IMAGE_WIDTH] = '16';
                style[mxConstants.STYLE_IMAGE_HEIGHT] = '16';
                graph.getStylesheet().putCellStyle('port', style);
                
                style = graph.getStylesheet().getDefaultEdgeStyle();
                style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
                style[mxConstants.STYLE_STROKEWIDTH] = '2';
                style[mxConstants.STYLE_ROUNDED] = true;
                style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
            },
            // 关闭调试、日志
            onRemoveConsoleTab(targetName){
                this.control[targetName].show = !this.control[targetName].show;
            },
            // 加载可拖拽项目
            onSideBarShow(item,sidebar){
                let graph = this.editor.graph;
                let sourcebar = this.$refs[sidebar].$el;

                document.querySelector(sourcebar).remove();

                _.forEach(item, (v)=>{
                    let url = [this.assetsPath,v.fileContent.icon.url].join("/");
                    this.addSidebarIcon(
                        graph, 
                        sourcebar,
                        `<h1 style="margin:0px;">${v.fileContent.title}</h1><img src="${url}" style="width:38px;padding:10px;"></img>`,
                        url || '/assets/graph/pipe/matrix.png',
                        v);
                })
            },
            onSideBarShowRule(){
                //this.$refs.RuleTreeView.treeDaata  
            },
            // 添加菜单项
            addSidebarIcon(graph, sidebar, label, image, data){
                
                // Function that is executed when the image is dropped on
                // the graph. The cell argument points to the cell under
                // the mousepointer if there is one.
                let funct = function(graph, evt, cell, x, y){
                    let parent = graph.getDefaultParent();
                    let model = graph.getModel();
                    
                    let v1 = null;
                    
                    model.beginUpdate();
                    try {
                        // NOTE: For non-HTML labels the image must be displayed via the style
                        // rather than the label markup, so use 'image=' + image for the style.
                        // as follows: v1 = graph.insertVertex(parent, null, label,
                        // pt.x, pt.y, 120, 120, 'image=' + image);
                        v1 = graph.insertVertex(parent, null, data, x, y, 120, 120);

                    } finally {
                        model.endUpdate();
                    }
                    
                    graph.setSelectionCell(v1);
                }
                
                // Creates the image which is used as the sidebar icon (drag source)
                let btn = document.createElement('button');
                btn.className = 'el-button--default el-button--small el-button';  
                btn.style.margin = '10px';
                btn.style.padding = '10px 20px';
                btn.title = '拖拽到画图进行设计';


                let img = document.createElement('img');
                img.setAttribute('src', image);
                img.style.width = '34px';
                img.style.height = '34px';
                btn.appendChild(img);

                let p = document.createElement('p');
                let t = document.createTextNode(data.fileContent.title);
                p.appendChild(t);
                btn.appendChild(p);


                sidebar.appendChild(btn);
                
                let dragElt = document.createElement('div');
                dragElt.style.border = 'dashed black 1px';
                dragElt.style.width = '60px';
                dragElt.style.height = '60px';
                                    
                // Creates the image which is used as the drag icon (preview)
                let ds = mxUtils.makeDraggable(img, graph, funct, dragElt, 0, 0, true, true);
                ds.setGuidesEnabled(true);
            },
            // 图保存
            onSave(){
                
                let encoder = new mxCodec();
                let node = encoder.encode(this.editor.graph.getModel());
                let graph = mxUtils.getPrettyXml(node);
                let name = this.model.name.split(".")[0]
                let param = encodeURIComponent(JSON.stringify( { graph:graph, name:name } ));
                
                this.m3.callFS("/matrix/m3event/pipe/savePipe.js", param).then( ()=>{
                    this.$message({
                        type: "success",
                        message: "保存成功"
                    })
                } );

            },
            // 图节点配置保存
            onSaveCell(type,data){
                if( type==='rule' ){
                    
            
                    const h = this.$createElement;
                    this.$msgbox({
                            title: `确认要更新规则`, 
                            message: h('span', null, [
                                h('p', null, `位置：${data.key}`),
                                h('p', null, `值：${_.truncate(data.value)}`),
                                h('p', null, `TTL：${ _.isUndefined(data.ttl) ? '' : data.ttl }`)
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                    }).then(() => {

                        this.m3.ruleUpdate(data).then( ()=>{
                            
                            this.$message({
                                type: "success",
                                message: "更新成功！"
                            });
                            
                        }).catch(err=>{
                            this.$message({
                                type: "error",
                                message: "更新失败：" + err
                            })
                        });

                    }).catch(() => {
                            
                    }); 
                    
                } else if( type==='cron' ) {
                    let id = data.cell.getId();
                    let name = [this.model.name.split(".")[0],id].join("/")
                    let param = encodeURIComponent(JSON.stringify( { name:name, data: data.data } ));
                    
                    this.m3.callFS("/matrix/m3event/pipe/savePipeCell.js", param).then( ()=>{
                        this.$message({
                            type: "success",
                            message: "节点配置保存成功"
                        })
                    } )
                } else {
                    let id = data.cell.getId();
                    let name = [this.model.name.split(".")[0],id].join("/")
                    let param = encodeURIComponent(JSON.stringify( { name:name, data: data.data } ));
                    
                    this.m3.callFS("/matrix/m3event/pipe/savePipeCell.js", param).then( ()=>{
                        this.$message({
                            type: "success",
                            message: "节点配置保存成功"
                        })
                    } );
                }
            },
            // 图另存为
            onSaveAs(){

            },
            // 图某节点删除
            onDelete(){

            },
            // 图所有节点删除
            onDeleteAllCells(includeEdges){

                // Cancels interactive operations
                let graph = this.editor.graph;
                graph.escape();
                
                let cells = graph.getChildVertices(graph.getDefaultParent());
                if (cells != null && cells.length > 0){
                    var parents = graph.model.getParents(cells);
                    graph.removeCells(cells, includeEdges);
                    
                    // Selects parents for easier editing of groups
                    if (parents != null){
                        var select = [];
                        
                        for (var i = 0; i < parents.length; i++){
                            if (graph.model.contains(parents[i]) &&
                                (graph.model.isVertex(parents[i]) ||
                                graph.model.isEdge(parents[i]))){
                                select.push(parents[i]);
                            }
                        }
                        graph.setSelectionCells(select);
                    }
                }
            },
            // 图关闭
            onClose(){

            },
            // 图运行
            onExecute(){

            },
            // 图放大
            onZoomIn(){
                this.editor.graph.zoomIn();
            },
            // 图缩小
            onZoomOut(){
                this.editor.graph.zoomOut();
            },
            // 图自适应大小
            onFit(){
                this.editor.execute("fit");
            },
            // 生成配置实例
            newInstance(model, id){
                let term = encodeURIComponent( JSON.stringify( { model:model, id:id } ) );
                this.m3.callFS("/matrix/m3event/pipe/newInstance.js", term);
            },
            // 删除配置实例
            deleteInstance(id){
                this.m3.callFS("/matrix/m3event/pipe/deleteInstance.js", encodeURIComponent(id));
            },
        }
    }
</script>

<style>
    
</style>
