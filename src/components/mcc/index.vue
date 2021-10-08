<template>
    <div class="container">
        <el-menu default-active="event" class="m3mcc-el-menu" :collapse="isCollapse">
            <el-menu-item index="event">
                <i class="el-icon-menu"></i>
                <span slot="title">事件列表</span>
            </el-menu-item>
            <el-menu-item index="policy">
                <i class="el-icon-location"></i>
                <span slot="title">策略管理</span>
            </el-menu-item>
            <el-menu-item index="entity">
                <i class="el-icon-office-building"></i>
                <span slot="title">设备列表</span>
            </el-menu-item>
            <el-submenu index="base">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span slot="title">基础信息</span>
                </template>
                <el-menu-item index="mib">
                    <span slot="title">Mib管理</span>
                </el-menu-item>
                <el-menu-item index="kpi">
                    <span slot="title">指标管理</span>
                </el-menu-item>
                <el-menu-item index="situation">
                    <span slot="title">分析情景管理</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item index="entityKeep">
                <i class="el-icon-setting"></i>
                <span slot="title">设备管理</span>
            </el-menu-item>
        </el-menu>
        <div class="content">
            <component v-bind:is="currentView"></component>
        </div>
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
            isCollapse: true,
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
        position: relative;
        width:100%;
        display: flex;
    }

    .content{
        width:100%;
    }

    .el-menu.el-menu--collapse{
        background-color: #ffffff!important;
    }

</style>
<style>
    .container .el-collapse-item__header {
        color: #666666!important;
        font-size: 12px!important;
        font-weight: normal!important;
    }

    .el-menu.el-menu--popup.el-menu--popup-right-start{
        background-color: #ffffff!important;
    }
</style>
