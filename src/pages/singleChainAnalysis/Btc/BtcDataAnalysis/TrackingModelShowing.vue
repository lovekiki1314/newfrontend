<template>
  <div class="hello">
    <Navigation />
    <div class="divAll">
    <h1 id="title">指定交易资金流追踪</h1>
    <div id="container">
      <h4 id="result_title"
          class="title"
          v-if="showHead">交易{{tx_hash}}追踪结果</h4>
      <div v-if="showHead">
        <b-tabs content-class="mt-3">
          <b-tab title="交易维度"
                 active
                 @click="changeDimension('transaction')"></b-tab>
          <b-tab title="地址维度"
                 @click="changeDimension('address')"></b-tab>
          <b-tab title="用户维度"
                 @click="changeDimension('user')"></b-tab>
          <b-tab title="热点领域维度"
                 @click="changeDimension('industry')"></b-tab>
        </b-tabs>
      </div>
      <h3 class="graph_description">资金流动图</h3>
      <div>
        <div id="mountedGraph"
             style="float: left;width: 69%"></div>
        <div style="float: left;width: 29%"
             id="upDescription">
          <div id="graphDescription"></div>
          <div id="graphExplanation"></div>
        </div>
      </div>
    </div>
    <div id="chart_container">
      <h3 class="graph_description">资金最终流向分布图</h3>
      <div>
        <div id="mountedChart"></div>
        <div id="downDescription">
          <div id="chartDescription"></div>
          <div id="chartExplanation"></div>
        </div>
      </div>
    </div>
    <div id="TxTableContainer"
         v-if="showTxTable">
      <h3>交易哈希前缀与交易哈希对照表</h3>
      <el-table :data="tableTxData"
                height="250"
                border
                style="width: 100%;">
        <el-table-column prop="tx_index"
                         label="交易哈希前缀"
                         width="180">
        </el-table-column>
        <el-table-column prop="tx_hash"
                         label="交易哈希"
                         width="540">
        </el-table-column>
        <el-table-column prop="time"
                         label="交易时间"
                         width="360">
        </el-table-column>
        
      </el-table>
    </div>
    <div id="AddressTableContainer"
         v-if="showAddressTable">
      <h3>地址前缀与实际地址对照表</h3>
      <el-table :data="tableAddressData"
                height="250"
                border
                style="width: 100%;">
        <el-table-column prop="address_index"
                         label="地址前缀"
                         width="180">
        </el-table-column>
        <el-table-column prop="address"
                         label="具体地址"
                         width="360">
        </el-table-column>
        <el-table-column prop="first_tx"
                         label="首次出现交易哈希"
                         width="540">
        </el-table-column>
        <el-table-column prop="first_time"
                         label="首次出现交易时间"
                         width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       plain
                       @click="jumpAddressDetail(scope.row.address)">查看详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>

  </div>
</template>

<script>
import Navigation from '../../../../components/nav/Nav'
import store from '../../../../store'
import insertCss from 'insert-css';

