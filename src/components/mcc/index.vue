<template>
    <div class="container">
        <el-menu default-active="event" 
            class="m3mcc-el-menu" 
            :collapse="isCollapse"
            @select="onSelect">
            <el-menu-item index="event">
                <i class="el-icon-warning"></i>
                <span slot="title">事件列表</span>
            </el-menu-item>
            <el-menu-item index="policy">
                <i class="el-icon-document"></i>
                <span slot="title">策略管理</span>
            </el-menu-item>
            <el-menu-item index="entitys">
                <i class="el-icon-office-building"></i>
                <span slot="title">设备列表</span>
            </el-menu-item>
            <el-submenu index="base">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span slot="title">基础信息</span>
                </template>
                <el-menu-item index="mibbrowser">
                    <span slot="title">Mib管理</span>
                </el-menu-item>
                <el-menu-item index="kpi">
                    <span slot="title">指标管理</span>
                </el-menu-item>
                <el-menu-item index="situation">
                    <span slot="title">分析情景管理</span>
                </el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="content">
            <component v-bind:is="currentView" :global="global"></component>
        </div>
    </div>
    
</template>

<script>
import basics from './basics/index.vue';
import mibbrowser from './basics/mibbrowser.vue';
import policy from './policy/index.vue';
import event from '../event/MainView.vue';
import entitys from '../entity/index.vue';


export default {
    components:{
        basics,
        entitys,
        policy,
        mibbrowser,
        event
    },
    props:{
        global: Object
    },
    data(){
        return {
            isCollapse: true,
            currentView: "event"
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    methods: {
        onToggleView(node){
            this.currentView = node.id;
        },
        onSelect(key) {
            this.currentView = key;
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

    .m3mcc-el-menu{
        height: 100vh;
    }

    .content{
        width: calc(100vw - 64px);
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
