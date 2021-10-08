<template>
    <el-row :gutter="20">
        <el-col :span="24">
            <div class="title">{{titles[0]}} {{ dt.left.selected.length }}/{{ dt.left.rows.length }}</div>
            <el-table
                ref="leftDt"
                :data="dt.left.rows"
                border
                stripe
                max-height="250"
                style="width: 100%"
                @selection-change="onLeftChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <template v-for="(item,index) in dt.left.columns">
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
                        
                           {{scope.row[item.field]}}
                           
                        </template>
                    </el-table-column>
                </template>
                <el-table-column align="right">
                    <template slot="header">
                        <el-input v-model="dt.left.search" size="mini" placeholder="输入关键字搜索" clearable></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="24" style="text-align:center;padding:20px;">
            <el-button type="primary" icon="el-icon-arrow-left" :disabled="rightBtnStatus" @click="onToLeft">{{buttonTexts[0]}}</el-button>
            <el-button type="primary" icon="el-icon-arrow-right" :disabled="leftBtnStatus" @click="onToRight">{{buttonTexts[1]}}</el-button>
        </el-col>
        <el-col :span="24">
            <div class="title">{{titles[1]}} {{ dt.right.selected.length }}/{{ dt.right.rows.length }}</div>
            <el-table
                ref="rightDt"
                border
                stripe
                row-key="field"
                max-height="250"
                :data="dt.right.rows"
                style="width: 100%"
                @selection-change="onRightChange"
                class="right-table">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <template v-for="(item,index) in dt.right.columns">
                    <el-table-column 
                        :prop="item.field"
                        :label="item.title" 
                        sortable 
                        show-overflow-tooltip
                        :key="index"
                        :width="item.width">
                        <template slot-scope="scope">
                            
                            <div v-if="item.field === 'title'">
                                <el-input v-model="scope.row[item.field]" size="mini" @focus.stop.prevent="$event.target.select()"></el-input>
                            </div>

                            <div v-else-if="item.field === 'width'">
                                <el-input type="number" v-model="scope.row[item.field]" size="mini" @focus.stop.prevent="$event.target.select()"></el-input>
                            </div>

                            <div v-else-if="item.field === 'visible'">
                                <el-switch v-model="scope.row[item.field]" size="mini"></el-switch>
                            </div>

                            <div v-else-if="item.field === 'render'">
                                <el-popover
                                    placement="right"
                                    width="400"
                                    popper-class="props-render-popper"
                                    trigger="click">
                                    <div style="width:100%;height:40px;line-height:40px;">
                                        <el-button type="default" @click="onSetRender(scope.row,item.field,code)" :key="index" v-for="(code,index) in render">
                                            {{code.name}}
                                        </el-button>
                                    </div>
                                    <VueEditor
                                        v-model="scope.row[item.field]"
                                        @init="onEditorInit"
                                        :lang="editor.lang.value"
                                        :theme="editor.theme.value"
                                        width="99.8%"
                                        height="calc(100% - 40px)"
                                        style="border:1px solid #f2f2f2;"
                                    ></VueEditor>
                                    <el-button slot="reference" type="text">属性渲染</el-button>
                                </el-popover>

                                <el-button type="text" @click="onTip()" class="el-icon-question"></el-button>
                            </div>

                            <div v-else>
                                {{scope.row[item.field]}}
                            </div>
                           
                        </template>
                    </el-table-column>
                </template>
                <el-table-column align="right">
                    <template slot="header">
                        <el-input v-model="dt.right.search" size="mini" placeholder="输入关键字搜索" clearable></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
    </el-row>    
</template>

