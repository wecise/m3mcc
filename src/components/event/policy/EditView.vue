<template>  
    <el-tabs value="info" v-if="policy.data">
        <el-tab-pane label="基本信息" name="info" v-if="policy.data">
            <el-form ref="form" :model="policy.data" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="policy.data.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="6" v-model="policy.data.attr.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <TagView domain='policy' :model.sync="policy.data.tags" :id="policy.data.id" :limit="4"></TagView>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onClose">取消</el-button>
                    <el-button type="success" @click="onApplyInfo" :loading="policy.loading">应用</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="策略定义" name="policy">
            <el-container style="height: calc(100vh - 275px);">
                <el-header style="height: 35px;line-height: 35px;background:#f2f2f2;display:flex;">
                    <el-tooltip content="刷新" >
                        <el-button type="text" @click="initData">
                            <svg-icon icon-class="refresh" style="width: 1.3em;height: 1.3em;"/>
                        </el-button>
                    </el-tooltip>
                    
                    <el-popover
                        title="粘贴自文本"
                        placement="right"
                        trigger="click">
                        <el-container style="height:60vh;width:60vw;">
                            <el-header style="height:30px;line-height:30px;width:100%;text-align:right;">
                                <el-tooltip content="选择主题">
                                    <el-dropdown>
                                        <span class="el-dropdown-link">
                                            <svg-icon icon-class="theme"/>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item v-for="group in editor.theme.list" :key="group.name">
                                                <el-dropdown @command="onToggleTheme">
                                                    <span class="el-dropdown-link">
                                                    {{ group.name }}
                                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item
                                                            v-for="item in group.items"
                                                            :key="item.name"
                                                            :command="item.name">{{ item.name }}</el-dropdown-item>
                                                        </el-dropdown-menu>
                                                </el-dropdown>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-tooltip>
                            </el-header>
                            <el-main>
                                <VueEditor
                                    v-model="editor.data"
                                    @init="onEditorInit"
                                    :lang="editor.lang.value"
                                    :theme="editor.theme.value"
                                    width="99.8%"
                                    height="100%"
                                    ref="editor"
                                ></VueEditor>
                            </el-main>
                        </el-container>
                        <el-button type="text" slot="reference">
                            <svg-icon icon-class="clipboard" style="width: 1.1em;height: 1.1em; padding-left:10px;"/>
                        </el-button>
                    </el-popover>
                    
                    <el-tooltip content="文件导入" >
                        <el-button type="text" @click="onUploadFromFile" style="padding-left:10px;">
                            <svg-icon icon-class="documentation" style="width: 1.0em; height: 1.0em;"/>
                        </el-button>
                    </el-tooltip>

                    <el-tooltip content="保存" >
                        <el-button type="text" @click="onApplyPolicy" :loading="policy.loading">
                            <svg-icon icon-class="save" style="width: 1.2em;height: 1.2em;"/>
                        </el-button>
                    </el-tooltip>

                    <el-input v-model="policy.dt.term" placeholder="关键字过滤" @change="onFilter" @clear="initData" clearable style="padding-left:15px;width:30%;"></el-input>

                    <span>
                        
                        <el-popover
                            placement="left"
                            trigger="click"
                            popper-class="info-popper"
                            style="float:right;padding-left:10px;font-size: 15px;">
                            <el-container>
                                <el-main style="padding:0px;">
                                    <el-tabs value="setup"  label-position="left">
                                        <el-tab-pane label="设置" name="setup">
                                            <el-form>
                                                <el-form-item label="忽略空行">
                                                    <el-switch
                                                        v-model="policy.config.skipEmptyLines"
                                                        active-color="#13ce66"
                                                        inactive-color="#dddddd">
                                                    </el-switch>
                                                </el-form-item>
                                                <el-form-item label="分隔符">
                                                    <el-select v-model="policy.config.delimiter">
                                                        <el-option :label="item.title" :value="item.name" :key="index" v-for="(item,index) in policy.config.delimitersToGuess"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-form>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-main>
                            </el-container>
                            <el-button type="text" slot="reference">
                                <i class="el-icon-setting" style="float:right;"> </i>
                            </el-button>
                        </el-popover>
                    </span>
                    
                </el-header>
                <el-main style="overflow:hidden;padding:0px;border-bottom:1px solid #dddddd;border-right:1px solid #dddddd;">
                     <hot-table :settings="policy.dt" height="100%" ref="hotTableComponent"></hot-table>
                </el-main>
                <el-footer style="line-height:60px;width:100%;">
                    <span v-if="policy.parse.data">
                        <el-popover
                            placement="top"
                            width="160">
                            <ul class="infinite-list" style="overflow:auto">
                                <li v-for="(v,k,index) in policy.parse.data" :key="index" class="infinite-list-item">
                                    <span style="padding:7px 5px;background:#dddddd;">{{k+1}}</span>  <span style="padding:2px 5px;text-align: right;width: 100%;">{{v.length}} 列</span>
                                </li>
                            </ul>
                            <el-button slot="reference" type="text" icon="el-icon-coin">数据</el-button>
                        </el-popover>
                    </span>
                    <span style="padding-left:10px;">
                        <el-popover
                            placement="top"
                            width="160">
                            <p v-for="(v,k,index) in policy.parse.errors" :key="index">
                                {{k}}: {{v}}
                            </p>
                            <el-button slot="reference" type="text" icon="el-icon-info">错误</el-button>
                        </el-popover>
                    </span>
                    <span v-if="policy.parse" style="padding-left:10px;">
                        <el-popover
                            placement="top"
                            width="160">
                            <p v-for="(v,k,index) in policy.parse.meta" :key="index">
                                {{k}}<el-input :value="v" :validate-event="false"></el-input>
                            </p>
                            <el-button slot="reference" type="text" icon="el-icon-bank-card">分析</el-button>
                        </el-popover>
                    </span>
                    <span style="float:right;"><el-button @click="onClose">取消</el-button></span>
                </el-footer>
            </el-container>
            <el-dialog
                title="粘贴自文本"
                :visible.sync="dialog.copyFrom.show"
                :modal-append-to-body="false"
                custom-class="policy-dialog"
                v-if="dialog.copyFrom.show">
                <el-container style="height:60vh;">
                    <el-main>
                        <Editor
                            v-model="editor.data"
                            @init="onEditorInit"
                            :lang="editor.lang.value"
                            :theme="editor.theme.value"
                            width="99.8%"
                            height="100%"
                            ref="editor"
                        ></Editor>
                    </el-main>
                </el-container>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialog.copyFrom.show = false">取 消</el-button>
                    <el-button type="primary" @click="dialog.copyFrom.show = false">确 定</el-button>
                </span>
                </el-dialog>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import _ from 'lodash';
