<template>  

    <el-tabs value="info" v-if="view.model" type="border-card">
        <el-tab-pane name="info" v-if="view.model.info">
            <h3 slot="label">
                1、基本信息<small> 设置视图名称和描述信息</small>
            </h3>
            <el-form ref="form" :model="view.model.info" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="view.model.info.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="6" v-model="view.model.info.attr.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <TagView domain='dashview' :model.sync="view.model.info.tags" :id="view.model.info.id" :limit="4"></TagView>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelete(model)" :loading="view.loading">删除视图</el-button>
                    <el-button type="success" @click="onApplyInfo" :loading="view.loading">应用</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane name="datasource" v-if="view.model.datasource">
            <h3 slot="label">
                2、选择数据源<small> 选择数据源</small>
            </h3>
            <el-container>
                <el-main>
                    <el-form ref="form" :model="view.model.datasource" label-width="80px">
                        <el-form-item label="数据源">
                            <el-input v-model="view.model.datasource.class" disabled>
                                <el-dropdown slot="prepend">
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-coin el-icon--right" style="cursor:pointer;"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <ActionView :root="datasource.root" 
                                            @node-click="onDataSourceSelect"
                                            @treedata-loaded="initDataSourceFields"></ActionView>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="返回记录数">
                            <el-input-number v-model="view.model.datasource.top" controls-position="right"></el-input-number> <span style="color:#999999;font-size: 10px;">视图最大返回记录数量</span>
                        </el-form-item>
                        <el-form-item label="过滤条件">
                            <div style="color:#999999;background: #f2f2f2;border: 1px solid #ddd;padding: 0 20px;font-size: 10px;">过滤条件可参考一键搜索语法，示例：severity>=3 | status=10 | print id,name,class</div>
                            <VueEditor
                                v-model="view.model.datasource.filter"
                                @init="onEditorInit"
                                :lang="text"
                                :theme="editor.theme.value"
                                width="100%"
                                height="20vh"
                                style="border:1px solid #f2f2f2;border-left: unset;"
                                ref="datasourceEditor"
                            ></VueEditor>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onTestDataSource" :loading="editor.loading">测试数据源</el-button>
                            <!-- <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用</el-button> -->
                            <el-button @click="onClose">取消</el-button>
                        </el-form-item>
                        <el-form-item label="数据结果" v-if="editor.data">
                            <TableView :model="editor.data"></TableView>
                        </el-form-item>
                    </el-form>
                </el-main>
                <el-footer style="line-height:60px;text-align: center;">
                    <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-footer>
            </el-container>
        </el-tab-pane>
        <el-tab-pane name="props" v-if="view.model.datasource">
             <h3 slot="label">
                3、显示定义<small> 根据所选数据源列出属性，选择需要显示的属性,调整属性显示顺序</small>
            </h3>
             <el-container>
                <el-main>
                    <TransferView 
                        :data="datasource.fields" 
                        :selected="view.model.datasource.fields"
                        @selected-change="((data)=>{ this.view.model.datasource.fields = data; })"
                        @order-change="(()=>{ this.onApplyDataSource(); })"
                        :titles="['选择属性生成显示视图', '已选属性']"
                        :button-texts="['取消选择', '选择属性']"
                        v-if="datasource.fields"></TransferView>
                </el-main>
                <el-footer style="line-height:60px;text-align: center;">
                    <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-footer>
            </el-container>
        </el-tab-pane>
    </el-tabs>
    

</template>

<script>
import _ from 'lodash';
import TableView from './TableView';
import ActionView from './ActionView';
import TagView from '../tags/TagView';
import TransferView from './TransferView';

