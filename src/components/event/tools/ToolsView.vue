<template>
    <div class="tool-box">
        <div class="tool" 
            v-for="item in list"
            :key="item.id"
            @click="$emit('tool-click',item)">
            <div>{{item.name}}</div>
            <p>
                <el-button type="text">
                    <span :class="item.icon" style="cursor:pointer;font-size:16px;"></span>
                </el-button>
            </p>
        </div>
    </div>
</template>

<script>
import _ from 'lodash/core';

export default({
    name: "ToolsView",
    data(){
        return  {
            list:[]
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            this.m3.dfsRead({parent:"/script/matrix/m3event/tools", name:"tools.json"}).then(rtn=>{
                
                this.list = _.chain(JSON.parse(rtn)).filter(res=>{
                    return res['status']!==false;
                }).value();

                // role
                this.list = _.filter(this.list, v=>{
                    if(this.m3.auth.signedUser.isadmin){ 
                        return v;
                    } else {
                        return v['id'] === 'smartGroupView';
                    }
                })
            })
        }
    }
})
</script>

<style scoped>
    .tool-box{
        display:flex;
        flex-wrap: wrap;
        align-items:flex-start;
        padding:20px;
        margin: -20px;
        width: 100%;
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
</style>