import TagView from '../tags/TagView';
import Papa from 'papaparse';
import { HotTable } from '@handsontable/vue';
import Handsontable from 'handsontable';

export default {
  name: "EditView",
  props: {
    model: Object
  },
  components:{
    VueEditor: require("vue2-ace-editor"),
    TagView,
    HotTable
  },
  data() {
    return {   
        policy: {
            loading: false,
            data: null,
            parse: null,
            config: {
                delimiter: "\t",	// auto-detect
                newline: "",	// auto-detect
                quoteChar: '"',
                escapeChar: '"',
                header: false,
                transformHeader: undefined,
                dynamicTyping: false,
                preview: 0,
                encoding: "",
                worker: false,
                comments: false,
                step: undefined,
                complete: undefined,
                error: undefined,
                download: false,
                downloadRequestHeaders: undefined,
                downloadRequestBody: undefined,
                skipEmptyLines: true,
                chunk: undefined,
                chunkSize: undefined,
                fastMode: undefined,
                beforeFirstChunk: undefined,
                withCredentials: undefined,
                transform: undefined,
                delimitersToGuess: [
                                        { name: ',', title:"逗号"}, 
                                        { name: '\t', title:"Tab"},
                                        { name: '|', title:"分隔符"},
                                        { name: ';', title:"分号"}
                                    ]
            },
            dt: {
                data: Handsontable.helper.createSpreadsheetData(6, 10),
                rowHeaders: true,
                colHeaders: true,
                autoWrapRow: false,
                minRows: 50,
                autoRowSize: true,
                autoColumnSize: true,
                stretchH: 'all',
                afterChange: (changes, source)=> {
                    console.log(changes, source)
                },
                minSpareCols: 2, //列留白
                minSpareRows: 2,//行留白,
                contextMenu: {
                    "items": {
                        "row_above": {
                            "name": "上方插入一行"
                        },
                        "row_below": {
                            "name": "下方插入一行"
                        },
                        "col_left": {
                            "name": "左方插入列"
                        },
                        "col_right": {
                            "name": "右方插入列"
                        },
                        "hsep1": "---------",
                        "remove_row": {
                            "name": "删除行"
                        },
                        "remove_col": {
                            "name": "删除列"
                        },
                        "make_read_only": {
                            "name": "只读"
                        },
                        "borders": {
                            "name": "表格线"
                        },
                        "commentsAddEdit": {
                            "name": "添加备注"
                        },
                        "commentsRemove": {
                            "name": "取消备注"
                        },
                        "freeze_column": {
                            "name": "固定列"
                        },
                        "unfreeze_column": {
                            "name": "取消列固定"
                        },
                        "hsep2": "---------"
                    }
                }
            }
        },
        editor: {
            term: "",
            data: null,
            loading: false,
            lang: {
                value: "text",
                list: []
            },
            theme: {
                value: "chrome",
                list: this.m3.EDITOR_THEME
            },
            options:{
                tabSize: 4,     
                useSoftTabs: false,
                split: " "
            }
        },
        dialog: {
            copyFrom: {
                show: false
            },
            upload: {
                show: false
            }
        }
    };
  },
  filters:{
      formatCase(val){
          return _.trim(_.upperFirst(val));
      }
  },
  watch:{
     model:{
         handler(){
             this.initData();
         }
    },
    'editor.data':{
        handler(val){
            if(_.isEmpty(val)) return false;
            this.policy.parse = Papa.parse(val);
            this.$refs.hotTableComponent.hotInstance.loadData(this.policy.parse.data);
        }
    }
  },
  mounted(){
      setTimeout(()=>{
          this.initData();
      },2000)
      
  },
  methods: {
    initFileInfo(){
        try{
            
            // 初始化attr
            if(_.isEmpty(this.policy.data.attr)){
                _.extend(this.policy.data, {attr:  {remark: "", icon: ""} });   
            } else {
                _.extend(this.policy.data, {attr: JSON.parse(this.policy.data.attr)});   
            }

        } catch(err){
            console.log(err)
             _.extend(this.policy.data, {attr:  {remark: "", icon: ""} });   
        }
    },
    onFilter:_.debounce(function(){
        let term = this.policy.dt.term;
        var row, r_len, col, c_len;
		var data = this.policy.dt.data;
		var array = [];

        for (row = 0, r_len = data.length; row < r_len; row++) {
            for(col = 0, c_len = data[row].length; col < c_len; col++) {
                
                if(('' + data[row][col]).indexOf(term) > -1) {
                    array.push(data[row]);
                    break;
                }
            }
        }
        
        this.$refs.hotTableComponent.hotInstance.loadData(array);

    },500),
    initData(){
        
        let param = encodeURIComponent(JSON.stringify({  action: "read", data: this.model }));
        
        this.m3.callFS("/matrix/m3event/policy/action.js", param).then(rtn=>{
            
            if(!_.isEmpty(rtn.message)){
                this.policy.parse = Papa.parse(rtn.message);
                this.policy.dt.data = this.policy.parse.data;
            } else {
                this.policy.parse = Papa.parse("    ");
                this.policy.dt.data = this.policy.parse.data;
            }
            
            this.policy.data = _.cloneDeep(this.model);
            this.policy.data.name = this.policy.data.name.split(".")[0];

            this.initFileInfo();

        }).catch((err)=>{
            console.log(err);
            this.policy.data = null;
        })
    },
    onCopyFromStr(){
        this.dialog.copyFrom.show = true;
        //this.editor.data = null;
    },
    onUploadFromFile(){
        this.dialog.upload.show = true;
    },
    onApplyInfo(){
        this.onApplyName();
    },
    onApplyName(){

        this.policy.loading = true;

        // update name
        let param = {
                srcpath: this.model.fullname, 
                dstpath: [this.policy.data.parent,[this.policy.data.name, this.policy.data.ftype].join(".")].join("/")
            };
        
        if(param.srcpath == param.dstpath){
            this.policy.loading = false;
            this.onApplyAttr();
            return false;
        }

        this.m3.dfsRename(param).then(()=>{
            this.policy.loading = false;
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
            this.policy.loading = false;
        })
    },
    onApplyAttr(){
        this.loading = true;
        
        if(JSON.stringify(this.policy.data.attr) === this.model.attr){
            this.loading = false;
            return false;
        }

        // update attr
        let attr = {
            parent: this.policy.data.parent, 
            name: [this.policy.data.name, this.policy.data.ftype].join("."),
            attr: JSON.stringify(this.policy.data.attr)
        };

        this.m3.dfsUpdateAttr(attr).then(()=>{
            
            this.$message({
                type: 'success',
                message: '更新备注成功'
            })
            
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })    
            this.loading = false;
        })
    },
    onClose(){
        this.editor.data = null;
        this.policy.data = null;
        this.policy.dt.data = [];
        this.$emit('dialog:close');
    },
    onEditorInit(){
        require("brace/ext/language_tools"); //language extension prerequsite...
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    onApplyPolicy(){
        
        this.policy.loading = true;

        let content = Papa.unparse(this.$refs.hotTableComponent.hotInstance.getData(),{ 
                delimiter: this.policy.config.delimiter,
                skipEmptyLines: this.policy.config.skipEmptyLines });
    
        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: { content: content, type: this.model.ftype, attr: this.model.attr, index: true }    
                    };
        
        this.m3.dfsWrite(param).then(()=>{
            this.$message({
              type: "success",
              message: "更新策略成功"
            })  
            this.initData();
            this.policy.loading = false;

        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "新建策略源失败 " + err.message
            })
            this.policy.loading = false;
            
        })
    },
    onToggleTheme(val){
        require(`brace/theme/${val}`); //language
        this.editor.theme.value = val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .infinite-list {
        height: 300px;
        padding: 0;
        margin: 0;
        list-style: none;
    }
    .infinite-list .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        background: #f2f2f2;
        margin: 5px;
        color: #333333;
    }
</style>
<style>
    #hot-display-license-info{
        display: none!important;
    }
    .htMenu.htContextMenu.handsontable{
        z-index: 3000;
    }
</style>
<style src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>