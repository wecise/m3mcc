<template>

  <IndexView :global="global"></IndexView>
  
</template>

<script>
import IndexView from './mcc/index.vue';

export default {
  name: 'MainView',
  props: {
    global: Object,
    auth: Object
  },
  components:{
    IndexView
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
