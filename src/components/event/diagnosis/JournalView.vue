<template>
  <el-container>
    <el-main @dblclick.native="reverse=!reverse">
      <el-timeline :reverse="reverse">
            <el-timeline-item
            v-for="(row,index) in dt.rows"
            :key="index"
            :color="row.severity | pickSeverityColor"
            :timestamp="row.vtime | formatDateTime">
            消息：{{row.msg}}
            <p>
                节点：{{row.node || row.nodealias || row.host}}
            </p>
            <p>
                状态：{{row.status | pickStatus}}
            </p>
            </el-timeline-item>
        </el-timeline>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "JournalView",
  props: {
    model: Object
  },
  data() {
    return {
      dt: {
          rows: []
      },
      reverse: true,
    };
  },
  filters:{
      pickSeverityColor(val){
          try{
            return window.global.register.event.severity[val][2];
          } catch(err){
            return null;  
          }
      },
      pickStatus(val){
        try{
          return window.global.register.event.status[val][1];
        } catch(err) {
          return null;
        }
      },
      formatDateTime(val){
          return new Date(val).toLocaleString();
      }
  },
  watch:{
    model:{
      handler(val){
          console.log(val)
          this.initData(val);
      },
      immediate: true
    }
  },
  methods: {
    initData(val){
        let param = encodeURIComponent(JSON.stringify(val).replace(/%/gi,'%25'));
        this.m3.callFS("/matrix/m3event/diagnosis/journal.js", param).then(rtn=>{
            this.dt.rows = rtn.message;
        })
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 205px);
  }
</style>
