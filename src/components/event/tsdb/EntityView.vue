<template>
    <div style="positon">
        <el-input placeholder="请输入内容" v-model="entity.term" class="input-with-select">
            <template slot="prepend">
                <div>
                    <el-dropdown trigger="hover" placement="top-end"  :hide-on-click="true">
                        <el-tooltip content="选则实体类">
                            <el-button type="text" size="mini">
                                <i class="el-icon-office-building" style="font-size:16px;padding: 10px;"></i>
                            </el-button>
                        </el-tooltip>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <template>
                                    <el-tree :data="tree.data" :props="tree.defaultProps" @node-click="onNodeClick">
                                        <span slot-scope="{ node, data }">
                                            <span v-if="data.children">{{ node.label }}</span>
                                            <span v-else>{{data.field}}</span>
                                        </span>
                                    </el-tree>
                                </template>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    
                    <el-button v-if="entity.prefix" style="margin-left:10px;" @click="entity.dt.show=!entity.dt.show;"> {{entity.prefix.class}}</el-button>

                </div>
            </template>
            
            <el-button slot="append" icon="el-icon-search"></el-button>

        </el-input>

        <el-container style="top: 95px;
                    position: absolute;
                    z-index:1000;
                    width: 94%;
                    height: 50vh;
                    background: #f2f2f2;
                    border: 1px solid #ddd;
                    text-align:center;"

            v-if="entity.dt.show">
            <el-main>
                <el-table
                    :data="entity.dt.rows"
                    @selection-change="onEntityNodeClick"
                    style="width: 100%"
                    stripe
                    border>
                    <el-table-column
                        type="selection"
                        width="55"
                        fixed="left">
                    </el-table-column>
                    <el-table-column :key="index" v-for="(item,index) in entity.dt.columns"
                        :prop="item.field"
                        :label="item.title"
                        :width="item.width">
                    </el-table-column>
                    </el-table>
            </el-main>
            <el-footer>
                <el-button type="default" @click="entity.dt.show = false;">关闭</el-button>
            </el-footer>
        </el-container>

    </div>
    
    
</template>

<script>
import _ from 'lodash';
export default {
  name: 'EntityView',
  props: {
    global: Object
  },
  data(){
      return {
        tsdb: null,
        tree: {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'class'
                }
        },
        entity: {
            prefix: null,
            term: "",
            tree: {
                defaultProps: {
                    children: 'children',
                    label: 'id'
                },
                data: []
            },
            dt: {
                show: false,
                rows: [],
                columns: [],
                selected: []
            }
        }
      }
  },
  watch: {
      'entity.prefix':{
          handler(){
              this.searchEntityByClass();
          }
      },
      'entity.term':{
          handler(){
              this.searchEntityByClass();
          }
      },
      'entity.tree.data':{
          handler(val){
              if(val.length > 0){
                  this.entity.dt.show = true;
              }else {
                  this.entity.dt.show = false;
              }
              this.entity.dt.rows = val;
              this.entity.dt.columns = _.map(val[0],(v,k)=>{
                  return {field:k,title:k,width:180};
              })
          }
      }
  },
  created(){
      this.getTsdb();
  },
  methods:{
      getTsdb(){
        this.m3.callFS("/matrix/m3event/diagnosis/tsdb/getTsdbList.js").then( rtn=>{
            this.tsdb = rtn.message;

            this.tree.data = _.sortBy(_.map(_.groupBy(this.tsdb,'class'), (v,k)=>{
                return {class:k, children:v};
            }),['class'],['asc'])
        } )
      },
      onNodeClick(treeNode){
          this.entity.prefix = treeNode;
          this.$emit("bucket-selected",treeNode);
      },
      searchEntityByClass(){

          let param = JSON.stringify( {term: this.entity.term, class: this.entity.prefix.class} );
          this.m3.callFS("/matrix/m3event/diagnosis/tsdb/searchEntityByClass.js", param).then(rtn=>{
              this.entity.tree.data = rtn.message;
          })
      },
      onEntityNodeClick(val){
          this.entity.dt.selected = val;
          this.$emit("entity-selected",val);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .el-table__body-wrapper{
        height: calc(50vh - 160px);
    }
    .el-table .cell {
        white-space: nowrap!important;
    }

    /* el-table hover actived style */
    /* .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #3c99f7!important;
    }
    .el-table__body tr.current-row>td {
            background-color:#3c99f7!important;;
    } */
</style>
