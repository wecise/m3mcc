<template>
    <div class="event-container">
        <div>
            <el-button type="text" icon="el-icon-warning"> {{dt.title}}</el-button>
        </div>   
        <div class="animated fadeIn">
            <el-table
                :data="dtable.rows"
                :row-class-name="rowClassName"  
                style="width: 100%">
                <template v-for="(item,index) in dtable.columns">
                    <el-table-column 
                        :prop="item.field"
                        :label="item.title" 
                        show-overflow-tooltip
                        :key="index"
                        :width="item.width"
                        :formatter="item.render"
                        v-if="item.visible">
                        <template slot-scope="scope">
                            <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                v-if="typeof item.render === 'function'">
                            </div>
                            <div v-else>
                                {{scope.row[item.field]}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';

    export default {
        props:{
            dt: Object,
            global: Object
        },
        data(){
            return {
                rowClass: "event-list"
            }
        },
        computed:{
            dtable(){
                let dt = {};
                
                _.extend(dt, {columns: _.map(this.dt.columns, (v)=>{
                    
                    if(_.isUndefined(v.visible)){
                        _.extend(v, { visible: true });
                    }
                    
                    if(_.isUndefined(v.render)){
                        return v;
                    } else {
                        return _.extend(v, { render: eval(v.render) });
                    }
                    
                })});

                _.extend(dt,{rows: this.dt.rows});

                return dt;
            }
        },
        methods:{
            rowClassName({rowIndex}){
                return `${this.rowClass}-row-${rowIndex}`;
            }
        }
    }
</script>

<style scoped>
    .event-container{
        padding: 20px;
        background: #f2f2f2;
    }
</style>
<style>
    /* el-table hover actived style */
    .event-container .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #86b4e6!important;
    }
    .event-container .el-table__body tr.current-row>td {
            background-color:#3c99f7!important;;
    }
</style>
