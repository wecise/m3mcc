<template>
  
    <el-container>
      <el-header>
            
            <el-tooltip content="刷新">
                <el-button type="text" @click="onRefresh" icon="el-icon-refresh"></el-button>
            </el-tooltip>

        </el-header> 
        <el-main>
            <el-table
                :loading="loading"
                :data="dt.rows"
                highlight-current-row
                style="width: 100%"
                :row-class-name="rowClassName"
                ref="table">
                <el-table-column type="selection" align="center"></el-table-column> 
                <template v-for="(item,index) in dt.columns">
                  <el-table-column :prop="item['field']"
                      sortable 
                      show-overflow-tooltip
                      :key="index"
                      :label="item.title" 
                      :formatter="item.render" 
                      :width="item.width"
                      v-if="item.visible"
                      min-width="160">
                  </el-table-column>
                </template>
            </el-table>
        </el-main>
    </el-container>

</template>

<script>
import _ from 'lodash';

export default {
  name: "JobView",
  props: {
    model: Object,
    global: Object
  },
  data() {
    return {
        loading: false,
        search: {
          type: "#/matrix/jobs/jobrun",
          model: {
            term: "",
            view: "all",
          }
        },
        dt: {
            rows: [],
            columns: [],
            selected: [],
            orderBy: [['status','stime'],['desc','desc']],
        }
    }
  },
  created(){
      this.onSearch();
  },
  methods: {
      /* 
          重新加载数据 
          重置样式
      */
      onRefresh(){
          this.$refs.table.clearSort();
          this.onSearch();
      },
      onSearch(){

        this.loading = true;

        let param = {
          view: this.search.model.view,
          term: this.search.model.term
            ? `${this.search.type} | ${this.search.model.term}`
            : this.search.type,
        };

        this.m3.callFS(
          "/matrix/m3event/job/job_list.js",
          encodeURIComponent(JSON.stringify(param))
        ).then( (rt)=>{
            let rtn = rt.message; 
            _.extend(this.dt, {columns: _.map(rtn.template, (v)=>{
                  
              if(_.isUndefined(v.visible)){
                  _.extend(v, { visible: true });
              }

              if(!v.render){
                  return v;
              } else {
                  return _.extend(v, { render: eval(v.render) });
              }
              
          })});

          /* 
            *   1、默认排序
            */
          let rows = _.orderBy(rtn.rows,this.dt.orderBy[0], this.dt.orderBy[1]);
          _.extend(this.dt, { rows: rows });

            this.loading = false;
        }).catch( ()=>{
          this.loading = false;
        } );
          
      },
      rowClassName({rowIndex}){
          return `row-${rowIndex}`;
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 115px);
    background: #f2f2f2;
  }
  .el-header{
    height:30px!important;
    line-height:30px;
  }
</style>
