<template>
  <div name="top">
    <Navigation />
    <div class="All">
      <div class="homeBody_Single">
        <router-link to="/singleChainAnalysis/Eth">
          <el-button type="primary" class="buttonTXC"
            >返回上一页</el-button
          ></router-link
        >
        <h3 style="text-align: center">以太坊地址关联分析</h3>
        <h6>以太坊地址的聚类与关联工作是基于以太坊与泰达币（USDT）交易数据所展开的。
          由于泰达币是以太坊生态中最为活跃，并且与现实世界法定货币存在映射关系的一种代币，
          因此，本平台将视角聚焦以太坊自身的交易与泰达币的交易。</h6><br />
        <el-form :model="form" :label-position="labelPosition">
          <el-form-item label="待查询的地址">
            <el-input
              type="text"
              v-model="form.address"
              placeholder="输入地址"
              style="width: 680px"
            ></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="8">
              <el-form-item label="查询深度">
                <el-input-number
                  v-model="form.num"
                  :step="1"
                  style="width: 130px"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button v-show="loadReady" type="primary" :loading="true"
                >努力加载中</el-button
              >
            </el-col>
          </el-row>
          <el-form-item> </el-form-item>
        </el-form>
        <img
          id="img1"
          v-if="!resultReady"
          src="../../../../assets/tsne_3d_new.gif"
        />
        <div v-show="resultReady">
          <div>地址关联结果</div>

          <div>
            <el-table
              :data="listData"
              :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
              class="table"
            >
              <el-table-column prop="target" label="节点地址"></el-table-column>
              <el-table-column prop="label" label="地址标签">
                <template slot-scope="scope">
        
                            <el-tag v-if="scope.row.label!=''" size="small" style="text-indent: 0px">{{scope.row.label}}</el-tag>
                          </template>
              </el-table-column>
              <el-table-column prop="num" label="地址相似度(根据地址向量间的余弦距离进行计算)"></el-table-column>
            </el-table>
          </div>
          <div>地址关联可视化</div>
          <div id="container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../../../../components/nav/Nav.vue";
