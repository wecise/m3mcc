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
                            label: 'mibbrowser',
                            id: 'mibbrowser',
                            children: []
                        },
                        {
                            label: '指标管理',
                            id: 'kpiKeep',
                            children: []
                        }, 
                        {
                            label: '分析情景管理',
                            id: 'situation',
                            children: []
                        }, 
                        {
                            label: '设备管理',
                            id: 'entity',
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
                this.$emit("node-click",node)
            }
        }
    }
</script>

<style scoped>
    .container{
        background: #f2f2f2;
    }

    .el-tree-node__label {
        font-size: 12px;
    }
</style>
