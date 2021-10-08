<template>
    <el-container style="height: calc(100% - 85px);margin-top: -20px;">
        <el-header style="height:30px;line-height:30px;padding:0px;">
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
        </el-header>
        <el-main :loading="editor.loading" style="padding:0px;overflow:hidden;">
            <VueEditor
                v-model="editor.data"
                @init="onEditorInit"
                :lang="editor.lang.value"
                :theme="editor.theme.value"
                width="99.8%"
                height="100%"
                style="border:1px solid #f2f2f2;"
                ref="editor"></VueEditor>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';

export default{
    name: "BitlogConsoleView",
    props: {
        model: Object
    },
    data(){
        return {
            editor: {
                data: null,
                loading: false,
                lang: {
                    value: "text",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                }
            },
        }
    },
    watch: {
        'model.words':{
            handler(val){
                
                if(_.isEmpty(val)) return false;

                _.delay(()=>{
                    let keywords = new RegExp(val.join("|"),"g");
                    this.$refs.editor.editor.findAll(keywords,{
                        caseSensitive: false,
                        wholeWord: true,
                        regExp: true
                    });
                },1000)
            }
        },
        model(){
            this.init();
        }
    },
    components:{
        VueEditor: require("vue2-ace-editor")
    },
    mounted(){
        this.init();

        this.eventHub.$on("WINDOW-RESIZE-EVENT",()=>{
            this.$refs.editor.editor.resize();
        }); 
    },
    methods: {
        onEditorInit(){
            require('brace/ext/searchbox');
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
        },
        onToggleTheme(val){
            require(`brace/theme/${val}`); //language
            this.editor.theme.value = val;
        },
        init(){
            this.editor.loading = true;
            let param = encodeURIComponent(JSON.stringify( this.model ));

            this.m3.callFS("/matrix/m3event/diagnosis/bitlog/searchBitlogByTerm.js",param).then(rtn=>{
                this.editor.data = this.arrayToCsv(rtn.message.result);
                this.editor.loading = false;
            }).catch(()=>{
                this.editor.loading = false;
            })
        },
        arrayToCsv(data){
                    
            let lineArray = [];
            _.forEach(data, (infoArray)=> {
                let valid = (new Date(infoArray[0])).getTime() > 0;
                
                if(valid){
                    this.$set(infoArray, 0, this.moment(infoArray[0]).format('YYYY-MM-DD HH:mm:ss.SSS'));
                }

                let line = infoArray.join(", ");
                lineArray.push(line);
            });
            
            return lineArray.join("\n");
            
        },
        arrayToJson(data){
            
            this.$set(this.dt,'rows',[]);

            _.forEach(data, (v, index)=> {
                
                let valid = (new Date(v[0])).getTime() > 0;
                let time = "";

                if(valid){
                    time = this.moment(v[0]).format('YYYY-MM-DD HH:mm:ss.SSS');
                }

                this.dt.rows.push( {index: index+1, time: time, msg: v.slice(3).join(", "), file:v[1], num:v[2]} );
            });
            
        },
        markByTerm(str){
            let finalStr = str;
            let term = this.options.term.split(",");
            
            _.forEach(term,(v)=>{
                
                if(_.isEmpty(v)) return;

                let reg = new RegExp(v, 'gim');
                finalStr = finalStr.replace(reg, function(s){ return '<mark style="padding:3px;">'+s+'</mark>'; });
            })

            return finalStr;
        }
    }/* ,
    destroyed(){
        this.$refs.editor.editor.destroy();
        this.$refs.editor.editor.container.remove();
    } */
}
</script>

<style>
    /* .ace_editor .ace_marker-layer .ace_selection {
        background: #fbde868a !important;
    }
    .ace_editor .ace_marker-layer .ace_active-line {
        background: #fbde868a !important;
    } */
    /* ace find highlight */
    .ace_editor .ace_marker-layer .ace_selected-word {
        background: #fbde868a !important;
        border: 1px solid /*[[base-color]]*/ #f3f5f8 !important;
    }
</style>
