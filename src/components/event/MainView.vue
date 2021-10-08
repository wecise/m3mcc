<template>
  <el-container>
    <el-main style="padding:0px 10px;">
      <el-tabs v-model="tabs.activeTab" closable @tab-remove="removeTab" >
        <el-tab-pane label="事件列表" name="event-list">
          <el-container>
            <el-header>
              <el-input
                placeholder="请输入内容"
                v-model="search.model.term"
                class="input-with-select"
                clearable
                @clear="onSearch"
                @keyup.enter.native="onSearch"
              >
                <el-select
                  v-model="views.value"
                  slot="prepend"
                  placeholder="选择视图"
                >
                  <el-option
                    :value="item.label"
                    :key="index"
                    v-for="(item,index) in views.list"
                  >
                    {{item.label}}
                    <span style="float:right;">
                      <el-button type="text" icon="el-icon-star-on" style="color: #ff9800;font-size: 14px;font-weight: 600;" v-if="item.defaultView"></el-button>
                    </span>
                  </el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                ></el-button>
              </el-input>
            </el-header>
            <el-main class="event-console-el-main">
              <EventList ref="eventList" :model="search.result.list" :global="global" :options="search.result.options"
                @onSearch="onSearch" 
                @DiagnosisView="((data)=>{ addTab(data.row,data.menu) })"
                @severity:change="onSearchBySeverity"
                @addTab="((data)=>{ addTab(data.row, data.data); })"
                @removeTab="((data)=>{ removeTab(data); })"></EventList>
            </el-main>
            
          </el-container>
        </el-tab-pane>
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list">
            <span slot="label">
              <span v-if="item.callback==='DiagnosisView'">
                
                  <el-button
                      type="default"
                      :style="'position:absolute;top:15px;left:10px;padding: 3px;border-radius: 15px;color:#ffffff;background:' + global.register.event.severity[item.data.severity][2]">
                  </el-button>
                  {{item.title}} {{ item.data.id }}
              </span>
              <span v-else>
                 {{item.title}} ({{views.value}})
              </span>
            </span>
          <!-- 分析 -->
          <DiagnosisView :model="item.data" :global="global" v-if="item.callback==='DiagnosisView'"></DiagnosisView>
          <!-- 智能分组 -->
          <SmartGroupView :model="item.data" :global="global" v-else-if="item.callback==='SmartGroupView'"></SmartGroupView>
          <!-- 右键菜单 -->
          <CtmenuKeepView :model="item.data" :global="global" v-else-if="item.callback==='CtmenuKeepView'"></CtmenuKeepView>
          <!-- 实体抽取 -->
          <EntityView :model="item.data" :global="global" v-else-if="item.callback==='EntityView'"></EntityView>
          <!-- 级别定义 -->
          <SeverityView :model="item.data" :global="global" v-else-if="item.callback==='SeverityView'"></SeverityView>
          <!-- 视图定制 -->
          <DashView :model="item.data" :global="global" v-else-if="item.callback==='DashView'" @toggle-view="initViews"></DashView>
          <!-- 通知管理 -->
          <NotifyView :model="item.data" :global="global" v-else-if="item.callback==='NotifyView'"></NotifyView>
          <!-- 规则管理 -->
          <RuleView :model="item.data" :global="global" v-else-if="item.callback==='RuleView'"></RuleView>
          <!-- 任务管理 -->
          <JobView :model="item.data" :global="global" v-else-if="item.callback==='JobView'"></JobView>
          <!-- 接口管理 -->
          <FsView :model="item.data" :global="global" v-else-if="item.callback==='FsView'"></FsView>
          <!-- 策略管理 -->
          <!-- <PolicyView :model="item.data" :global="global" v-else-if="item.callback==='PolicyView'"></PolicyView> -->
          <!-- 策略管理 -->
          <TriggerView :model="item.data" :global="global" v-else-if="item.callback==='TriggerView'"></TriggerView>
          <!-- 规则设计 -->
          <PipeView :model="item.data" :global="global" v-else-if="item.callback==='PipeView'"></PipeView>
          <!-- 采集管理 -->
          <CollectorView :model="item.data" :global="global" v-else-if="item.callback==='CollectorView'"></CollectorView>
          
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>

