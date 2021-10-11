<template>
  <el-container class="card-container">
    <el-header>
        <el-button type="default" icon="el-icon-refresh" @click="onRefresh">刷新</el-button>
        <el-button type="success" icon="el-icon-plus" @click="onNew">新建</el-button>
    </el-header>
    <el-main class="card-main">
        <el-card :body-style="{ padding: '10px' }" 
            style="text-align: center;padding:0px;cursor:pointer;" :key="index" v-for="(item,index) in dt.rows"
            @dblclick.native="onEdit(item)"
            shadow="hover">
            <el-dropdown style="position: absolute;right: 5px;top: 5px;cursor:pointer;">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="onEdit(item)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="onDelete(item)" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <svg-icon icon-class="eventList" style="font-size:6em;"/>
            <div style="padding: 14px;">
                <span>{{item.name | formatName}}</span>
                <div class="bottom clearfix">
                  <time class="time">创建时间:{{  item.vtime | formatTime}}</time>
                </div>
            </div>
            <div style="text-align:right;color: #999;">
                <el-switch v-model="item.disable"
                  inactive-color="#13ce66"
                  active-color="#dddddd"
                  active-value="true"
                  inactive-value="false"
                  @change="onChangeStatus(item)"></el-switch>
            </div>
        </el-card>
      
    </el-main>
    <el-dialog title="触发器" 
        :visible.sync="dialog.newTrigger.show" 
        :show-close="false"
        :close-on-press-escape="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        custom-class="trigger-dialog"
        v-if="dialog.newTrigger.show">
          <el-container style="background:#f2f2f2;" v-if="dialog.newTrigger.type=='add'">
            
            <el-main style="border-top: 1px solid #ffffff;">
              <el-form label-position="right" :model="dialog.newTrigger.data" ref="dialogNewTrigger">
                <el-form-item label="对应类">
                    <el-input v-model="view.value" placeholder="对应类" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                    <el-input v-model="dialog.newTrigger.data.name" placeholder="名称" :disabled="dialog.newTrigger.type=='edit'?true:false"></el-input>
                </el-form-item>
                <el-form-item label="定义">
                    <el-tooltip content="选择主题">
                        <el-dropdown style="padding-left:10px;float:right;">
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
                    <VueEditor
                        v-model="dialog.newTrigger.data.script"
                        @init="onEditorInit"
                        :lang="editor.lang.value"
                        :theme="editor.theme.value"
                        width="99.8%"
                        height="calc(75vh - 270px)"
                        style="border:1px solid #f2f2f2;"
                        ref="editor"
                    ></VueEditor>
                </el-form-item>
                <el-form-item>
                          
                  <el-switch v-model="dialog.newTrigger.data.before"
                      active-color="#13ce66"
                      inactive-color="#dddddd"
                      active-value="true"
                      inactive-value="false"
                      active-text="插入前触发"
                      inactive-text="插入后触发"></el-switch>
                  
                </el-form-item>
                <el-form-item label="优先级">
                  <el-input-number v-model="dialog.newTrigger.data.level"></el-input-number>
                </el-form-item>
              </el-form>
            </el-main>
            <el-footer style="text-align:right;">
                  <el-button type="default" @click="dialog.newTrigger.show = false;">取消</el-button>
                  <el-button type="success" @click="onSave" :loading="dialog.newTrigger.loading">
                      提交
                  </el-button>
            </el-footer>
        </el-container>
        <el-container v-else>
            <el-main>
              <el-tabs value="base" type="border-card">
                <el-tab-pane name="base" style="padding:0px;">
                  <span slot="label">{{dialog.newTrigger.data.name}} <small>({{view.value}})</small></span>
                  <el-container style="background:#f2f2f2;">
                  <el-main style="border-top: 1px solid #ffffff;">
                    <el-form label-position="right" :model="dialog.newTrigger.data" ref="dialogNewTrigger">
                      <!-- <el-form-item label="对应类">
                          <el-input v-model="view.value" placeholder="对应类" disabled></el-input>
                      </el-form-item> -->
                      <el-form-item label="名称" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
                          <el-input v-model="dialog.newTrigger.data.name" placeholder="名称" :disabled="dialog.newTrigger.type=='edit'?true:false"></el-input>
                      </el-form-item>
                      <el-form-item label="定义">
                          <el-tooltip content="选择主题">
                            <el-dropdown style="padding-left:10px;float:right;">
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
                          <VueEditor
                              v-model="dialog.newTrigger.data.script"
                              @init="onEditorInit"
                              :lang="editor.lang.value"
                              :theme="editor.theme.value"
                              width="99.8%"
                              height="calc(75vh - 360px)"
                              style="border:1px solid #f2f2f2;"
                              ref="editor"
                          ></VueEditor>
                      </el-form-item>
                      <el-form-item>
                        
                        <el-switch v-model="dialog.newTrigger.data.before"
                            active-color="#13ce66"
                            inactive-color="#dddddd"
                            active-value="true"
                            inactive-value="false"
                            active-text="插入前触发"
                            inactive-text="插入后触发"></el-switch>
                        
                      </el-form-item>
                      <el-form-item label="优先级">
                        <el-input-number v-model="dialog.newTrigger.data.level"></el-input-number>
                      </el-form-item>
                    </el-form>
                  </el-main>
                  <el-footer style="text-align:right;">
                        <el-button type="default" @click="dialog.newTrigger.show = false;">取消</el-button>
                        <el-button type="success" @click="onSave" :loading="dialog.newTrigger.loading">
                            提交
                        </el-button>
                  </el-footer>
                </el-container>
                </el-tab-pane>
                <el-tab-pane label="日志" name="log">
                  <span slot="label">日志 <i class="el-icon-date"></i></span>
                  <LogView :fullname="dialog.newTrigger.data.name" :ownerClass="view.value" logType="trigger"></LogView> 
                </el-tab-pane>
              </el-tabs>
            </el-main>
          </el-container>
    </el-dialog>
  </el-container>