export default {
  name: "EditView",
  props: {
    model: Object
  },
  components:{
    TableView,
    ActionView,
    VueEditor: require("vue2-ace-editor"),
    TagView,
    TransferView
  },
  data() {
    return {
        view: {
            loading: false,
            activeName: "",
            model: {
                datasource: {
                    fields:[]
                }
            }
        },
        editor: {
            term: "",
            data: null,
            loading: false,
            lang: {
                value: "javascript",
                list: []
            },
            theme: {
                value: "chrome",
                list: this.m3.EDITOR_THEME
            }
        },
        datasource:{
            root: "/matrix/devops",
            loading: false,
            fields: []
        }
    };
  },
  watch:{
     model:{
         handler(){
             this.initData();
         },
         immediate: true
     }
  },
  methods: {
    initData(){
        let param = encodeURIComponent(JSON.stringify({  action: "read", data: this.model }));
        this.m3.callFS("/matrix/m3event/view/action.js", param).then((rtn)=>{
            this.view.model = JSON.parse(rtn.message);
            this.view.model.info = _.cloneDeep(this.model);
            this.view.model.info.name = this.view.model.info.name.split(".")[0];

            this.initFileInfo();


        }).catch((err)=>{
            console.log(err);
            this.view.model = null;
        })
    },
    initFileInfo(){
        try{
            
            // 初始化attr
            if(_.isEmpty(this.view.model.info.attr)){
                _.extend(this.view.model.info, {attr:  {remark: "", icon: ""} });   
            } else {
                _.extend(this.view.model.info, {attr: JSON.parse(this.view.model.info.attr)});   
            }

        } catch(err){
            console.log(err)
             _.extend(this.view.model.info, {attr:  {remark: "", icon: ""} });   
        }
    },
    initDataSourceFields(treeData){

        if(!this.view.model) return false;

        try{
            
            let find = (nodes)=>{
                
                _.forEach(nodes,(v)=>{
                    
                    if(this.view.model.datasource.class == v.class){
                        if(v.fields){
                            this.datasource.fields = _.compact(_.map(v.fields,(val)=>{
                                if(_.includes(val,'_')) return;  

                                return {field: val, title: val, ftype: 'varchar', width:120, visible:true};//{key:val, label:val};
                                
                            }));
                        }
                    }

                    if(v.children){
                        find(v.children);
                    }
                })
                
            };
            
            find(treeData);            

        } catch(err){
            console.log(err)
        } finally{
            // 已经做了排序
            /* if(!_.isEmpty(this.view.model.datasource.fields.value)){
                _.forEach(this.view.model.datasource.fields.data,v=>{
                    let index = _.findIndex(this.datasource.fields,{field: v.field});
                    this.datasource.fields.splice(index, 1, v);
                })
            } */
            // 还没有排序
            
        }
    },
    onApplyInfo(){
        this.onApplyName();
    },
    /* 设置视图名称 */
    onApplyName(){

        this.view.loading = true;

        // update name
        let param = {
                srcpath: this.model.fullname, 
                dstpath: [this.view.model.info.parent,[this.view.model.info.name, this.view.model.info.ftype].join(".")].join("/")
            };
        
        if(param.srcpath == param.dstpath){
            this.view.loading = false;
            this.onApplyAttr();
            return false;
        }

        this.m3.dfsRename(param).then(()=>{
            this.view.loading = false;
            this.$message({
                type: 'success',
                message: '更新名称成功'
            })
            this.onApplyAttr();
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })
            this.view.loading = false;
        })
    },
    /* 设置视图备注 */
    onApplyAttr(){
        this.view.loading = true;
        
        if(JSON.stringify(this.view.model.info.attr) === this.model.attr){
            this.view.loading = false;
            return false;
        }

        // update attr
        let attr = {
            parent: this.view.model.info.parent, 
            name: [this.view.model.info.name, this.view.model.info.ftype].join("."),
            attr: JSON.stringify(this.view.model.info.attr)
        };

        this.m3.dfsUpdateAttr(attr).then(()=>{
            
            this.$message({
                type: 'success',
                message: '更新备注成功'
            })

            this.view.loading = false;
            
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })    
            this.view.loading = false;
        })
    },
    onClose(){
        this.$emit('dialog:close');
    },
    onEditorInit(){
        require("brace/ext/language_tools"); //language extension prerequsite...
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    /* 测试数据源 */
    onTestDataSource(){

        this.editor.loading = true;

        let term = this.$refs.datasourceEditor.editor.getValue();//this.view.model.datasource.filter;
        let param = encodeURIComponent(JSON.stringify({  datasource: this.view.model.datasource, term: term }));
        
        this.m3.callFS("/matrix/m3event/view/datasourceTest.js", param).then((rt)=>{
            
            this.editor.data = rt.message;

            this.editor.loading = false;

        }).catch((err)=>{
            console.log(err);
            this.editor.loading = false;
        })
    },
    /* 数据源选择切换 */
    onDataSourceSelect(data){

        let setData = ()=>{
            this.view.model.datasource.name = `${data.class}/${_.now()}`
            this.view.model.datasource.class = data.class;
            
            this.m3.getClassFieldsById(data.id).then(res=>{
                this.datasource.fields = _.compact(_.map(res.message,(v)=>{
                    if(_.includes(v,'_')) return;  
                    return {field: v.name, title: v.title, ftype: v.ftype, width:120, visible:true};
                }))
                
                if(this.view.model.datasource.fields){
                    // _.extend(this.datasource.fields,this.view.model.datasource.fields.data);    
                    this.view.model.datasource.fields = [];
                }
            })
        }
        
        if(data.class !== this.view.model.datasource.class && !_.isEmpty(this.view.model.datasource.class)){
            this.$confirm(`类选则发生变化，是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                setData();

            }).catch(() => {
                this.$message.info("类选择操作已取消");
            });

            return;
        }

        if(_.isEmpty(this.view.model.datasource.class)){
           
            setData();

            return;
        }


    },
    /* 视图设置提交 */
    onApplyDataSource(){

        this.datasource.loading = true;

        // 排序
        let content = JSON.stringify(this.view.model,null,2);
    
        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: { content: content, type: this.model.ftype, attr: this.view.model.info.attr, index: true }    
                    };
        
        this.m3.dfsWrite(param).then(()=>{
            this.$message({
              type: "success",
              message: "更新数据源成功"
            })  
            this.initData();
            this.datasource.loading = false;
        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "新建数据源失败 " + err.message
            })
            this.datasource.loading = false;
        })
    },
    onDelete(item){
      this.$confirm(`确定要删除该视图 ${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       
        this.m3.dfsDelete(item).then(()=>{
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.$emit("view-delete");
        }).catch((err)=>{
          this.$message({
            type: "error",
            message: "删除失败 " + err
          })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
<style>
    
    #pane-props .el-transfer-panel:first-child {
        width: 100%;
    }
    #pane-props .el-transfer-panel:last-child {
        width: 100%;
    }
    #pane-props .el-transfer-panel:last-child .el-transfer-panel__body,
    #pane-props .el-transfer-panel:last-child .el-transfer-panel__list.is-filterable{
        height: auto;
    }
    

    #pane-props .el-form-item__label {
        color: #a1a4a9;
    }
    #pane-props .el-transfer-panel__item.el-checkbox {
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }
    .el-dialog__body{
        height: auto;
        background: #ffffff!important;
    }
    #pane-props .el-transfer__buttons {
        line-height: 60px;
        text-align: center;
        width: 100%;
    }

    .el-dialog__body small{
        color: #999;
    }

    .dashview .el-dialog__body .el-tabs__item.is-top{
        height: 60px;
    }

    .el-notification{
        width: auto!important;
    }
    
    .props-render-popper.el-popover.el-popper{
        width: 60vw!important;
        height: 40vh!important;
    }
</style>
