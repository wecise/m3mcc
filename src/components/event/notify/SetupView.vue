<template>
  <el-container>
    <el-main>
        <el-tabs value="email" tabPosition="left" type="border-card" v-if="rtype">
          <el-tab-pane label="邮件配置" name="email" v-if="rtype.email && rtype.email.status">
              <el-form :model="rtype.email"  label-width="100px">
                <el-form-item label="SMTP地址" prop="address">
                  <el-input v-model="rtype.email.address"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model="rtype.email.port"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="rtype.email.username"></el-input>
                </el-form-item>
                <el-form-item label="用户口令" prop="password">
                  <el-input v-model="rtype.email.password"></el-input>
                </el-form-item>
                <el-form-item label="定时器" prop="cron">
                  <el-input v-model="rtype.email.cron"></el-input>
                </el-form-item>
                <el-form-item label="服务器" prop="group">
                  <el-input v-model="rtype.email.group"></el-input>
                </el-form-item>
                <el-form-item label="开启日志" prop="log">
                  <el-switch v-model="rtype.email.log"></el-switch>
                </el-form-item>
                <el-form-item label="HTML" prop="html">
                  <el-switch v-model="rtype.email.html"></el-switch>
                </el-form-item>
                <el-form-item label="重试间隔" prop="retry_interval">
                  <el-input-number v-model="rtype.email.retry_interval"></el-input-number>
                </el-form-item>
                <el-form-item label="重试次数" prop="retry_num">
                  <el-input-number v-model="rtype.email.retry_num"></el-input-number>
                </el-form-item>
                <el-form-item label="发送数量" prop="send_num">
                  <el-input-number v-model="rtype.email.send_num"></el-input-number>
                </el-form-item>
              </el-form>
          </el-tab-pane>

          <el-tab-pane label="短信配置" name="sms" v-if="rtype.sms && rtype.sms.status">
            <el-form :model="rtype.sms"  label-width="100px">
                
                <el-form-item label="接口类型">
                  <el-radio-group v-model="rtype.sms.type">
                    <el-radio label="netgate">网关</el-radio>
                    <el-radio label="jdbc">JDBC</el-radio>
                    <el-radio label="rest">REST</el-radio>
                  </el-radio-group>
                </el-form-item>

                <template v-if="rtype.sms.type==='netgate'">

                  <el-form-item label="地址" prop="address">
                    <el-input v-model="rtype.sms.netgate.address"></el-input>
                  </el-form-item>
                  <el-form-item label="端口" prop="port">
                    <el-input v-model="rtype.sms.netgate.port"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.sms.netgate.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.sms.netgate.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.sms.netgate.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.sms.netgate.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.sms.netgate.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.sms.netgate.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.sms.netgate.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.sms.netgate.send_num"></el-input-number>
                  </el-form-item>

                </template>
                <template v-if="rtype.sms.type==='jdbc'">
                  
                   <el-form-item label="Driver" prop="driver">
                      <el-input v-model="rtype.sms.jdbc.driver"></el-input>
                    </el-form-item>
                  <el-form-item label="Url" prop="url">
                    <el-input v-model="rtype.sms.jdbc.url"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.sms.jdbc.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.sms.jdbc.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.sms.jdbc.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.sms.jdbc.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.sms.jdbc.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.sms.jdbc.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.sms.jdbc.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.sms.jdbc.send_num"></el-input-number>
                  </el-form-item>

                </template>
                <template v-if="rtype.sms.type==='rest'">
                  
                  <el-form-item label="URL" prop="url">
                    <el-input v-model="rtype.sms.rest.url"></el-input>
                  </el-form-item>
                  <el-form-item label="端口" prop="port">
                    <el-input v-model="rtype.sms.rest.port"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.sms.rest.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.sms.rest.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.sms.rest.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.sms.rest.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.sms.rest.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.sms.rest.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.sms.rest.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.sms.rest.send_num"></el-input-number>
                  </el-form-item>

                </template>
              </el-form>
          </el-tab-pane>

          <el-tab-pane label="微信配置" name="wechat"  v-if="rtype.wechat && rtype.wechat.status">

            <el-form :model="rtype.wechat"  label-width="100px">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="rtype.wechat.address"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model="rtype.wechat.port"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="rtype.wechat.username"></el-input>
                </el-form-item>
                <el-form-item label="用户口令" prop="password">
                  <el-input v-model="rtype.wechat.password"></el-input>
                </el-form-item>
                <el-form-item label="定时器" prop="cron">
                  <el-input v-model="rtype.wechat.cron"></el-input>
                </el-form-item>
                <el-form-item label="服务器" prop="group">
                  <el-input v-model="rtype.wechat.group"></el-input>
                </el-form-item>
                <el-form-item label="开启日志" prop="log">
                  <el-switch v-model="rtype.wechat.log"></el-switch>
                </el-form-item>
                <el-form-item label="重试间隔" prop="retry_interval">
                  <el-input-number v-model="rtype.wechat.retry_interval"></el-input-number>
                </el-form-item>
                <el-form-item label="重试次数" prop="retry_num">
                  <el-input-number v-model="rtype.wechat.retry_num"></el-input-number>
                </el-form-item>
                <el-form-item label="发送数量" prop="send_num">
                  <el-input-number v-model="rtype.wechat.send_num"></el-input-number>
                </el-form-item>
              </el-form>

          </el-tab-pane>

        </el-tabs>
        
    </el-main>
    <el-footer>
      <el-button type="success" @click="onApply">提交</el-button>
    </el-footer>
  </el-container>

</template>

<script>
import _ from 'lodash';

export default {
  name: "SetupView",
  data() {
    return {
      root: '/script/matrix/m3event/notify/server',
      rtype: null
    };
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let param = {parent: this.root , fullname: this.root, name: 'server.json'};
        this.m3.dfsRead(param).then( res=>{
            this.rtype = JSON.parse(res);
        } );
    },
    onNodeClick(node){
      this.dt.columns = [];
      
      this.m3.dfsRead(node).then(res=>{
        let rt = JSON.parse(res.message);
        this.dt.rows = rt.rows;
        this.dt.columns = _.map(rt.columns,v=>{
          if(_.isUndefined(v.visible)){
              _.extend(v, { visible: true });
          }

          if(!v.render){
              return v;
          } else {
              return _.extend(v, { render: eval(v.render) });
          }
        });  
      })
    },
    onRefresh(){
      this.initData();
    },
    onApply(){

      let content = JSON.stringify(this.rtype,null,2);
    
      let param = {
                      parent: this.root, name: "server.json", 
                      data: { content: content, type: 'json', attr: '', index: true }    
                  };
      
      this.m3.dfsWrite(param).then(()=>{
          
          
          let data = _.filter(this.rtype,v=>{ return v.status; });
          let param = encodeURIComponent( JSON.stringify(data) );
          this.m3.callFS("/matrix/m3event/notify/setup.js", param).then(rtn=>{
            console.log(rtn);
          })
          
          this.$message({
            type: "success",
            message: "更新成功"
          })  
      }).catch((err)=>{
          this.$message({
            type: "error",
            message: "更新失败 " + err.message
          })
      })

    },
    onEdit(index,row){
      console.log(index,row)
    },
    onDelete(index,row){
      console.log(index,row)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px)!important;
  }
  .el-header{
    height:40px!important;
    line-height:40px;
  }
  .el-main{
    padding: 0px;
    overflow: hidden;
  }
  .el-footer{
    text-align: center;
    line-height: 60px;
  }
</style>
