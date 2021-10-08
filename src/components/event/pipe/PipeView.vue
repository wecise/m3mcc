<template>
    <el-container>
        <el-main style="overflow:hidden;">
            <el-tabs v-model="main.activeName" type="border-card" closable @tab-remove="onRemoveMainTab">
                <el-tab-pane label="规则列表" name="table-view">
                    <el-container style="height: calc(100vh - 225px);">
                        <el-aside width="200px" style="background: #f2f2f2;" ref="leftView" v-show="control.tagTree.show">
                            <TagTreeView :model="{domain:'pipe'}" :fun="onRefreshByTag" ref="pipeTagTree"></TagTreeView>
                        </el-aside>
                        <el-container ref="mainView">
                            <el-header style="height:35px;line-height:35px;">
                                <el-row>
                                    <el-col :span="12">
                                        <el-breadcrumb separator=">">
                                            <el-breadcrumb-item>
                                                <el-button type="text" @click="onForward(dfs.root)"><i class="el-icon-s-home"></i> 组</el-button>
                                            </el-breadcrumb-item>
                                            <el-breadcrumb-item  v-for="(item,index) in fullname" :key="index">
                                                <template v-if="index > 0">
                                                    <el-button type="text" @click="onForward(fullname.slice(0,index+1).join('/'))">{{item}}</el-button>
                                                </template>
                                            </el-breadcrumb-item>
                                        </el-breadcrumb>
                                    </el-col>
                                    <el-col :span="12" style="text-align:right;">
                                        <el-tooltip content="切换视图" placement="top">
                                            <el-button type="text" @click="onTogglePanel">
                                                <span :class="control.tagTree.show?'el-icon-s-fold':'el-icon-s-unfold'" style="font-size:17px;"></span>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip content="格子视图" placement="top">
                                            <el-button type="text" @click="showView='grid'" icon="el-icon-picture">
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip content="表格视图" placement="top">
                                            <el-button type="text" @click="showView='table'" icon="el-icon-menu">
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip content="新建接入组" placement="top">
                                            <el-button type="text" icon="el-icon-folder-add" @click="onNewGroup(null,null)" style="padding-left:5px;"></el-button>
                                        </el-tooltip>
                                        <el-tooltip content="新建接入" placement="top">
                                            <el-button type="text" icon="el-icon-plus" @click="onNewPipe(null,null)" style="padding-left:5px;"></el-button>
                                        </el-tooltip>
                                        <el-tooltip content="刷新" placement="top">
                                            <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
                                        </el-tooltip>
                                        <el-tooltip content="导出">
                                            <el-dropdown @command="onExport">
                                                <span class="el-dropdown-link">
                                                    <i class="el-icon-download el-icon--right"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item command="csv">CSV</el-dropdown-item>
                                                    <el-dropdown-item command="json">JSON</el-dropdown-item>
                                                    <!--el-dropdown-item command="pdf">PDF</el-dropdown-item-->
                                                    <el-dropdown-item command="png">PNG</el-dropdown-item>
                                                    <!--el-dropdown-item command="sql">SQL</el-dropdown-item-->
                                                    <el-dropdown-item command="xls">XLS (Excel 2000 HTML format)</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </el-header>
                            <el-main v-if="showView=='table'">
                                <el-table
                                    :data="dt.rows"
                                    :highlight-current-row="true"
                                    stripe
                                    style="width: 100%;"
                                    :row-class-name="rowClassName"
                                    ref="table"
                                    v-if="dt.columns.length>0">
                                    
                                    <template v-for="(item,index) in dt.columns">
                                        <el-table-column
                                            sortable 
                                            show-overflow-tooltip
                                            :key="index"
                                            :prop="item.field"
                                            :label="item ? item.title : ''"
                                            :width="item.width"
                                            v-if="item.visible">
                                                <template slot-scope="scope">
                                                    <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                                        v-if="typeof item.render === 'function'">
                                                    </div>
                                                    <div v-else>
                                                        <span v-if="item.field=='name'">
                                                            {{scope.row[item.field].split(".")[0]}}
                                                        </span>
                                                        <span v-else>
                                                            {{scope.row[item.field]}}
                                                        </span>
                                                    </div>
                                                </template>
                                        </el-table-column>
                                    </template>
                                    <el-table-column label="标签" prop="tags" width="200">
                                        <template slot-scope="scope">
                                            <TagView domain='pipe' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="160">
                                        <template slot="header">
                                            <el-input
                                            v-model="dt.term"
                                            size="mini"
                                            clearable
                                            placeholder="输入关键字搜索"/>
                                        </template>
                                        <template slot-scope="scope">
                                            <el-tooltip content="新建接入组" placement="top">
                                                <el-button type="text" @click="onNewGroup(scope.row, scope.$index)" icon="el-icon-folder-add"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="新建接入" placement="top">
                                                <el-button type="text" @click="onNewPipe(scope.row, scope.$index)" icon="el-icon-plus"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="编辑接入" placement="top">
                                                <el-button type="text" icon="el-icon-edit"  @click="onUpdatePipe(scope.row,scope.$index)" v-if="scope.row.ftype!=='dir'"></el-button>
                                            </el-tooltip>
                                            <el-tooltip content="删除接入" placement="top">
                                                <el-button type="text" @click="onDeletePipe(scope.row, scope.$index)" icon="el-icon-delete"></el-button>
                                            </el-tooltip>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div style="background:#ffffff;padding:20px;height:100%;display:block;text-align:center;" v-else>
                                    <h2 style="margin: 0px 0px 40px 0px;">欢迎使用接入管理</h2>
                                    <p>
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-office-building" style="font-size:48px;"></i> <p>数据接入</p>
                                        </el-button>
                                        
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-postcard" style="font-size:48px;"></i> <p>流程设计</p>
                                        </el-button>
                                    
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-s-data" style="font-size:48px;"></i> <p>执行监控</p>
                                        </el-button>
                                    
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-money" style="font-size:48px;"></i> <p>输出管理</p>
                                        </el-button>
                                    </p>
                                    <object data="/fs/assets/images/files/svg/configWorld.svg?type=open&issys=true" 
                                        type="image/svg+xml" style="width:40vw;height:40vh;background: #ffffff;">
                                    </object>
                                    <p>
                                        如有任何意见或建议，请及时反馈给我们。
                                        <el-link href="mailto:m3@wecise.com">Email：m3@wecise.com</el-link>
                                    </p>
                                </div>
                            </el-main>
                            <el-main v-else>
                                <el-checkbox-group v-model="dt.selected" class="pipe-grid-node" v-if="dt.columns.length>0">
                                    <el-button type="default" 
                                            style="max-width: 12em;width: 12em;height:110px;border-radius: 10px!important;margin: 5px;border: unset;box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.05);"
                                            @dblclick.native="onForward(item.fullname)"
                                            @click="onTriggerClick(item)"
                                            :key="item.id"
                                            v-for="item in dt.rows">
                                            <i class="el-icon-folder" style="font-size:48px;margin:5px;color:#FF9800;" v-if="item.ftype=='dir'"></i>
                                            <i class="el-icon-cpu" style="font-size:48px;margin:5px;color:#FF9800;" v-else></i>
                                            <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:5px;text-align:center;">
                                                {{item.name.split(".")[0]}}
                                            </p>
                                            <el-checkbox :label="item" :ref="'checkBox_'+item.id"></el-checkbox>
                                    </el-button>
                                </el-checkbox-group>
                                <div style="background:#ffffff;padding:20px;height:100%;display:block;text-align:center;" v-else>
                                    <h2 style="margin: 0px 0px 40px 0px;">欢迎使用接入管理</h2>
                                    <p>
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-office-building" style="font-size:48px;"></i> <p>数据接入</p>
                                        </el-button>
                                        
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-postcard" style="font-size:48px;"></i> <p>流程设计</p>
                                        </el-button>
                                    
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-s-data" style="font-size:48px;"></i> <p>执行监控</p>
                                        </el-button>
                                    
                                        <el-button style="width:100px;height:90px;">
                                            <i class="el-icon-money" style="font-size:48px;"></i> <p>输出管理</p>
                                        </el-button>
                                    </p>
                                    <object data="/fs/assets/images/files/svg/configWorld.svg?type=open&issys=true" 
                                        type="image/svg+xml" style="width:40vw;height:40vh;background: #ffffff;">
                                    </object>
                                    <p>
                                        如有任何意见或建议，请及时反馈给我们。
                                        <el-link href="mailto:m3@wecise.com">Email：m3@wecise.com</el-link>
                                    </p>
                                </div>
                            </el-main>
                            <el-footer style="height:30px;line-height:30px;">
                                {{ info.join(' &nbsp; | &nbsp;') }}
                            </el-footer>
                        </el-container>
                    </el-container>
                </el-tab-pane>
                <el-tab-pane :key="tab.id" :name="tab.name"  v-for="tab in main.tabs">
                    <span slot="label">
                        <i class="el-icon-files" style="color:rgb(64, 158, 255);"></i> {{tab.name.split(".")[0]}}
                        <el-dropdown trigger="click">
                            <span class="el-dropdown-link">
                                <i class="el-icon-arrow-down"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onTabClose(0,tab)" divided>关闭</el-dropdown-item>
                                <el-dropdown-item @click.native="onTabClose(1,tab)">关闭其它标签页</el-dropdown-item>
                                <el-dropdown-item @click.native="onTabClose(2,tab)">关闭右侧标签页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                    <DesignView :model="tab"></DesignView>
                </el-tab-pane>
            </el-tabs>
        </el-main>
        
    </el-container>
