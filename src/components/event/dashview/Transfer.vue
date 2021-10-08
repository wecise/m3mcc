<template>
        <el-row>
            <el-col :span="10">
                <el-container style="border:1px solid #dddddd;height:45vh;">
                    <el-header style="height: 40px;line-height: 40px;background: #f2f2f2;">{{titles[0]}} {{source.selected.length}}/{{source.rows.length}}</el-header>
                    <el-main style="overflow:hidden;">
                        <el-input v-model="all.term" 
                            @input="onSearchAllList" 
                            @clear="onSearchAllList" 
                            placeholder="关键字" 
                            clearable suffix-icon="el-icon-search"
                            class="mx-transfer-search">
                        </el-input>
                        <el-table ref="source"
                            :data="source.rows"
                            style="width: 100%"
                            @selection-change="onSourceSelectionChange">
                            <el-table-column type="selection" width="55" :selectable='onSelectCheckBox'></el-table-column>
                            <el-table-column :label="prop.title[0]">
                                <template slot-scope="scope">
                                    {{scope.row[prop.label[0]]}}
                                    <span v-if="scope.row.iszabbix == 1"> - {{ scope.row.iszabbix | pickZabbix }} </span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="prop.title[1]" width="120">
                                <template slot-scope="scope">
                                    {{scope.row[prop.label[1]].join(", ")}}
                                </template>
                            </el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="right-start"
                                        :title="scope.row.host"
                                        width="350px"
                                        trigger="click"
                                        popper-class="dataTablePopper"
                                        :popper-options="{ boundariesElement: 'body' }">
                                        <el-container>
                                            <el-main>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <p v-for="(v,k) in scope.row.config" :key="k">
                                                            <template v-if="!_.includes(k,'usedpercent')">
                                                                <span v-if="template[k].unit=='number'">{{template[k].title}}: {{mx.bytesToSize(v)}}</span>
                                                                <span v-else>{{template[k].title}}: {{v}}</span>
                                                            </template>
                                                        </p>
                                                    </el-col>
                                                    <el-col :span="16" style="display:flex;border-left:1px solid #dddddd;padding:0px 20px;">
                                                        <div v-for="(v,k) in scope.row.config" :key="k" style="margin:5px;text-align: center;">
                                                            <template v-if="_.includes(k,'usedpercent')">
                                                                <el-progress type="circle" :percentage="v"></el-progress>
                                                                <p>{{template[k].title}}</p>
                                                            </template>
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </el-main>
                                        </el-container>
                                        <el-button slot="reference" type="text" icon="el-icon-postcard"></el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-col>
            <el-col :span="4" style="text-align: center;padding-top: 5em;">
                <p><el-button type="primary" ref="toRightButton" :disabled="_.isEmpty(source.selected)" @click="onToRight">{{buttonTexts[0]}}</el-button></p>
                <p><el-button type="primary" ref="toLeftButton" :disabled="_.isEmpty(target.selected)" @click="onToLeft">{{buttonTexts[1]}}</el-button></p>
                <p><el-button type="default" ref="toLeftButton" :disabled="_.isEmpty(source.selected) && _.isEmpty(target.selected)" @click="onReset">{{buttonTexts[2]}}</el-button></p>
            </el-col>
            <el-col :span="10">
                <el-container style="border:1px solid #dddddd;height:45vh;">
                    <el-header style="height: 40px;line-height: 40px;background: #f2f2f2;">{{titles[1]}} {{target.selected.length}}/{{target.rows.length}}</el-header>
                    <el-main style="overflow:hidden;">
                        <el-input v-model="target.term" 
                            @input="onSearchTargetList" 
                            @clear="onSearchTargetList" 
                            placeholder="关键字" 
                            clearable 
                            suffix-icon="el-icon-search"
                            class="mx-transfer-search">
                        </el-input>
                        <el-table ref="target"
                            :data="target.rows"
                            style="width: 100%"
                            @selection-change="onTargetSelectionChange">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column :label="prop.title[0]">
                                <template slot-scope="scope">
                                    {{scope.row[prop.label[0]]}}
                                    <span v-if="scope.row.iszabbix == 1"> - {{ scope.row.iszabbix | pickZabbix }} </span>
                                </template>
                            </el-table-column>
                            <el-table-column :label="prop.title[1]" width="120">
                                <template slot-scope="scope">
                                    {{scope.row[prop.label[1]].join(", ")}}
                                </template>
                            </el-table-column>
                            <el-table-column width="80">
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="left-start"
                                        :title="scope.row.host"
                                        width="350px"
                                        trigger="click"
                                        popper-class="dataTablePopper"
                                        :popper-options="{ boundariesElement: 'body' }">
                                        <el-container>
                                            <el-main>
                                                <el-row>
                                                    <el-col :span="8">
                                                        <p v-for="(v,k) in scope.row.config" :key="k">
                                                            <template  v-if="!_.includes(k,'usedpercent')">
                                                                <span v-if="template[k].unit=='number'">{{template[k].title}}: {{mx.bytesToSize(v)}}</span>
                                                                <span v-else>{{template[k].title}}: {{v}}</span>
                                                            </template>
                                                        </p>
                                                    </el-col>
                                                    <el-col :span="16" style="display:flex;border-left:1px solid #dddddd;padding:0px 20px;">
                                                        <div v-for="(v,k) in scope.row.config" :key="k" style="margin:5px;text-align: center;">
                                                            <template v-if="_.includes(k,'usedpercent')">
                                                                <el-progress type="circle" :percentage="v"></el-progress>
                                                                <p>{{template[k].title}}</p>
                                                            </template>
                                                        </div>
                                                    </el-col>
                                                </el-row>
                                            </el-main>
                                        </el-container>
                                        <el-button slot="reference" type="text" icon="el-icon-postcard"></el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </el-col>
        </el-row>
