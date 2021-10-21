<template>
    <el-container style="overflow:hidden; flex: 0 0 100%;">
        <el-header>
            <span style="font-weight:900;">MIB Browser</span>
        </el-header>
        <el-main style="overflow:hidden; flex: 1 1 0; display:flex; flex-flow:column nowrap;">
            <div style="background:#ffffff; overflow:hidden; flex:0 0 auto;">
                <div style="padding: 10px 0 0 0; border-bottom:1px solid #dddddd;">
                    <el-form :inline="true">
                        <el-form-item label="地址" label-width="40px">
                            <el-input v-model="snmp_o_p.ip" placeholder="IP" style="width:100px;"/>
                        </el-form-item>
                        <el-form-item label="端口" label-width="40px">
                            <el-input v-model="snmp_o_p.port" placeholder="161" style="width:60px;"></el-input>
                        </el-form-item>
                        <el-form-item label="Community" label-width="70px">
                            <el-input v-model="snmp_o_p.community" placeholder="********" style="width:100px;"></el-input>
                        </el-form-item>
                        <el-form-item label="版本" label-width="40px">
                            <el-select v-model="snmp_o_p.version" placeholder="2" style="width:70px;">
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
                                <el-option label="Walk" value="Walk"></el-option>
                                <el-option label="Table" value="Table"></el-option>
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
                    <SplitArea :size="75" :minSize="0" style="overflow:hidden;">
                        <el-header height="40px">
                            Result Table [<span>{{result.length}}/{{totalcount}}</span>]
                        </el-header>
                        <el-table
                            class="result"
                            :data="result"
                            border
                            height="calc(100% - 40px)">
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
    import mibtree from './mibtree.vue';

    export default {
        components: { mibtree },
        data(){
            return {
                snmp_o_p: {
                    request_id: 0,
                    ip: "",
                    port: 161,
                    community: "",
                    version: "2",
                    OID: ".1.3.6.1.4.1.2021.10.1.5.1",
                    op: "Get",
                },
                result: [],
                totalcount: 0,
                result_columns: [
                    {prop:"Time", label:"Time"},
                    {prop:"Addr", label:"Addr"},
                    {prop:"OID", label:"OID"},
                    {prop:"Name", label:"Name"},
                    {prop:"Value", label:"Value"},
                    {prop:"Type", label:"Type"},
                ],
            }
        },
        beforeDestroy(){
            // 停止持续请求
            this.snmp_o_p.request_id = 0;
        },
        methods:{
            onNodeClick(node){
                if (node.Kind == "Node") {
                    this.snmp_o_p.OID = node.OID
                    this.snmp_o_p.op = "Walk"
                } else if (node.Kind == "Table") {
                    this.snmp_o_p.OID = node.OID
                    this.snmp_o_p.op = "Table"
                } else {
                    this.snmp_o_p.OID = node.OID+".0"
                    this.snmp_o_p.op = "Get"
                }
            },
            run(){
                this.$data.result = []; //执行操作，清除之前数据
                this.snmp_o_p.request_id++;
                this.snmpGet({
                        request_id: this.snmp_o_p.request_id,
                        op: this.snmp_o_p.op,
                        OID: this.snmp_o_p.OID,
                        ip: this.snmp_o_p.ip,
                        port: this.snmp_o_p.port,
                        community: this.snmp_o_p.community,
                        version: this.snmp_o_p.version,
                        continuing: "",
                });
            },
            snmpGet(params){
                let me = this;
                let mdata = this.$data;
                let service = params.continuing?params.continuing:"m3service.mibbrowser"
                this.m3
                    .callService(service, "get", params)
                    .then((res) => {
                        let data = res.message;
                        if(data.Error) {
                            console.error("", data.Error);
                        } else {
                            data = data.Result;
                            //console.debug("onNodeClick",JSON.stringify(data))
                            if(params.request_id == me.snmp_o_p.request_id) {
                                if(data.Continuing) {
                                    // 持续请求
                                    params.continuing = data.Continuing
                                    setTimeout(me.snmpGet, 1, params)
                                }
                                if (data && data.Rows) {
                                    if (data.Rows.length>0) {
                                        mdata.result_columns = []
                                        var keys = data.Rows[0]["--keys--"]
                                        if(!keys) {
                                            keys = Object.keys(data.Rows[0])
                                        }
                                        for(var ki=0; ki<keys.length; ki++) {
                                            var k = keys[ki]
                                            if(k.substring(0,2) != "--") {
                                                mdata.result_columns.push({
                                                            prop: k,
                                                            label: k,
                                                        })
                                            }
                                        }
                                    }
                                    for (var i=0; i<data.Rows.length; i++) {
                                        mdata.result.push(data.Rows[i])
                                    }
                                    mdata.totalcount = Math.max(data.TotalCount, mdata.result.length)
                                }
                            }
                        }
                    });
            }
        }
    }
</script>

<style scoped>
.el-container {
  height: calc(100vh - 80px);
}
.el-header {
  height: 40px !important;
  line-height: 40px;
  padding: 0px 10px;
  background: #f2f2f2;
}
.el-main {
  padding: 0px;
  overflow: hidden;
  background: #ffffff;
}
</style>
