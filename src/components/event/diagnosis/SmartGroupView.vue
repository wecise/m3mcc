<template>
  <el-container>
    <el-main style="overflow:hidden;padding:1px;">
        <Split>
            <SplitArea :size="30" :minSize="0" style="overflow:hidden;">
                <el-container>
                    <el-header style="height:30px;line-height:30px;">
                        <span style="font-weight:600;color:#555;">
                            <span class="el-icon-s-grid"></span> 分组列表
                        </span>
                        <el-tooltip :content="$t('event.actions.refresh')"  placement="top">
                            <el-button type="text" @click="onRefresh" style="float:right;">
                                <span class="el-icon-refresh" style="cursor:pointer;"></span>
                            </el-button>
                        </el-tooltip>
                    </el-header>
                    <el-main style="overflow:hidden;">
                        <el-table
                            :data="smartGroup.dt.rows"
                            :highlight-current-row="true"
                            :row-class-name="rowClassName"                
                            ref="groupedTable"
                            style="width:100%;"
                            class="smartGroup-list"
                            @row-click="onSmartGroupSelectionChange">
                            <template v-for="item in smartGroup.dt.columns">
                                <el-table-column 
                                    :prop="item.field"
                                    sortable 
                                    show-overflow-tooltip
                                    :key="item.id"
                                    :label="item ? item.title : ''"
                                    :width="item.width"
                                    v-if="item.visible">
                                    <template slot-scope="scope">
                                        <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                            v-if="typeof item.render === 'function'">
                                        </div>
                                        <div v-else>
                                            {{scope.row[item.field]}}
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-main>
                </el-container>
            </SplitArea>
            <SplitArea :size="70" :minSize="0" style="overflow:hidden;">
                
                <Split direction="vertical">
                    <SplitArea :size="64" :minSize="0" style="overflow:hidden;">
                        
                        <GraphView :model="graph.model" v-if="graph.model && graph.model.length>0"></GraphView>
                        
                    </SplitArea>
                    <SplitArea :size="36" :minSize="0" style="overflow:hidden;">
                        <EventList ref="eventList" 
                            id="smartGroupTable"
                            :model="dt" 
                            :global="global" 
                            :options="dt.options" 
                            rowClass="smartGroupEvent"
                            @DiagnosisView="onDiagnosis"
                            @smartGroupEvent-row-click="onPositionAtGraph"
                            height="0px">
                        </EventList> 
                    </SplitArea>
                </Split>
            </SplitArea>
        </Split>
    </el-main>
  </el-container>
</template>

<script>
import _ from "lodash";
import EventList from '../EventList.vue';
import GraphView from './GraphView.vue'


export default {
  name: "SmartGroupView",
  props: {
    model: Array,
    global: Object
  },
  components:{
    EventList,
    GraphView
  },
  data() {
    return {
        ids: [],
        smartGroup:{
            dt: {
                rows: [],
                columns: [],
                selected: []
            }
        },
        dt: {
            rows: [],
            columns: [],
            selected: [],
            options:{
                header:false,
                dtContainerHeight: '560px',
                severityBar: false
            }
        },
        graph: {
            model: null
        }
    };
  },
  watch:{
      'smartGroup.dt.selected':{
          handler(val){
              this.loadEventListByGroup(val);
          }
      },
      'model':{
          handler(val){
              this.ids = val;
          },
          immediate: true
      },
      ids:{
          handler:function(){
            this.initData();
          },
          immediate: true
        },
      'dt.rows':{
          handler(val){
              this.graph.model = _.compact(_.map(val,'entity'));
          }
      }
  },
  created(){
      this.eventHub.$on("smartGroup-refresh",(data)=>{
          this.ids = data;
      });
  },
  mounted(){
        
        this.$refs.groupedTable.setCurrentRow(this.smartGroup.dt.rows[0]);
        
        setTimeout(()=>{
            this.smartGroup.dt.selected = !_.isEmpty(this.smartGroup.dt.rows)?this.smartGroup.dt.rows[0].ids.split(";"):[];
            this.$refs.groupedTable.setCurrentRow(this.smartGroup.dt.rows[0]);
        },1000)
      
  },
  methods: {
    rowClassName({rowIndex}){
        return `smartGroupList-row-${rowIndex}`;
    },
    onRefresh(){
        this.initData();
    },
    initData(){
        const rLoading = this.openLoading('smartGroup-list');
        this.smartGroup.dt.rows = [];
        this.graph.model = [];
        this.dt.rows = [];

        let term = encodeURIComponent(JSON.stringify(this.ids));
        this.m3.callFS("/matrix/m3event/diagnosis/smartGroup.js", term).then((rtn)=>{
            let rt = rtn.message;
            _.extend(this.smartGroup.dt, {columns: _.map(rt.template, (v)=>{
                
                if(_.isUndefined(v.visible)){
                    _.extend(v, { visible: true });
                }

                if(!v.render){
                    return v;
                } else {
                    return _.extend(v, { render: eval(v.render) });
                }
                
            })});
            
            _.extend(this.smartGroup.dt, { rows: rt.rows });

            rLoading.close();

        })
    },
    onSmartGroupSelectionChange(row){
        this.smartGroup.dt.selected = row.ids.split(";");
    },
    loadEventListByGroup(val){

        if(_.isEmpty(val)){
            this.dt.rows = [];
            return false;   
        }

        let term = encodeURIComponent(JSON.stringify(val));

        this.m3.callFS("/matrix/m3event/diagnosis/eventListBySmartGroup.js", term).then( (rtn) =>{
            
            let rt = rtn.message;

            _.extend(this.dt, {columns: _.map(rt.columns, (v)=>{
                
                if(_.isUndefined(v.visible)){
                    _.extend(v, { visible: true });
                }

                if(!v.render){
                    return v;
                } else {
                    return _.extend(v, { render: eval(v.render) });
                }
                
            })});
            _.extend(this.dt, { rows: rt.rows });
        })
    },
    onDiagnosis(data){
        this.eventHub.$emit("event-diagnosis", data);
    },
    onPositionAtGraph(data){
        this.eventHub.$emit('graph-position',{ row:data, hFlag:true,vFlag:true});
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 115px);
        background: #f2f2f2;
        border:unset!important;
    }

    .smartGroup-list .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    } 
    
</style>

<style>

    .smartGroup-list .el-table__body-wrapper{
        height: calc(100vh - 210px)!important;
        overflow: auto;
    }
    #smartGroupTable .event-list.el-table .el-table__body-wrapper {
        overflow: auto;
        position: relative;
        height: calc(100vh - 590px)!important;
    }
</style>

