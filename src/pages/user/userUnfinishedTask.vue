<template>
  <el-main>
    <div>
      <el-table
        :data="
          unfinishedList.slice(
            (currentPage - 1) * pagesize,
            currentPage * pagesize
          )
        "
        style="width: 100%; margin-top: -20px"
        border
        :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
        v-loading="loadingShow"
        element-loading-text="数据正在加载中..."
      >
        <el-table-column prop="QueryItem" label="未完成项目" width="200">
        </el-table-column>
        <el-table-column label="已输入数据" width="600">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <json-viewer
                :value="scope.row.InputData"
                :expand-depth="1"
                :copyable="{copyText:'复制',
              copiedText:'已复制'}"
              ></json-viewer>
            </span>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="QueryData"-->
        <!--                         label="已输入数据"-->
        <!--                         width="500">-->
        <!--        </el-table-column>-->
        <el-table-column prop="TaskStatus" label="任务状态"> </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="unfinishedList.length"
      >
      </el-pagination>
    </div>
  </el-main>
</template>

<script>
import JsonViewer from "vue-json-viewer";
import axios from "axios";
export default {
  name: "userUnfinishedTask",
  components: { JsonViewer },
  data() {
    return {
      loadingShow: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      unfinishedList: [],
    };
  },
  created() {
    this.handleUnfinishedList();
  },
  methods: {
    // 初始页currentPage和数据data
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    handleUnfinishedList() {
      this.loadingShow = true;

      this.$axios
        .post(
          "http://10.176.34.154:8000/api/userManagement/user/unfinishedWork",
          {
            id: this.$store.state.id,
          }
        )
        .then((res) => {
          console.log("未完成任务");
          console.log(res.data);
          this.loadingShow = false;
          var content = res.data.content;
          this.unfinishedList = [];
          for (var i in content) {
            if (content[i] != null) {
              var temp = {};
              var inputDataJson = JSON.parse(content[i].params);
              switch (content[i].type) {
                case "community":
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
                    temp1["基础维度"] = inputDataJson.basic_info;
                  }
                  if (inputDataJson.industry_active_info !== "") {
                    temp1["活跃维度"] = inputDataJson.industry_active_info;
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
                  temp["QueryItem"] = "非法活动";
                  var temp1 = {};
                  if (inputDataJson.illegalAcitivityName !== "") {
                    temp1["非法活动类型"] = inputDataJson.illegalAcitivityName;
                  }
                  if (inputDataJson.illegalAcitivitycategory !== "") {
                    temp1["非法活动名称"] =
                      inputDataJson.illegalAcitivitycategory;
                  }
                  if (inputDataJson.address !== "") {
                    temp1["查询的地址"] = inputDataJson.address;
                  }
                  if (inputDataJson.basic_info !== "") {
                    temp1["基础维度"] = inputDataJson.basic_info;
                  }
                  if (inputDataJson.hash !== "") {
                    temp1["交易哈希"] = inputDataJson.hash;
                  }
                  if (inputDataJson.money_transfer !== "") {
                    temp1["资金转移"] = inputDataJson.money_transfer;
                  }
                  if (inputDataJson.victim_migration !== "") {
                    temp1["受害者迁移"] =
                      "victim_migration" + inputDataJson.victim_migration;
                  }
                  temp["InputData"] = temp1;
                  break;
                case "tracking":
                  temp["QueryItem"] = "资金追踪";
                  var temp1 = {};
                  if (inputDataJson.depth !== "") {
                    temp1["查询深度"] = inputDataJson.depth;
                  }
                  if (inputDataJson.method !== "") {
                    temp1["追踪方法"] = inputDataJson.method;
                  }
                  if (inputDataJson.tx_hash !== "") {
                    temp1["查询的哈希"] = inputDataJson.tx_hash;
                  }
                  temp["InputData"] = temp1;
                  break;
                case "cluster":
                  temp["QueryItem"] = "地址关联分析";
                  var temp1 = {};
                  if (inputDataJson.target_address !== "") {
                    temp1["目标地址"] = inputDataJson.target_address;
                  }
                  if (inputDataJson.rule_map !== "") {
                    temp1["选择的规则和权重"] = inputDataJson.rule_map;
                  }
                  if (inputDataJson.rule_weight !== "") {
                    temp1["多输入规则的权重"] = inputDataJson.rule_weight;
                  }
                  if (inputDataJson.coinbase_weight !== "") {
                    temp1["挖矿权重"] = inputDataJson.coinbase_weight;
                  }
                  if (inputDataJson.deep !== "") {
                    temp1["迭代深度"] = inputDataJson.deep;
                  }
                  temp["InputData"] = temp1;
                  break;
              }
              temp["QueryData"] = content[i].params;
              switch (content[i].status) {
                case 0:
                  temp["TaskStatus"] = "任务等待中";
                  break;
                case 1:
                  temp["TaskStatus"] = "任务等待中";
                  break;
                case 2:
                  temp["TaskStatus"] = "任务进行中";
                  break;
                case 3:
                  temp["TaskStatus"] = "任务异常";
                  break;
              }

              this.unfinishedList.push(temp);
            }
          }
        });
    },
  },
};
</script>