</template>

<script>
import _ from 'lodash';

export default ({
    name: 'Transfer',
    props: {
        template: Object,
        row: Object,
        list: Array,
        model: Array,
        prop: {
            key: String,
            label: Array,
            title: Array,
        },
        titles: Array,
        buttonTexts: Array
    },
    data(){
        return {
            all: {
                list: [],
                term: ""
            },
            source: {
                rows:[],
                selected: []
            },
            target:{
                rows: [],
                selected: [],
                term: ""
            }
        }
    },
    filters: {
        pickZabbix(val){
            return val == 1 ? 'Zabbix' : '';
        }
    },
    watch: {
        model(){
            // target
            this.setTargetData();
            // source
            this.setSourceData();
        }
    },
    mounted(){
        this.setAllList();
    },
    methods: {
        onSelectCheckBox(row){
            if( row['disable'] ){
                return 0;
            } else {
                return 1;
            }
        },
        setAllList(){
            if(!_.isEmpty(this.list)){
                // all
                this.all.list = this.list;
                // target
                this.setTargetData();
                // source
                this.setSourceData();
            }
        },
        setTargetData(){
            // target
            if(!_.isEmpty(this.model)){
                this.target.rows = _.filter(this.list, (v)=>{
                    if(_.includes(this.model, v.host)){
                        return v;
                    }
                })
            } else {
                this.target.rows = [];
            }
        },
        setSourceData(){
            try{
                // 排除当前选择的
                this.source.rows = _.difference(this.all.list, this.target.rows);
                
                // 排除选择的数据
                let selectedRows = JSON.parse(JSON.stringify(this.model));
                _.forEach(this.source.rows,(v)=>{
                    if( _.indexOf( selectedRows, v.host) !== -1 ) {
                        v['disable'] = true;
                    } else {
                        v['disable'] = false;
                    }
                })
                
            } catch(err){
                console.error(err);
            }
        },
        onSearchAllList: _.debounce(function(){
            
            if(_.isEmpty(this.all.term)){
                this.m3.callFS("/matrix/depot/getServerList.js").then( rtn=>{
                    this.all.list = rtn.message.rows;
                } );
                
            } else {
                this.m3.callFS("/matrix/depot/getServerList.js", encodeURIComponent(this.all.term) ).then( rtn=>{
                    this.all.list = rtn.message.rows;
                } );
            }

            // 赋值给source
            _.delay(()=>{
                this.setSourceData();
            },500)
        },500),
        onSearchTargetList(){
            let term = this.target.term;
            
            if(term){
                this.target.rows = _.filter(this.target.rows,(v)=>{
                    return v.host.indexOf(term) !== -1;
                });
            } else {
                this.setTargetData();
            }
        },
        onSourceSelectionChange(val){
            this.source.selected = val;
        },
        onTargetSelectionChange(val){
            this.target.selected = val;
        },
        onToRight(){
            this.$emit('update:change', { value:null, direction: 'right', movedKeys: this.source.selected } );
        },
        onToLeft(){
            this.$emit('update:change', { value:null, direction: 'left', movedKeys: this.target.selected } );
        },
        onReset(){
            this.$refs.source.clearSelection();
            this.$refs.target.clearSelection();
        }
    }
})
</script>

<style scoped>

</style>