</template>

<script>
import _ from 'lodash';
import LogView from '../consolelog/LogView';

export default {
  name: "TriggerView",
  props: {
    global:Object,
    model: Object
  },
  components:{
    VueEditor: require("vue2-ace-editor"),
    LogView
  },
  data() {
    return {
      dt: {
        rows:[],
        selected: null
      },
      view: {
        value:""
      },
      editor: {
          data: null,
          loading: false,
          lang: {
              value: "lua",
              list: []
          },
          theme: {
              value: "chrome",
              list: this.m3.EDITOR_THEME
          }
      },
      dialog: {
        newTrigger: {
          show: false,
          loading: false,
          type: 'add',
          data: {
            name: "",
            disable: "true",
            before: "true",
            level: "1",
            vtime: _.now(),
            class: "",
            script: ""
          }
        }
      }
    };
  },
  filters:{
    formatTime(value){
      return new Date(value).toLocaleString();//format(window.global.register.format);
    },
    formatName(value){
      return value.split(".")[0];
    }
  },
  created(){
     this.initView();
  },
  methods: {
    initView(){
      let param = encodeURIComponent(JSON.stringify({action:'getDefaultView'}));
      this.m3.callFS("/matrix/m3event/view/action.js",param).then(rtn=>{
        this.view.value = rtn.message;
        this.initData();
      })
    },
    parseTrigger(data){
        return _.map(data.script,function(v,k){
            let attr = {disable:false};

            if(data.attr && data.attr != null){
                if(data.attr[k]) {
                    attr = JSON.parse(data.attr[k] || '{}');
                }
            }

            return _.merge(attr,{name:k,script:data.script[k],class:data.class,vtime:data.vtime});
        });
    },
    initData(){
        this.m3.triggerList(this.view.value).then(rtn=>{
            this.dt.rows = [];
            let parse = this.parseTrigger(rtn.message[0]);
            this.dt.rows = _.map(parse,v=>{
                return   {
                    name: _.trim(v.name),
                    disable: v.disable,
                    before: v.before,
                    level: v.level,
                    vtime: v.vtime,
                    class: v.class,
                    script: v.script
                }
            });
        })
        
    },
    onChangeStatus(item){
      let param = {class: this.view.value, name: item.name, script: item.script, attr:{ disable: item.disable, before: item.before, level: String(item.level)}};
      this.m3.triggerNew(param).then(()=>{
          this.onRefresh();
      } );
    },
    onRefresh(){
      this.initData();
    },
    onNew(){
      this.dialog.newTrigger.show = true;
      this.dialog.newTrigger.type = "add";
      this.dialog.newTrigger.data.name = "";
      this.dialog.newTrigger.data.disable = "false";
      this.dialog.newTrigger.data.before = "true";
      this.dialog.newTrigger.data.level = "1";
      this.dialog.newTrigger.data.vtime = _.now();
      this.dialog.newTrigger.data.class = "";
      this.dialog.newTrigger.data.script = "";
    },
    onSave(){

      if(_.isEmpty(this.view.value)){
        this.$message.warning("触发器需要类设置，请确认！");
        return false;
      } else {
        this.dialog.newTrigger.data.class = this.view.value;
      }

      if(_.isEmpty(this.dialog.newTrigger.data.name)){
        this.$message.warning("请输入名称");
        return false;
      }

      let param = {class: this.dialog.newTrigger.data.class, name: this.dialog.newTrigger.data.name, script: this.dialog.newTrigger.data.script, attr:{
          disable: this.dialog.newTrigger.data.disable,
          before: this.dialog.newTrigger.data.before,
          level: String(this.dialog.newTrigger.data.level)
          }};
      this.m3.triggerNew(param).then(()=>{
          this.onRefresh();
          // this.dialog.newTrigger.show = false;
      } ).catch(err=>{
        console.error(err);
        // this.dialog.newTrigger.show = false;
      });
    },
    onEdit(item){
      this.dialog.newTrigger.type = "edit";
      this.dialog.newTrigger.data = item;
      this.dialog.newTrigger.show = true;
    },
    onDelete(item){
      this.$confirm(`确定要删除该触发器 ${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       
        this.m3.triggerDelete(this.dialog.newTrigger.data.class,item.name).then(()=>{
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.onRefresh();
        }).catch((err)=>{
          this.$message({
            type: "error",
            message: "删除有误 " + err.message
          })
          this.onRefresh();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    onEditorInit(){
          require("brace/ext/language_tools"); //language extension prerequsite...
          require(`brace/mode/${this.editor.lang.value}`); //language
          require(`brace/snippets/${this.editor.lang.value}`); //snippet
          require(`brace/theme/${this.editor.theme.value}`); //language

          /* this.$refs.editor.editor.commands.addCommand({
              name: "save",
              bindKey: {
                  mac: "cmd-S", 
                  win: "ctrl-S",
                  sender: 'editor|cli'
              },
              exec: ()=> {
                  this.save();
              }
          }); */
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
  .el-container.card-container{
    height: calc(100vh - 115px);
  }
  .el-header{
    line-height: 60px;
  }
  .el-footer{
    line-height: 60px;
  }
  .el-main.card-main{
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    align-content: flex-start;
  }
  .el-card{
    position: relative;
    margin:10px;
  }
  .time {
    font-size: 12px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

   
  
</style>

<style>
.trigger-dialog .el-dialog__body{
  padding-top:0px!important;
}
.trigger-dialog.el-dialog #pane-log .ace_editor{
     height: calc(100vh - 320px)!important;
   }
</style>
