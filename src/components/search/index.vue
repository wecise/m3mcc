<template>
    <el-container style="height: calc(100vh - 80px);background:#ffffff;">
        <el-header style="line-height: 60px;">
            <el-input placeholder="请输入关键字" v-model="search.term" 
                clearable
                @clear="onClear">
                <el-button slot="append" icon="el-icon-search" @click="onSearch" :loading="search.loading"></el-button>
            </el-input>
        </el-header>
        <el-main style="overflow: hidden;height: 100%;padding-top:0px;" v-if="search.result && search.result.all.length>0">
            <div style="padding:10px;background:#f2f2f2;">
                <span>搜索结果：</span>
                <template v-for="(v,k) in search.result">
                    <el-button type="default" :key="k" 
                        @click="onScrollTo(k)"
                        v-if="v.title && v.rows.length > 0">
                        {{v.title}}: {{v.rows.length}}
                    </el-button>
                </template>
            </div>
            <el-container style="height: calc(100% - 20px);">
                <el-main style="padding:0px 20px 0px 0px;height:100%;overflow:auto;background:#f2f2f2;" ref="container">
                    <el-tabs value="view" type="border">
                        <el-tab-pane name="view" key="view">
                            <span slot="label">按分类</span>
                            <template v-for="(v,k) in search.result">
                                <component 
                                    :ref="k"
                                    :id="'el-'+k"
                                    v-bind:is="k" :global="global" :dt="v" 
                                    :key="k" v-if="v.title && v.rows.length>0"></component>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane name="timeline" key="timeline">
                            <template slot="label">时间线</template>
                            <timeline :model="search.result" :global="global"></timeline>
                        </el-tab-pane>
                    </el-tabs> 
                    
                </el-main>
                
            </el-container>
            
        </el-main>

        <el-main style="background:#ffffff;" v-else>
                <svg-icon icon-class="eventList" style="font-size:64px;"/>
                <h2>没有找到相关记录。</h2>
                <p>
                    温馨提示：  
                    请检查您的输入是否正确 
                    如有任何意见或建议，请及时反馈给我们。wj@wecise.com 
                </p>
        </el-main>

    </el-container>
    
</template>

<script>
import _ from 'lodash';
import $ from 'jquery';
import event from './event.vue';
import change from './change.vue';
import entity from './entity.vue';
import file from './file.vue';
import perf from './perf.vue';
import logs from './logs.vue';
import timeline from './timeline.vue';
import { scrollTo } from 'scroll-js';

export default {
    name: "IndexView",
    components:{
        event,
        entity,
        change,
        file,
        perf,
        logs,
        timeline
    },
    props:{
        global: Object
    },
    data(){
        return {
            search:{
                term: "",
                class: {
                    value: "/matrix/devops/alert_status"
                },
                result: null,
                loading: false
            }
        }
    },
    watch:{
        "search.term"(val){
            if(!val){
                this.onClear();
            }
        }
    },
    created(){
        // 初始化preset
        /* try{
            let preset = decodeURIComponent(window.atob(this.getQueryVariable('preset')));
            _.extend(this.options,_.attempt(JSON.parse.bind(null, preset)));
        } catch(err){
            console.error(err);
        } */

        document.onkeydown = ()=> {
            let key = window.event.keyCode;
            if (key == 13) {
                this.onSearch();
            }
        }

    },
    mounted(){
        
        this.weclome();

    },
    methods: {
        onScrollTo(name){
            let el = this.$refs[name][0].$el.offsetTop;
            let container = this.$refs['container'].$el;
            scrollTo(container, { top: el });
        },
        onClear(){
            this.search.result = null;
        },
        onSearch(){

            if(_.isEmpty(this.search.term)){
                this.$message.info("请输入搜索关键字");
                return false;
            }

            this.search.loading = true;
            let param = encodeURIComponent( JSON.stringify( {term:this.search.term, preset:null} ) );
            this.m3.callFS("/matrix/m3mcc/searchByTerm.js", param).then(res=>{
                this.search.result = res.message;
                this.search.loading = false;
            }).catch(err=>{
                this.search.loading = false;
            })

            this.eventHub.$emit("WINDOW-RESIZE-EVENT");
        },
        getQueryVariable(variable){
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
        },
        weclome(){

            this.m3.callFS("/matrix/m3mcc/weclome.js",null).then( (rtn)=>{
                let message = rtn.message;

                this.$notify({
                    title: '欢迎使用一键搜索',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: message
                });
            } );
        }
    }
}
</script>

<style scoped>

</style>
