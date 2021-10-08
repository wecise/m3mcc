<template>
    <el-container style="height:100%;">
        <el-header style="height: 35px;line-height: 35px;padding: 0px 10px;background: #f6f6f6;">
            <span>
                <i class="el-icon-postcard"></i>
                <el-dropdown v-if="list" :hide-on-click="true">
                    <span class="el-dropdown-link">
                        <span v-if="_.isEmpty(selected)">选择触发器</span>
                        <span v-else>${selected.name}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :key="item.name" v-for="item in list" @click.native="onChangeTrigger(item)">
                            <el-button type="text" style="text-align: left;">
                                <span class="el-icon-document" style="font-size:38px;text-align: center;display: block;"></span>
                                <p style="text-align: center;">${item.name}</p>
                                <p style="font-size: 10px;color:#999999;">创建时间：${moment(item.time).format(mx.global.register.format)}</p>
                                <p style="font-size: 10px;color:#999999;">脚本大小：${_.size(item.script)}</p>
                            </el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
            <el-button-group style="width:100%;" v-if="!_.isEmpty(selected) && !_.isEmpty(list)">
                
                <el-tooltip content="新建触发器" placement="bottom" open-delay="800">
                    <el-button type="text" @click="add" icon="el-icon-plus">
                    </el-button>
                </el-tooltip>

                <el-divider direction="vertical"></el-divider>
                
                <el-tooltip content="删除触发器" placement="bottom" open-delay="800">
                    <el-button type="text" @click="remove" icon="el-icon-delete">
                    </el-button>
                </el-tooltip>
                
                <el-divider direction="vertical"></el-divider>
                
                <el-tooltip content="保存触发器" placement="bottom" open-delay="800">
                    <el-button type="text" @click="save" icon="fas fa-save">
                    </el-button>
                </el-tooltip>
                
                <el-divider direction="vertical"></el-divider>

                <el-switch v-model="selected.disable"
                        inactive-color="#13ce66"
                        active-color="#dddddd"
                        active-value="true"
                        inactive-value="false"
                        @change="changeStatus"
                        v-if="!_.isEmpty(selected)">
                </el-switch>

                <el-tooltip content="选择主题">
                    <el-dropdown style="padding-left:10px;float:right;">
                        <span class="el-dropdown-link">
                            <svg-icon icon-class="theme"/>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="group in editor.theme.list" :key="group.name">
                                <el-dropdown @command="onToggleTheme">
                                    <span class="el-dropdown-link">
                                    {{ group.name }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            v-for="item in group.items"
                                            :key="item.name"
                                            :command="item.name">{{ item.name }}</el-dropdown-item>
                                        </el-dropdown-menu>
                                </el-dropdown>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>

            </el-button-group>
            <el-button-group style="width:100%;" v-else>
                
                <el-tooltip content="新建触发器" placement="bottom" open-delay="800">
                    <el-button type="text" @click="add" icon="el-icon-plus">
                    </el-button>
                </el-tooltip>

            </el-button-group>
        </el-header>
        <el-main style="padding:0px;overflow: hidden;" ref="editor">
            <VueEditor
                v-model="editor.data"
                @init="onEditorInit"
                :lang="editor.lang.value"
                :theme="editor.theme.value"
                width="99.8%"
                height="15vh"
                style="border:1px solid #f2f2f2;"
            ></VueEditor>
        </el-main>
        <el-footer :id="id+'_statusBar'" style="height:30px;line-height: 30px;" ref="statusBar"></el-footer>
    </el-container>
</template>

<script>
    import _ from 'lodash';

    export default defineComponent({
        name: 'EditView',
        props: {
            className: String,
            model: Object
        },
        components:{
            VueEditor: require("vue2-ace-editor")
        },  
        data(){
            return {
                editor: {
                    data: null,
                    loading: false,
                    lang: {
                        value: "lua",
                        list: []
                    },
                    theme: {
                        value: "chrome",
                        list: this.m3.EDITOR_THEME
                    }
                },
                result: null,
                list: [],
                selected: {
                    name: "",
                    disable: false,
                    time: moment().format("YYYY-MM-DD hh:mm:ss"),
                    class: "",
                    script: ""
                },
                statusBarInfo: "",
                logName: ""
            }
        },
        computed: {
            selectedTitle(){
                return this.selected.disable == 'true' ? '启用中。。。' : '禁用中。。。';
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.initData();
            })
        },
        watch: {
            selected:{
                handler:function(val,oldVal){
                    this.editor.setValue(val.script);
                    
                    if(val.name){
                        this.logName = `${val.class}#${val.name}`;
                        console.log(11,this.logName)
                    }
                },
                deep:true
            },
            result: function(val,oldVal){
                    if(val != oldVal) {
                        eventHub.$emit("QUERY-RESULT-TRIGGER-EVENT",this.result);
                    }
            }

        },
        methods: {
            onEditorInit(){
                require("brace/ext/language_tools"); //language extension prerequsite...
                require(`brace/mode/${this.editor.lang.value}`); //language
                require(`brace/snippets/${this.editor.lang.value}`); //snippet
                require(`brace/theme/${this.editor.theme.value}`); //language

                this.$refs.editor.editor.commands.addCommand({
                    name: "save",
                    bindKey: {
                        mac: "cmd-S", 
                        win: "ctrl-S",
                        sender: 'editor|cli'
                    },
                    exec: ()=> {
                        this.save();
                    }
                });
            },
            onToggleTheme(val){
                require(`brace/theme/${val}`); //language
                this.editor.theme.value = val;
            },
            onChangeTrigger(item){
                this.selected = item;
            },
            getSelected(){
                
                let temp = this.editor.getSelectedText();

                if(_.isEmpty(temp)){
                    this.inputText = this.editor.getValue();
                } else {
                    this.inputText = temp;
                }
            },
            // 触发器数据结构化整理
            treatNode(event){
                return _.map(event.script,function(v,k){
                    let attr = {disable:false};

                    if(event.attr && event.attr != null){
                        if(event.attr[k]) {
                            attr = JSON.parse(event.attr[k] || '{}');
                        }
                    }

                    return _.merge(attr,{name:k,script:event.script[k],class:event.class,vtime:event.vtime});
                });
            },
            initData(){
                
                triggerHandler.triggerListAsync(this.className).then( (rtn)=>{
                    
                    let list = [];

                    if(!_.isEmpty(rtn)){
                        list = this.treatNode(rtn[0]);
                    }

                    if(!_.isEmpty(list)){
                        this.list = _.map(list,(v,k)=>{
                            return   {
                                name: _.trim(v.name),
                                disable: v.disable,
                                time: v.vtime,
                                class: v.class,
                                script: v.script
                            }
                        });

                        this.selected = _.head(_.orderBy(this.list,['name'],['asc']));
                    }
                } );

            },
            add(){
                
                this.$prompt('新增触发器', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {

                    if(_.isEmpty(value)){
                        this.$message({
                            type: 'info',
                            message: '请输入触发器名称！'
                        });
                        return false;
                    }

                    triggerHandler.triggerNewAsync({class: this.className, name: _.trim(value), script:''}).then( (rtn)=>{
                        
                        if(rtn == 1) {
                            this.$message({
                                type: 'success',
                                message: '新建触发器成功'
                            });
                            this.refresh(value);
                        }else {
                            this.$message({
                                type: 'error',
                                message: '新建触发器失败 ' + rtn
                            });
                        }
                    } );


                }).catch(() => {
                
                });

            },
            save() {
                
                let script = this.editor.getValue();

                triggerHandler.triggerNewAsync({class: this.className, name: this.selected.name, script: script, attr:{disable: `${this.selected.disable}`}}).then( (rtn)=>{
                    if(rtn == 1) {
                        this.$message({
                                type: 'success',
                                message: '保存触发器成功'
                            });
                        this.refresh(this.selected.name);
                    } else {
                        this.$message({
                            type: 'error',
                            message: '保存触发器失败 ' + rtn
                        });
                    }
                } );

            },
            changeStatus(value){
                
                let script = this.editor.getValue();

                triggerHandler.triggerNewAsync({class: this.className, name: this.selected.name, script: script, attr:{disable: `${this.selected.disable}`}}).then( (rtn)=>{
                    if(rtn === 1) {
                        this.refresh(this.selected.name);
                    }
                } );
                
            },
            refresh(name) {
                
                triggerHandler.triggerListAsync(this.className).then( (rtn)=>{
                    if(!_.isEmpty(rtn)){
                        this.list = _.map(this.treatNode(rtn[0]),(v,k)=>{
                            return   {
                                name: v.name,
                                disable: v.disable,
                                time: v.vtime,
                                class: v.class,
                                script: v.script
                            }
                        });

                        this.selected = _.groupBy(_.orderBy(this.list,['name'],['asc']),'name')[name][0];

                    } else {
                        this.list = [];
                        this.selected = { name: ""};
                    }

                } );

            },
            remove() {
                
                this.$confirm(`确认删除触发器：${this.selected.name}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    
                    triggerHandler.triggerDeleteAsync(this.className, this.selected.name).then( (rtn)=>{
                        if(rtn == 1){
                            this.$message({
                                type: 'success',
                                message: '删除触发器成功'
                            });
                            let name = this.list.length>0 ? _.head(this.list).name : null;
                            this.refresh(name);
                        } else{
                            this.$message({
                                type: 'error',
                                message: '删除触发器失败 ' + rtn
                            });
                        }
                    } );
                    
                }).catch(() => {
                    
                });

            }
        }


    }
</script>

<style scoped>

</style>
