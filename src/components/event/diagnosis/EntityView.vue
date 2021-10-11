<template>
  <!-- <el-container> -->
    <!--el-aside>
        <el-container>
            <el-header></el-header>
            <el-main>
                 <ul class="infinite-list" style="overflow:auto">
                    <li :key="item" v-for="item in model" class="infinite-list-item">{{ item }}</li>
                </ul>
            </el-main>
        </el-container>
    </el-aside-->
    <el-container>
        <el-header></el-header>
        <el-main>
            <el-card class="box-card" :key="k" v-for="(v,k) in groupedEntity">
                <div slot="header" class="clearfix">
                    <span>{{k}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text"></el-button>
                </div>
                
                <el-button type="default" :key="index" v-for="(val,index) in v">
                    {{val}}
                </el-button>
                
            </el-card>
        </el-main>
    <!-- </el-container> -->
  </el-container>
</template>

<script>
import _ from 'lodash';

export default {
  name: "EntityView",
  props: {
    model: Object
  },
  data() {
    return {
      
    };
  },
  computed:{
      groupedEntity(){
          return _.groupBy(this.model,(v)=>{
              return v.split(":")[0];
          })
      }
  },
  created(){
    
  },
  methods: {
    

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 115px);
    }

    .el-header{
        height: 30px!important;
        line-height: 30px;
        background: #f2f2f2;
    }

    .el-main{
        display: flex;
        flex-wrap: wrap;
    }

    .infinite-list {
        height: 100%;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .infinite-list .infinite-list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        background: #e8f3fe;
        margin: 10px;
        color: #7dbcfc;
    }

    .box-card{
        width:300px;
        margin:10px;    
    }
    .box-card .el-card__body{
        display: flex;
        flex-wrap: wrap;
    }

</style>
