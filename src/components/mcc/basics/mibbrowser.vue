<template>
    <el-container>
        <el-header>
            <span style="font-weight:900;">MIB Browser</span>
        </el-header>
        <el-main>
            <div style="height: 40px;padding: 10px 0 0 0;border-bottom:1px solid #dddddd;">
                <el-form :inline="true">
                    <el-form-item label="地址" label-width="40px">
                        <el-input  placeholder="127.0.0.1" style="width:100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="端口" label-width="40px">
                        <el-input  placeholder="161" style="width:60px;"></el-input>
                    </el-form-item>
                    <el-form-item label="Community" label-width="70px">
                        <el-input placeholder="********" style="width:100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="版本" label-width="40px">
                        <el-select value="1" placeholder="V1" style="width:60px;">
                            <el-option label="V1" value="1"></el-option>
                            <el-option label="V2" value="2"></el-option>
                            <el-option label="V3" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" icon="el-icon-setting"></el-button>
                    </el-form-item>
                    <el-form-item label="OID" label-width="40px">
                        <el-input placeholder=".1.3.6.1.4.1.2021.10.1.5.1" style="width:180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="操作" label-width="40px">
                        <el-select value="GetSubtree" placeholder="GetSubtree" style="width:120px;">
                            <el-option label="Get" value="Get"></el-option>
                            <el-option label="GetSubtree" value="GetSubtree"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">执行</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <Split style="background:#ffffff;">
                <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                    <mibtree></mibtree>
                </SplitArea>
                <SplitArea :size="80" :minSize="0" style="overflow:hidden;">
                    <div style="font-weight:900;height:30px;line-height:30px;padding:0 10px;">SNMP Mibs</div>
                    
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
</template>
<script>
    import _ from 'lodash';
    import mibtree from './mibtree.vue';

    export default {
        components: { mibtree },
        data(){
            return {
                tree:{
                    data: [
                        {
                            label: 'oidgroup管理',
                            children: []
                        }, 
                        {
                            label: 'mibbrowser',
                            children: []
                        }, 
                        {
                            label: '日志管理',
                            children: []
                        }, 
                        {
                            label: 'trap管理',
                            children: []
                        }, 
                        {
                            label: '外接事件管理',
                            children: []
                        }, 
                        {
                            label: '分析情景管理',
                            children: []
                        }, 
                        {
                            label: '设备类型管理',
                            children: []
                        }, 
                        {
                            label: '厂商管理',
                            children: []
                        }, 
                        {
                            label: '基础信息导入导出',
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