import _ from 'lodash';
import EventList from './EventList.vue';
/*import DiagnosisView from './diagnosis/DiagnosisView';
import SmartGroupView from './diagnosis/SmartGroupView';
import EntityView from './diagnosis/EntityView';
import CtmenuKeepView from './contextmenu/EditView';
import SeverityView from './utils/SeverityView';
import DashView from './dashview/DashView';
import NotifyView from './notify/NotifyView';
import RuleView from './rule/RuleView';
import CollectorView from './collector/RuleView';
import JobView from './job/JobView';
import FsView from './api/FsView';
import PolicyView from './policy/PolicyView';
import TriggerView from './trigger/TriggerView';
import PipeView from './pipe/PipeView'; */

export default {
  name: "MainView",
  props: {
    global: Object
  },
  components:{
    EventList,
    DiagnosisView: resolve => {require(['./diagnosis/DiagnosisView.vue'], resolve)},
    CtmenuKeepView: resolve => {require(['./contextmenu/EditView.vue'], resolve)},
    SmartGroupView: resolve => {require(['./diagnosis/SmartGroupView.vue'], resolve)},
    EntityView: resolve => {require(['./diagnosis/EntityView.vue'], resolve)},
    SeverityView: resolve => {require(['./utils/SeverityView.vue'], resolve)},
    DashView: resolve => {require(['./dashview/DashView.vue'], resolve)},
    NotifyView: resolve => {require(['./notify/NotifyView.vue'], resolve)},
    RuleView: resolve => {require(['./rule/RuleView.vue'], resolve)},
    JobView: resolve => {require(['./job/JobView.vue'], resolve)},
    FsView: resolve => {require(['./api/FsView.vue'], resolve)},
    // PolicyView: resolve => {require(['./policy/PolicyView.vue'], resolve)},
    TriggerView: resolve => {require(['./trigger/TriggerView.vue'], resolve)},
    PipeView: resolve => {require(['./pipe/PipeView.vue'], resolve)},
    CollectorView: resolve => {require(['./collector/RuleView'], resolve)}
  },
  data() {
    return {
      loading: false,
      views: {
        value: "",
        list: []
      },
      search: {
        type: "",
        model: {
          term: "",
          view: "all",
        },
        result: {
          list: null,
          options: {
            dtContainerHeight: '130px',
          }
        }
      },
      tabs: {
        activeTab: 'event-list',
        list: []
      },
      openLoading:null
    };
  },
  watch: {
    'tabs.list':{
        handler(val){
            if(val.length > 0){
                document.querySelector("#tab-event-list").style.display = '';
            }else {
                document.querySelector("#tab-event-list").style.display = 'none';
            }
        },
        deep:true
    },
    'views.value':{
      handler(val){
        this.onToggleDefaultView(val);
      }
    },
    'search.model.term':{
      handler(val){
        if(_.isEmpty(val)){
          this.$refs.eventList.dt.selectedSeverity = [];
        }
      }
    }
  },
  created(){

    this.openLoading = function(target) {
      const loading = this.$loading({           // 声明一个loading对象
        lock: true,                             // 是否锁屏
        text: '',                               // 加载动画的文字
        spinner: 'el-icon-loading',             // 引入的loading图标
        background: 'rgba(0, 0, 0, 0)',         // 背景颜色
        target: `.${target}`,                   // 需要遮罩的区域
        body: false,                              
        customClass: 'mask'                     // 遮罩层新增类名
      })
      setTimeout( ()=> {                        // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
        loading.close();                        // 关闭遮罩层
      },3000)
      return loading;
    };

    this.initViews();

    this.eventHub.$on("event-diagnosis",(data)=>{
      this.addTab(data.row,data.menu)
    })
  },
  mounted(){
    this.hideTabEventViewConsoleUl();
  },
  methods: {
    hideTabEventViewConsoleUl(){
      let el = document.querySelector("#tab-event-list");
      let elSpan = document.querySelector("#tab-event-list span");
      if(el) {
          el.style.display = 'none';
          elSpan.style.display = 'none';
      } else {
          setTimeout(this.hideTabEventViewConsoleUl, 50);
      } 
    },
    onToggleDefaultView(val){
      let view = _.find(this.views.list,{label:val});
      let param = encodeURIComponent(JSON.stringify({  action: "setDefaultView", data: { key: 'defaultView', value: view.fullname } }));
      this.m3.callFS("/matrix/m3event/view/action.js", param).then(()=>{
          this.$notify.success(`已设置 ${view.name.replace(/.json/,'')} 为默认视图`);
          this.initViews();
          
          this.$refs.eventList.onRefresh();
          this.$refs.eventList.control.ifVoiceNotify = false;
          
          setTimeout(()=>{
            let ids = _.chain(this.$refs.eventList.model.rows).map('id').compact().uniq().value().slice(0,100);
            this.eventHub.$emit("smartGroup-refresh", ids);
          },1500)
        })
    },
    initViews(){
        let term = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/m3event/view/action.js", term).then((rtn)=>{
            this.views.list = _.map(_.orderBy(rtn.message,['name'],['asc']),v=>{
                                
                                let label = v.name.replace(/\.json/,'');
                                if(v.defaultView){
                                  this.views.value = label;
                                }
                                return _.extend(v, {label: label});
                              });
        })
    },
    onSearchBySeverity(data){
      this.search.model.term = _.map(data,v=>{
        return `severity=${ _.lowerCase(v[0]) }`;
      }).join(";")
      this.onSearch();
    },
    onSearch() {
      
      const rLoading = this.openLoading('event-console-el-main');

      let param = {
        view: this.search.model.view=this.views.value,
        term: this.search.model.term
          ? _.compact([this.search.type,this.search.model.term]).join(" | ")
          : this.search.type,
      };

      this.m3.callFS(
        "/matrix/m3event/event_list.js",
        encodeURIComponent(JSON.stringify(param))
      ).then( (rtn)=>{
          this.search.result.list = rtn.message;
          rLoading.close();
      }).catch( err=>{
        this.search.result.list = null;
        rLoading.close();
        console.error(err);
      } );

    },
    addTab(row,menu){
      
      let find = _.find(this.tabs.list, {name:row.id});
      
      if(find){
        this.tabs.activeTab = row.id;
      } else {
        let data = row;
        /* 智能分组需要传入ids */
        if( _.includes(['smartGroupView'],row.id) ){
            data = _.chain(this.$refs.eventList.model.rows).map('id').compact().uniq().value().slice(0,100);
        } else if(  _.includes(['entityEtl'],row.id) ){
            data = _.compact(_.map(this.$refs.eventList.dt.rows,'entity'));
        } 
        let tabObj = {name: row.id, title: menu.name, type: menu.type, callback: menu[menu.type].name, data: data};
        this.tabs.list.push(tabObj);
        this.tabs.activeTab = row.id;
      }

      
    },
    removeTab(targetName){
      let tabs = this.tabs.list;
        let activeName = this.tabs.activeTab;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              } else {
                activeName = 'event-list';
              }
            }
          });
        }
        
        this.tabs.activeTab = activeName;
        this.tabs.list = tabs.filter(tab => tab.name !== targetName);

        // 关闭智能分组
        this.$refs.eventList.control.ifSmartGroup = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-header {
  height: 40px!important;
  padding: 0px;
}

.el-main {
  padding: 0px;
  overflow: hidden;
}
.el-input-group__prepend > .el-select {
  width: 120px;
}
</style>
