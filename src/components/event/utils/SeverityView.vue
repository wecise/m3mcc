<template>
  <el-container>
    <el-header>
      <el-tooltip content="刷新">
        <el-button type="default" icon="el-icon-refresh" @click="onRefresh">刷新</el-button>
      </el-tooltip>
      <el-tooltip content="新建级别">
        <el-button type="success" icon="el-icon-plus" @click="onNew">新建级别</el-button>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-table
        :data="dt.rows"
        :highlight-current-row="true"
        stripe
        style="width:100%;"
        ref="table"
        v-if="dt.rows"
        class="severity-table">
        <template v-for="(item,index) in dt.columns">
          <el-table-column 
            :label="item.title" 
            :prop="item.field"
            show-overflow-tooltip
            sortable 
            :key="index" v-if="item.visible">
            <template slot-scope="scope">
              <el-color-picker
                :value="scope.row.color"
                show-alpha
                v-if="item.field==='color'">
              </el-color-picker>
              <el-tag v-else-if="item.field==='name'">{{scope.row[item['field']]}}</el-tag>
              <div style="font-weight:600;padding-left:20px;" v-else>{{scope.row[item['field']]}}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button @click="onEdit(scope.row)" type="text">编辑</el-button>
            <el-button @click="onDelete(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-dialog
        title="级别管理"
        :visible.sync="dialog.severity.show"
        :append-to-body="true"
        v-if="dialog.severity.show">
        <el-form :model="dialog.severity.data"  :rules="dialog.severity.rules" ref="severityForm" label-width="100px">
          <el-form-item label="级别" prop="name">
           <el-input-number v-model="dialog.severity.data.name" :min="0" :max="10000" :disabled="dialog.severity.action==='update'?true:false"></el-input-number>
          </el-form-item>
          <el-form-item label="级别名称" prop="title_en">
            <el-input v-model="dialog.severity.data.title_en" clearable></el-input>
          </el-form-item>
          <el-form-item label="显示名称" prop="title_cn">
            <el-input v-model="dialog.severity.data.title_cn" clearable></el-input>
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-color-picker v-model="dialog.severity.data.color" size="medium"></el-color-picker>
          </el-form-item>
          <el-form-item>
            <em class="el-icon-info"></em> <span style="font-size:12px;color:#999999;">级别定义更新后需要重新刷新页面方可生效</span>
          </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.severity.show = false">取 消</el-button>
          <el-button type="primary" @click="onSave">确 定</el-button>
        </span>

      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
// import TemplateView from '../notify/TemplateView.vue';

export default {
  name: "SeverityView",
  props: {
    model: Object,
    global: Object
  },
  data(){
    return {
      dt: {
        rows:[],
        columns: [],
        selected: []
      },
      dialog:{
        severity:{
            show: false,
            data: {
              name: null,
              title_en:"",
              title_cn:"",
              color: ""
            },
            rules: {
                name:[
                  { required: true, message: '请输入级别', trigger: 'blur' }
                ],
                title_en: [
                  { required: true, message: '请输入级别名称', trigger: 'blur' }
                ],
                title_cn: [
                  { required: true, message: '请输入级别显示名称', trigger: 'blur' }
                ],
                color: [
                  { required: true, message: '请选择颜色值', trigger: 'blur' }
                ]
            }
        }
      }
    }
  },
  created(){
    this.initData();
  },
  methods:{
    onRefresh(){
      this.$refs.table.clearSort();
      this.initData();
    },
    initData(){
      let param = encodeURIComponent(JSON.stringify({action:"list"}));
      this.m3.callFS("/matrix/m3event/severity/action.js",param).then((rtn)=>{
        _.extend(this.dt,rtn.message);
      });
    },
    onNew(){
      this.onReset();
      this.dialog.severity.show = true;
      this.dialog.severity.action = "add";
      this.dialog.severity.data =  {
              name: null,
              title_en:"",
              title_cn:"",
              color: ""
            };
    },
    onReset(){
      if(this.$refs['severityForm']){
        this.$refs['severityForm'].resetFields();
      }
    },
    onEdit(row){
      this.dialog.severity.data = row;
      this.dialog.severity.show = true;
      this.dialog.severity.action = "update";
    },
    onDelete(row){
      this.$confirm(`确定要删除该级别定义 ${row.title_en}(${row.name}), 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        
        let param = encodeURIComponent(JSON.stringify({action:"delete", name: row.name, model:row}));
        this.m3.callFS("/matrix/m3event/severity/action.js",param).then(()=>{
          this.onRefresh();
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    onSave(){
      let model = [this.dialog.severity.data.title_en,this.dialog.severity.data.title_cn,this.dialog.severity.data.color];
      let param = encodeURIComponent(JSON.stringify({action: this.dialog.severity.action, name:this.dialog.severity.data.name, model: model}));
        this.m3.callFS("/matrix/m3event/severity/action.js",param).then(()=>{
          this.onRefresh();
          this.$message({
            type: 'success',
            message: '级别定义更新成功'
          });  
          this.dialog.severity.show = false;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 115px)!important;
    background: #f2f2f2;
  }
  .el-main{
    padding: 0 20px 20px 20px;
  }
  .el-header{
    height:60px!important;
    line-height:60px;
  }

</style>

<style>
  .severity-table.el-table .el-table__body-wrapper {
        overflow: auto;
        position: relative;
        height: calc(100% - 50px)!important;
    }
</style>
