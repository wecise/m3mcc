<template>
  <div
    style="
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
    "
  >
    <el-header> SNMP MIBS </el-header>
    <div style="overflow: hidden; flex: 1 1 100%">
      <Split style="background: #ffffff" direction="vertical">
        <SplitArea
          :size="60"
          :minSize="1"
          style="overflow: auto; overflow-x: auto; overflow-y: auto"
        >
          <el-tree
            :data="tree.data"
            :props="tree.defaultProps"
            @node-click="onNodeClick"
          ></el-tree>
        </SplitArea>
        <SplitArea
          :size="40"
          :minSize="1"
          style="overflow: auto; overflow-x: auto; overflow-y: auto"
        >
          <el-table
            class="mib-info"
            :show-header="false"
            :data="dt.rows"
            border
            style="display: flex; flex-flow: column nowrap"
          >
            <el-table-column prop="key" label="Key" style="width: 50%">
            </el-table-column>
            <el-table-column prop="value" label="Value" style="width: 50%">
            </el-table-column>
          </el-table>
        </SplitArea>
      </Split>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import $ from "jquery";

export default {
  data() {
    return {
      tree: {
        data: [
          {
            Name: "MIB Tree",
            Children: [
              {
                Name: "iso.org.dod.internet",
                Children: [
                  {
                    Name: "mgmt",
                    Children: [
                      {
                        Name: "...",
                        Children: [],
                      },
                    ],
                  },
                  {
                    Name: "snmpV2",
                    Children: [
                      {
                        Name: "...",
                        Children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        defaultProps: {
          children: "Children",
          label: "Name",
        },
      },
      dt: {
        rows: [],
        columns: [],
      },
    };
  },
  mounted() {
    this.getMIBTree();
  },
  methods: {
    onNodeClick(node) {
      //console.debug("onNodeClick",JSON.stringify(node))
      let dtrows = [];
      let keys = node["--keys--"]
      if(!keys) {
        keys = Object.keys(node)
      }
      for(var ki=0; ki<keys.length; ki++) {
        var k = keys[ki]
        if(k.substring(0,2) != "--") {
            //console.debug("type of", k, typeof(node[k]))
            if (typeof node[k] in { string: 1, number: 1 }) {
            dtrows.push({
                key: k,
                value: node[k],
            });
            }
        }
      }
      this.$data.dt.rows = dtrows;
    //   $.ajax({
    //     url: "http://127.0.0.1:10801/mibtree?n=" + node.Name + "&x=2",
    //     dataType: "jsonp",
    //     type: "GET",
    //     success(data) {
    //       //console.debug("onNodeClick",JSON.stringify(data))
    //       if (
    //         data &&
    //         data.MIBTree &&
    //         data.MIBTree[0] &&
    //         data.MIBTree[0].Children
    //       ) {
    //         node.Children = data.MIBTree[0].Children;
    //       }
    //     },
    //     error(err) {
    //       console.error("getMIBTree", JSON.stringify(err));
    //     },
    //   });
      this.m3
        .callService("m3service.mibbrowser", "mibtree", {
          n: node.Name,
          x: 2,
        })
        .then((res) => {
          let data = res.message;
          if(data.Error) {
            console.error("", data.Error);
          } else {
            data = data.Result;
            //console.debug("onNodeClick",JSON.stringify(data))
            if (
                data &&
                data.MIBTree &&
                data.MIBTree[0] &&
                data.MIBTree[0].Children
            ) {
                node.Children = data.MIBTree[0].Children;
            }
          }
        });
      this.$emit("node-click", node);
    },
    getMIBTree() {
      let mdata = this.$data;
    //   $.ajax({
    //     url: "http://127.0.0.1:10801/mibtree?n=internet&x=2",
    //     dataType: "jsonp",
    //     type: "GET",
    //     success(data) {
    //       //console.debug("getMIBTree",JSON.stringify(data))
    //       data.MIBTree[0].Name = "iso.org.dod.internet";
    //       data.MIBTree[0].Children = data.MIBTree[0].Children.filter(function (
    //         item
    //       ) {
    //         return item.Name in { mgmt: 1, snmpV2: 1 };
    //       });
    //       mdata.tree.data = data.MIBTree;
    //     },
    //     error(err) {
    //       console.error("getMIBTree", JSON.stringify(err));
    //     },
    //   });
      this.m3
        .callService("m3service.mibbrowser", "mibtree", {
          n: "internet",
          x: 2,
        })
        .then((res) => {
          let data = res.message;
          if(data.Error) {
              console.error("", data.Error);
          } else {
            data = data.Result;
            //console.debug("getMIBTree",JSON.stringify(data))
            data.MIBTree[0].Name = "iso.org.dod.internet";
            data.MIBTree[0].Children = data.MIBTree[0].Children.filter(function (
                item
            ) {
                return item.Name in { mgmt: 1, snmpV2: 1 };
            });
            mdata.tree.data = data.MIBTree;
          }
        });
    },
  },
};
</script>

<style scoped>
.el-container {
  height: calc(100vh - 80px);
}
.el-header {
  height: 40px !important;
  line-height: 40px;
  padding: 0px 10px;
  background: #f2f2f2;
}
.el-main {
  padding: 0px;
  overflow: hidden;
  background: #ffffff;
}
</style>
<style>
.el-tree {
  height: 100%;
}
.el-tree-node__label {
  font-size: 12px !important;
}
.mib-info,
.mib-info .el-table__body-wrapper {
  overflow: visible !important;
  overflow-x: visible !important;
  overflow-y: visible !important;
}
</style>
