<template>
    <div class="container">
        <div class="animated fadeIn">
           <el-tree :data="tree.data" :props="tree.defaultProps" 
                @node-click="onNodeClick"></el-tree>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';

    export default {
        data(){
            return {
                tree:{
                    data: [
                        {
                            label: '管理',
                            id: 'keep',
                            children: []
                        }, 
                        {
                            label: '统计报表',
                            id: 'summary',
                            children: []
                        }
                    ],
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    }
                }
            }
        },
        methods:{
            onNodeClick(node){
                
            }
        }
    }
</script>

<style scoped>
    .container{
        background: #f2f2f2;
    }
</style>
