<template>
  <el-main>
    <el-table
      :data="
        finishedList.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%; margin-top: -20px"
      border
      :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
      v-loading="loadingShow"
      element-loading-text="数据正在加载中..."
    >
      <el-table-column prop="QueryItem" label="已完成项目" width="200">
      </el-table-column>
      <el-table-column label="已输入数据" width="800">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            <json-viewer
              :value="scope.row.InputData"
              :expand-depth="1"
              :copyable="{ copyText: '复制', copiedText: '已复制' }"
            ></json-viewer>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
                     label="查询数据"
                      width="400">
      <template slot-scope="scope">
         <span style="margin-left: 10px">
           <json-viewer
        :value="scope.row.QueryData"
          :expand-depth=5
            copyable
            boxed></json-viewer>
          </span>
       </template>
       </el-table-column>  -->

      <el-table-column label="结果获取" width="250">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row"
            @click="enter(scope.row)"
            type="primary"
            style="margin-left: 30%"
            >分析结果</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            @click="deletetask(scope.row)"
            type="primary"
            style="margin-left: 30%"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total,  prev, pager, next, jumper"
      :total="finishedList.length"
    >
    </el-pagination>
  </el-main>
</template>

<script>
import JsonViewer from "vue-json-viewer";
import router from "../../router";
// eslint-disable-next-line no-unused-vars
import store from "../../store";
export default {
  name: "userFinishedTask",
  components: {
    JsonViewer,
  },
  data() {
    return {
      loadingShow: false,
      currentPage: 1, // 初始页
      pagesize: 5, //    每页的数据
      finishedList: [],
    };
  },
  created() {
    this.handleFinishedList();
  },
  methods: {
    admin() {
      router.push("/Admin");
    },
    superAdmin() {
      router.push("/SuperAdmin");
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); // 点击第几页
    },
    handleFinishedList() {
      this.loadingShow = true;
      this.$axios
        .post(
          "http://10.176.34.154:8000/api/userManagement/user/finishedWork",
          {
            id: this.$store.state.id,
          }
        )
        .then((res) => {
          console.log("已完成任务");
          console.log(res.data);
          var content = res.data.content;
          if (res.data.result == true) {
            this.loadingShow = false;
          }
          this.finishedList = [];
          for (var i in content) {
            // console.log(content[i].params)
            if (content[i] != null) {
              var temp = {};
              temp["id"] = content[i].id;
              var inputDataJson = JSON.parse(content[i].params);
              switch (content[i].type) {
                case "fuzzy":
                  temp["QueryItem"] = "虚拟现实匹配";
                  let temp1 = {};
                  let legaltocn = ["美元", "人民币", "日元", "韩元"];
                  console.log(inputDataJson);
                  if (inputDataJson.coin !== "") {
                    temp1["虚拟币种选择"] = inputDataJson.coin;
                  }
                  if (inputDataJson.fileloca !== "") {
                    temp1["上传文件"] = inputDataJson.fileloca;
                  }
                  if (inputDataJson.legal_currency !== "") {
                    temp1["法币类型"] = legaltocn[inputDataJson.legal_currency];
                  }
                  if (inputDataJson.percentage !== "") {
                    temp1["比例"] = inputDataJson.percentage;
                  }
                  if (inputDataJson.time_range !== "") {
                    temp1["时间范围"] = inputDataJson.time_range + " 天";
                  }
                  temp["InputData"] = temp1;
                  break;
                case "community":
                  var basictocn = ["行业用户及交易情况统计", "行业结构可视化"];
                  var activetocn = [
                    "重要的行业成员情况",
                    "资金在行业间的流动情况",
                    "用户在行业间迁移情况",
                  ];
                  temp["QueryItem"] = "行业分析";
                  var temp1 = {};
                  if (inputDataJson.startTime !== "") {
                    temp1["开始时间"] = inputDataJson.startTime;
                  }
                  if (inputDataJson.endTime !== "") {
                    temp1["结束时间"] = inputDataJson.endTime;
                  }
                  if (inputDataJson.timeUnit !== "") {
                    temp1["时间单元"] = inputDataJson.timeUnit;
                  }
                  if (inputDataJson.basic_info !== "") {
                    temp1["基础维度"] = [];
                    for (var j in inputDataJson.basic_info) {
                      temp1["基础维度"].push(
                        basictocn[inputDataJson.basic_info[j] - "0" - 1]
                      );
                    }
                  }
                  if (inputDataJson.industry_active_info !== "") {
                    temp1["活跃维度"] = [];
                    for (var j in inputDataJson.industry_active_info) {
                      temp1["活跃维度"].push(
                        activetocn[
                          inputDataJson.industry_active_info[j] - "0" - 1
                        ]
                      );
                    }
                  }
                  if (inputDataJson.address !== "") {
                    temp1["查询的地址"] = inputDataJson.address;
                  }
                  if (inputDataJson.txhash !== "") {
                    temp1["查询的哈希"] = inputDataJson.txhash;
                  }
                  temp["InputData"] = temp1;
                  break;
                case "illegal":
                  var basictocn = ["非法活动活跃时间段", "非法活动交易量统计"];
                  var trantocn = [
                    "行业间资金流经情况",
                    "行业间资金沉淀情况",
                    "重要成员情况",
                  ];
                  temp["QueryItem"] = "非法活动";
                  var temp1 = {};
                  if (inputDataJson.illegalAcitivityName != "") {
                    temp1["非法活动类型"] = inputDataJson.illegalAcitivityName;
                  }
                  if (inputDataJson.illegalAcitivitycategory != "") {
                    temp1["非法活动名称"] =
                      inputDataJson.illegalAcitivitycategory;
                  }
                  if (inputDataJson.address != "") {
                    temp1["查询的地址"] = inputDataJson.address;
                  }
                  if (inputDataJson.basic_info != "") {
                    temp1["基础维度"] = [];
                    for (var j in inputDataJson.basic_info) {
                      temp1["基础维度"].push(
                        basictocn[inputDataJson.basic_info[j] - "0" - 1]
                      );
                    }
                  }
                  if (inputDataJson.hash != "") {
                    temp1["交易哈希"] = inputDataJson.hash;
                  }
                  if (inputDataJson.money_transfer != "") {
                    temp1["资金转移"] = [];
                    for (var j in inputDataJson.money_transfer) {
                      temp1["资金转移"].push(
                        trantocn[inputDataJson.money_transfer[j] - 1]
                      );
                    }
                  }
                  if (inputDataJson.victim_migration != "") {
                    temp1["受害者迁移"] =
                      "victim_migration" + inputDataJson.victim_migration;
                  }
                  temp["InputData"] = temp1;
                  // temp['InputData'] = ''
                  // for (var j in temp1) {
                  //   temp['InputData'] += (JSON.stringify(temp1[j]) + '\n')
                  // }
                  // temp['InputData'] = temp['InputData'].replace(/\"/g, '')
                  break;
                case "tracking":
                  temp["QueryItem"] = "资金追踪";
                  var methodtocn = ["Poison", "Haircut", "FIFO"];
                  var temp1 = {};
                  if (inputDataJson.depth !== "") {
                    temp1["查询深度"] = inputDataJson.depth;
                  }
                  if (inputDataJson.method !== "") {
                    temp1["追踪方法"] =
                      methodtocn[inputDataJson.method - "0" - 1];
                  }
                  if (inputDataJson.tx_hash !== "") {
                    temp1["查询的哈希"] = inputDataJson.tx_hash;
                  }
                  temp["InputData"] = temp1;
                  break;
                case "cluster":
                  temp["QueryItem"] = "地址关联分析";
                  var temp1 = {};
                  if (inputDataJson.target_address != "") {
                    temp1["目标地址"] = inputDataJson.target_address;
                  }
                  if (inputDataJson.rule_map != "") {
                    temp1["选择的规则和权重"] = inputDataJson.rule_map;
                  }
                  if (inputDataJson.rule_weight != "") {
                    temp1["多输入规则的权重"] = inputDataJson.rule_weight;
                  }
                  if (inputDataJson.coinbase_weight != "") {
                    temp1["挖矿权重"] = inputDataJson.coinbase_weight;
                  }
                  if (inputDataJson.deep != "") {
                    temp1["迭代深度"] = inputDataJson.deep;
                  }
                  temp["InputData"] = temp1;
                  break;
              }

              temp["QueryData"] = content[i].params;
              this.finishedList.push(temp);
            }
          }
        });
    },
    enter(data) {
      console.log(data);
      var content = data;
      console.log("enter");
      console.log(content);
      switch (content.QueryItem) {
        case "行业分析":
          console.log("测试");
          this.$cookies.set("task_id", content.id);
          this.$cookies.set("form", JSON.parse(content.QueryData));
          router.push(
            "/singleChainAnalysis/Btc/BtcDataAnalysis/communityGraph"
          );
          break;
        case "非法活动":
          this.$cookies.set("task_id", content.id);
          this.$cookies.set("illegal_form", JSON.parse(content.QueryData));
          router.push("/singleChainAnalysis/Btc/BtcDataAnalysis/illegalGraph");
          break;
        case "虚拟现实匹配":
          this.$cookies.set("fuzzy_form", content.InputData);
          this.$cookies.set("task_id", content.id);
          router.push("/fuzzyshow");
          break;
        case "资金追踪":
          this.$cookies.set("tracking_form", JSON.parse(content.QueryData));
          this.$cookies.set("task_id", content.id);
          // this.$cookies.set('tracking_form', JSON.parse(content.QueryData))
          router.push(
            "/singleChainAnalysis/Btc/BtcDataAnalysis/TrackingModelShowing"
          );
          break;
        case "地址关联分析":
          this.$cookies.set("task_id", content.id);
          this.$cookies.set("cluster_form", JSON.parse(content.QueryData));
          router.push("/singleChainAnalysis/Btc/BtcCluster/singleClusterGraph");
          break;
      }
    },
    deletetask(data) {
      var content = data;
      console.log("删除");
      console.log(content);
      console.log(this.$store.state.id);
      this.$axios
        .post(
          "http://10.176.34.154:8000/api/userManagement/user/delete_one_task",
          {
            task_id: content.id,
            user_id: this.$store.state.id,
            finished: 1,
          }
        )
        .then((res) => {
          console.log(res.data.result);
          this.handleFinishedList();
        });
    },
  },
};
</script>

<style scoped>
.el-table {
  background-color: white;
}
.finishedTask {
  white-space: pre;
}
</style>
