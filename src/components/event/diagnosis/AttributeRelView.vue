<template>
  
    <el-container>
        <el-header style="height:auto!important;min-height:60px!important;">
            <el-dropdown style="position:absolute;top:5px;left:15px;" trigger="click">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-grid el-icon--right" style="cursor:pointer;padding-top:10px;font-size:16px;"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width:30vw;padding:20px;">
                    <el-container>
                        <el-header style="height: 40px;line-height: 40px;padding:0px;" v-if="attr.dt.selected.length > 1">
                            <span style="float:right;">
                                <el-button type="success" @click="onAttrSelect(';')">选择（OR）</el-button>
                                <el-button type="warning" @click="onAttrSelect('|')">选择（AND）</el-button>
                            </span>
                        </el-header>
                        <el-header style="height: 40px;line-height: 40px;padding:0px;" v-else-if="attr.dt.selected.length == 1">
                            <span style="float:right;">
                                <el-button type="primary" @click="onAttrSelect(',')">选择同一 {{ attr.dt.selected | pickAttrName }}</el-button>
                            </span>
                        </el-header>
                        <el-header style="height: 40px;line-height: 40px;padding:0px;" v-else>
                            <span>选择属性
                            </span>
                        </el-header>
                        <el-main style="padding: 10px 0 0 0;">
                            <el-table
                                ref="attrTable"
                                border
                                stripe
                                :data="attr.dt.rows"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="onAttrSelectionChange"
                                class="diagnosis-attr-table">
                                <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="属性"
                                    width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="value"
                                    label="值">
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="tag-box" v-if="attr.tag.list.length > 0">
                <el-tag 
                    class="tag-box-item"
                    :key="index" 
                    v-for="(tag,index) in attr.tag.list"
                    :type="attr.tag.type"
                    effect="dark"
                    closable
                    @close="onAttrTagClose(tag)">{{tag}}</el-tag>
            </div>
        </el-header>
        <el-main style="padding:0px;overflow:hidden;">
            <EventList :model="result.dt" :global="global" :options="result.dt.options" rowClass="attributeRelEvent" @DiagnosisView="onDiagnosis" v-if="result.dt.rows"></EventList>
        </el-main>
    </el-container>

</template>

<script>
import EventList from '../EventList.vue'
import _ from 'lodash';

export default {
  name: "AttributeRelView",
  props: {
    model: Object,
    global: Object
  },
  components:{
    EventList
  },
  data() {
    return {
      attr:{
          dt: {
              // 属性列表
              rows: [],
              // 选择的属性
              selected: [],
              // 初始化的属性
              init: ['biz','host','entity']
          },
          // 根据选择的属性生成的tag条件
          tag: {
              list:[],
              type: _.sample(['info'])
          }
      },
      result: {
          dt: {
              rows: [],
              columns: [],
              options:{
                  header:false,
                  dtContainerHeight: '320px',
                  severityBar: false
                }
          }
      }
    };
  },
  watch:{
      'attr.tag.list':{
          handler(val){
            if(_.isEmpty(val)) {
                this.result.dt.rows = [];
                return false;
            }
            this.onSearchByTags(val);
          }
      }
  },
  filters: {
      pickAttrName(val){
          return _.map(val,'name')[0];
      }
  },
  created(){
     this.initData();
     
     // 初始化维度查询
     this.initAttr();
  },
  methods: {
    initData(){
        
        this.attr.dt.rows = _.compact(_.map(this.model, (v,k)=>{
                                if(!v) return;
                                return {name:k, value:v};
                            }));
    },
    initAttr(){
        this.attr.dt.selected = _.filter(this.attr.dt.rows, (v)=>{
                                    if( _.indexOf(this.attr.dt.init,v.name) !== -1 ){
                                        return v;
                                    }
                                });
        
        this.onAttrSelect(" ; ");
    },
    onAttrSelectionChange(val){
        this.attr.dt.selected = val;
    },
    onAttrSelect(val){
        let selected = _.map(this.attr.dt.selected, (v)=>{
            return `${v.name}='${v.value}'`;
        }).join(` ${val} `);
        
        if( _.indexOf(this.attr.tag.list,selected) !== -1 ) {
            this.$message({
                type: "info",
                message: "已选择属性"
            })
            return;
        } else {
            this.attr.tag.list.push( selected );
        }

        if(!_.isEmpty(this.attr.dt.selected)){
            this.attr.dt.selected = [];
            
            if(this.$refs.attrTable){
                this.$refs.attrTable.clearSelection();
            }
        }
    },
    onAttrTagClose(tag){
        this.attr.tag.list.splice(this.attr.tag.list.indexOf(tag), 1);
    },
    onSearchByTags(val){
        let term = encodeURIComponent(JSON.stringify(  val.join(" | ") ).replace(/%/gi,'%25'));
        this.m3.callFS("/matrix/m3event/diagnosis/attributeRel.js", term).then( (rtn)=>{
            this.result.dt = rtn.message;
        } )
    },
    onDiagnosis(data){
        this.eventHub.$emit("event-diagnosis", data);
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container{
    height:calc(100vh - 205px);
    border:unset!important;
}

.el-main{
    padding:0px;
}

.tag-box{
display: flex;
flex-wrap: wrap;
height:100px!important;
align-items: center;
}
.tag-box-item{
    margin: 5px;
}
</style>

<style>
.diagnosis-attr-table.el-table .el-table__body-wrapper {
    height: calc(100vh - 290px)!important;
    overflow: auto;
}
</style>
