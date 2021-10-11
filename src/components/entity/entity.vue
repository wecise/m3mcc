<template>
    <el-container style="padding:20px 0;height:calc(100vh - 30px);">
        <el-header>
            <el-input
                :placeholder="search.placeholder"
                v-model="search.term"
                clearable
                @clear="onSearch"
                @keyup.enter.native="onSearch">
                <template slot="prepend">
                    <el-popover
                        placement="top-end"
                        trigger="click"
                        popper-class="info-popper"
                        :popper-options="{ boundariesElement: 'body' }"
                        :inline="true"
                        @show="onShowDatePicker">
                        <div class="block">
                            <el-date-picker
                                v-model="search.time.range"
                                :picker-options="search.time.options"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right"
                                ref="datePicker">
                            </el-date-picker>
                        </div>
                        <el-button slot="reference" icon="el-icon-timer" style="height:42px;"></el-button>
                    </el-popover> 
                </template>
                {{search.placeholder}}
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                  :loading="search.loading"
                ></el-button>
            </el-input>
            <div style="height: 30px;line-height: 30px;">
                
                <el-tooltip content="刷新"  placement="top">
                    <el-button type="text" @click="onReloadAndRefresh">
                        <span class="el-icon-refresh" style="cursor:pointer;font-size:16px;"></span>
                    </el-button>
                </el-tooltip>

                <el-tooltip content="新增实体"  placement="top">
                    <el-button type="text" @click="onReloadAndRefresh">
                        <span class="el-icon-plus" style="cursor:pointer;font-size:16px;"></span>
                    </el-button>
                </el-tooltip>
                
                <el-tooltip :content="control.ifRefresh?'自动刷新启用中':'自动刷新关闭中'" placement="top" >
                    <span style="float:right;">
                        {{ control.ifRefresh ? '自动刷新' : '刷新关闭' }}
                        <el-switch
                            v-model="control.ifRefresh"
                            active-color="#13ce66"
                            inactive-color="#dddddd"
                            :active-value="true"
                            :inactive-value="false">
                        </el-switch>
                    </span>
                </el-tooltip>

                <el-dropdown style="padding-left:10px;">
                    <span class="el-dropdown-link">
                        <i class="el-icon-s-grid el-icon--right" style="cursor:pointer;padding-top:7px;font-size:16px;"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div class="tool-box">
                            
                            <div class="tool">
                                <div>选择导出</div>
                                <p>
                                    <el-dropdown style="cursor:pointer;font-size:16px;" @command="onExport">
                                        <span class="el-icon-download"></span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="csv">CSV</el-dropdown-item>
                                            <el-dropdown-item command="txt">TXT</el-dropdown-item>
                                            <el-dropdown-item command="xlsx">Excel</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </p>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>   
        
        <el-main style="padding-top:0px;">
            
            <el-table
                :loading="search.loading"
                :data="dt.rows"
                :highlight-current-row="true"
                :row-class-name="rowClassName"                
                @row-click="onRowClick"
                @selection-change="(data)=>{ dt.selected = data; }"
                @sort-change="onSortChange"
                :header-cell-class-name="headerCellClassName"
                ref="table"
                height="70vh"
                border
                stripe
                style="width:100%;">
                <el-table-column label="序号" type="index" show-overflow-tooltip width="50" fixed>
                </el-table-column>
                <!-- <el-table-column type="selection" align="center"></el-table-column>  -->
                <template v-for="(item,index) in dt.columns">
                    <el-table-column 
                        :prop="item.field"
                        :label="item.title" 
                        sortable 
                        show-overflow-tooltip
                        :key="index"
                        :width="item.width"
                        :formatter="item.render"
                        v-if="item.visible">
                        <template slot-scope="scope">
                            <div style="height:30px;line-height:30px;" v-if="item.field=='tags'">
                                <TagView domain='auditlog' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                            </div>
                            <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                v-else-if="typeof item.render === 'function'">
                            </div>
                            <div v-else>
                                <el-popover
                                    placement="top-start"
                                    width="550"
                                    trigger="click"
                                    popper-class="info-popper"
                                    :popper-options="{ boundariesElement: 'body' }"
                                    v-if="item.field=='operation'">
                                    <el-container>
                                        <el-main style="padding:0px;">
                                            <VueEditor
                                                v-model="scope.row[item['field']]"
                                                @init="onEditorInit"
                                                :lang="editor.lang.value"
                                                :theme="editor.theme.value"
                                                width="100%"
                                                height="30vh"
                                                style="border:1px solid #f2f2f2;border-left: unset;"
                                                ref="datasourceEditor"
                                            ></VueEditor>
                                        </el-main>
                                    </el-container>
                                    <el-button type="text" slot="reference">
                                        <span class="el-icon-date"></span></el-button>
                                </el-popover>
                                {{scope.row[item.field]}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="操作" width="60" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip content="删除" placement="top">
                            <el-button type="danger" style="padding:3px 6px;" @click="onDelete(scope.row,scope.$index)" icon="el-icon-delete" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <div class="footbar">
                {{ info.join(' &nbsp; | &nbsp;') }}
                <span style="float:right;padding-right:10px;">
                    <countdown 
                        :left-time="60000"
                        @finish="onCountDownS" ref="vac" v-if="control.ifRefresh"> 
                        <span
                        slot="process"
                        slot-scope="{ timeObj }">
                            {{ `距离下次刷新：${timeObj.ceil.s} 秒` }}
                        </span>
                    </countdown>
                </span>
            </div>
        </el-footer>
    </el-container>
</template>

<script>

import _ from 'lodash';
import TagView from '../tags/TagView';
import Vue from 'vue';
import vueAwesomeCountdown from 'vue-awesome-countdown';
Vue.use(vueAwesomeCountdown, 'vac');
window.moment = require("moment");

export default {
    components: {
        TagView,
        VueEditor: require("vue2-ace-editor"),
    },
    data(){
   
        return {
            editor: {
                term: "",
                data: null,
                loading: false,
                lang: {
                    value: "toml",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                }
            },
            rowClass: {
                type: String,
                default: "auditlog"
            },
            search: {
                loading: false,
                type: "",
                placeholder: "",
                term: "",
                result: null,
                time: {
                    range: [this.moment().add(-24,'hour').format('YYYY-MM-DD HH:mm'),this.moment().format('YYYY-MM-DD HH:mm')],
                    options: {
                        shortcuts:[
                            {
                                text: '最近15分钟',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 900 * 1000);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近30分钟',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 1800 * 1000);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近一小时',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 1);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近一天',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近七天',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近30天',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近60天',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近半年',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近1年',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近2年',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2);
                                    picker.$emit('pick', [start, end]);
                                }
                            }, {
                                text: '最近5年',
                                onClick(picker) {
                                    const end = new Date();
                                    const start = new Date();
                                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 5);
                                    picker.$emit('pick', [start, end]);
                                }
                            }
                    ]}
                }
            },
            dt:{
                chunk:[],
                pageNum: 0,
                pageSize: 50,
                rows:[],
                columns: [],
                selected: [],
                summary: null,
                orderBy: [{name:'vtime',value:'desc'}]
            },
            info: [],
            control:{
                ifRefresh: true
            }
        }
    },
    watch: {
        'search.result': {
            handler(val){

                this.dt.pageNum = 0;

                if(val){
                    
                    this.info = [];
                    this.info.push(`共 ${val.rows.length} 项`);
                    this.info.push(`已选择 ${this.dt.selected.length} 项`);
                    this.info.push(this.moment().format("YYYY-MM-DD HH:mm:ss.SSS"));

                    this.initData(val);
                }
            },
            deep: true,
            immediate:true
        },
        'dt.selected': {
            handler(val){
                this.info = [];
                this.info.push(`共 ${this.dt.rows.length} 项`);
                this.info.push(`已选择 ${val.length} 项`);
                this.info.push(this.moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
            }
        },
        'search.loading'(val){
            this.control.ifRefresh = !val;
        },
        'control.ifRefresh':{
            handler(){
                this.$nextTick(()=>{
                    //this.onCountdownTimeRefresh(val);
                })
            },
            immediate: true
        },
        'search.time.range':{
            handler(val){
                if(val) {
                    this.search.placeholder = "window " + val.join(" to ");
                }
            },
            immediate: true
        }
    },
    computed:{
        metaColumns(){
            try{
                return this.model.columns[this.model.rootClass];
            } catch(err){
                return [];
            }
        }
    },
    mounted(){  

        this.onSearch();
        
        this.$refs.table.bodyWrapper.addEventListener('scroll', (evt) => {
            // 滚动距离
            let scrollTop = Math.round(evt.target.scrollTop); 
            // 变量windowHeight是可视区的高度
            let windowHeight = evt.target.clientHeight;
            // 变量scrollHeight是滚动条的总高度
            let scrollHeight = evt.target.scrollHeight;
            
            //console.log(scrollTop, windowHeight, scrollHeight)

            // 脚底
            if (scrollTop + windowHeight === scrollHeight) {
                this.onLoadMore(); 
                _.delay(()=>{
                    evt.target.scrollTop = evt.target.scrollTop - 100;
                })
                
            }
            
        })
    },
    methods: {
        /* 倒计时刷新 */
        onCountDownS(){
            this.$refs.vac.startCountdown(true);
            this.onSearch();
        },
        /* 
            重新加载数据 
            重置样式
        */
        onReloadAndRefresh(){
            this.onRefresh();
            this.dt.orderBy = [];
        },
        onShowDatePicker(){
            this.$refs.datePicker.focus();
        },
        onRefresh(){
            this.$refs.table.clearSort();
            this.$emit("onSearch");
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
        },
        pickFtype(key){

            let rtn = 'string';
            try{
                rtn = _.find(this.metaColumns,{data:key}).type;
            } catch(err){
                return rtn;
            }
            return rtn;

        },
        onSearch() {
      
            this.search.loading = true;

            let param = {
                term: _.compact([ this.search.term, this.search.placeholder]).join(" | ")
            };

            this.m3.callFS(
                "/matrix/m3entity/entity_list.js",
                encodeURIComponent(JSON.stringify(param))
            ).then( (rtn)=>{
                this.search.result = rtn.message;
                this.search.loading = false;
            }).catch( err=>{
                this.search.result = null;
                this.search.loading = false;
                console.error(err);
            } );

        },
        onLoadMore() {
            
            this.dt.pageNum++;

            if( this.dt.pageNum < this.dt.chunk.length){
                this.dt.rows = this.dt.rows.concat(this.dt.chunk[this.dt.pageNum]);
            }

            this.$nextTick(()=>{
                this.$refs.table.doLayout();
            })
            
        },
        initData(data){
            
            try{
                this.dt.columns = [];
                
                _.extend(this.dt, {columns: _.map(data.columns, (v)=>{
                    
                    if(_.isUndefined(v.visible)){
                        _.extend(v, { visible: true });
                    }
                    
                    if(_.isUndefined(v.render)){
                        return v;
                    } else {
                        return _.extend(v, { render: eval(v.render) });
                    }
                    
                })});
                
                /* 
                *   1、默认排序
                *   2、配合多选
                */
                // this.dt.chunk = _.map(_.orderBy(this.model.rows,),(v,index)=>{  v.index = index; return v; });
                let orderByName = _.chain(this.dt.orderBy).map('name').value();
                let orderByValue = _.chain(this.dt.orderBy).map('value').value();
                this.dt.chunk = _.chain(data.rows)
                                .orderBy(orderByName, orderByValue)
                                .map((v,index)=>{  v.index = index; return v; })
                                .chunk(this.dt.pageSize)
                                .value();
                _.extend(this.dt, { rows: this.dt.chunk[this.dt.pageNum] });

            } catch(err){
                console.log(err)
            }
            
        },
        rowClassName({rowIndex}){
            return `${this.rowClass}-row-${rowIndex}`;
        },
        onSelectionChange(val) {
            this.dt.selected = val;
        },
        // 排序样式
        headerCellClassName({column}) {
            
            for (let v of this.dt.orderBy) {
                
                if(column.property === v.name){
                    
                    if(v.value == 'asc'){    
                        return `active-ascending`;
                    } else if(v.value == 'desc'){
                        return 'active-descending';
                    } 
                }
            }
            
        },
        // 多列排序
        onSortChange({ prop, order }){
            let orderValue =  order==='ascending'?'asc':'desc' || '';
            let index = _.findIndex(this.dt.orderBy, {name:prop});            
            if(index !== -1){
                if(order == null){
                    _.difference(this.dt.orderBy,_.pullAt(this.dt.orderBy,index) );
                } else {
                    _.extend(this.dt.orderBy[index],{name:prop, value: orderValue});
                }
            } else {
                this.dt.orderBy.push({name:prop, value: orderValue});
            }

            let orderByName = _.chain(this.dt.orderBy).map('name').value();
            let orderByValue = _.chain(this.dt.orderBy).map('value').value();
            
            this.model.rows = _.chain(this.model.rows)
                            .orderBy(orderByName, orderByValue)
                            .value();
        },
        // row单击事件
        onRowClick(row){
            this.$emit(`${this.rowClass}-row-click`,row);
        },
        onExport(){
            /* this.dt.downloadLoading = true;
            let formatJson = (filterVal, jsonData)=>{
                return jsonData.map(v => filterVal.map(j => {
                    if (_.includes(['day','ctime','vtime'],j)) {
                        return new Date(v[j]).toLocaleString();
                    } else if (typeof v[j] == 'object') {
                        return JSON.stringify(v[j],null,2);
                    } else {
                        return v[j];
                    }
                }));
            };
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = _.keys(_.head(this.dt.rows));
                const data = formatJson(tHeader, this.dt.rows);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: `Export_${this.moment().format("YYYY-MM-DD HH:mm:ss")}`,
                    autoWidth: true,
                    bookType: type
                })
                this.dt.downloadLoading = false;
            }) */
            
        },
        onDelete(row){
            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要删除该日志`, 
                    message: h('span', null, [
                        h('p', null, `日志ID：${row.id}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.callFS("/matrix/m3entity/deleteLog.js", encodeURIComponent(JSON.stringify(row))).then( ()=>{
                    this.onRefresh();
                } );

            }).catch(() => {
                this.$message.info("删除操作已取消")
            }); 
        }
    }
}
</script>

