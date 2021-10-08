<template>
  <FormView :term="model.id" :cHeight="20" v-if="model"></FormView>
</template>

<script>
import FormView from '../utils/FormView';

export default {
  name: "InfoView",
  props: {
    model: Object
  },
  components:{
    FormView
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 205px);
  }

  .el-main{
    overflow: hidden;
  }
</style>
