<template>
  <div class="TransactionDetail">
    <Nav />
    <div class="All">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        class="transaction-main-body1"
      >
        <p v-show="input">以太坊内部交易信息查询</p>
        <el-form-item title="请输入待查询的指定交易哈希" v-show="input">
          <el-input
            type="text"
            v-model="form.blockHash"
            style="width: 800px"
            @input="change($event)"
            placeholder="请输入待查询的指定交易哈希"
            id="input"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="input">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button type="primary"
            ><router-link to="/singleChainAnalysis/Eth" style="color: white"
              >返回上一级</router-link
            ></el-button
          >
        </el-form-item>
        <el-button v-show="show2" type="primary" :loading="true"
          >努力加载中</el-button
        >
      </el-form>

      <div v-show="show" class="transaction-main-body">
        <el-button
          type="danger"
          style="margin: 20px 10% 5px 10%"
          @click="onReset"
          >继续查询</el-button
        >
        <el-button
          type="primary"
          style="margin: 20px 10% 5px -5%"
          @click="trInfor"
          >查看详细信息</el-button
        >
        <br />
        <table class="table">
          <tr>
            <th colspan="2">以太坊交易基础信息</th>
          </tr>
          <tr>
            <td>交易哈希</td>
            <td>{{ info.hash }}</td>
          </tr>
          <tr>
            <td>区块哈希</td>
            <td>{{ info.blockhash }}</td>
          </tr>
          <tr>
            <td>区块高度</td>
            <td>{{ info.blocknumber }}</td>
          </tr>
          <tr>
            <td>交易发送地址</td>
            <td>
              <router-link
                :to="{ name: 'ethAddressQuery', params: { msgKey: info.from } }"
                style="color: #409eff"
                >{{ info.from }}</router-link
              >
              <el-tag
                v-if="info.from_label != ''"
                size="small"
                style="text-indent: 0px"
                >{{ info.from_label }}</el-tag
              >
            </td>
          </tr>
          <tr>
            <td>交易接收地址</td>
            <td>
              <router-link
                :to="{ name: 'ethAddressQuery', params: { msgKey: info.to } }"
                style="color: #409eff"
                >{{ info.to }}</router-link
              >
              <el-tag
                v-if="info.to_label != ''"
                size="small"
                style="text-indent: 0px"
                >{{ info.to_label }}</el-tag
              >
            </td>
          </tr>
          <tr>
            <td>交易金额</td>
            <td>{{ info.value }} ether</td>
          </tr>
          <tr>
            <td>交易时间</td>
            <td>{{ info.timestamp }}</td>
          </tr>
          <tr>
            <td>燃料量</td>
            <td>{{ info.gas }}</td>
          </tr>
          <tr>
            <td>燃料价格</td>
            <td>{{ info.gasprice }}</td>
          </tr>
          <!-- <tr>
             <td>输入信息</td>
             <td>{{info.input}}</td>
           </tr> -->
          <tr>
            <td>随机数</td>
            <td>{{ info.nonce }}</td>
          </tr>
          <tr>
            <td>交易序号</td>
            <td>{{ info.transactionindex }}</td>
          </tr>
          <tr v-show="tr">
            <td>r</td>
            <td>{{ info.r }}</td>
          </tr>
          <tr v-show="tr">
            <td>s</td>
            <td>{{ info.s }}</td>
          </tr>
          <tr v-show="tr">
            <td>v</td>
            <td>{{ info.v }}</td>
          </tr>
          <tr v-if="usdt && tr">
            <td>usdt调用方法</td>
            <td>{{ info.usdt.method }}</td>
          </tr>
          <tr v-if="usdt && tr">
            <td>usdt真实发送方</td>
            <td>{{ info.usdt.usdt_real_from }}</td>
          </tr>
          <tr v-if="usdt && tr">
            <td>usdt真实接收方</td>
            <td>{{ info.usdt.usdt_to_addr }}</td>
          </tr>
          <tr v-if="usdt && tr">
            <td>usdt交易金额</td>
            <td>{{ info.usdt.usdt_value }} u</td>
          </tr>
        </table>
        <br /><br /><br />
        <h3>以太坊交易内部数据展示</h3>
        <div id="container"></div>
        
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../../../components/nav/Nav";
export default {
  data() {
    return {
      usdt: false,
      graphdata: {},
      input: true,
      info: "",
      test: false,
      vin: "",
      vout: "",
      show2: false,
      resultReady: false,
      tr: false,
      amount_in: 0,
      amount_out: 0,
      resData: {},
      script_in: [],
      script_out: [],
      display: false,
      show1: false,
      form: {
        blockHash: "",
      },
      loading: true,
      errored: false,
      show: false,
    };
  },
  components: {
    Nav,
  },
  methods: {
    paint() {
      this.test = true;
      console.log("internaltxquery_paint");
      const data = {
        nodes: [
          {
            id: "0",
            label: "0",
            cluster: "part1",
          },
          {
            id: "1",
            label: "1",
            cluster: "part2",
          },
          {
            id: "2",
            label: "2",
            cluster: "part1",
          },
          {
            id: "3",
            label: "3",
            cluster: "part2",
          },
          {
            id: "4",
            label: "4",
            cluster: "part1",
          },
          {
            id: "5",
            label: "5",
            cluster: "part2",
          },
          {
            id: "6",
            label: "6",
            cluster: "part1",
          },
          {
            id: "7",
            label: "7",
            cluster: "part2",
          },
          {
            id: "8",
            label: "8",
            cluster: "part1",
          },
          {
            id: "9",
            label: "9",
            cluster: "part2",
          },
          {
            id: "10",
            label: "10",
            cluster: "part1",
          },
          {
            id: "11",
            label: "11",
            cluster: "part2",
          },
        ],
        edges: [
          {
            source: "0",
            target: "1",
            length: 123,
          },
          {
            source: "1",
            target: "0",
            length: 190,
          },
          {
            source: "2",
            target: "3",
          },
          {
            source: "4",
            target: "5",
          },
          {
            source: "6",
            target: "7",
          },
          {
            source: "8",
            target: "9",
          },
          {
            source: "10",
            target: "11",
          },
        ],
      };

      this.$g6.registerLayout("bigraph-layout", {
        execute() {
          const self = this;
          const center = self.center;
          const biSep = self.biSep;
          const nodeSep = self.nodeSep;
          const nodeSize = self.nodeSize;
          const direction = self.direction || "horizontal";
          let part1Pos = 0;
          let part2Pos = 0;
          if (direction === "horizontal") {
            part1Pos = center[0] - biSep / 2;
            part2Pos = center[0] + biSep / 2;
          }
          const { nodes, edges } = self;
          const part1Nodes = [];
          const part2Nodes = [];
          const part1NodeMap = new Map();
          const part2NodeMap = new Map();
          // separate the nodes and init the positions
          nodes.forEach(function (node, i) {
            if (node.cluster === "part1") {
              part1Nodes.push(node);
              part1NodeMap.set(node.id, i);
            } else {
              part2Nodes.push(node);
              part2NodeMap.set(node.id, i);
            }
          });

          // order the part1 node
          part1Nodes.forEach(function (p1n) {
            let index = 0;
            let adjCount = 0;
            edges.forEach(function (edge) {
              const sourceId = edge.source;
              const targetId = edge.target;
              if (sourceId === p1n.id) {
                index += part2NodeMap.get(targetId);
                adjCount += 1;
              } else if (targetId === p1n.id) {
                index += part2NodeMap.get(sourceId);
                adjCount += 1;
              }
            });
            index /= adjCount;
            p1n.index = index;
          });
          part1Nodes.sort(function (a, b) {
            return a.index - b.index;
          });
          part2Nodes.forEach(function (p2n) {
            let index = 0;
            let adjCount = 0;
            edges.forEach(function (edge) {
              const sourceId = edge.source;
              const targetId = edge.target;
              if (sourceId === p2n.id) {
                index += part1NodeMap.get(targetId);
                adjCount += 1;
              } else if (targetId === p2n.id) {
                index += part1NodeMap.get(sourceId);
                adjCount += 1;
              }
            });
            index /= adjCount;
            p2n.index = index;
          });
          part2Nodes.sort(function (a, b) {
            return a.index - b.index;
          });

          // place the nodes
          const hLength =
            part1Nodes.length > part2Nodes.length
              ? part1Nodes.length
              : part2Nodes.length;
          const height = hLength * (nodeSep + nodeSize);
          let begin = center[1] - height / 2;
          if (direction === "vertical") {
            begin = center[0] - height / 2;
          }
          part1Nodes.forEach(function (p1n, i) {
            if (direction === "horizontal") {
              p1n.x = part1Pos;
              p1n.y = begin + i * (nodeSep + nodeSize);
            } else {
              p1n.x = begin + i * (nodeSep + nodeSize);
              p1n.y = part1Pos;
            }
          });
          part2Nodes.forEach(function (p2n, i) {
            if (direction === "horizontal") {
              p2n.x = part2Pos;
              p2n.y = begin + i * (nodeSep + nodeSize);
            } else {
              p2n.x = begin + i * (nodeSep + nodeSize);
              p2n.y = part2Pos;
            }
          });
        },
      });

      this.$g6.Util.processParallelEdges(data.edges);

      const container = document.getElementById("container");
      console.log("getcontainer");
      const width = 1600;
      const height = 600;
      const graph = new this.$g6.Graph({
        container: "container",
        width,
        height,
        layout: {
          type: "bigraph-layout",
          biSep: 600,
          nodeSep: 50,
          nodeSize: 20,
        },
        animate: true,
        defaultNode: {
          size: [350, 40],
          type: "rect",
          style: {
            radius: 10,
            fill: "#C6E5FF",
            stroke: "#5B8FF9",
          },
        },
        defaultEdge: {
          type: "quadratic",
          size: 1,
          color: "#e2e2e2",
        },
        modes: {
          default: [
            "drag-canvas",
            {
              type: "edge-tooltip", // 提示框
              offset: 1,
              formatText(model) {
                //提示框文本内容
                let text = "";

                text = "交易数据：" +
                "<br/>交易合约地址：" +
                  model.token +
                  "<br/>交易代币数量：" +
                  model.token_value;

                return text;
              },
            },
          ],
        },
      });

      let resdata = this.resData;

      let dataList = {
        nodes: [],
        edges: [],
      };
      for (let i in resdata) {
        let temp = resdata[i];
        let nodefrom = {
          id: temp["src"],
          label: temp["src"],
          cluster: "part1",
        };
        let nodeto = {
          id: temp["dst"],
          label: temp["dst"],
          cluster: "part2",
        };
        let flag1 = true;
        let flag2 = true;
        dataList.nodes.forEach((item) => {
          if (item.id == nodefrom.id) {
            console.log("from");
            console.log(item.id);
            flag1 = false;
          }
        });
        dataList.nodes.forEach((item) => {
          if (item.id == nodeto.id) {
            console.log("to");
            console.log(item.id);
            flag2 = false;
          }
        });
        if (flag1) {
          dataList.nodes.push(nodefrom);
        }
        if (flag2) {
          dataList.nodes.push(nodeto);
        }

        let edge = {
          source: temp["src"],
          target: temp["dst"],
          token: temp["token"],
          token_value: temp["token_value"],
        };
        dataList.edges.push(edge);
      }
      console.log(dataList);
      graph.data(dataList);
      console.log('render')
      graph.render();
      

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
    },
    onReset() {
      Object.assign(this.$data, this.$options.data());
    },
    change(e) {
      this.$forceUpdate();
    },
    onSubmit() {
      console.log("internaltxquery_onSubmit");
      this.show2 = true;
      this.input = false;
      this.display = true;
      let url =
        "http://10.176.34.154:8000/api/basicquery/eth/internaltx/" +
        this.form.blockHash +
        "/";
      this.$axios.get(url).then((res) => {
        console.log(res.data);
        if (res.data) {
          this.show2 = false;
          this.info = res.data.basic_info;
          this.show = true;
          this.resData = res.data.internal_tx;
          this.resultReady = true;
          this.paint();
          
        }
      });
    },
    
    showInfo() {
      this.show1 = !this.show1;
    },
    trInfor() {
      this.tr = true;
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: normal;
}

/* ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
} */
.All {
  min-height: 900px;

  padding-bottom: 100px;
}

a {
  color: #42b983;
}
.table {
  border-collapse: collapse;
  width: 80%;
  margin: 0 10%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
}
td {
  border: 1px solid gray;
  height: 35px;
}
th {
  height: 40px;
  background-color: #50a6fc;
  color: white;
  text-align: left;
  border: none;
}

.transaction-main-body1 {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
}

.transaction-main-body {
  position: relative;
  top: 20px; /* 距离窗口顶部距离 */
  /*vertical-align: middle;*/
  width: 80%;
  margin: 20px 10% 100px 10%;
}
#container {
  height: 650px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>