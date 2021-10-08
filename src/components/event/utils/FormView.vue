<template>
  <el-container>
      <el-header style="height:40px;line-height: 40px;text-align:right;">
          <span>
              <el-tooltip content="刷新">
                  <el-button type="text" icon="el-icon-refresh" @click="loadForm"></el-button>
              </el-tooltip>
              <el-tooltip content="更新">
                  <el-button type="text" icon="el-icon-position" v-if="allow"></el-button>
              </el-tooltip>
              <el-tooltip content="添加">
                  <el-button type="text" icon="el-icon-plus" v-if="allow"></el-button>
              </el-tooltip>
              <el-tooltip content="删除">
                  <el-button type="text" icon="el-icon-delete" v-if="allow"></el-button>
              </el-tooltip>
              <el-tooltip content="表单样式">
                  <el-button type="text" icon="el-icon-bank-card" @click="toggleFormStyle"></el-button>
              </el-tooltip>
          </span>
      </el-header>
      <el-main ref="mainView" style="padding:0px 20px;">
          <el-form :model="model" ref="form" label-width="140px" :label-position="labelPosition" v-if="model">
              <template v-for="(item,index) in model.components">
                <el-form-item :label="item.label" :key="index" v-if="item.visible">
                    <el-select v-model="item.data" :placeholder="item.placeholder" v-if="item.type==='select'">
                        <el-option v-for="data in item.data" :key="data">{{data}}</el-option>
                    </el-select>
                    <el-date-picker type="date" v-model="item.data" :placeholder="item.placeholder" v-else-if="item.type==='date-picker'"></el-date-picker>
                    <el-input-number v-model="item.data" :placeholder="item.placeholder" v-else-if="item.type==='input-number'"></el-input-number>
                    <el-input type="textarea" autosize v-model="item.data" :placeholder="item.placeholder" v-else-if="item.type==='input-textarea'"></el-input>
                    <TagView domain='event' :model.sync="item.data" :id="model.dataId" :limit="4" v-else-if="item.type==='tag'">{{item.data}}</TagView>
                    <el-input v-model="item.data" :placeholder="item.placeholder" v-else></el-input>
                </el-form-item>
              </template>
          </el-form>
      </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash/core';
import TagView from '../tags/TagView';

export default {
  name: "FormView",
  props: {
      term: String,
      cHeight: Number
  },
  components:{
    TagView
  },
  data(){
      return {
          model:null,
          labelPosition: 'right',
          allow: false
      }
  },
  watch: {
      term(){
          this.loadForm();
      }
  },
  filters: {
      pickIcon(evt){
          try {
              return `/static/assets/images/entity/png/${_.last(evt.path.split("/"))}.png`;
          } catch(err){
              return `/static/assets/images/entity/png/matrix.png`;
          }
      }
  },
  created(){
      this.loadForm();
  },
  methods: {
      onErrorPickIcon(){
          _.extend(this.model,{path:"/matrix"});
      },
      loadForm(){
          this.m3.callFS("/matrix/omdb/form.js", encodeURIComponent(this.term)).then((rtn)=>{
              this.model = rtn.message;
          });
      },
      toggleFormStyle(){
          this.labelPosition = _.sample(_.xor(['top','right','left'],[this.labelPosition]));
      }
      
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: 100%;
  }

  .el-header{
    height:40px!important;
    line-height:40px;
  }

</style>
