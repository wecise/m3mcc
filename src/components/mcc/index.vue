<template>
    <div class="container">
        <Split style="background: #fff;">
            <SplitArea :size="15" :minSize="0" style="overflow:hidden;">
                <div style="padding: 11px;background: #f2f2f2;">监控配置</div>
                <el-collapse accordion style="padding:0 10px;">
                    <el-collapse-item>
                        <template slot="title">
                            <i class="el-icon-setting"></i> 基础信息
                        </template>
                        <basics @node-click="onToggleView"></basics>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <i class="el-icon-office-building"></i> 设备管理
                        </template>
                        <entity></entity>
                    </el-collapse-item>
                    <el-collapse-item>
                        <template slot="title">
                            <i class="el-icon-files"></i> 策略管理
                        </template>
                        <policy></policy>
                    </el-collapse-item>
                </el-collapse>
            </SplitArea>
            <SplitArea :size="85" :minSize="0" style="overflow:hidden;background: #f2f2f2;">
                <component  v-bind:is="currentView"></component>
            </SplitArea>
        </Split>
    </div>
    
</template>

<script>
import _ from 'lodash';
import basics from './basics/index.vue';
import mibbrowser from './basics/mibbrowser.vue';
import entity from './entity/index.vue';
import policy from './policy/index.vue';

export default {
    components:{
        basics,
        entity,
        policy,
        mibbrowser
    },
    props:{
        global: Object
    },
    data(){
        return {
            currentView: "mibbrowser"
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    methods: {
        onToggleView(node){
            this.currentView = node.id;
        }
    }
}
</script>

<style scoped>
    .container{
        flex: 1 1 auto;
        width:100%;
    }

    .container .el-tabs--border-card {
        box-shadow: unset;
        height: 100%;
    }
</style>
<style>
    .container .el-collapse-item__header {
        color: #666666!important;
        font-size: 12px!important;
        font-weight: normal!important;
    }
</style>