import insertCss from "insert-css";
import router from "../../../../router";
import Footer from "../../../../components/nav/Footer";
insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);
export default {
  data() {
    return {
      node0: '',
      listData: [],
      loadReady: false,
      resetShow: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      addressList: [
        {
          address: "1tTPrttnGFzybBKAjV3dYTpx6Y7NxtA8L",
          amount: "1BTC",
          FirstTradingTime: "2016-06-01",
          LastTradingTime: "2017-07-01",
        },
      ],
      labelPosition: "right",
      resultReady: false,
      resultData: [],
      form: {
        address: "",
        num: "10",
      },
    };
  },
  components: {
    Navigation,
    Footer,
  },
  mounted() {
    if (this.$store.state.isLogin == false) {
      console.log("未登录");
      router.push("/");
    }
  },

  methods: {
    paint() {
      const width = 1500;
      const height = 600;
      const colors = [
        "#BDD2FD",
        "#BDEFDB",
        "#C2C8D5",
        "#FBE5A2",
        "#F6C3B7",
        "#B6E3F5",
        "#D3C6EA",
        "#FFD8B8",
        "#AAD8D8",
        "#FFD6E7",
      ];
      const strokes = [
        "#5B8FF9",
        "#5AD8A6",
        "#5D7092",
        "#F6BD16",
        "#E8684A",
        "#6DC8EC",
        "#9270CA",
        "#FF9D4D",
        "#269A99",
        "#FF99C3",
      ];
      const container = document.getElementById("container");

      const graph = new this.$g6.Graph({
        container: "container",
        width,
        height,
        clustering: true,
        layout: {
          type: "force",
          preventOverlap: true,
          linkDistance: (d) => {
            return d.length;
          },
          nodeSize: 60,
        },
        Node: {},
        defaultNode: {
          color: colors,
        },
        modes: {
          default: [
            "drag-canvas",
            "drag-node",
            "zoom-canvas",
            {
              type: "tooltip", // 提示框
              formatText(model) {
                //提示框文本内容
                
                let text = "id: " + model.id;
                return text;
              },
            },
            {
              type: "edge-tooltip", // 提示框
              formatText(model) {
                //提示框文本内容                
                let text1 = "相似度：" + 100 / model.length;
                return text1;
              },
            },
          ],
        },
      });
      const data2 = [
        { "0x0a98fb70939162725ae66e626fe4b52cff62c2e5": 1.0 },
        { "0x67a1671830c087d38f335fd7f703767ebc182d1a": 0.91018146276474 },
        { "0x2bb84d73a4e9373566d491f63470768919160df4": 0.540532112121582 },
        { "0x2f125231174f4e2721ed40069cfeba511cffbd3d": 0.5111662149429321 },
        { "0x6748f50f686bfbca6fe8ad62b22228b87f31ff2b": 0.4939717650413513 },
        { "0xfdb16996831753d5331ff813c29a93c76834a0ad": 0.48564112186431885 },
        { "0xeee28d484628d41a82d01e21d12e2e78d69920da": 0.4726434350013733 },
        { "0x46705dfff24256421a05d056c29e81bdc09723b8": 0.4661341607570648 },
        { "0x1fa5b47a1f511abc7c211e74517027858f2f518b": 0.4657541513442993 },
        { "0x16f1a2020f498beede1d14b75f412d5b51145d0c": 0.462733656167984 },
      ];
      let data1 = this.resultData;
      let dataList = {
        nodes: [],
        edges: [],
      };
      let node0 = this.node0;
      for (let i in data1) {
        let nodetemp = {};
        let dataKey = i;
        let dataValue = Object.values(data1[i])[0];
        if(Object.values(data1[i])[1].label != 'no'){
          let dataLabel = Object.values(data1[i])[1].label;
          nodetemp['label'] = dataLabel
        }
        else {
          nodetemp['label'] = ''
        }
        nodetemp["id"] = dataKey;
        nodetemp["size"] = 60;
        dataList.nodes.push(nodetemp);
        if (i != node0) {
          let edgetemp = {};
          let listtemp = {};
          edgetemp["source"] = node0;
          edgetemp["target"] = dataKey;
          edgetemp["length"] = 100 / dataValue;
          dataList.edges.push(edgetemp);
          listtemp['target'] = dataKey;
          listtemp['num'] = dataValue;
          listtemp['label'] = nodetemp['label']
          this.listData.push(listtemp)
        }
      }
      // console.log(dataList);
      // console.log(this.listData)
      //数据格式
      // const data = {
      //   nodes: [
      //     { id: "node0", size: 15 },
      //     { id: "node1", size: 15 },
      //     { id: "node2", size: 15 },
      //     { id: "node3", size: 15 },
      //   ],
      //   edges: [
      //     { source: "node0", target: "node1", length: 100 },
      //     { source: "node0", target: "node2", length: 100 },
      //     { source: "node0", target: "node3", length: 100 },
      //   ],
      // };
      const nodes = dataList.nodes;
      graph.node((node) => {
        // console.log(node);
        if (node.id === node0) {
          return {
            style: {
              fill: "#2db7f5",
              stroke: "#ea7171",
            },
          };
        }
        return {
          style: {
            fill: "#fff",
            stroke: "#ea7171",
          },
        };
      });

      graph.data({
        nodes,
        edges: dataList.edges.map(function (edge, i) {
          edge.id = "edge" + i;
          return Object.assign({}, edge);
        }),
      });
      graph.render();

      graph.on("node:dragstart", function (e) {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", function (e) {
        refreshDragedNodePosition(e);
      });
      graph.on("node:dragend", function (e) {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });

      if (typeof window !== "undefined")
        window.onresize = () => {
          if (!graph || graph.get("destroyed")) return;
          if (!container || !container.scrollWidth || !container.scrollHeight)
            return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };

      function refreshDragedNodePosition(e) {
        const model = e.item.get("model");
        model.fx = e.x;
        model.fy = e.y;
      }
    },
    onSubmit() {
      this.loadReady = true;
      var address = this.form.address;
      var num = this.form.num;
      this.node0 = address;
      var form = {
        address: address,
        num: num,
      };
      console.log(form);
      this.$axios
        .post("http://10.176.34.154:8000/api/analysis/eth/address_link", form)
        .then((res) => {
          if (res.data) {
            this.loadReady = false;
            console.log(res.data);
            this.resultData = res.data;
            this.paint();
            this.resultReady = true;
          }
        });
    },
  },
};
</script>

<style scoped>
.divAll {
  min-height: 700px;
}
.buttonTXC {
  margin-top: 2%;
  margin-bottom: 3%;
}
table {
  border-collapse: collapse;
  width: 60%;
  margin: 0 20%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
}
h3 {
  margin-bottom: 3%;
}
.homeBody_Single {
  padding: 8%;
  font-weight: bold;
}
.homeBody_Single_Title {
  text-align: center;
  font-size: 18px;
}
#container {
  height: 600px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>