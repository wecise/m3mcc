<template>
    <el-container>
        <el-main>
            <Split :gutterSize="5">
                <SplitArea :size="sizes[0]" :minSize="0" style="overflow:hidden;">
                    <TagTreeView :model="{domain:'entity'}" :fun="onRefreshByTag" ref="entityTagTree"></TagTreeView>
                </SplitArea>
                <SplitArea :size="sizes[1]" :minSize="0" style="overflow:hidden;">
                    <EntityView ref="entityView"></EntityView>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
</template>

<script>

    import TagTreeView from '../tags/TagTreeView.vue';
    import EntityView from './entity.vue';
    export default {
        components:{
            TagTreeView,
            EntityView
        },
        data(){
            return {
                sizes: [20,80]
            }
        },
        methods:{
            onRefreshByTag(tag){
                if(!tag){
                    this.$refs.entityView.onSearch();
                } else {
                    this.$refs.entityView.search.term = `tags=${tag}`;
                    this.$refs.entityView.onSearch();
                }
            }
        }
    }
</script>

<style scoped>
    .el-main{
        padding:0px;
    }
</style>