<script>
import _ from 'lodash';
import Sortable from 'sortablejs';
export default({
    props: {
        selected: Array,
        data: Array,
        titles: Array,
        buttonTexts: Array
    },
    components: {
        VueEditor: require("vue2-ace-editor"),
    },
    data(){
        return {
            dt:{
                all: {
                    rows: []
                },
                left: {
                    rows: [],
                    columns: [
                        {field: 'field', title: '属性', ftype: 'varchar', width:120, visible:true},
                        {field: 'title', title: '显示名称', ftype: 'varchar', width:120, visible:true},
                        {field: 'ftype', title: '类型', ftype: 'varchar', width:120, visible:true},
                        {field: 'width', title: '宽度', ftype: 'varchar', width:120, visible:false}
                    ],
                    search: "",
                    selected: []
                },
                right: {
                    rows: [],
                    columns: [
                        {field: 'field', title: '属性', ftype: 'varchar', width:160, visible:true},
                        {field: 'title', title: '显示名称', ftype: 'varchar', width:120, visible:true},
                        {field: 'ftype', title: '类型', ftype: 'varchar', width:120, visible:true},
                        {field: 'width', title: '宽度', ftype: 'varchar', width:160, visible:true},
                        {field: 'visible', title: '是否可见', ftype: 'varchar', width:160, visible:true},
                        {field: 'render', title: '属性渲染', ftype: 'varchar', width:160, visible:true}
                    ],
                    search: "",
                    selected: []
                }
            },
            editor: {
                term: "",
                data: null,
                loading: false,
                lang: {
                    value: "javascript",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                }
            },
            render: [
                {
                    name: '状态转换',
                    code: `var s=function(row, column, cellValue, index){ 
        return global.register.event.status[cellValue][1];
    };eval(s);`
                },
                {
                    name: '级别映射',
                    code: `var s=function(row, column, cellValue, index){ 
        /* by row */
        var el = document.querySelector('.row-'+index);
        /* by column */
        /* var el = document.querySelector('.row-'+index+' >.'+column.id+' > .cell');*/
        el.style.backgroundColor = global.register.event.severity[cellValue][2];
        el.style.color = '#ffffff';
        el.style.textAlign = 'center';
        return global.register.event.severity[cellValue][1]; 
    };eval(s);`
                },
                {
                    name: '时间转换',
                    code: `var s=function(row, column, cellValue, index){
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    };
    eval(s);`
                }
            ]
        }
    },
    computed:{
        leftBtnStatus(){
            return _.isEmpty(this.dt.left.selected);
        },
        rightBtnStatus(){
            return _.isEmpty(this.dt.right.selected);
        }
    },
    watch: {
        'dt.right.rows':{
            handler(val){
                this.$emit("selected-change",val);
            },
            deep:true
        },
        'data':{
            handler(val){
                this.dt.all.rows = _.cloneDeep(val);
                this.dt.right.rows = _.cloneDeep(this.selected);
                this.dt.left.rows = _.differenceBy(this.dt.all.rows, this.dt.right.rows,'field');
            },
            immediate: true
        },
        'dt.left.search':{
            handler(val){
                if(_.isEmpty(val)){
                    this.dt.left.rows = _.differenceBy(this.dt.all.rows, this.selected,'field');
                } else {
                    this.dt.left.rows = this.dt.left.rows.filter(data => !val || data.field.toLowerCase().includes(val.toLowerCase()));
                }
                
            }
        },
        'dt.right.search':{
            handler(val){
                if(_.isEmpty(val)){
                    this.dt.right.rows = _.differenceBy(this.dt.all.rows, this.dt.left.rows,'field');
                } else {
                    this.dt.right.rows = this.dt.right.rows.filter(data => !val || data.field.toLowerCase().includes(val.toLowerCase()));
                }
                
            }
        }
    },
    mounted(){
        
        setTimeout(()=>{
            this.initRowsDraggable();
        },1000)
    },
    methods: {
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
        },
        onLeftChange(val){
            this.dt.left.selected = val;
        },
        onRightChange(val){
            this.dt.right.selected = val;
        },
        onToRight(){
            this.dt.right.rows = _.concat(this.dt.right.rows, this.dt.left.selected);
            this.dt.left.rows = _.differenceBy(this.dt.all.rows, this.dt.right.rows,'field');
        },
        onToLeft(){
            this.dt.left.rows = _.concat(this.dt.left.rows, this.dt.right.selected);
            this.dt.right.rows = _.differenceBy(this.dt.all.rows, this.dt.left.rows,'field');
        },
        initRowsDraggable(){
            const tbody = document.querySelector('.right-table .el-table__body-wrapper tbody');
            const self = this;
            
            Sortable.create(tbody, {
                draggable: ".el-table__row",
                onEnd ({ newIndex, oldIndex }) {
                    const currRow = self.dt.right.rows.splice(oldIndex, 1)[0];
                    self.dt.right.rows.splice(newIndex, 0, currRow);
                    
                    self.$emit("selected-change",self.dt.right.rows);
                    self.$emit("order-change");
                }
            });

        },
        onSetRender(row,field,item){
            console.log(row, field, row[field], item)
            row[field] = item.code;
        },
        onTip(){
        
            this.$notify({
            title: "属性渲染示例",
            duration: 30 * 1000 ,
            dangerouslyUseHTMLString: true,
            message: this.render.map(v=>{ return `<h3>${v.name}</h3><pre style="background:#f2f2f2;padding:5px;">${v.code}</pre>`}).join("\n")
            });
        },
    }
})
</script>

<style scoped>
    .title {
        margin-bottom: 5px;
        font-weight: 600;
    }
</style>
