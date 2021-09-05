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
                            label: '日志管理',
                            id: 'log',
                            children: []
                        }, 
                        {
                            label: 'TRAP管理',
                            id: 'trap',
                            children: []
                        }, 
                        {
                            label: '外接事件管理',
                            id: 'event',
                            children: []
                        }, 
                        {
                            label: '分析情景管理',
                            id: 'diagnosis',
                            children: []
                        }, 
                        {
                            label: '设备类型管理',
                            id: 'model',
                            children: []
                        }, 
                        {
                            label: '厂商管理',
                            id: 'manufacturer',
                            children: []
                        }, 
                        {
                            label: 'MIB Browser',
                            id: 'mibbrowser',
                            children: []
                        }, 
                        {
                            label: '基础信息导入导出',
                            id: 'infoKeep',
                            children: []
                        },
                        {
                            label: 'OIDGROUP管理',
                            id: 'oidgroup',
                            children: []
                        }, 
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
