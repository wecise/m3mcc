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
                            label: 'snmp监控策略',
                            id: 'snmp',
                            children: []
                        }, 
                        {
                            label: 'icmp监控策略',
                            id: 'icmp',
                            children: []
                        }, 
                        {
                            label: 'rping监控策略',
                            id: 'rping',
                            children: []
                        }, 
                        {
                            label: 'syslog监控策略',
                            id: 'syslog',
                            children: []
                        }, 
                        {
                            label: 'trap监控策略',
                            id: 'trap',
                            children: []
                        }, 
                        {
                            label: '策略导入导出',
                            id: 'policyKeep',
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