<style scoped>

    .el-main > .el-table .el-table--small td{
        padding: 0px;
    }

    .el-footer > .footbar{
        height:30px;
        line-height: 30px;
        font-size: 12px;
    }

    .el-divider{
        margin: 0px;
    }

    .tool-box{
        display:flex;
        flex-wrap: wrap;
        align-items:flex-start;
        padding:20px;
        width: 585px;
    }
    .tool-box .tool{
        text-align:center;
        padding:20px;
        margin:5px;
        border:1px solid #efefef;
        height: 60px;
        width: 65px;
        border-radius: 5px;
    }
    .tool-box .tool:hover{
        cursor: pointer;
        background: rgba(125, 202, 253,.2);
    }

    /* 多选选中文字状态 */
    .cell-user-select{
        -webkit-user-select:none;/*谷歌 /Chrome*/
        -moz-user-select:none; /*火狐/Firefox*/
        -ms-user-select:none;    /*IE 10+*/
        user-select:none;
    }

</style>

<style>
    
    /* el-table hover actived style */
    .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #86b4e6!important;
    }
    .el-table__body tr.current-row>td {
            background-color:#3c99f7!important;;
    }

    .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }
    
</style>

<style>
    .el-table .active-ascending .sort-caret.ascending {
        border-bottom-color: #252D47!important;
    }
    .el-table .active-descending .sort-caret.descending {
        border-top-color: #252D47!important;
    }
    
</style>