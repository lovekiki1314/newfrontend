<template>
  <div>
    <Nav />
    <div class="mainbody2">
      <el-table
        :data="
          listdata.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        "
        :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
        element-loading-text="数据正在加载中..."
      >
        <!-- <template slot="empty">
              <img src="logo.ico" alt="暂无数据">
            </template> -->
        <el-table-column prop="AA" label="序号" width="150">
          <!-- <template slot-scope="scope">
                            <router-link :to="{ name: 'btcTransactionQuery', params: { msgKey: scope.row.transactionhash}}"
                            >{{scope.row.transactionhash}}</router-link>
                          </template> -->
        </el-table-column>
        <el-table-column prop="BB" label="交易发送方银行账户">
        </el-table-column>
        <el-table-column prop="CC" label="交易接收方银行账户">
        </el-table-column>
        <el-table-column prop="DD" label="交易时间"> </el-table-column>
        <el-table-column prop="EE" label="交易金额"> </el-table-column>
        <el-table-column label="结果获取" width="250">
          <template slot-scope="scope">
            <el-button v-if="scope.row" @click="enter(scope.row)" type="primary"
              >分析结果</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="listdata.length"
      >
      </el-pagination>
      <br /><br /><br />
      <h3>交易匹配可视化</h3>
      <div id="container"></div>
      <br /><br /><br />
      <el-button
        type="primary"
        icon="el-icon-download2"
        class="loadButton"
        @click="download"
        >下载文件</el-button
      >
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
import insertCss from "insert-css";
insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 10px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

