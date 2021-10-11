<template>
    <div style="background: #f2f2f2;padding: 5px 20px 20px 20px;;">
        <h4>实体名称：{{selectedEntity}}</h4> 
        <span style="font-weight:600;">选择指标：</span>
        <el-cascader
            :options="buckets"
            :props="defaultProps"
            @change="onChange"
            collapseTags
            clearable
            filterable
            ref="cascader"
            style="margin-left:20px;">
            <template slot-scope="{ node, data }">
                <span>{{ data.title }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                <span style="color:#999999;font-size:10px;text-align:right;" v-else> {{ data.ptype }}</span>
            </template>
        </el-cascader>
    </div>
</template>


<script>

import _ from 'lodash';

export default{
    name: "EntityCascaderView",
    props: {
        multiplenable: {
            default: false,
            type: Boolean
        },
        entity: Array,
        buckets: Array
    },
    data(){
        return {
            options: [],
            defaultProps: {multiple: false },
            selected: null
        }
    },
    computed:{
        selectedEntity(){
            return _.map(this.entity,'name').join(", ");
        }
    },
    watch:{
        selected:{
            handler(val){
                this.$emit("selected",val);
            }
        }
    },
    created(){
        this.defaultProps.multiple = this.multiplenable;
    },
    methods: {
        onChange(val){
            this.selected = { bucketKeys: val, options: this.buckets };
        }
    }
}
</script>