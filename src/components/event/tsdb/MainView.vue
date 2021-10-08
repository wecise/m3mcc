<template>
  <el-container>
    <el-header style="display:none;">
      <entity-view 
        @bucket-selected="((data)=>{ onSetBucket(data); })"
        @entity-selected="((data)=>{ onSetEntity(data); })"></entity-view>
    </el-header>
    <el-main style="padding:0px;">
        <tsdb-view :bucket="bucket" :entity="entity"></tsdb-view>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
import TsdbView from './TsdbView.vue';
import EntityView from './EntityView.vue';

export default {
  components: { TsdbView, EntityView },
  name: 'MainView',
  props: {
    model: String
  },
  data(){
    return {
      entity: null,
      bucket: null
    }
  },
  watch: {
    model:{
      handler(val){
        this.init(val);
      },
      immediate: true
    }
  },
  mounted(){
    document.body.style.setProperty('overflow-y','auto','important');
  },
  methods: {
    // 根据实体初始化bucket
    init(value){
      let param = encodeURIComponent(value);
      this.m3.callFS("/matrix/m3event/diagnosis/tsdb/getBucketByEntity.js", param).then( rtn=>{
          this.bucket = _.head(_.sortBy(_.map(_.groupBy(rtn.message.bucket,'class'), (v,k)=>{
                return {class:k, children:v};
            }),['class'],['asc']));
          this.entity = rtn.message.entity;
      })
    },
    //选择的bucket定义
    onSetBucket(data){
      this.bucket = data;
    },
    //选择的实体
    onSetEntity(data){
      this.entity = data;
    }
  },
  destroyed(){
    document.body.style.removeProperty('overflow-y');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 205px);
  }
  .el-header{
    line-height: 60px;
  }
</style>