let graph;
export default {
  data() {
    return {
      show: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      fuzzy_form: {},
      datas: [],
      listdata: [],
      resultdata: {},
    };
  },
  components: {
    Nav,
  },
  mounted() {
    if (this.$cookies.get("fuzzy_form") != "") {
      console.log(this.$cookies.get("fuzzy_form"));
      console.log(this.$cookies.get("task_id"));
      this.fuzzy_form = this.$cookies.get("fuzzy_form");
    }
    let form = {
      task_file: this.fuzzy_form["上传文件"],
    };
    console.log(form);
    this.$axios
      .post(
        "http://10.176.34.154:8000/api/analysis/fuzzy_query_view_list",
        form
      )
      .then((res) => {
        console.log(res.data);
        let resdata = res.data;
        let listtemp = [];
        resdata.forEach((item) => {
          let temp = {
            AA: Object.keys(item)[0],
            BB: Object.values(item)[0][0],
            CC: Object.values(item)[0][1],
            DD: Object.values(item)[0][2],
            EE: Object.values(item)[0][3],
          };
          listtemp.push(temp);
        });
        this.listdata = listtemp;
        console.log(this.listdata);
      });

    const container = document.getElementById("container");
    const width = 1830;
    const height = 600;
    graph = new this.$g6.Graph({
      container: "container",
      width,
      height,
      fitView: true,
      modes: {
        default: [
          "drag-canvas",
          // "drag-node",
          // "zoom-canvas",
          {
            type: "edge-tooltip", // 提示框
            offset: 1,
            formatText(model) {
              //提示框文本内容
              let text = "";
              if (model.hash) {
                text =
                  "交易哈希：" +
                  model.hash +
                  "<br/>链上交易时间：" +
                  model.time +
                  "<br/>法币数量：" +
                  model.coin +
                  "<br/>加密货币数量：" +
                  model.value;
              } else text = "交易类型：" + model.currency;
              return text;
            },
          },
        ],
      },
      layout: {
        type: "dagre",
        rankdir: "LR",
        align: "UL",
        controlPoints: true,
        nodesepFunc: () => 1,
        ranksepFunc: () => 1,
      },
      defaultNode: {
        size: [350, 40],
        type: "rect",
        style: {
          radius: 10,
          lineWidth: 1,
          stroke: "#5B8FF9",
          fill: "#C6E5FF",
        },
      },
      defaultEdge: {
        type: "line",
        size: 2,
        color: "#808080",
      },
    });

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

    // this.paint();
  },
  methods: {
    enter(data) {
      let content = data;
      console.log("fuzzyshow_enter");
      console.log(content);
      let form = {
        task_file: this.fuzzy_form["上传文件"],
        bank_from: content.BB,
        bank_to: content.CC,
      };
      this.paint(form);
    },
    paint(form) {
      if (graph) {
        graph.clear();
      }
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
      const data = {
        nodes: [
          {
            id: "0",
            label: "a",
          },
          {
            id: "1",
            label: "1",
          },
          {
            id: "2",
            label: "2",
          },
          {
            id: "3",
            label: "3",
          },
          {
            id: "4",
            label: "4",
          },
          {
            id: "5",
            label: "5",
          },
          {
            id: "6",
            label: "6",
          },
          {
            id: "7",
            label: "7",
          },
        ],
        edges: [
          {
            source: "0",
            target: "1",
            length: "123",
          },
          {
            source: "0",
            target: "2",
            length: "123",
          },
          {
            source: "0",
            target: "3",
            length: "123",
          },
          {
            source: "1",
            target: "4",
            length: "123",
          },
          {
            source: "2",
            target: "5",
            length: "123",
          },
          {
            source: "3",
            target: "6",
            length: "123",
          },
          {
            source: "4",
            target: "7",
            length: "123",
          },
          {
            source: "5",
            target: "7",
            length: "123",
          },
          {
            source: "6",
            target: "7",
            length: "123",
          },
        ],
      };

      this.$axios
        .post(
          "http://10.176.34.154:8000/api/analysis/fuzzy_query_view_result",
          form
        )
        .then((res) => {
          if (res.data) {
            console.log("graphdata");
            console.log(res.data);
            this.data = {};
            this.data = res.data;
            var dataList = {
              nodes: [],
              edges: [],
            };

            let bankinfo = Object.keys(this.data)[0];
            let bankfrom = bankinfo.split("_")[0];
            let bankto = bankinfo.split("_")[1];
            let resultList = this.data[bankinfo];
            let firstnode = {
              id: bankfrom,
              label: "银行账号：" + bankfrom,
              style: {
                radius: 10,
                fill: "#70f3ff",
              },
            };
            let lastnode = {
              id: bankto,
              label: "银行账号：" + bankto,
              style: {
                radius: 10,
                fill: "#e9f1f6",
              },
            };
            dataList.nodes.push(firstnode);
            dataList.nodes.push(lastnode);

            for (let i in resultList) {
              let result = resultList[i];
              let nodefrom = {
                id: result[2],
                label: "加密货币地址：" + result[2],
                style: {
                  radius: 10,
                  fill: "#44cef6",
                },
              };
              let nodeto = {
                id: result[3],
                label: "加密货币地址：" + result[3],
                style: {
                  radius: 10,
                  fill: "#fcefe8",
                },
              };
              dataList.nodes.push(nodefrom);
              dataList.nodes.push(nodeto);
              let edgefront = {
                source: bankfrom,
                target: nodefrom.id,
                currency: result[0],
              };
              let edgemid = {
                source: nodefrom.id,
                target: nodeto.id,
                hash: result[1],
                value: result[4],
                coin: result[5],
                time: result[6],
                style: {
                  endArrow: {
                    path: "M 0,0 L 8,4 L 8,-4 Z",
                    fill: "#e2e2e2",
                  },
                  radius: 20,
                },
              };
              let edgebehind = {
                source: nodeto.id,
                target: bankto,
                currency: result[0],
              };
              dataList.edges.push(edgefront);
              dataList.edges.push(edgemid);
              dataList.edges.push(edgebehind);
            }

            console.log("dataList");
            console.log(dataList);

            this.resultdata = dataList;
            var data1 = JSON.parse(JSON.stringify(this.resultdata));
            console.log("data1");
            console.log(data1);
            graph.data(data1);
            graph.render();
          }
        });

      // graph.data({
      //   nodes: data.nodes,
      //   edges: data.edges.map(function (edge, i) {
      //     edge.id = "edge" + i;
      //     return Object.assign({}, edge);
      //   }),
      // });
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    temp() {
      console.log("虚拟");
      console.log("download");
      var url = "/static/演示结果.zip";
      var name = "演示结果.zip";
      console.log(url);
      this.$axios({
        url: url,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        console.log(response.data);
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", name);
        document.body.appendChild(fileLink);
        fileLink.click();
      });
      console.log(content.InputData);
      this.$cookies.set("fuzzy_form", JSON.parse(content.InputData));
      this.$cookies.set("task_id", content.id);
      console.log(content.InputData["上传文件"]);
      var task_file = content.InputData["上传文件"];
      var downloadForm = {
        task_file: task_file,
      };
      this.$axios
        .post(
          "http://10.176.34.154:8000/api/analysis/fuzzy_query_view_result",
          downloadForm
        )
        .then((res) => {
          console.log(res.data);
          const download_file_name = res.headers["download_file_name"];
          // 以上两行代码获取服务端返回的文件名，当然也可以前端在此定义指定文件名 如：const fileName = test.xls
          let blob = new Blob([res.data], {
            type: "text/csv", // 将会被放入到 blob 中的数组内容的 MIME 类型,常用 ：application/vnd.ms-excel
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = download_file_name;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        });
    },
    download() {
      console.log("fuzzyshow_download");
      var task_file = this.fuzzy_form["上传文件"];
      var downloadForm = {
        task_file: task_file,
      };

      this.$axios
        .post(
          "http://10.176.34.154:8000/api/analysis/fuzzy_query_result",
          downloadForm
        )
        .then((res) => {
          const download_file_name = res.headers["download_file_name"];
          // 以上两行代码获取服务端返回的文件名，当然也可以前端在此定义指定文件名 如：const fileName = test.xls
          let blob = new Blob([res.data], {
            type: "text/csv", // 将会被放入到 blob 中的数组内容的 MIME 类型,常用 ：application/vnd.ms-excel
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = download_file_name;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        });
    },
  },
};
</script>

<style scoped>
.loadButton {
  position: relative;
  left: 48%;
}
.mainbody2 {
  padding-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
  font-family: "Montserrat", sans-serif;
}
.mainbody2 {
  padding-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
  font-family: "Montserrat", sans-serif;
}
#container {
  height: 650px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>