<template>
  <div class="m3">
    ......
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  data(){
    return {
      global: null,
      auth: null,
      control:{
      }
    }
  },
  created(){
    // setTimeout(()=>{
    //   this.global = this.m3.global;
    //   this.auth = this.m3.auth;
    // },1500)
  }
}
</script>

<style>
  body{
    font-size: 12px;
    font-family: "PingFang SC",Arial,"Microsoft YaHei",sans-serif;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
  }
  
  .el-input__inner{
    padding: 0 5px!important;
  }

  .el-menu .svg-icon{
    width: 1.2em!important;
    height: 1.2em!important;
    padding: 0px 5px 0 0;
  }

  .main{
    padding-top: 50px;
    display: flex;
  }

  .container{
    overflow: hidden;
  }
</style>
