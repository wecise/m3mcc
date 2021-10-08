<template>
    <div style="height: calc(100vh - 300px);">
        
        <div style="background: #f2f2f2;padding: 5px 20px 20px 20px;">
            <h4>已选实体：
                {{ entity | pickEntityTitle }}
            </h4>
            <h4>选择日志：
                <el-cascader
                    v-model="bitlog.buckets"
                    :options="buckets"
                    :props="{ multiple: true,checkStrictly: false }"
                    clearable
                    @change="onBucketChange"
                    style="width:90%;">
                </el-cascader>
            </h4>
            <h4> 关键字符： 
                <el-tag
                    :key="word"
                    v-for="word in bitlog.word.words"
                    closable
                    :disable-transitions="false"
                    @close="onWordClose(word)">
                    {{word}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="bitlog.word.inputVisible"
                    v-model="bitlog.word.inputValue"
                    ref="saveTagInput"
                    size="mini"
                    @keyup.enter.native="onWordInputConfirm"
                    @blur="onWordInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" @click="onWordShowInput" type="default">+ 关键字</el-button>
            </h4>
            
            <div><span style="font-weight:600;">时间区间：</span>
                <el-date-picker
                    v-model="bitlog.time"
                    :picker-options="kpi.options"
                    type="datetimerange"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    ref="datePicker">
                </el-date-picker>
            </div>
        </div>

        <grid-layout 
                    :layout="kpi.list"
                    :col-num="layout.colNum"
                    :row-height="40"
                    :is-draggable="layout.draggable"
                    :is-resizable="layout.resizable"
                    :vertical-compact="true"
                    :use-css-transforms="true">

            <grid-item :static="item.static"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    v-for="(item,index) in kpi.list"
                    :key="index"
                    @resize="onGridItemResizeEvent"
                    @move="onGridItemMoveEvent"
                    @resized="onGridItemResizedEvent"
                    @container-resized="onGridItemContainerResizedEvent"
                    @moved="onGridItemMovedEvent"
                    drag-ignore-from=".no-drag"
                    :ref="'item'+item.i">

                <el-card style="height:100%;">
                    <div slot="header" class="clearfix" style="padding:5px;">
                        {{ item.id }} / {{ item.field }} / {{ item.file }}
                    </div>

                    <bitlog-console-view :model="item" class="no-drag" v-if="item"></bitlog-console-view>
                    
                </el-card>
                <el-button type="text" icon="el-icon-full-screen" @click="onFullScreen(item)" style="position: absolute;top: 10px;right: 30px;font-weight: 900;color: #b2b2b2;"></el-button>
                <el-button type="text" icon="el-icon-close" @click="onRemoveItem(item.i)" style="position: absolute;top: 10px;right: 10px;font-weight: 900;color: #b2b2b2;"></el-button>
            </grid-item>

        </grid-layout>

        <el-dialog :visible.sync="dialog.max.show" v-if="dialog.max.show" custom-class="bitlog-max-dialog">
            
            <el-card style="height:60vh;">
                <div slot="header" class="clearfix" style="padding:5px;">
                    {{ dialog.max.data.id }} / {{ dialog.max.data.field }} / {{ dialog.max.data.file }}
                </div>

                <bitlog-console-view :model="dialog.max.data" class="no-drag" v-if="dialog.max.data"></bitlog-console-view>
                
            </el-card>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialog.max.show = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import _ from 'lodash';
import Cookies from 'js-cookie';
import { GridLayout, GridItem } from "vue-grid-layout";
import BitlogConsoleView from './BitlogConsoleView.vue';

export default{
    name: "BitlogView",
    props: {
        bucket: Array,
        entity: Array
    },
    components:{
        GridLayout,
        GridItem,
        BitlogConsoleView
    },
    data(){
        return {
            layout: {
                draggable: true,
                resizable: true,
                colNum: 12,
                index: 0
            },
            kpi: {
                list: [],
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
            },
            bitlog: {
                buckets: [],
                time: [this.moment().add(-1,'hour').format('YYYY-MM-DD HH:mm'),this.moment().format('YYYY-MM-DD HH:mm')],
                word: {
                    words: [],
                    inputVisible: false,
                    inputValue: ''
                }
            },
            dialog: {
                max: {
                    show: false,
                    data: null
                }
            }

        }
    },
    computed:{
        buckets(){
            return _.map(this.bucket,(v)=>{
                return _.extend(v, { value:v.field, label:v.field, children: _.map(v.files,(f)=>{ return { value: f, label: f}  }) } );
            })
        }
    },
    filters:{
        formatTimeRegion(val){
            return `开始：${ new Date(val[0]).toLocaleString() } 结束：${ new Date(val[1]).toLocaleString() }`;
        },
        pickEntityTitle(val){
            return _.map(val,'name').join(", ");
        }
    },
    watch: {
        'bitlog.time'(val){
            
            _.forEach(this.kpi.list,(v)=>{
                this.$set(v,'time',val);
            })
            
            this.onSetKpiList();

            Cookies.set('m3performance-time',val);
        },
        'bitlog.buckets':{
            handler(){
                this.onSetKpiList();
            }
        },
        'bitlog.word.words':{
            handler(){
                this.onSetKpiList();
            }
        }
    },
    created(){
        this.bitlog.time = JSON.parse(Cookies.get('m3performance-time'));
    },
    methods: {
        onShowDatePicker(){
            this.$refs.datePicker.focus();
        },
        onBucketChange(val){
            this.bitlog.buckets = val;
        },
        onSetKpiList(){
            
            this.kpi.list = [];

            _.forEach(this.entity,e=>{
                
                _.forEach(this.bitlog.buckets,(v)=>{
                    
                    let layout = {
                                    x: ( this.kpi.list.length * 12) % (this.layout.colNum || 12),
                                    y: this.kpi.list.length + (this.layout.colNum || 12), // puts it at the bottom
                                    w: 12,
                                    h: 12,
                                    i: this.layout.index,
                                };
                    this.layout.index++;

                    this.kpi.list.push( _.extend(layout,{ id: e.id, class: e.class, field: v[0], file: v[1], time: this.bitlog.time, words: this.bitlog.word.words }) );
                })
            })

            //this.kpi.list = _.uniqBy(this.kpi.list,'field');
        },
        onFullScreen(val){
            
            //let el = this.$refs['item'+val][0].$el
            this.dialog.max.show = true;
            this.dialog.max.data = val;
            
        },
        onRemoveItem(val) {
            const index = this.kpi.list.map(item => item.i).indexOf(val);
            this.kpi.list.splice(index, 1);
        },
        onGridItemResizeEvent(){
            //this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        onGridItemMoveEvent(){
            //this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        onGridItemResizedEvent(){
            this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        onGridItemContainerResizedEvent(){
            //this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        onGridItemMovedEvent(){
            this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        onWordClose(tag) {
            this.bitlog.word.words.splice(this.bitlog.word.words.indexOf(tag), 1);
        },
        onWordShowInput() {
            this.bitlog.word.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        onWordInputConfirm() {
            let inputValue = this.bitlog.word.inputValue;
            if (inputValue) {
                this.bitlog.word.words.push(inputValue);
            }
            this.bitlog.word.inputVisible = false;
            this.bitlog.word.inputValue = '';
        }
    }
}
</script>

<style>
.el-card__body{
    height:100%;
}

.bitlog-max-dialog{
    width: 80vw;
    height: 80vh;
}
</style>
<style scoped>
   

   .columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}
/*************************************/
.remove {
    position: absolute;
    right: 5px;
    top: 0;
    padding: 5px;
    cursor: pointer;
}
.vue-grid-layout {
    background: #f2f2f2;
    padding: 0px;
}
.vue-grid-item:not(.vue-grid-placeholder) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
.vue-grid-item .minMax {
    font-size: 12px;
}
.vue-grid-item .add {
    cursor: pointer;
}
.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

    .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>