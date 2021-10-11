<template>
  <el-container >
    <el-header style="height:40px;line-height:40px;padding:0px;text-align:right;">
        <el-popover
            placement="left"
            trigger="click"
            popper-class="info-popper">
            <el-container>
                <el-main style="padding:0px;">
                    <el-tabs value="setup">
                        <el-tab-pane label="设置" name="setup">
                            <el-form>
                                <el-form-item label="工具栏">
                                    <el-switch
                                        v-model="graph.control.toolbar.show"
                                        active-color="#13ce66"
                                        inactive-color="#dddddd">
                                    </el-switch>
                                </el-form-item>
                                <el-form-item label="自动刷新">
                                    <el-switch
                                        v-model="graph.control.refresh.enable"
                                        active-color="#13ce66"
                                        inactive-color="#dddddd"
                                        @change="onRefreshChange">
                                    </el-switch>
                                </el-form-item>
                                <el-form-item label="手动刷新">
                                    <el-button type="text"><i class="el-icon-refresh" @click="onRefreshCellStatus"></i></el-button>
                                </el-form-item>
                                <el-form-item label="预览视图">
                                    <el-switch
                                        v-model="graph.control.outline.show"
                                        active-color="#13ce66"
                                        inactive-color="#dddddd"
                                        @change="onToggleOutline">
                                    </el-switch>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="节点" name="vertex">
                            <el-form>
                                <el-form-item label="排列">
                                    
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="边线" name="edge">
                            <el-form>
                                <el-form-item label="样式">
                                    
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
            <el-button type="text" slot="reference">
                <i class="el-icon-setting" style="font-size:15px;margin:0 5px;"></i>
            </el-button>
        </el-popover>
    </el-header>
    <el-main id="graphContainer" ref="graphContainer" style="width:100vw;height:100vh;min-width:100vw;position:releative;overflow:hidden;padding:0px;"></el-main>
    <div ref="outlineContainer"
        style="position:absolute;overflow:hidden;top:40px;right:20px;width:200px;height:140px;background:transparent;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
        v-show="graph.control.outline.show">
    </div>
  </el-container>
</template>

<script>
import 'mxgraph/javascript/src/css/common.css';

import _ from 'lodash';
import mxgraph from './mxGraph.js';
const {mxEditor,mxGraph,mxConstants,mxPanningHandler,mxGraphHandler,mxGuide,mxEdgeHandler,mxClient,mxRectangleShape,mxRubberband,mxCellOverlay,mxOutline,mxImage,mxPoint,mxEdgeStyle,mxCellTracker,mxUtils,mxCodec,mxEvent,mxHierarchicalLayout,mxMorphing,mxFastOrganicLayout,mxCompactTreeLayout,mxCircleLayout} = mxgraph;

