<template>
    <el-container>
      <el-header>
          <el-tooltip content="刷新" placement="top">
              <el-button type="text" @click="onRefresh" icon="el-icon-refresh">
              </el-button>
          </el-tooltip>
          <el-tooltip content="时间轴视图" placement="top">
              <el-button type="text" @click="currentView='timeline-view'" icon="el-icon-picture">
              </el-button>
          </el-tooltip>
          <el-tooltip content="列表视图" placement="top">
              <el-button type="text" @click="currentView='grid-view'" icon="el-icon-s-grid">
              </el-button>
          </el-tooltip>
      </el-header>
      <el-main @dblclick.native="reverse=!reverse">
        <el-timeline :reverse="reverse" class="attachment-timeline" v-if="currentView=='timeline-view'">
              <el-timeline-item
                v-for="row in dt.rows"
                :key="row.id"
                :icon="row.ftype | formatType"
                :color="row.ftype | formatColor"
                :timestamp="row.vtime | formatDateTime"
                @click.native="onAttachOpen(row)"
                style="cursor:pointer;">
              名称：{{row.name}}
              <p>
                  大小：{{row.size | formatSize}}
              </p>
              <p>
                  作者：{{row.author}}
              </p>
              </el-timeline-item>
          </el-timeline>
          <el-checkbox-group v-model="dt.selected" v-else>
              <el-button type="default" 
                      @click="onAttachOpen(item)"
                      style="max-width: 12em;width: 12em;height:110px;border-radius: 10px!important;margin: 5px;border: unset;box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.2);"
                      :key="item.id"
                      v-for="item in dt.rows">
                      <el-image style="width:34px;height:34px;margin:5px;" :src="item | pickIcon">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline" style="font-size:32px;"></i>
                          </div>
                      </el-image>
                      <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:5px;text-align:center;">
                          {{item.name}}
                      </p>
                      <!-- <el-checkbox :label="item.id" :ref="'checkBox_'+item.id"></el-checkbox> -->
              </el-button>
          </el-checkbox-group>
      </el-main>
    </el-container>
</template>

<script>
//import _ from 'lodash';

export default {
  name: "AttachmentView",
  props: {
    model: Object
  },
  data() {
    return {
      currentView:"timeline-view",
      baseUrl: "/script/matrix/m3event/attachment",
      dt: {
          rows: [],
          selected: []
      },
      reverse: true
    };
  },
  filters: {
      pickIcon(item){
          return `/static/assets/images/files/png/${item.ftype}.png`;
      },
      formatType(val){
        return val==='dir'?'el-icon-folder-opened':'el-icon-document';
      },
      formatColor(val){
        return val==='dir'?'#ff9800':'#4caf50';
      },
      formatSize(val){
          return window.m3.bytesToSize(val);
      },
      pickStatus(val){
          return window.global.register.event.status[val][1];
      },
      formatDateTime(val){
          return new Date(val).toLocaleString();
      }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let param = {parent: [this.baseUrl,this.model.entity,this.model.id].join("/"), fullname: [this.baseUrl,this.model.entity,this.model.id].join("/")};
        this.m3.dfsList(param).then((res)=>{
            this.dt.rows = res.message;
        })
    },
    onRefresh(){
      this.initData();
    },
    onAttachOpen(item){
      window.open(`/static${item.fullname}`,'_blank');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 205px);
  }
  .el-header{
    height: 40px!important;
    line-height: 40px;
  }
  .el-main{
    overflow: hidden;
  }
</style>
<style>
  .attachment-timeline .el-timeline-item__node--normal {
      left: -10px!important;
      top: -10px!important;
      width: 32px!important;
      height: 32px!important;
  }
  #pane-attachmment .el-checkbox-group .el-checkbox__label{
    display: none;
  }
</style>
