<template>
  <el-container>
    <el-main style="padding:0px;">
      <el-tabs v-model="tabs.activeTab" type="border-card">
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list" lazy>
          <span slot="label">{{item.title}} <span @click="onTip(item)" class="el-icon-question" v-if="item.desc"></span></span>
          <InfoView :model="model"  v-if="item.type==='info'"></InfoView>
          <JournalView :model="model" v-else-if="item.type==='journal'"></JournalView>
          <AttributeRelView :model="model" :global="global" v-else-if="item.type==='attribute'"></AttributeRelView>
          <HistoryView :model="model" :global="global" v-else-if="item.type==='history'"></HistoryView>
          <GraphView :model="[model.entity]" :global="global" v-else-if="item.type==='graph'"></GraphView>
          <BitLogView :model="model.entity" v-else-if="item.type==='bitlog'"></BitLogView>
          <TsdbView :model="model.entity" v-else-if="item.type==='tsdb'"></TsdbView>
          <AttachmentView :model="model" v-else-if="item.type==='attachmment'"></AttachmentView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import InfoView from './InfoView.vue';

export default {
  name: "DiagnosisView",
  props: {
    model: Object,
    global: Object
  },
  components:{
    InfoView,
    JournalView: resolve => {require(['./JournalView.vue'], resolve)},
    AttributeRelView: resolve => {require(['./AttributeRelView.vue'], resolve)},
    HistoryView: resolve => {require(['./HistoryView.vue'], resolve)},
    GraphView: resolve => {require(['./GraphView.vue'], resolve)},
    AttachmentView: resolve => {require(['./AttachmentView.vue'], resolve)},
    BitLogView: resolve => {require(['../bitlog/MainView.vue'], resolve)},
    TsdbView: resolve => {require(['../tsdb/MainView.vue'], resolve)}
  },
  data() {
    return {
      tabs: {
          list: [],
          activeTab: 'info'
      }
    };
  },
  created(){
    this.tabs.list = [
            {name:'info',title:'告警信息',type:'info',data: this.model},
            {name:'journal',title:'告警轨迹',type:'journal', data: this.model, desc:'当前告警的生命周期。'},
            {name:'attribute',title:'维度关联性告警',type:'attribute', data: this.model, desc:'选则当前告警属性，可多选、可单选，通过选择不同的属性组合进行关联告警的查找、分析，从而通过相关告警快速定位问题所在。'},
            {name:'history',title:'历史相似告警',type:'history', data: this.model, desc:'选则当前告警的实体属性，根据该实体查找最近发生过的历史告警。'},
            {name:'graph',title:'资源分析',type:'graph', data: this.model, desc:`选则当前告警的实体属性，根据该实体查找上下关联的实体，结果以图形式展示。示例：match() <-[*1] - (entity) - [*1] -> ()`},
            {name:'bitlog',title:'日志分析',type:'bitlog', data: this.model, desc:`提取当前告警中的实体，通过搜索分析实体相关的日志信息`},
            {name:'tsdb',title:'性能分析',type:'tsdb', data: this.model, desc:`提取当前告警中的实体，通过搜索分析实体相关的性能信息`},
            {name:'attachmment',title:'实体附件',type:'attachmment', data: this.model, desc:`显示当前告警实体相关的附件文档信息`}
          ];
  },
  methods: {
    onTip(item){
        if(!item.desc) return false;
        
        const h = this.$createElement;
        this.$notify({
          title: item.title,
          position: 'top-right',
          message: h('i', { style: 'color: teal'}, item.desc)
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