insertCss(
  `
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
    text-align: left;
  }
`
);
let graph;
let transaction_chart;
let address_chart;
let user_chart;
let industry_chart;
let loading;
export default {
  name: 'TrackingModel',
  data: function () {
    return {
      tx_hash: '48e9a2cfd3eebd691d20776ba7444bda5a3c3feb7b0879ebe7724877f366ebbb', //f8e216f38f46a55ef88aa7d2cfde7b1878ae4b6107e66632642009a1becf4159  48e9a2cfd3eebd691d20776ba7444bda5a3c3feb7b0879ebe7724877f366ebbb
      tracking_methods: [{
        "index": 1,
        "name": "Poison"
      }, {
        "index": 2,
        "name": "Haircut"
      }, {
        "index": 3,
        "name": "FIFO"
      }],
      method_list: ["Poison", "Haircut", "FIFO"],
      choosed_method: 1,
      tracking_result: '',
      depth: 3,
      tableTxData: [],
      tableAddressData: [],
      showTxTable: false,
      showAddressTable: false,
    }
  },
  components: {
    Navigation,
  },
  mounted () {
    let task_id = 0
    let tracking_form
    if (this.$cookies.get('task_id') !== '') {
      console.log("777")
      task_id = this.$cookies.get('task_id')
      tracking_form = this.$cookies.get('tracking_form')
      console.log(task_id)
    }
    this.submit_tracing(task_id, tracking_form)
    const graph_width = document.getElementById('container').scrollWidth * 0.69;
    graph = new this.$g6.Graph({
      container: 'mountedGraph',
      width: graph_width,
      height: 800,
      fitView: true, // 调整布局用的
      modes: {
        default: ['drag-node', 'drag-canvas', 'zoom-canvas', { //'drag-canvas',
          type: 'tooltip',
          formatText: function formatText (model) {
            return model.description;
          },
        },
          'activate-relations'
        ],
      },
      layout: {
        type: 'dagre',
        rankdir: 'LR',
        align: 'DL',
        nodesepFunc: () => 1,
        ranksepFunc: () => 1,
      },
      defaultNode: {
        size: [20, 20],
        type: 'circle',
        style: {
          lineWidth: 2,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
        },
        labelCfg: {
          style: {
            // fill: '#1890ff',
            fontSize: 12,
          },
        },
      },
      defaultEdge: {
        size: 1,
        color: '#e2e2e2',
        style: {
          endArrow: {
            path: 'M 0,0 L 8,4 L 8,-4 Z',
            fill: '#e2e2e2'
          },
        },
      },
      nodeStateStyles: {
        active: {
          opacity: 1,
        },
        inactive: {
          opacity: 0.2,
        },
      },
    });
    graph.on('node:click', e => {
      let _input = document.createElement("input");   // 直接构建input
      let nodeItem = e.item._cfg.model;
      console.log(nodeItem)
      console.log(nodeItem.copy)
      _input.value = nodeItem.copy;  // 设置内容
      document.body.appendChild(_input);    // 添加临时实例
      _input.select();   // 选择实例内容
      document.execCommand("Copy");   // 执行复制
      // var tip ="<div class='pop_tip'>复制成功！</div>"
      // $('.pop_tip').show().delay(3000).fadeOut();
      alert("复制节点信息：" + nodeItem.copy +　" 成功")
      document.body.removeChild(_input); // 删除临时实例

    });
    const chart_width = document.getElementById('chart_container').scrollWidth * 0.69;
    transaction_chart = new this.$Chart({
      container: 'mountedChart',
      autoFit: true,
      height: 500,
      width: chart_width,
    });

    transaction_chart.coordinate('theta', {
      radius: 0.75,
    });

    transaction_chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    transaction_chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });
    transaction_chart
      .interval()
      .position('percent')
      .color('item')
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`;
        },
      })
      .tooltip('key*count', (key, count) => {
        return {
          name: key,
          value: count,
        };
      })
      .adjust('stack');
    transaction_chart.interaction('element-active');
    address_chart = new this.$Chart({
      container: 'mountedChart',
      autoFit: true,
      height: 500,
      width: chart_width,
    });

    address_chart.coordinate('theta', {
      radius: 0.75,
    });

    address_chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    address_chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });
    address_chart
      .interval()
      .position('percent')
      .color('item', (item) => {
        return this.tracking_result["address"]["color_dict"][item];
      })
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`;
        },
      })
      .tooltip('key*count', (key, count) => {
        return {
          name: key,
          value: count,
        };
      })
      .adjust('stack');
    address_chart.interaction('element-active');
    user_chart = new this.$Chart({
      container: 'mountedChart',
      autoFit: true,
      height: 500,
      width: chart_width,
    });

    user_chart.coordinate('theta', {
      radius: 0.75,
    });

    user_chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    user_chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });
    user_chart
      .interval()
      .position('percent')
      .color('item', (item) => {
        return this.tracking_result["user"]["color_dict"][item];
      })
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`;
        },
      })
      .tooltip('key*count', (key, count) => {
        return {
          name: key,
          value: count,
        };
      })
      .adjust('stack');
    user_chart.interaction('element-active');
    industry_chart = new this.$Chart({
      container: 'mountedChart',
      autoFit: true,
      height: 500,
      width: chart_width,
    });

    industry_chart.coordinate('theta', {
      radius: 0.75,
    });

    industry_chart.scale('percent', {
      formatter: (val) => {
        val = val * 100 + '%';
        return val;
      },
    });
    industry_chart.tooltip({
      showTitle: false,
      showMarkers: false,
    });
    industry_chart
      .interval()
      .position('percent')
      .color('item', (item) => {
        return this.tracking_result["industry"]["color_dict"][item];
      })
      .label('percent', {
        content: (data) => {
          return `${data.item}: ${(data.percent * 100).toFixed(2)}%`;
        },
      })
      .tooltip('key*count', (key, count) => {
        return {
          name: key,
          value: count,
        };
      })
      .adjust('stack');
    industry_chart.interaction('element-active');
    // console.log("wk")
    // console.log(this.methods)
    // console.log(this.tracking_result)
    // this.tableTxData = this.tracking_result["transaction"]["tableTxData"];
    // this.tableAddressData = this.tracking_result["address"]["tableAddressData"];
    // console.log(this.tableAddressData)
    // this.showHead = true;
    // this.showResult = true;
    // this.industry_task_add = false;
    // this.showTransaction();
    // console.log("展示完毕");

  },
  methods: {
    submitHash: function () {
      let _this = this;
      this.showResult = false;
      this.showHead = false;
      graph.clear();
      // chart.clear();
      let url = 'http://10.176.34.154:8000/api/analysis/btc/money_tracking';
      let params = {};
      params["tx_hash"] = this.tx_hash;
      params["method"] = this.choosed_method;
      params["depth"] = this.depth;
      if (this.depth > 7) {
        alert("追踪步数过深");
        return;
      }
      this.openFullScreen();
      console.log("已发送");
      this.$axios.post(url, params).then(
        function (res) {
          console.log("接收成功");
          _this.tracking_result = res.data["content"];
          _this.tableTxData = _this.tracking_result["transaction"]["tableTxData"];
          _this.tableAddressData = _this.tracking_result["address"]["tableAddressData"];
          console.log(_this.tableAddressData)
          _this.showHead = true;
          _this.showResult = true;
          _this.industry_task_add = false;
          _this.showTransaction();
          console.log("展示完毕");
          _this.closeFullScreen();
        }
      )
    },
    showTransaction: function () {
      this.showResult = true;
      this.showTxTable = true;
      this.showAddressTable = false;
      let method = this.method_list[this.choosed_method - 1];
      let graphDescription = document.getElementById("graphDescription");
      graphDescription.innerHTML = "<p>追踪方法：" + method + "</p>" +
        "<p>追踪步数： " + this.depth + "步</p>" +
        "<p>起始污染金额: " + this.tracking_result["transaction"]["start_polluted"] + " BTC</p>" +
        "<p>涉及交易数量：" + this.tracking_result["transaction"]["tx_nums"] + "</p>";
      let graphExplanation = document.getElementById("graphExplanation");
      graphExplanation.innerHTML = "<p>此图展示资金在交易中的流动</p>"
      let chartDescription = document.getElementById("chartDescription");
      chartDescription.innerHTML = "<p>最终污染金额：" + this.tracking_result["transaction"]["leaf_polluted_value"] +
        " BTC</p>" +
        "<p>资金流入交易数量：" + this.tracking_result["transaction"]["leaf_tx_nums"] + "</p>";
      let chartExplanation = document.getElementById("chartExplanation");
      chartExplanation.innerHTML = "<p>此图显示资金最终流向的交易分布，显示各交易的污染资金额以及比例</p>";
      console.log("123123")
      console.log(this.tracking_result["transaction"]["data"])
      graph.data(this.tracking_result["transaction"]["data"]);
      graph.render();
      this.hideAllChart();
      transaction_chart.show();
      transaction_chart.data(this.tracking_result["transaction"]["leaves"])
      transaction_chart.render();
    },
    showUser: function () {
      this.showResult = true;
      this.showTxTable = true;
      this.showAddressTable = false;
      let method = this.method_list[this.choosed_method - 1];
      let graphDescription = document.getElementById("graphDescription");
      graphDescription.innerHTML = "<p>追踪方法：" + method + "</p>" +
        "<p>追踪步数： " + this.depth + "步</p>" +
        "<p>起始污染金额: " + this.tracking_result["user"]["start_polluted"] + "BTC</p>" +
        "<p>涉及交易数量：" + this.tracking_result["user"]["tx_nums"] + "</p>" +
        "<p>涉及用户数量：" + this.tracking_result["user"]["user_nums"] + "</p>";
      let graphExplanation = document.getElementById("graphExplanation");
      graphExplanation.innerHTML = "<p>此图展示资金在交易和用户中的流动，圆形表示交易，矩形表示用户，同一颜色的矩形代指同一个用户</p>"
      let chartDescription = document.getElementById("chartDescription");
      chartDescription.innerHTML = "<p>最终污染金额：" + this.tracking_result["user"]["leaf_polluted_value"] + " BTC</p>" +
        "<p>资金流入用户数量：" + this.tracking_result["user"]["leaf_user_nums"] + "</p>";
      let chartExplanation = document.getElementById("chartExplanation");
      chartExplanation.innerHTML = "<p>此图显示资金最终流向的用户分布，显示各用户的污染资金额以及比例</p>";
      graph.data(this.tracking_result["user"]["data"]);
      graph.render();
      this.hideAllChart();
      user_chart.show();
      user_chart.data(this.tracking_result["user"]["leaves"])

      user_chart.render();
    },
    showAddress: function () {
      this.showResult = true;
      this.showTxTable = true;
      this.showAddressTable = true;
      let method = this.method_list[this.choosed_method - 1];
      let graphDescription = document.getElementById("graphDescription");
      graphDescription.innerHTML = "<p>追踪方法：" + method + "</p>" +
        "<p>追踪步数： " + this.depth + "步</p>" +
        "<p>起始污染金额: " + this.tracking_result["address"]["start_polluted"] + "BTC</p>" +
        "<p>涉及交易数量：" + this.tracking_result["address"]["tx_nums"] + "</p>" +
        "<p>涉及地址数量：" + this.tracking_result["address"]["address_nums"] + "</p>";
      let graphExplanation = document.getElementById("graphExplanation");
      graphExplanation.innerHTML = "<p>此图展示资金在交易和地址中的流动，圆形表示交易，矩形表示地址，同一颜色的矩形代指同一个地址</p>"
      let chartDescription = document.getElementById("chartDescription");
      chartDescription.innerHTML = "<p>最终污染金额：" + this.tracking_result["address"]["leaf_polluted_value"] + " BTC</p>" +
        "<p>资金流入地址数量：" + this.tracking_result["address"]["leaf_address_nums"] + "</p>";
      let chartExplanation = document.getElementById("chartExplanation");
      chartExplanation.innerHTML = "<p>此图显示资金最终流向的地址分布，显示各地址的污染资金额以及比例</p>";
      graph.data(this.tracking_result["address"]["data"]);
      graph.render();
      this.hideAllChart();
      address_chart.show();
      address_chart.data(this.tracking_result["address"]["leaves"])
      address_chart.render();
    },
    showIndustry: function () {
      this.showTxTable = false;
      this.showAddressTable = false;
      let method = this.method_list[this.choosed_method - 1];
      let graphDescription = document.getElementById("graphDescription");
      graphDescription.innerHTML = "<p>追踪方法：" + method + "</p>" +
        "<p>追踪步数： " + this.depth + "步</p>" +
        "<p>起始污染金额: " + this.tracking_result["industry"]["start_polluted"] + "BTC</p>" +
        "<p>涉及交易数量：" + this.tracking_result["industry"]["tx_nums"] + "</p>" +
        "<p>涉及行业数量：" + this.tracking_result["industry"]["industry_nums"] + "</p>";
      let graphExplanation = document.getElementById("graphExplanation");
      graphExplanation.innerHTML = "<p>此图展示资金在交易和用户中的流动，圆形表示交易，矩形表示用户，同一颜色的矩形代指用户属于同一个行业</p>"
      let chartDescription = document.getElementById("chartDescription");
      chartDescription.innerHTML = "<p>最终污染金额：" + this.tracking_result["industry"]["leaf_polluted_value"] + " BTC</p>" +
        "<p>资金流入行业数量：" + this.tracking_result["industry"]["leaf_industry_nums"] + "</p>";
      let chartExplanation = document.getElementById("chartExplanation");
      chartExplanation.innerHTML = "<p>此图显示资金最终流向的行业分布，显示各行业的污染资金额以及比例</p>";
      graph.data(this.tracking_result["industry"]["data"]);
      graph.render();
      this.hideAllChart();
      industry_chart.show();
      industry_chart.data(this.tracking_result["industry"]["leaves"]);
      industry_chart.render();
    },
    changeDimension: function (dimension) {
      console.log(dimension);
      if (dimension === "transaction") {
        this.showTransaction();
      }
      if (dimension === "address") {
        this.showAddress();
      }
      if (dimension === "user") {
        this.showUser();
      }
      if (dimension === 'industry') {
        this.showIndustry()
      }
    },
    openFullScreen: function () {
      loading = this.$loading({
        lock: true,
        text: '追踪中，请等待......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    closeFullScreen: function () {
      loading.close();
    },
    hideAllChart: function () {
      transaction_chart.hide();
      address_chart.hide();
      user_chart.hide();
      industry_chart.hide();
    },
    addTask: function () {
      let url = 'http://10.176.34.154:8000/api/analysis/btc/tracking/add';
      let params = {};
      params["user_id"] = 12;
      params["tx_hash"] = this.tx_hash;
      params["method"] = this.choosed_method;
      params["depth"] = this.depth;
      if (this.depth > 7) {
        alert("追踪步数过深");
        return;
      }
      this.$axios.post(url, params).then(
        function (res) {
          console.log("添加任务成功");
        }
      )
      this.industry_task_add = true;
      document.getElementById("community_button").disabled = true
    },
    jumpTransactionDetail: function (tx_hash) {
      console.log(tx_hash);
    },
    jumpAddressDetail: function (address) {
      console.log(address);
    },
    submit_tracing: function (task_id, tracking_form) {
      console.log(tracking_form)
      this.tx_hash = tracking_form["tx_hash"]
      this.choosed_method = tracking_form["method"];
      this.depth = tracking_form["depth"];
      console.log(this.depth)
      let _this = this;
      let url = 'http://10.176.34.154:8000/api/getTaskResult';
      let params = {}
      params["user_id"] = this.$store.state.id
      params["task_id"] = task_id
      console.log(task_id)
      this.$axios.post(url, params).then(
        function (res) {
          console.log("接收成功");
          console.log(res.data);
          _this.tracking_result = res.data;
          _this.tableTxData = _this.tracking_result["transaction"]["tableTxData"];
          _this.tableAddressData = _this.tracking_result["address"]["tableAddressData"];
          console.log(_this.tableAddressData)
          _this.showHead = true;
          _this.showResult = true;
          _this.industry_task_add = false;
          _this.showTransaction();
          console.log("展示完毕");
          _this.$cookies.set('task_id', '')
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divAll{
   min-height: 700px;
   padding-top: 3%;
 }
#result_title {
  text-align: center;
}

#title {
  text-align: center;
  margin-top: 100px;
}

.form-group {
  margin-right: 50px;
  margin-top: 20px;
}

#form_div {
  width: 40%;
  height: 300px;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#form_table {
  text-align: left;
  width: fit-content;
  margin: 0 auto;
  padding-top: 15px;
  font-size: 100%;
}

#submit_button {
  font-size: large;
  margin-top: 20px;
}

#community_button {
  font-size: large;
  margin-top: 20px;
}

label {
  margin-right: 15px;
}

#container {
  width: 80%;
  height: 800px;
  margin: 0 auto;
  margin-top: 30px;
  /*border-style: solid;*/
  /*border-width: 1px;*/
  /*border-color: #000*/
}

.graph_description {
  margin-top: 30px;
}

#chart_container {
  width: 80%;
  height: 600px;
  margin: 0 auto;
  margin-top: 230px;
}

#mountedGraph {
  height: 810px;
  position: relative;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#mountedChart {
  /* padding-top: 20px; */
  margin-top: 20px;
  /* width: 1000px; */
  height: 500px;
  float: left;
  /* width: 70%; */
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#graphDescription {
  text-align: center;
  margin: 0 auto;
  padding-top: 60px;
  padding-left: 10px;
  width: 280px;
}

#graphExplanation {
  text-align: center;
  margin: 0 auto;
  padding-top: 60px;
  padding-left: 10px;
  width: 280px;
}

#upDescription {
  margin-left: 10px;
  margin-top: 20px;
  width: 400px;
  height: 810px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#chartDescription {
  margin: 0 auto;
  padding-top: 60px;
  padding-left: 10px;
  width: 280px;
}

#chartExplanation {
  text-align: center;
  margin: 0 auto;
  padding-top: 60px;
  padding-left: 10px;
  width: 280px;
}

#downDescription {
  text-align: center;
  margin-top: 20px;
  margin-left: 10px;
  width: 400px;
  height: 500px;
  float: left;
  width: 29%;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#TxTableContainer {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
}
#AddressTableContainer {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 50px;
}
</style>
