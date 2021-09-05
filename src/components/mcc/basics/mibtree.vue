<template>
    <el-container>
        <el-header>
            SNMP MIBS
        </el-header>
        <el-main>
            <Split style="background:#ffffff;" direction="vertical">
                <SplitArea :size="60" :minSize="0" style="overflow:hidden;">
                    <el-tree :data="tree.data" :props="tree.defaultProps" 
                        @node-click="onNodeClick"></el-tree>
                </SplitArea>
                <SplitArea :size="40" :minSize="0" style="overflow:hidden;">
                    <el-table
                        :data="dt.rows"
                        height="120"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="name"
                        label="Name"
                        width="180">
                        </el-table-column>
                        <el-table-column
                        prop="cisco"
                        label="Cisco"
                        width="120">
                        </el-table-column>
                    </el-table>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
</template>
<script>
    import _ from 'lodash';

    export default {
        data(){
            return {
                tree:{
                    data: [
                        {
                            label: 'MIB Tree',
                            children: [
                                {
                                    label: 'mibbrowser',
                                    children: []
                                }, 
                                {
                                    label: '.iso.org.dod.internet',
                                    children: [
                                        {
                                            label: 'mgmt',
                                            children: []
                                        }, 
                                        {
                                            label: 'private',
                                            children: [
                                                {
                                                    label: 'enterprise',
                                                    children: [
                                                        {
                                                            label: 'cisco',
                                                            children: []
                                                        }, 
                                                        {
                                                            label: 'ucdavls',
                                                            children: []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, 
                                        {
                                            label: 'snmpV2',
                                            children: [
                                                {
                                                    label: 'snmpModules',
                                                    children: []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    defaultProps: {
                        children: 'children',
                        label: 'label'
                    }
                },
                dt:{
                    rows: [],
                    columns: []
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
    .el-container{
        height: calc(100vh - 80px);
    }
    .el-header{
        height: 40px!important;
        line-height: 40px;
        padding: 0px 10px;
        background: #f2f2f2;
    }
    .el-main{
        padding: 0px;
        overflow: hidden;
        background: #ffffff;
    }
</style>
<style>
    .el-tree{
        height: 100%;
    }
    .el-tree-node__label {
        font-size: 12px!important;
    }
</style>
