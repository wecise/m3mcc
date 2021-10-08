<template>		
    <div v-if="auth.isAdmin" style="border:unset!important;color:#ffffff;height: unset!important;">
        <div v-if="model.length > limit">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <i class="el-icon-price-tag el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :key="tag" v-for="tag in model">
                        <el-tag
                            :closable="auth.isAdmin"
                            :disable-transitions="false"
                            @close="onTagClose(tag)">
                            {{tag}}
                        </el-tag>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
            <el-button type="text" icon="el-icon-plus" v-else class="button-new-tag" size="mini" @click.stop="showInput"></el-button>
        </div>
        <div style="padding:0px;overflow: hidden;" v-else>
            <el-tag
                :key="tag"
                v-for="tag in model"
                :closable="auth.isAdmin"
                :disable-transitions="false"
                @close="onTagClose(tag)">
                {{tag}}
                </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"></el-input>
            <el-button type="text" icon="el-icon-plus" v-else class="button-new-tag" size="mini" @click.stop="showInput"></el-button>
        </div>
    </div>
    <div v-else>
        <div style="padding:0px;overflow: hidden;min-height:20px;">
            <el-dropdown v-if="model.length > limit">
                <span class="el-dropdown-link">
                    <i class="el-icon-price-tag el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :key="tag" v-for="tag in model">
                        <el-tag
                            :closable="auth.isAdmin"
                            :disable-transitions="false"
                            @close="onTagClose(tag)">
                            {{tag}}
                        </el-tag>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-tag
                :key="tag"
                v-for="tag in model"
                :closable="auth.isAdmin"
                :disable-transitions="false"
                @close="onTagClose(tag)"
                v-else>
                {{tag}}
            </el-tag>
            <el-select v-model="inputValue" 
                filterable 
                placeholder="请选择标签" 
                @change="handleInputConfirm"
                ref="saveTagInput"
                v-if="inputVisible"
                style="display:none;">
                <el-option
                    v-for="item in allTags"
                    :key="item.id"
                    :value="item.name">
                    <span style="float: left;">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.domain }}</span>
                </el-option>
            </el-select>
            <el-button type="text" icon="el-icon-plus" v-else class="button-new-tag" size="mini" @click.stop="showInput" style="display:none;"></el-button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "TagView",  
        props: {
            domain: String,
            model: Array,
            limit: Number,
            id: String
        },
        data() {
            return {
                inputVisible: false,
                inputValue: "",
                allTags: [],
                auth: this.m3.auth
            };
        },
        created(){
            this.initTags();
        },
        methods: {
            initTags(){
                let key = `${this.domain}-cache`;
                let cache = localStorage.getItem(key);

                if(_.isEmpty(cache)){
                    this.m3.callFS("/matrix/tags/getAllTags.js").then((rtn)=>{
                        this.allTags = _.filter(rtn.message, {domain: this.domain});
                        localStorage.setItem(key, JSON.stringify(this.allTags));
                    });
                } else {
                    this.allTags = JSON.parse(cache);
                }
                
            },
            onTagClose(tag) {
                
                this.model.splice(this.model.indexOf(tag), 1);

                if(!_.isEmpty(this.id)) {
                    try{
                        let term = {domain: this.domain, action: "-", tags: [tag], ids: [this.id]};
                        this.m3.callFS("/matrix/tags/tag_service.js", encodeURIComponent(JSON.stringify(term))).then(()=>{
                            this.eventHub.$emit("TAG-TREE-REFRESH");
                        });

                    } catch(err){
                        console.log(err);
                    }
                }
                
            },
            onChangeValue(value){
                this.inputValue = value;
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(() => {
                    if(this.auth.isAdmin){
                        this.$refs.saveTagInput.$refs.input.focus();
                    } else {
                        this.$refs.saveTagInput.focus();
                    }
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                
                if (inputValue) {
                    this.model.push(inputValue);

                    if(!_.isEmpty(this.id)) {
                        try{
                            let term = {domain:this.domain, action: "+", tags: [inputValue], ids: [this.id]};
                            this.m3.callFS("/matrix/tags/tag_service.js", encodeURIComponent(JSON.stringify(term))).then(()=>{
                                this.eventHub.$emit("TAG-TREE-REFRESH");
                            });

                        } catch(err){
                            console.log(err);
                        }
                    }

                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }
    };
</script>

<style scoped>
    .el-main{
        padding:0px;
        overflow: hidden;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 25px;
        line-height: 23px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .el-input--mini .el-input__inner {
        height: 22px!important;
        line-height: 22px!important;
    }

    .info-popper{
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        background: #fff;
        padding: 10px;
        outline: unset;
    }

</style>