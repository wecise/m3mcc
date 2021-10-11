<template>
  <el-container>
    <el-header style="display:none;">
      <entity-view 
        @bucket-selected="((data)=>{ onSetBucket(data); })"
        @entity-selected="((data)=>{ onSetEntity(data); })"></entity-view>
    </el-header>
    <el-main style="padding:5px;">
        <bitlog-view :bucket="bucket" :entity="entity"></bitlog-view>
    </el-main>
  </el-container>
</template>

<script>
import BitlogView from './BitlogView.vue'
import EntityView from './EntityView.vue'
export default {
  components: { BitlogView, EntityView },
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
      this.m3.callFS("/matrix/m3event/diagnosis/bitlog/getBucketByEntity.js", param).then( rtn=>{
          this.bucket = rtn.message.bucket;
          this.entity = rtn.message.entity;
      })
    },
    //选择的bucket定义
    onSetBucket(data){
      this.bucket = data.children;
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
