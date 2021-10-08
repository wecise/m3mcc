<template>
<el-container style="background:#f2f2f2;">
    <el-main style="padding: 0px;">
        <Split :gutterSize="5">
            <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                <TagTreeView :model="{domain:'dashview'}" :fun="onRefreshByTag" ref="dashviewTagTree"></TagTreeView>
            </SplitArea>
            <SplitArea :size="80" :minSize="0" style="overflow:hidden;padding:20px;">
              <el-container>
                <el-header>
                    <el-button type="default" icon="el-icon-refresh" @click="onRefresh">刷新</el-button>
                    <el-button type="success" icon="el-icon-plus" @click="onNew">新建</el-button>
                </el-header>
                <el-main>
                  
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
                             <p style="text-align:left;"><TagView domain='dashview' :model.sync="item.tags" :id="item.id" :limit="1"></TagView></p>
                            <div class="bottom clearfix">
                              <time class="time">创建时间:{{  item.ctime | formatTime}}</time>
                            </div>
                        </div>
                        <div style="text-align:right;color: #999;">
                            默认视图
                            <el-button type="text" icon="el-icon-star-on" style="color: #ff9800;font-size: 15px;font-weight: 600;" v-if="item.defaultView"></el-button>
                            <el-button type="text" icon="el-icon-star-off" style="color: #ff9800;font-size: 14px;font-weight: 600;" @click="onSetDefaultView(item)" v-else></el-button>
                        </div>
                    </el-card>
                  
                </el-main>

                <el-dialog :title="'视图编辑 ' + dt.selected.name.replace(/.json/,'')" 
                    :visible.sync="edit.show" 
                    :show-close="false"
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :destroy-on-close="true"
                    dialogDrag
                    dialogChange
                    custom-class="dashview"
                    v-if="dt.selected">
                  <EditView :model.sync="dt.selected" ref="editView" @dialog:close="onClose" @view-delete="(()=>{ edit.show=false; this.onRefresh();})"></EditView>
                </el-dialog>

              </el-container>
            </SplitArea>
        </Split>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
import EditView from './EditView';
import TagView from '../tags/TagView';
import TagTreeView from '../tags/TagTreeView';

export default {
  name: "DashView",
  props: {
    global:Object,
    model: Object
  },
  components:{
    EditView,
    TagView,
    TagTreeView
  },
  data() {
    return {
      dt: {
        rows:[],
        selected: null
      },
      views: {
        default: ""
      },
      edit:{
        show: false
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
     this.initData();
  },
  methods: {
    initData(){
        let param = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/m3event/view/action.js", param).then((rtn)=>{
            this.dt.rows = _.orderBy(rtn.message,['name'],['asc']);
            this.edit.show = false;
        })
    },
    onRefresh(){
      this.initData();
      this.$emit("toggle-view");
    },
    onRefreshByTag(tag){
      if(_.isEmpty(tag)){
          this.initData();
        } else {
          let param = encodeURIComponent(JSON.stringify({  action: "search", param: tag  }));
          this.m3.callFS("/matrix/m3event/view/action.js", param).then((rtn)=>{
              this.dt.rows = _.orderBy(rtn.message,['name'],['asc']);
              this.edit.show = false;
          })
        }
    },
    onNew(){
       this.$prompt('请输入视图名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        
        if(_.isEmpty(value)){
            this.$message({
                type: 'warning',
                message: '请输入视图名称！'
            });
            return false;
        }

        let param = encodeURIComponent(JSON.stringify({  action: "add", data:this.m3.EventViewDataObj, name:value }));
        this.m3.callFS("/matrix/m3event/view/action.js", param).then((rtn)=>{
            this.dt.rows = rtn.message;
            this.onRefresh();
        })

        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消新建视图操作'
        });       
      });
      
    },
    onSetDefaultView(item){
      let param = encodeURIComponent(JSON.stringify({  action: "setDefaultView", data: { key: 'defaultView', value: item.fullname } }));
      this.m3.callFS("/matrix/m3event/view/action.js", param).then(()=>{
          this.onRefresh();
          this.$notify.success(`已设置 ${item.name.replace(/.json/,'')} 为默认视图`);
      })
    },
    onEdit(item){
      this.dt.selected = item;
      this.edit.show = true;
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
          this.onRefresh();
        }).catch((err)=>{
          this.$message({
            type: "error",
            message: "删除有误 " + err.message
          })
          setTimeout(()=>{
            this.onRefresh();
          },1000)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    onClose(){
      this.edit.show = false;
      this.onRefresh();
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 115px);
  }
  .el-header{
     height: 30px!important;
    line-height: 30px;
  }
  .el-main{
     display: -webkit-flex;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      padding: 10px;
  }
  .el-card{
    position: relative;
    margin:10px;
    width: 20em;
    height: 19em;
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