</template>

<script>
    import _ from 'lodash';
    import DesignView from './DesignView';
    import TagView from '../tags/TagView';
    import TagTreeView from '../tags/TagTreeView';

    export default{
        name: 'PipeView',
        props: {
            model: Object,
            global: Object
        },
        components:{
            TagView,
            DesignView,
            TagTreeView
        },
        data() {
            return {
                dt:{
                    rows:[],
                    columns: [],
                    selected: [],
                    term: ""
                },
                info: [],
                dfs: {
                    root: `/script/matrix/m3event/pipe/view`,
                    path: `/script/matrix/m3event/pipe/view`
                },
                showView: 'table',
                control: {
                    tagTree: {
                        show: false
                    }
                },
                main: {
                    tabs: [],
                    activeName: "table-view"
                }
            }
        },
        watch: {
            dt: {
                handler(){
                    this.info = [];
                    this.info.push(`共 ${this.dt.rows.length} 项`);
                    this.info.push(this.moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
                },
                deep:true,
                immediate:true
            },
            'dt.term':{
                handler(val){
                    if(_.isEmpty(val)){
                        this.initData();
                    } else {
                        this.dt.rows = this.dt.rows.filter(data => !val || data.name.toLowerCase().includes(val.toLowerCase()));
                    }
                }
            }
        },
        computed: {
            fullname(){
                return _.concat([""],_.xor(this.dfs.root.split("/"), this.dfs.path.split("/")));
            }
        },
        created(){
            this.initData();

            // 默认边栏显示状态
            this.control.tagTree.show = (localStorage.getItem("PIPE-TAG-TREE-IFSHOW") == 'true');
        },
        mounted(){
            
        },
        methods: {
            rowClassName({rowIndex}){
                return `row-${rowIndex}`;
            },			
            onTogglePanel(){
                this.control.tagTree.show = !this.control.tagTree.show;

                localStorage.setItem("PIPE-TAG-TREE-IFSHOW",this.control.tagTree.show);
            },
            onRefreshByTag(){

            },
            onTriggerClick(item){
                this.$refs['checkBox_'+item.id][0].$el.click();
            },
            initData(){
                
                this.m3.callFS("/matrix/m3event/pipe/getPipeList.js").then( (val)=>{
                    let rtn = val.message;

                    this.dt.rows = rtn.rows;
                
                    _.extend(this.dt, {columns: _.map(rtn.columns, (v)=>{
                                            
                        if(_.isUndefined(v.visible)){
                            _.extend(v, { visible: true });
                        }

                        if(!v.render){
                            return v;
                        } else {
                            return _.extend(v, { render: eval(v.render) });
                        }
                        
                    })});
                }); 
            },
            onForward(fullname){

                this.m3.callFS("/matrix/m3event/pipe/getChildPipeList.js", encodeURIComponent(fullname) ).then(rtn=>{
                    this.dt.rows = rtn.message;
                    if(fullname){
                        this.dfs.path = fullname;
                        this.fullname = _.concat([""],_.xor(this.dfs.root.split("/"), this.dfs.path.split("/")))
                    } else {
                        this.dfs.path = [this.dfs.root];
                    }
                });
            },
            onRefresh(){
                this.initData();
            },
            onExport(){
                
            },
            onNewGroup(){

                this.$prompt('请输入接入组名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    }).then(({ value }) => {

                    if(_.isEmpty(value)){
                        this.$message({
                            type: 'info',
                            message: '请输入接入组名称！'
                        });
                        return false;
                    }

                    let ftype = "dir";
                    let parent = this.dfs.root;
                    let content = "";
                    let attr = {remark: ''};
                    let index = true;

                    let param = {
                        parent: parent, name: value, 
                        data: {content: content, ftype: ftype, attr: attr, index: index}
                    };

                    this.m3.dfsNew(param).then(()=>{
                        this.$message({
                            type: "success",
                            message: "新建接入组成功 " + value
                        })  
                        this.initData();
                    }).catch((err)=>{
                        this.$message({
                            type: "error",
                            message: "新建接入组失败 " + err.message
                        })
                    })
                })

            },
            onNewPipe(row){
                
                this.$prompt('请输入接入名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    }).then(({ value }) => {
                    
                    if(_.isEmpty(value)){
                        this.$message({
                            type: 'info',
                            message: '请输入接入名称！'
                        });
                        return false;
                    }

                    let ftype = "json";
                    let parent = this.dfs.root;
                    let content = "";
                    let attr = {remark: ''};
                    let index = index;

                    if(row){
                        parent = row.fullname;
                    }

                    let param = {
                        parent: parent, name: [value,ftype].join("."), 
                        data: {content: content, ftype: ftype, attr: attr, index: index}
                    };

                    this.m3.dfsNew(param).then(()=>{
                        this.$message({
                            type: "success",
                            message: "新建接入成功 " + value
                        })  
                        this.initData();
                    }).catch((err)=>{
                        this.$message({
                            type: "error",
                            message: "新建接入失败 " + err.message
                        })
                    })
                })
            },
            onDeletePipe(row,index){
                this.$confirm(`确认要删除规则：${row.name}？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    this.m3.callFS("/matrix/m3event/pipe/deletePipeById.js", encodeURIComponent(row.id)).then( (rtn)=>{
                        if( rtn.status == 'ok' ){
                            this.$message({
                                type: "success",
                                message: "删除成功！"
                            });        

                            this.dt.rows.splice(index, 1);

                        } else {
                            this.$message({
                                type: "error",
                                message: "删除失败：" + rtn.message
                            });        
                        }
                    } );
                    
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消删除操作！"
                    });
                });
            },
            // 标签操作 
            onTabClose(key,tab){
                
                if(key === 0){
                    this.onRemoveMainTab(tab.name);
                } else if( key === 1 ){
                    let others = _.xor(this.main.tabs,[tab]);
                    _.forEach(others,(v)=>{
                        this.onRemoveMainTab(v.name);
                    })
                } else {
                    let others = this.main.tabs.slice(_.indexOf(this.main.tabs,tab) + 1, this.main.tabs.length);
                    _.forEach(others,(v)=>{
                        this.onRemoveMainTab(v.name);
                    })
                }
            },
            // 编辑规则
            onUpdatePipe(row){
                if( _.find(this.main.tabs,{id: row.id}) ){
                    this.main.activeName = row.name;    
                } else {
                    this.main.activeName = row.name;
                    this.main.tabs.push(row);
                }

            },
            // 关闭编辑规则
            onRemoveMainTab(targetName){
                try{                                
                    
                    let tabs = this.main.tabs;
                    let activeName = this.main.activeName;

                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }
                    
                    this.main.tabs = tabs.filter(tab => tab.name !== targetName);
                    
                    if(this.main.tabs.length == 0){
                        this.main.activeName = "table-view";    
                    } else {
                        this.main.activeName = activeName;
                    }
                    
                } catch(err){
                    console.error(err);
                } 
            }
        }
}
</script>
<style scoped>

</style>

<style>
    .pipe-grid-node .el-checkbox__label{
        display: none;
    }
</style>