export default {
  name: "GraphView",
  props: {
    model: Array,
    global: Object
  },
  data() {
    return {
      graph: {
            editor:null,
            data: null,
            control:{
                ifIcon: true,
                outline: {
                    show: false,
                    inst: null
                },
                toolbar:{
                    show: false
                },
                refresh:{
                    inst: null,
                    enable: false,
                    interval: 15*1000
                }
            },
            layout: {
                default: 'hierarchical_vertical'
            },
            style: {
                grid: {
                    show: false
                },
                vertex:{
                    align: {
                        value: '',
                        list: [
                            {name: '左对齐', icon:'', value:'mxConstants.ALIGN_LEFT'},
                            {name: '居中', icon:'', value:'mxConstants.ALIGN_CENTER'},
                            {name: '右对齐', icon:'', value:'mxConstants.ALIGN_RIGHT'},
                            {name: '上对齐', icon:'', value:'mxConstants.ALIGN_TOP'},
                            {name: '中间', icon:'', value:'mxConstants.ALIGN_MIDDLE'},
                            {name: '下对齐', icon:'', value:'mxConstants.ALIGN_BOTTOM'}
                        ]
                    }
                },
                edge: {
                    endArrow: 'classic',
                    strokeWidth: 1,
                    strokeColor: '#333333',
                    value: {
                            name: 'isometric1', cnTitle:'等距1', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', null, null, null]
                        },
                    list: [
                        {
                            name: 'straight', cnTitle:'直线', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:[null, null, null]
                        },
                        {
                            name: 'orthogonal', cnTitle:'正交', title:'orthogonalEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['orthogonalEdgeStyle', null, null]
                        },
                        {
                            name: 'simple1', cnTitle:'简单1', title:'elbowEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['elbowEdgeStyle', null, null, null]
                        },
                        {
                            name: 'simple2', cnTitle:'简单2', title:'elbowEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['elbowEdgeStyle', 'vertical', null, null]
                        },
                        {
                            name: 'isometric1', cnTitle:'等距1', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', null, null, null]
                        },
                        {
                            name: 'isometric2', cnTitle:'等距2', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', 'vertical', null, null]
                        },
                        {
                            name: 'entityRelation', cnTitle:'实体关联', title:'entityRelationEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['entityRelationEdgeStyle', null, null]
                        }
                    ]
                }
            },
            path: {
                list:[],
                colors:['#ff0000','#ffd700','#666666','#00ffff','#40e0d0','#ff7373','#d3ffce','#3399ff','#000080','#66cccc','#a0db8e','#794044','#6897bb','#cc0000'],
            },
            edges: {
                value: "",
                list: [],
                properties: {
                    value: "",
                    list: []
                }
            }
      }
    };
  },
  watch: {
        model:{
          handler(){
              this.initData();
          },
          deep: true
        },
        'graph.control.refresh.enable':{
            handler(val){
                if(val) {
                    this.graph.control.refresh.inst = setInterval(()=>{
                        this.onRefreshCellStatus();
                    },this.graph.control.refresh.interval);
                    this.$message({
                        type: "info",
                        message: "自动刷新开启"
                    })
                } else {
                    clearInterval(this.graph.control.refresh.inst);
                    this.$message({
                        type: "info",
                        message: "自动刷新关闭"
                    })
                }
            },
            immediate:true
        },
  },
  created(){
    this.initData();
    this.init();
  },
  mounted(){
      this.eventHub.$on("graph-position",(v)=>{
          this.onCellPosition(v.row,v.hFlag,v.vFlag);
      })
  },
  methods: {
    // 初始化
    init(){
        this.m3.callFS("/matrix/m3event/graph/edges.js",null).then( (rtn)=>{
            this.graph.edges.list = rtn.message;
        } );

        // 状态刷新标志
        this.graph.control.refresh.enable = (localStorage.getItem("GRAPH-STATUS-IFREFRESH") == 'true');

        // 节点是否可以移动 
        mxGraphHandler.prototype.setMoveEnabled(true);
        //显示节点位置标尺  
        mxGraphHandler.prototype.guidesEnabled = true;

        // Alt disables guides
        mxGuide.prototype.isEnabledForEvent = function(evt){
            return !mxEvent.isAltDown(evt);
        };

        // Enables snapping waypoints to terminals
        mxEdgeHandler.prototype.snapToTerminals = true;
    },
    // 加载图数据
    initData(){
        
        if(_.isEmpty(this.model)) {
            this.onReload();
            return false;
        } else {
            
            this.m3.dfsRead({parent:"/script/matrix/m3event/graph", name:"config.json"}).then( rtn=>{
                let matchTemplate = _.template(JSON.parse(rtn).match);
                let match = matchTemplate({ids: this.model.join("','")});
                let param = encodeURIComponent( match );

                this.m3.callFS("/matrix/m3event/graph/graphService.js", param).then( res=>{
                    this.graph.data = res.message[0].graph;
                    this.onReload();
                } )
            })
        }
    },
    // 初始化图板
    initGraph(){
        this.graph.editor = new mxEditor();
        this.graph.editor.setGraphContainer(this.$refs.graphContainer.$el);
        let graph = this.graph.editor.graph;

        // 是否允许平移。true：表示按住Shift+左键拖动时，整个graph移动；
        // false：按住Shift+左键拖动时，选中的图形水平方向或者垂直方向平移。
        graph.setPanning(true);
        mxPanningHandler.prototype.isPanningTrigger = function() {
            return true;
        };

        // 禁止改变节点大小
        graph.setCellsResizable(false);
        // 禁止节点文字编辑功能
        graph.setCellsEditable(false);
        
        // 禁止连线移动
        graph.disconnectOnMove = false;
        

        // 允许连线的目标和源是同一元素 
        graph.setAllowLoops(true); 
        // 居中缩放
        graph.centerZoom = true;
        // Tooltips on touch devices
        graph.setTooltips(!mxClient.IS_TOUCH);
        // 支持Html
        graph.setHtmlLabels(true);

        // 去锯齿效果
        mxRectangleShape.prototype.crisp = true;

        // 鼠标框选
        new mxRubberband(graph);
        
        // 预览时鼠标悬浮到节点时，改变鼠标样式
        graph.getCursorForCell = function(cell){
            if (cell != null && cell.value != null && cell.vertex ==1 ){
                return 'pointer';
            }
        }
        
        // 预览时鼠标悬浮到节点时，改变节点样式
        new mxCellTracker(graph);

        // Sets global styles
        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.EDGE_SELECTION_STROKEWIDTH] = 3;
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'transparent';
        style[mxConstants.STYLE_LABEL_PADDING] = 5;


        style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_FILLCOLOR] = '#2f8ee7';
        style[mxConstants.STYLE_FONTCOLOR] = '#333333';
        style[mxConstants.STYLE_FONTSIZE] = '14';
        style[mxConstants.STYLE_SHAPE] = 'swimlane';
        style[mxConstants.STYLE_SPACING] = '10';
        style[mxConstants.STYLE_STARTSIZE] = 30;
        style[mxConstants.STYLE_GRADIENTCOLOR] = '#419efe';
        style[mxConstants.VERTEX_SELECTION_STROKEWIDTH] = 3;
        style[mxConstants.VERTEX_SELECTION_COLOR] = '#ff0000';

        // 预览时鼠标悬浮到节点时，改变节点样式
        new mxCellTracker(graph);

        // 首先禁用浏览器右键菜单
        mxEvent.disableContextMenu(this.$el);
        // 右键菜单
        graph.popupMenuHandler.factoryMethod = (menu, cell, evt)=>{
            this.createPopupMenu(this.graph.editor, graph, menu, cell, evt);
        };

        this.initGraphEvent(graph);

    },
    initGraphEvent(graph){
        // 初始化滚轮图缩放事件监听
        this.addScrollListener(graph);

        // Add the source vertex
        graph.addListener(mxEvent.ADD_CELLS, _.debounce(()=> {
            this.onRefreshCellStatus();
        }),1000);

        // 初始化鹰眼视图
        this.onInitOutline(graph);
    },
    // 滚轮缩放事件监听
    addScrollListener(graph){
        var t = (function a(element, wheelHandle) {
                if (typeof element != 'object') return;
                if (typeof wheelHandle != 'function') return;

                // 监测浏览器
                if (typeof a.browser == 'undefined') {
                    var user = navigator.userAgent;
                    var b = {};
                    b.opera = user.indexOf("Opera") > -1 && typeof window.opera == "object";
                    b.khtml = (user.indexOf("KHTML") > -1 || user.indexOf("AppleWebKit") > -1 || user.indexOf("Konqueror") > -1) && !b.opera;
                    b.ie = user.indexOf("MSIE") > -1 && !b.opera;
                    b.gecko = user.indexOf("Gecko") > -1 && !b.khtml;
                    a.browser = b;
                }
                if (element == window)
                    element = document;
                if (a.browser.ie)
                    element.attachEvent('onmousewheel', wheelHandle);
                else
                    element.addEventListener(a.browser.gecko ? 'DOMMouseScroll' : 'mousewheel', wheelHandle, false);
        });
        t(graph.container, this.wheelHandle);
    },
    // 滚轮缩放图
    wheelHandle(e) {
        var upcheck;

        if (e.wheelDelta) {
            upcheck = e.wheelDelta > 0 ? 1 : 0;
        } else {
            upcheck = e.detail < 0 ? 1 : 0;
        }
        if (upcheck) {
            this.graph.editor.graph.zoomIn();
        }
        else {
            this.graph.editor.graph.zoomOut();
        }

        if (window.event) {
            e.returnValue = false;
            window.event.cancelBubble = true;
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    },
    checkImgExists(){
        //let term = {parent:"/assets/images/entity/png", name:name};
        return true;//fsHandler.callFsJScript("/matrix/graph/checkHaveFile.js", encodeURIComponent(JSON.stringify(term))).message;
    },  
    // 渲染图片来源
    imageRenderHandler(icon) {
        
        if(_.includes(icon,'http://')){
            return icon;
        } else {
            return `/static/assets/images/entity/png/${icon}.png`;
        }

    },
    // 切换预览
    onInitOutline(graph){
        new mxOutline(graph, this.$refs.outlineContainer);
    },
    onToggleOutline(val){
        this.graph.control.outline.show = val;
    },
    // 自动刷新控制
    onRefreshChange(val){
        this.onRefreshCellStatus();
        this.graph.control.refresh.enable = val;
        localStorage.setItem("GRAPH-STATUS-IFREFRESH", this.graph.control.refresh.enable);
    },
    // 定位图节点
    onPosition(id,hFlag,vFlag){
                
        let editor = this.graph.editor; 
        let graph = editor.graph;
        let cell = graph.getModel().getCell(id);

        try{
            // 恢复图实际大小
            editor.execute("actualSize");    
            
            let containerW = graph.container.clientWidth;
            let containerH = graph.container.clientHeight;
            let x =-cell.geometry.x + ( containerW - cell.geometry.width) / 2;
            let y =-cell.geometry.y + ( containerH - cell.geometry.height) / 2;
            
            if( hFlag ){
                x = x / 2;
            }

            if( vFlag ){
                y = y / 2;
            }
            
            graph.getView().setTranslate(x,y);
            graph.scrollCellToVisible(cell);
            graph.setSelectionCells([cell]);

            _.delay(()=>{
                let state = graph.view.getState(cell);
                
                if(this.model.control.ifIcon){
                    state.shape.node.getElementsByTagName("image")[0].setAttribute('class', 'animated flash');
                } else {
                    state.shape.node.getElementsByTagName("ellipse")[0].setAttribute('class', 'animated flash');
                }
            },500)

            // 选择节点突出显示
            graph.setCellStyles(mxConstants.STYLE_PERIMETER_SPACING, 8, [cell]);
            
        } catch(err){
            
            // 当前画布中不包含该实体
            this.$message({
                type: "info",
                message: "画布没有该实体 "
            })
        }
        
    },
    // 图自适应并居中显示
    onGraphToCenter(immediate){
        const self = this;

        let editor = this.graph.editor;
        let graph = editor.graph;
        let parent = graph.getDefaultParent();
        let limit = 30;  // 当前画布节点数量阈值
        let topCell = graph.findTreeRoots(parent)[0];
        
        // 获取当前选择节点 
        // 针对加载子图的场景
        // 最顶层节点  graph.center(true,true,0,0.5);
        // 子节点  graph.center(true,true,0.5,0.5);
        let toCenter = function(){
            let selectionCell = graph.getSelectionCell();
            let allCells = graph.getChildVertices(parent);
            
            if( allCells.length > limit){
                // 图自适应
                editor.execute("fit");
                editor.execute("actualSize"); 
            } else {
                // 图实际大小
                editor.execute("actualSize"); 
            }

            // 没有选择节点
            if( selectionCell == null ){
                
                graph.center(true,true,0.5,0.5);  // middle-center

            } else {
                
                // 选择了最顶层节点
                if( selectionCell == topCell ){
                    graph.center(true,true,0,0.5); // top-center
                    // 定位选择节点
                    self.onPosition(selectionCell.getId(), true, true);
                } 
                // 选择了子节点
                else {
                    graph.center(true,true,0.5,0.5);  // middle-center
                    // 定位选择节点
                    self.onPosition(selectionCell.getId(), true, true);
                }
            }

            //graph.clearSelection();
            
        }

        if(immediate){
            editor.execute("fit");
            toCenter();
        } else {
            let loadSvg = function(){
                try{
                    let rtn = graph.getChildEdges(parent);
                    
                    if(_.size(rtn) > 0){
                        return true;
                    } else {
                        return false;
                    }
                    
                } catch(err){
                    return false
                }
            };
            
            if(loadSvg()) {
                _.delay(()=>{
                    editor.execute("fit");
                    toCenter();
                },500)
            } else {
                setTimeout(loadSvg, 50);
            }   
        }
    },
    onReload(){
        try{
            document.querySelector(this.$refs.graphContainer.$el).remove();
            
            // 清空
            this.graph.editor.execute("selectAll");
            this.graph.editor.execute("delete");

            // 重新初始化
            this.initGraph();

        } catch(err){

            this.initGraph();

        } finally{
            
            this.renderGraph(this.graph.editor);

        }
    },
    // 图绘制
    renderGraph(editor){
        
        let graph = editor.graph;
        let model = graph.getModel();
        let parent = graph.getDefaultParent();

        model.beginUpdate();
        
        try{
            

            if(!_.isEmpty(window.URL_PARAMS_ITEM)) {
                let doc = mxUtils.parseXml(this.graph.data);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, model);
            } else {
                
                
                let allNodes = _.concat([],this.graph.data.nodes);
                let allEdges = _.concat([],this.graph.data.edges);

                if( this.graph.data['diff'] && 'add' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.add.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.add.edges);
                }

                if( this.graph.data['diff'] && 'del' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.del.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.del.edges);
                }

                allNodes = _.uniqBy(allNodes,'id');
                allEdges = _.uniqBy(allEdges,'id'); 
                
                // 绘制节点
                _.forEach(allNodes,(v)=>{

                    let _type = v._icon || 'matrix';

                    // 可设置默认显示属性
                    let _name =  '';

                    try{
                        if(window.URL_PARAMS_GRAPH){
                            _name = v[window.URL_PARAMS_GRAPH.title];
                        } else {
                            _name = v[this.model.graph.default.title];
                        }
                    } catch(err){
                        _name = v["id"];
                    }

                    // 选择节点渲染模式：icon/shape
                    let imageUrl = this.imageRenderHandler(_type);

                    // icon渲染
                    if(this.graph.control.ifIcon){
                        if(this.checkImgExists(`${_type}.png`)){
                            graph.insertVertex(parent, v.id, _name, 50, 50, 60, 60,`shape=image;html=1;image=${imageUrl};verticalLabelPosition=bottom;verticalAlign=top;`);
                        } else {
                            graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                        }    
                    } 
                    // shape渲染
                    else {
                        graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                    }
                })
                
                // 绘制边
                _.forEach(allEdges,(k,index)=>{
                    
                    let source = model.getCell(k.source);
                    let target = model.getCell(k.target);
                    
                    let baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};html=1;rounded=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;`;
                    let direction = '';

                    if(k.twoway){
                        direction = 'startArrow=block;endArrow=block;endFill=1;';
                    }

                    // edge为path的样式
                    if(k.class === "path"){
                        baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};orthogonalLoop=1;strokeWidth=1;dashed=1;startFill=0;endArrow=none;endFill=0;startArrow=none;orthogonal=1;elbow=vertical;`;
                        let strokeColor = this.model.graph.path.colors[index] || _.sample(this.graph.path.colors);
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction+`strokeColor=${strokeColor}`);
                        return;
                    }

                    
                    try {
                        let edgeName = _.find(this.graph.edges.list,{name:k.class}).remedy;
                        graph.insertEdge(parent, k.id, edgeName, source, target, baseEdgeStyle+direction);
                    } catch(err){
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction);
                    } 
                })
                
            }
            
        }
        finally {
            
            model.endUpdate();    

            this.executeLayout();

            this.onGraphToCenter(true);

        }
    },
    renderAndMergeGraph(editor){
        
        let graph = new mxGraph();
        let parent = graph.getDefaultParent();
        let model = graph.getModel();

        model.beginUpdate();
        
        try{
            

            if(!_.isEmpty(window.URL_PARAMS_ITEM)) {
                let doc = mxUtils.parseXml(this.graph.data);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, model);
            } else {
                
                
                let allNodes = _.concat([],this.graph.data.nodes);
                let allEdges = _.concat([],this.graph.data.edges);

                if( this.graph.data['diff'] && 'add' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.add.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.add.edges);
                }

                if( this.graph.data['diff'] && 'del' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.del.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.del.edges);
                }

                allNodes = _.uniqBy(allNodes,'id');
                allEdges = _.uniqBy(allEdges,'id'); 
                
                // 绘制节点
                _.forEach(allNodes,(v)=>{

                    let _type = v._icon || 'matrix';

                    // 可设置默认显示属性
                    let _name =  '';

                    try{
                        if(window.URL_PARAMS_GRAPH){
                            _name = v[window.URL_PARAMS_GRAPH.title];
                        } else {
                            _name = v[this.model.graph.default.title];
                        }
                    } catch(err){
                        _name = v["id"];
                    }

                    // 选择节点渲染模式：icon/shape
                    let imageUrl = this.imageRenderHandler(_type);

                    // icon渲染
                    if(this.graph.control.ifIcon){
                        if(this.checkImgExists(`${_type}.png`)){
                            graph.insertVertex(parent, v.id, _name, 50, 50, 60, 60,`shape=image;html=1;image=${imageUrl};verticalLabelPosition=bottom;verticalAlign=top;`);
                        } else {
                            graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                        }    
                    } 
                    // shape渲染
                    else {
                        graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                    }
                })
                
                // 绘制边
                _.forEach(allEdges,(k,index)=>{
                    
                    let source = model.getCell(k.source);
                    let target = model.getCell(k.target);
                    
                    let baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};html=1;rounded=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;`;
                    let direction = '';

                    if(k.twoway){
                        direction = 'startArrow=block;endArrow=block;endFill=1;';
                    }

                    // edge为path的样式
                    if(k.class === "path"){
                        baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};orthogonalLoop=1;strokeWidth=1;dashed=1;startFill=0;endArrow=none;endFill=0;startArrow=none;orthogonal=1;elbow=vertical;`;
                        let strokeColor = this.model.graph.path.colors[index] || _.sample(this.graph.path.colors);
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction+`strokeColor=${strokeColor}`);
                        return;
                    }

                    
                    try {
                        let edgeName = _.find(this.graph.edges.list,{name:k.class}).remedy;
                        graph.insertEdge(parent, k.id, edgeName, source, target, baseEdgeStyle+direction);
                    } catch(err){
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction);
                    } 
                })
                
            }
            
        }
        finally {
            
            model.endUpdate();    

            // 合并图
            editor.graph.getModel().mergeChildren(model.getRoot(), parent, true);

    
            this.executeLayout();

            this.onGraphToCenter(true);

        }
    },
    // 图分析 - 子图
    loadSubGraph(node){
        
        let term = "";
        let edgeStr = _.isEmpty(node.edge) ? node.edge : `:${node.edge}`;

        if(node.direction=="out"){
            term = `match ('${node.node.id}') - [${edgeStr}*${node.step}] -> ()`;
        } else{
            term = `match ('${node.node.id}') <- [${edgeStr}*${node.step}] - ()`;
        }

        this.m3.callFS("/matrix/graph/graph_service.js", encodeURIComponent(term)).then( val=>{
            let rtn = val.message[0].graph;

            let allNodes = _.concat([],rtn.nodes);
            let allEdges = _.concat([],rtn.edges);

            if( rtn['diff'] && 'add' in rtn['diff'] ){
                allNodes = _.concat(allNodes, rtn.diff.add.nodes);
                allEdges = _.concat(allEdges, rtn.diff.add.edges);
            }

            if( rtn['diff'] && 'del' in rtn['diff'] ){
                allNodes = _.concat(allNodes, rtn.diff.del.nodes);
                allEdges = _.concat(allEdges, rtn.diff.del.edges);
            }

            this.graph.data.nodes = _.uniqBy(allNodes,'id');
            this.graph.data.edges = _.uniqBy(allEdges,'id');

            this.renderAndMergeGraph(this.graph.editor);

        } );
        
        
    },
    // 右键菜单
    createPopupMenu(editor, graph, menu, cell, evt){
        
        // 节点或边菜单
        if (cell != null){
            
            // cell object
            let id = cell.getId();
            let value = cell.getValue();
            
            // 节点菜单
            if(!cell.edge){
                
                if(!this.m3.auth.isAdmin) return;

                let node = {id: id, value: value, type:'event', cell: cell};

                /* menu.addItem('实体分析', null, ()=>{
                    
                }); */

                /* menu.addItem('实体删除', null, ()=>{
                    this.removeEntityHandler(cell);
                }); */

                // menu.addSeparator();
                
                menu.addItem('节点删除', null, ()=>{
                    this.onDeleteSelectedCells(graph,evt != null && mxEvent.isShiftDown(evt));
                });

                let vars = {};
                let submenuBsearch = null;
                let submenuEsearch = null;
                this.m3.callFS("/matrix/graph/getEdgesByClass.js",encodeURIComponent(id)).then(rtn=>{
                    
                    menu.addSeparator();

                    let edgeListByClass = rtn.message;

                    if(_.find(edgeListByClass,{direction:'out'})){
                        submenuBsearch = menu.addItem('起点查询', null, null);
                    }
                    if(_.find(edgeListByClass,{direction:'in'})){
                        submenuEsearch = menu.addItem('终点查询', null, null);
                    }
                    _.forEach(edgeListByClass,(v,index)=>{
                        
                        if(v.direction == 'out'){
                            
                            vars['submenuBStep'+index] = menu.addItem(v.remedy,null,null,submenuBsearch)
                            let stepCount = Array(6);
                            _.forEach(stepCount,(val,idx)=>{
                                let step = idx + 1;
                                
                                menu.addItem(step + '跳', null, ()=>{
                                    this.loadSubGraph({direction:"out",node:node,step:step,edge:v.name});
                                },vars['submenuBStep'+index]);
                            
                            })
                        } else {
                            vars['submenuEStep'+index] = menu.addItem(v.remedy,null,null,submenuEsearch);
                            let stepCount = Array(6);
                            _.forEach(stepCount,(val,idx)=>{
                                let step = idx + 1;
                                
                                menu.addItem(step + '跳', null, ()=>{
                                    this.loadSubGraph({direction:"in",node:node,step:step,edge:v.name});
                                },vars['submenuEStep'+index]);
                                
                            })
                        }
                        
                    })

                })
                    
                

            } else {
                
                if(!this.m3.auth.isAdmin) return;

                // node = {id: id, value: value, type:'edge', cell: cell};

                /* menu.addItem('实体关系分析', null, ()=>{
                    
                });
                menu.addItem('实体关系删除', null, ()=>{
                    
                });
                menu.addSeparator();

                menu.addItem('新建关系类型', null, ()=>{
                    
                });
                menu.addItem('更新关系类型', null, ()=>{
                    
                });
                
                menu.addSeparator();

                menu.addItem('隐藏边', null, ()=>{
                    
                }); */
            }
        } 
        // 画布菜单
        else {
            
            let submenuLayout = menu.addItem('布局', null, null);

            let submenuLayoutHierarchical = menu.addItem('分层布局', null, null,submenuLayout);
            menu.addItem('上下', null, ()=>{
                this.graph.layout.default = 'hierarchical_vertical';
                this.executeLayout();
            }, submenuLayoutHierarchical);
            menu.addItem('左右', null, ()=>{
                this.graph.layout.default = 'hierarchical_horizontal';
                this.executeLayout();
            }, submenuLayoutHierarchical);

            
            let submenuLayoutTree = menu.addItem('树形布局', null, null,submenuLayout);

            menu.addItem('上下', null, ()=>{
                this.graph.layout.default = 'tree_vertical';
                this.executeLayout();
            }, submenuLayoutTree);
            menu.addItem('左右', null, ()=>{
                this.graph.layout.default = 'tree_horizontal';
                this.executeLayout();
            }, submenuLayoutTree);

            menu.addItem('随机布局', null, ()=>{
                this.graph.layout.default = 'organic';
                this.executeLayout();
            }, submenuLayout);
            menu.addItem('圆形布局', null, ()=>{
                this.graph.layout.default = 'circle';
                this.executeLayout();
            }, submenuLayout);
        }
        
    },
    // 设置布局
    executeLayout(){
        let graph = this.graph.editor.graph;
        let parent = graph.getDefaultParent();
        let layout = this.graph.layout;
        let model = graph.getModel();

        // 布局定义
        if(layout.default === 'hierarchical_vertical'){
            // Layout hierarchical
            model.beginUpdate();
            try {
                layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
                layout.inst.edgeStyle = layout.edgeStyle;
                layout.inst.intraCellSpacing = 80;
                layout.inst.interRankCellSpacing = 80;
                
                layout.inst.execute(parent, null);

            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
            
        } else if(layout.default === 'hierarchical_horizontal'){
            // Layout hierarchical
            model.beginUpdate();
            try {
                layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                layout.inst.edgeStyle = layout.edgeStyle;
                layout.inst.intraCellSpacing = 80;
                layout.inst.interRankCellSpacing = 80;
                
                layout.inst.execute(parent, null);
            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
            
        } else if(layout.default === 'organic'){
            // Layout Organic
            model.beginUpdate();
            try {
                layout.inst = new mxFastOrganicLayout(graph);
                layout.inst.forceConstant = 140;
                //layout.inst.execute(parent);

                layout.inst.execute(parent,null);
            } finally {
                model.endUpdate();
            }
            
        } else if(layout.default === 'tree_vertical'){
            /* Layout tree vertical */
            model.beginUpdate();
            try {
                let tmp = graph.getSelectionCell();
                let roots = null;
                let cells = [tmp];
                
                if ( tmp == null || model.getChildCount(tmp) == 0 ) {
                    if (model.getEdgeCount(tmp) == 0){
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
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
        } else if(layout.default === 'tree_horizontal'){
            /* Layout tree horizontal */
            model.beginUpdate();
            try {
                let tmp = graph.getSelectionCell();
                let roots = null;
                let cells = [tmp];
                
                if (tmp == null || model.getChildCount(tmp) == 0){
                    if (model.getEdgeCount(tmp) == 0){
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
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
        } else {
            /* Layout Circle */
            model.beginUpdate();
            try {
                layout.inst = new mxCircleLayout(graph);
                layout.inst.execute(parent, null);
            } finally {
                model.endUpdate();
            }
        }
        
    },
    // 节点告警状态
    onRefreshCellStatus(){
        
        let graph = this.graph.editor.graph;
        let parent = graph.getDefaultParent();
        
        // 图所有节点
        let cells = _.map(graph.getChildVertices(parent),v=>{
                        return {gid: v.id, name: v.value};
                    });

        this.m3.callFS("/matrix/m3event/graph/graph_imap_data.js", encodeURIComponent(JSON.stringify(cells))).then( rtn=>{
            
            graph.getModel().beginUpdate();

            try {
                
                _.forEach(rtn.message,(v)=>{
                    let id = v.gid;
                    let status = v.status;
                    let cell = graph.getModel().getCell(id);
                    //let state = graph.view.getState(cell);
                    
                    if (cell != null) {
                        
                        // Resets
                        graph.removeCellOverlays(cell);

                        if (status >= 5) {
                            graph.addCellOverlay(cell, this.createOverlayByTip(status, `${id}: 重大告警`));
                        } else if (status >3 && status < 5) {
                            graph.addCellOverlay(cell, this.createOverlayByTip(status, `${id}: 严重告警`));
                        } else {
                            graph.removeCellOverlays(cell);
                        } 
                    
                    }

                })

            } 
            finally {
                graph.getModel().endUpdate();
            }
        } );
    },
    // 节点状态渲染图标
    createOverlayByTip(image, tooltip) {                  
        let overlay = new mxCellOverlay(new mxImage(`/static/assets/images/apps/png/severity/${image}.png`,24,24), tooltip, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_TOP, new mxPoint(-10,15));
        return overlay;
    },
    // 删除选择的节点
    onDeleteSelectedCells(graph,includeEdges){
        // Cancels interactive operations
        graph.escape();
        var cells = graph.getDeletableCells(graph.getSelectionCells());
        
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
    // 节点高亮定位显示
    onCellPosition(row,hFlag,vFlag){
        
        let id = row.entity;
        let editor = this.graph.editor; 
        let graph = editor.graph;
        let cell = graph.getModel().getCell(id);

        try{
            // 根据cell数量决定视图是否缩放
            if(this.graph.data.nodes.length > 10){
                editor.execute("fit");    
            } else {
                editor.execute("actualSize");  
            }
            
            let containerW = graph.container.clientWidth;
            let containerH = graph.container.clientHeight;
            let x =-cell.geometry.x + ( containerW - cell.geometry.width) / 2;
            let y =-cell.geometry.y + ( containerH - cell.geometry.height) / 2;
            
            if( hFlag ){
                x = x / 2;
            }

            if( vFlag ){
                y = y / 2;
            }
            
            graph.getView().setTranslate(x,y);
            graph.scrollCellToVisible(cell);
            graph.setSelectionCells([cell]);

            _.delay(()=>{
                let state = graph.view.getState(cell);
                
                if(this.graph.control.ifIcon){
                    state.shape.node.getElementsByTagName("image")[0].setAttribute('class', 'animated flash');
                } else {
                    state.shape.node.getElementsByTagName("ellipse")[0].setAttribute('class', 'animated flash');
                }
            },500)

            // 选择节点突出显示
            graph.setCellStyles(mxConstants.STYLE_PERIMETER_SPACING, 8, [cell]);
            
        } catch(err){
            
            // 当前画布中不包含该实体
            this.$message({
                type: "info",
                message: "没有该实体 "
            })
        }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 205px)!important;
    }
</style>
