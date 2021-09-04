<template>
    <el-container>
        <el-header>
            <span style="font-weight:900;">MIB Browser</span>
        </el-header>
        <el-main>
            <div style="height: 40px;padding: 10px 0 0 0;border-bottom:1px solid #dddddd;">
                <el-form :inline="true">
                    <el-form-item label="测试地址" label-width="70px">
                        <el-input  placeholder="测试地址"></el-input>
                    </el-form-item>
                    <el-form-item label="Community" label-width="70px">
                        <el-input placeholder="Community"></el-input>
                    </el-form-item>
                    <el-form-item label="版本" label-width="40px">
                        <el-select placeholder="版本" style="width:80px;">
                            <el-option label="V1" value="v"></el-option>
                            <el-option label="V2" value="v2"></el-option>
                            <el-option label="V3" value="v3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Oid" label-width="40px">
                        <el-input placeholder="Oid"></el-input>
                    </el-form-item>
                    <el-form-item label="操作" label-width="40px">
                        <el-select placeholder="操作" style="width:80px;">
                            <el-option label="V1" value="v"></el-option>
                            <el-option label="V2" value="v2"></el-option>
                            <el-option label="V3" value="v3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">执行</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <Split style="background:#ffffff;">
                <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                    <div style="font-weight:900;height:30px;line-height:30px;padding:0 10px;">监控配置</div>
                    <el-tree :data="tree.data" :props="tree.defaultProps" 
                        @node-click="onNodeClick"></el-tree>
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

    export default {
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
        background: #ffffff;
    }
    .el-header{
        height: 40px!important;
        line-height: 40px;
        padding: 0px 10px;
        background: #f2f2f2;
    }
    .el-main{
        padding: 0px;
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
