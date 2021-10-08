<template>
  
    <el-container style="height:calc(100vh - 115px);background:#f2f2f2;">
        <el-main style="padding:0px;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0">
                    <el-container style="height:100%;">
                        <el-header style="line-height:60px;">
                            <span>菜单设计</span>
                            <span style="float:right;">
                                <el-button type="default" @click="onLoad" icon="el-icon-refresh">刷新</el-button>
                                <el-button type="success" @click="onNew(null,$event)" icon="el-icon-plus">新建</el-button>
                            </span>
                        </el-header>
                        <el-main>
                            <draggable
                                :list="tree.list"
                                class="list-group"
                                ghost-class="ghost"
                                @start="dragging = true"
                                @end="onDragEnd"
                                handle=".handle">
                                <div
                                    class="list-group-item"
                                    v-for="(element,index) in tree.list"
                                    :key="element.name"
                                    @click="onTreeNodeClick(element)">
                                    <span class="handle" style="line-height:30px;">
                                        <span class="el-icon-s-grid"></span>&nbsp;&nbsp;
                                        <span v-if="element.type==='divider'">---</span>
                                        <span v-else>{{element.name}}</span>
                                    </span>
                                    <el-button type="text" icon="el-icon-close" @click.stop="onDelete(element)" style="float:right;padding-left:10px;"></el-button>
                                    <el-tooltip content="添加分隔符">
                                        <el-button type="text" icon="el-icon-minus" @click.stop="onAppendDivider(index)" style="float:right;"></el-button>
                                    </el-tooltip>
                                     <nested-draggable :tasks="element.subMenu" v-if="element.type==='dir'"></nested-draggable>
                                </div>
                            </draggable>
                        </el-main>
                    </el-container>  
                </SplitArea>
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                    <el-container style="height:100%;">
                        <el-header style="line-height:60px;">
                            <span>效果预览</span>
                        </el-header>
                        <el-main>

                            <ul class="v-context">
                                <li>
                                    <el-link :underline="false"> 
                                        <span> z0000000000060znkhAEhdgY1mEJ48jwebtQR</span>
                                        <span style="position: absolute;top: 4px;left: 10px;">
                                            <el-button
                                                type="default"
                                                :style="'padding: 3px;border-radius: 15px;color:#ffffff;background:'+ global.register.event.severity[5][2]">
                                            </el-button>
                                        </span>
                                    </el-link>
                                </li>
                                <template v-for="(menu,index) in tree.list">

                                    <li :key="index" class="tool-item">

                                        <el-link :underline="false" v-if="menu.type==='component'"> 
                                            {{ menu.name }}
                                        </el-link>
                                        
                                        <el-link :underline="false" v-else-if="menu.type==='action'">
                                            {{ menu.name }}
                                        </el-link>
                                        
                                        <el-link :underline="false" v-else-if="menu.type==='attachment'">
                                            {{ menu.name }}
                                        </el-link>

                                        <el-link :underline="false" v-else-if="menu.type==='url'">
                                            {{ menu.name }}
                                        </el-link>

                                        <!-- <div style="height:40px;line-height:40px;" v-else-if="menu.name && menu.type==='tag'" >
                                            <TagView domain='event' :model.sync="data.tags" :id="data.id" :limit="4"></TagView>
                                        </div> -->

                                        <el-divider v-else-if="menu.type==='divider'"></el-divider>

                                    </li>
                                </template>
                            </ul>
                        </el-main>
                    </el-container>  
                </SplitArea>
                <SplitArea :size="50" :minSize="0" style="overflow:hidden;">
                    
                    <el-container style="height:calc(100vh - 55px);">
                        <el-header style="line-height:60px;">
                            <span>内容编辑</span>
                        </el-header>
                        <el-main>
                            <el-form ref="form" :model="form.data" label-width="80px" v-if="form.data">
                                <el-form-item label="名称">
                                    <el-input v-model="form.data.name"></el-input>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-radio-group v-model="form.data.type" disabled>
                                        <el-radio-button label="component">组件</el-radio-button>
                                        <el-radio-button label="action">动作</el-radio-button>
                                        <el-radio-button label="url">URL</el-radio-button>
                                        <el-radio-button label="attachment">附件</el-radio-button>
                                        <el-radio-button label="tags">标签</el-radio-button>
                                        <el-radio-button label="dir">菜单目录</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <template v-if="form.data.type=='component'">
                                    <el-form-item label="组件">
                                        <el-radio-group v-model="form.data.component.name" size="small">
                                            <el-radio :label="cp.component.name" border v-for="cp in component.list" :key="cp.id">{{cp.name}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </template>
                                <template v-if="form.data.type=='url'">
                                    <el-form-item label="URL">
                                        <el-input v-model="form.data.url.value"></el-input>
                                    </el-form-item>
                                    <el-form-item label="打开方式">
                                        <el-radio-group v-model="form.data.url.target">
                                            <el-radio label="_top">当前窗口打开</el-radio>
                                            <el-radio label="_blank">新窗口打开</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="参数">
                                        <el-input v-model="form.data.url.param"></el-input>
                                    </el-form-item>
                                </template>
                                 <template v-if="form.data.type=='action'">
                                    <el-form-item label="动作编辑">
                                        <VueEditor
                                            v-model="form.data.action.name"
                                            @init="onEditorInit"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="100%"
                                            height="30vh"
                                        ></VueEditor>
                                    </el-form-item>
                                    <el-form-item label="参数">
                                        <el-input v-model="form.data.action.value"></el-input>
                                    </el-form-item>
                                 </template>
                                <el-form-item>
                                    <el-button type="primary" @click="onUpdate">更新</el-button>
                                </el-form-item>
                                </el-form>
                        </el-main>
                        <el-footer>

                        </el-footer>
                    </el-container>
                    
                </SplitArea>
            </Split>

            <el-dialog title="新建右键工具" 
                :visible.sync="dialog.new.show"
                :show-close="false"
                :close-on-press-escape="true"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                v-if="dialog.new.show"
                custom-class="contextmenu-dialog">
                新建类型
                <p>
                    <el-radio-group v-model="dialog.new.type">
                        <!-- <el-radio-button label="component">组件</el-radio-button> -->
                        <el-radio-button label="action">动作</el-radio-button>
                        <el-radio-button label="url">URL</el-radio-button>
                        <!-- <el-radio-button label="attachment">附件</el-radio-button>
                        <el-radio-button label="tags">标签</el-radio-button> -->
                        <!-- <el-radio-button label="dir">菜单目录</el-radio-button> -->
                    </el-radio-group>
                </p>
                <el-form :model="dialog.new.data" :rules="dialog.new.rules" ref="newDataForm" label-position="top" v-if="dialog.new.data" style="padding-bottom:20px;">
                    <el-form-item label="名称" required v-if="dialog.new.type !== 'divider'">
                        <el-input v-model="dialog.new.data.name" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <template v-if="dialog.new.data.type=='component'">
                        <el-form-item label="组件">
                            <el-radio-group v-model="dialog.new.data.component.name" size="small">
                                <el-radio :label="cp.id" border v-for="cp in component.list" :key="cp.id">{{cp.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <template v-else-if="dialog.new.data.type=='url'">
                        <el-form-item label="URL">
                            <el-input v-model="dialog.new.data.url.value"></el-input>
                        </el-form-item>
                        <el-form-item label="打开方式">
                            <el-radio-group v-model="dialog.new.data.url.target">
                                <el-radio label="_top">当前窗口打开</el-radio>
                                <el-radio label="_blank">新窗口打开</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="参数">
                            <el-input v-model="dialog.new.data.url.param"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else-if="dialog.new.data.type === 'action'">
                        <el-form-item label="动作编辑">
                            <VueEditor
                                v-model="dialog.new.data.action.name"
                                @init="onEditorInit"
                                :lang="editor.lang.value"
                                :theme="editor.theme.value"
                                width="100%"
                                height="15vh"
                            ></VueEditor>
                        </el-form-item>
                        <el-form-item label="URL参数">
                            <el-input v-model="dialog.new.data.action.param"></el-input>
                        </el-form-item>
                    </template>
                    
                    <el-form-item style="float: right;">
                        <el-button @click="dialog.new.show = false">取 消</el-button>
                        <el-button type="primary" @click="onSave(dialog.new.data)">确 定</el-button>    
                    </el-form-item>    
                </el-form>
                
            </el-dialog>
        </el-main>
        
    </el-container>
  
</template>

<script>
import _ from 'lodash';
import draggable from 'vuedraggable';

export default {
  name: "EditView",
  props: {
      model: Object,
      global: Object
  },
  components:{
    VueEditor: require("vue2-ace-editor"),
    draggable
  },
  data() {
    return {
        auth: null,
        tree:{
            defaultProps: {
                children: 'subMenu',
                label: 'name'
            },
            list: [],
            json: ""
        },
        form: {
            data: null
        },
        editor: {
            lang: {
                value: "toml",
                list: []
            },
            theme: {
                value: "chrome",
                list: this.m3.EDITOR_THEME
            }
        },
        component:{
            list: []
        },
        dialog: {
            new:{
                show: false,
                type: "url",
                data: null,
                rules: {
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                }
            }
        }
    };
  },
  watch:{
      'tree.list':{
          handler(val){
              this.tree.json = JSON.stringify(val,null,2);
              //this.$refs.jsonStr.editor.resize();
          }
      },
      'dialog.new.type':{
          handler(val){
              this.dialog.new.data = this.m3.EventViewTools[val];
          },
          immediate:true
      }
  },
  created(){
    this.onLoad();
    this.auth = this.m3.auth.signedUser;
  },
  methods: {
    onMouseEnter(data){
        this.$set(data, 'show', true);
        this.$refs.tree.setCurrentKey(data.key);
    },
    onMouseLeave(data){
        this.$set(data, 'show', false)
    },
    onTreeNodeClick(data){
        if(data.type === 'divider') return false;
        this.form.data = data;
    },
    onEditorInit(){
        require("brace/ext/language_tools"); //language extension prerequsite...
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    onNew(){
        this.dialog.new.show = true;
        this.dialog.new.data = null;
        this.dialog.new.data = this.m3.EventViewTools[this.dialog.new.type];
    },
    onSave(val){
        
        let data = this.m3.EventViewTools[val.type];
        this.tree.list.push(_.extend(data,{
                                id: _.now(),
                                name: this.dialog.new.data.type==='divider'?_.now():val.name
                            }));
        this.tree.list = _.uniqBy(this.tree.list, 'name');
        this.dialog.new.show = false;

        this.saveHandler(this.tree.list);
    },
    onUpdate(){
        this.saveHandler(this.tree.list);
    },
    onDelete(data){

        this.$confirm(`确定要删除该菜单项【${data.type==='divider'?'分隔符':data.name}】, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
        
            this.tree.list = _.xor(this.tree.list, [data]);

            this.saveHandler(this.tree.list);

        }).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除'
            });          
        })

    },
    onLoad(){
        this.m3.callFS("/matrix/m3event/contextmenu/getContextMenu.js").then( rtn=>{
            this.tree.list = rtn.message;
        });

        this.m3.dfsRead({parent:"/script/matrix/m3event/tools", name:"tools.json"}).then( rtn=>{
            this.component.list = rtn.message;
        })
    },
    onDragEnd(){
        this.dragging = false;

        this.saveHandler(this.tree.list);
    },
    saveHandler(data){

        let content = JSON.stringify(data,null,2);
    
        let param = {
                        parent: "/script/matrix/m3event/contextmenu", name: "context-menu.json", 
                        data: { content: content, type: 'json', attr: '', index: true }    
                    };
        
        this.m3.dfsWrite(param).then(()=>{
            this.$message({
              type: "success",
              message: "更新成功"
            })  
        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "更新失败 " + err.message
            })
        })
    },
    onAppendDivider(index){
        let data = this.m3.EventViewTools['divider'];
        this.tree.list.splice(index+1,0,_.extend(data,{
                                id: _.now(),
                                name: _.now()
                            }));
        this.tree.list = _.uniqBy(this.tree.list, 'name');
        
        this.saveHandler(this.tree.list);
    },
    onEdit(){

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .ace_editor {
        border: 1px solid #ddd;
    }

    .el-radio--small.is-bordered {
        width: 10em;
        margin: 10px;
    }

    .list-group {
        display: -ms-flexbox;
        display: -webkit-box;
        display: flex;
        -ms-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        padding-left: 0;
        margin-bottom: 0;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    
    .list-group {
        min-height: 20px;
        border: 1px dashed #999;
    }

    .list-group-item:first-child {
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    
    .list-group-item {
        position: relative;
        display: block;
        padding: .75rem 1.25rem;
        margin-bottom: -1px;
        background-color: #fff;
        border-bottom: 2px dashed #999;
    }

    .list-group-item:hover {
        background: #f2f2f2;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    
    .list-group-item {
        cursor: pointer;
    }

    .v-context, .v-context ul {
        background-color: #fff;
        background-clip: padding-box;
        border-radius: .25rem;
        border: 1px solid rgba(0,0,0,.15);
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        display: block;
        margin: 0;
        padding: 10px 0;
        min-width: 10rem;
        z-index: 1500;
        position: fixed;
        list-style: none;
        box-sizing: border-box;
        max-height: calc(100% - 50px);
        overflow-y: auto;
    }
    .v-context>li, .v-context ul>li {
        margin: 0;
        position: relative;
    }

    .v-context>li>a, .v-context ul>li>a {
        display: block;
        padding: .5rem 1.5rem;
        font-weight: 400;
        color: #212529;
        text-decoration: none;
        white-space: nowrap;
        background-color: transparent;
        border: 0;
    }
    .v-context>li, .v-context ul>li {
        margin: 0;
        position: relative;
    }
    .v-context>li .el-divider--horizontal {
        margin: 0;
    }
</style>

<style>
.contextmenu-dialog.el-dialog{
    width :65vw!important;
    height:70vh;
}
</style>
