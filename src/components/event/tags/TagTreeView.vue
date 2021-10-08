<template>		
    <el-container>
        <el-main style="padding: 5px;height: calc(100vh - 175px);">
            <el-tree 
                node-key="name"
                highlight-current
                :default-expand-all="false"
                :default-expanded-keys="defaultExpandedKeys"
                :expand-on-click-node="false"
                :data="nodes" 
                :props="defaultProps" 
                draggable
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                @node-drag-start="onDragStart"
                @node-drag-end="onDragEnd"
                @node-drop="onDrop"
                @node-click="onNodeClick"
                style="background: transparent;"
                ref="tree">
                <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;"  @mouseenter="onMouseEnter(data)" @mouseleave="onMouseLeave(data)">
                    <div v-if="auth.isadmin">
                        <span class="el-icon-price-tag" style="color: #f8a502;font-size: 14px;"></span>
                        <span v-if="data.name === '' && data.name.length === 0">
                            <span>标签</span>
                            <el-button v-show="data.show" type="text" @click="addTagDir(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-plus"></el-button>
                            <el-button v-show="data.show" type="text" @click.stop="loadNodes" style="float:right;width:14px;margin:0 5px;" icon="el-icon-refresh"></el-button>
                        </span>
                        <span v-else>
                            <span>{{node.label}}</span>
                            <el-button v-show="data.show" type="text" @click="delTagDir(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-delete"></el-button>
                            <el-button v-show="data.show" type="text" @click="editTagDir(data,$event)" style="float:right;width:14px;margin-left:5px;" icon="el-icon-edit"></el-button>
                            <el-button v-show="data.show" type="text" @click="addTagDir(data,$event)" style="float:right;width:14px;" icon="el-icon-plus"></el-button>
                        </span>
                    </div>
                    <div v-else>
                        <span class="el-icon-price-tag" style="color: #f8a502;font-size: 14px;"></span>
                        <span v-if="data.name === '' && data.name.length === 0">
                            <span>标签</span>
                            <el-button v-show="data.show" type="text" @click.stop="loadNodes" style="float:right;width:14px;margin:0 5px;" icon="el-icon-refresh"></el-button>
                        </span>
                        <span v-else>
                            <span>{{node.label}}</span>
                        </span>
                    </div>
                </span>                  
            </el-tree>
        </el-main>
    </el-container>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "TagTreeView",
        props: {
            model: Object,
            fun: {
                type: Function
            }
        },
        data(){
            return {
                appRoot: "/matrix/m3event/tags",
                auth: this.m3.auth.signedUser,
                defaultProps: {
                    children: 'nodes',
                    label: 'name'
                },
                nodes: [],
                defaultExpandedKeys: [""],
                nodePath: [],
                movePath: []
            }
        },
        created(){
            this.loadNodes();

            this.eventHub.$on("TAG-TREE-REFRESH",()=>{
                this.loadNodes()
            });
        },
        methods:{
            loadNodes(){
                let name = [this.appRoot,'getTagTreeByDomain.js'].join("/");
                let param = this.model.domain;
                this.m3.callFS(name,param).then(rtn=>{
                    this.nodes = rtn.message;
                });
            },
            onMouseEnter(data){
                this.$set(data, 'show', true);
                this.$refs.tree.setCurrentKey(data.key);
            },
            onMouseLeave(data){
                this.$set(data, 'show', false)
            },
            recursiveTraverse(nodes) {

                _.forEach(nodes, (v,k)=>{
                    
                    if(k < 1){
                        this.defaultExpandedKeys.push(v.name);
                    } 

                    this.recursiveTraverse(v.nodes);
                })

            },
            onNodeClick(tNode){
                this.fun(tNode.name);
            },
            onDragStart(node) {
                
                try {
                    this.getParentNode(node.label);
                    this.movePath[0] = node.label;
                    this.movePath[1] = this.nodePath.slice(1);
                } finally{
                    this.nodePath = [];
                }
                
            },
            onDragEnd() {
                
                this.getParentNode(this.movePath[0]);
                this.movePath[2] = _.initial(this.nodePath.slice(1));
                this.nodePath = [];

            },
            onDrop() {
                
                try {
                    // 提交更新
                    let name = this.movePath[1].join("/");
                    let newName = this.movePath[2].join("/");
                    let term = { domain: this.model.domain, tag: name, newTag: newName };
                    this.m3.callFS("/matrix/tags/tagDirMove.js", encodeURIComponent(JSON.stringify(term))).then(rtn=>{
                        if(rtn.status == 'ok') {
                            this.loadNodes();
                        }
                    });
                    
                } catch(err){
                    console.error(err)
                }
            },
            allowDrop(draggingNode, dropNode, type) {
                console.log(draggingNode);
                if (dropNode.data.label === '') {
                    return type !== 'inner';
                } else {
                    return true;
                }
            },
            allowDrag(draggingNode) {
                return draggingNode;
            },
            addTagDir(tNode,event){
                
                event.stopPropagation();

                this.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                    }).then(({ value }) => {

                        this.getParentNode(tNode.name);
                        
                        let name = _.concat(this.nodePath.slice(1),[value]).join("/");
                        let term = {domain: this.model.domain, tag: name};
                        this.m3.callFS("/matrix/tags/tagDirAdd.js", encodeURIComponent(JSON.stringify(term))).then(rtn=>{
                            if(rtn.status == 'ok') {
                                this.loadNodes();
                            } 

                            this.nodePath = [];
                        });

                    }).catch(() => {
                        
                    });

            },
            editTagDir(tNode,event){

                event.stopPropagation();

                this.$prompt('请输入标签名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: tNode.name
                    }).then(({ value }) => {

                        this.getParentNode(tNode.name);

                        let path = this.nodePath.slice(1);
                        let name = path.slice(1,-1).concat(tNode.name).join("/");
                        let newName = path.slice(1,-1).concat(value).join("/");
                        let term = {domain: this.model.domain, tag: name, newTag: newName};
                        this.m3.callFS("/matrix/tags/tagDirRename.js", encodeURIComponent(JSON.stringify(term))).then(rtn=>{
                            if(rtn.status == 'ok') {
                                this.loadNodes();
                            }

                            this.nodePath = [];
                        });
                        
                    }).catch(() => {
                        
                    });
            },
            delTagDir(tNode,event){
                
                event.stopPropagation();

                const h = this.$createElement;

                this.$msgbox({
                        title: "确认要删除该标签?",
                        message: h('span', null, [
                            h('p', null, `标签域：${this.model.domain}`),
                            h('p', null, `标签名称：${tNode.name}`)
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                }).then(() => {
                    
                    this.getParentNode(tNode.name);

                    let name = this.nodePath.slice(1).join("/");
                    let term = {domain: this.model.domain, tag: name};
                    this.m3.callFS("/matrix/tags/tagDirDelete.js", encodeURIComponent(JSON.stringify(term))).then(rtn=>{
                        if(rtn.status == 'ok') {
                            this.loadNodes();
                        }

                        this.nodePath = [];
                    });
                    
                }).catch(()=>{

                });

            },
            getParentNode(name) {
                
                let cNode = this.$refs.tree.getNode(name);
                        
                this.nodePath.unshift(cNode.label);
                
                if(cNode.parent && cNode.parent.label != undefined){
                    this.getParentNode(cNode.parent.label);
                }
            }
        }
    };
</script>

<style scoped>

</style>
