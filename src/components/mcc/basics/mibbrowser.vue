<template>
    <el-container>
        <el-header>
            <span style="font-weight:900;">MIB Browser</span>
        </el-header>
        <el-main style="overflow:hidden; display:flex; flex-flow:column nowrap;">
            <div style="background:#ffffff; overflow:hidden; flex:0 0 auto;">
                <div style="height: 40px;padding: 10px 0 0 0;border-bottom:1px solid #dddddd;">
                    <el-form :inline="true">
                        <el-form-item label="地址" label-width="40px">
                            <el-input v-model="snmp_o_p.ip" placeholder="127.0.0.1" style="width:100px;"></el-input>
                        </el-form-item>
                        <el-form-item label="端口" label-width="40px">
                            <el-input v-model="snmp_o_p.port" placeholder="161" style="width:60px;"></el-input>
                        </el-form-item>
                        <el-form-item label="Community" label-width="70px">
                            <el-input v-model="snmp_o_p.community" placeholder="********" style="width:100px;"></el-input>
                        </el-form-item>
                        <el-form-item label="版本" label-width="40px">
                            <el-select v-model="snmp_o_p.version" placeholder="1" style="width:70px;">
                                <el-option label="V1" value="1"></el-option>
                                <el-option label="V2" value="2"></el-option>
                                <el-option label="V3" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="text" @click="run" icon="el-icon-setting"></el-button>
                        </el-form-item>
                        <el-form-item label="OID" label-width="40px">
                            <el-input v-model="snmp_o_p.OID" placeholder=".1.3.6.1.4.1.2021.10.1.5.1" style="width:180px;"></el-input>
                        </el-form-item>
                        <el-form-item label="操作" label-width="40px">
                            <el-select v-model="snmp_o_p.op" placeholder="Get" style="width:120px;">
                                <el-option label="Get" value="Get"></el-option>
                                <el-option label="GetSubtree" value="GetSubtree"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="run">执行</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="overflow:hidden; flex: 1 1 auto;">
                <Split style="background:#ffffff;">
                    <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                        <mibtree @node-click="onNodeClick"></mibtree>
                    </SplitArea>
                    <SplitArea :size="75" :minSize="0" style="overflow:auto;">
                        <el-header>
                            Result Table
                        </el-header>
                        <el-table
                            class="result"
                            :data="result"
                            border
                            style="display:flex; flex-flow:column nowrap;">
                            <el-table-column v-for="rc in result_columns" :key="rc.prop" :prop="rc.prop" :label="rc.label">
                            </el-table-column>
                        </el-table>
                    </SplitArea>
                </Split>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    import _ from 'lodash';
    import $ from 'jquery';
    import mibtree from './mibtree.vue';

    export default {
        components: { mibtree },
        data(){
            return {
                snmp_o_p: {
                    ip: "127.0.0.1",
                    port: 161,
                    community: "haoba_public",
                    version: "1",
                    OID: ".1.3.6.1.4.1.2021.10.1.5.1",
                    op: "Get",
                },
                result: [],
                result_columns: [
                    {prop:"Time", label:"Time"},
                    {prop:"Addr", label:"Addr"},
                    {prop:"Name", label:"Name"},
                    {prop:"OID", label:"OID"},
                    {prop:"Value", label:"Value"},
                    {prop:"Type", label:"Type"},
                ],
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
                if(node.Kind == "Table"){
                    this.snmp_o_p.OID = node.OID
                } else {
                    this.snmp_o_p.OID = node.OID+".0"
                }
            },
            run(){
                let mdata = this.$data
                // $.ajax({
                //     url: "http://127.0.0.1:10801/get?op="+this.snmp_o_p.op+"&OID="+this.snmp_o_p.OID+"&ip="+this.snmp_o_p.ip+"&port="+this.snmp_o_p.port+"&community="+this.snmp_o_p.community+"&version="+this.snmp_o_p.version,
                //     dataType: 'jsonp',
                //     type: 'GET',
                //     success(data) {
                //         //console.debug("onNodeClick",JSON.stringify(data))
                //         if (data && data.Result) {
                //             for (var i=0; i<data.Result.length; i++) {
                //                 mdata.result.push(data.Result[i])
                //             }
                //         }
                //     },
                //     error(err){
                //         console.error("getMIBTree", JSON.stringify(err))
                //     }
                // });
                this.m3
                    .callService("m3service.mibbrowser", "get", {
                        op: this.snmp_o_p.op,
                        OID: this.snmp_o_p.OID,
                        ip: this.snmp_o_p.ip,
                        port: this.snmp_o_p.port,
                        community: this.snmp_o_p.community,
                        version: this.snmp_o_p.version,
                    })
                    .then((res) => {
                        let data = res.message;
                        if(data.Error) {
                            console.error("", data.Error);
                        } else {
                            data = data.Result;
                            //console.debug("onNodeClick",JSON.stringify(data))
                            mdata.result = []
                            if (data && data.Result) {
                                if (data.Result.length>0) {
                                    mdata.result_columns = []
                                    for(var k in data.Result[0]) {
                                        mdata.result_columns.push({
                                                prop: k,
                                                label: k,
                                            })
                                    }
                                }
                                for (var i=0; i<data.Result.length; i++) {
                                    mdata.result.push(data.Result[i])
                                }
                            }
                        }
                    });
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
