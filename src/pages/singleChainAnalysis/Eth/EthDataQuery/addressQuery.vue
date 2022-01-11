<template>
  <div>
    <Nav />
    <div class="All">
      <div class="FundChainTrackingMain">
        <el-form ref="form" :model="form" :inline="true">
          <p>以太坊地址信息查询</p>
          <el-form-item title="">
            <el-input
              type="text"
              v-model="form.address"
              style="width: 820px"
              placeholder="请输入待查询的以太坊地址"
              id="input1"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="primary"
              ><router-link to="/singleChainAnalysis/Eth" style="color: white"
                >返回上一级</router-link
              ></el-button
            >
          </el-form-item>
        </el-form>
        <el-button v-show="show2" type="primary" :loading="true"
          >努力加载中</el-button
        >
      </div>
      <el-collapse-transition>
        <div v-show="blockHashQuery">
          <table class="AdressTable">
            <tr>
              <th colspan="2">以太坊地址信息总览</th>
            </tr>
            <tr>
              <td>地址</td>
              <td>{{ info.address }}  <el-tag v-if="info.label!=''" size="small" style="text-indent: 0px">{{info.label}}</el-tag> </td>
            </tr>
            <tr>
              <td>当前余额</td>
              <td>{{ info.balance }}</td>
            </tr>
            <tr>
              <td>首次出现时间</td>
              <td>{{ info.firsttime }}</td>
            </tr>
            <tr>
              <td>首次出现区块号</td>
              <td>
                {{ info.firstblock }}
              </td>
            </tr>
            <tr>
              <td>首次交易哈希</td>
              <td>
                <router-link
                  :to="{
                    name: 'ethTransactionQuery',
                    params: { msgKey: info.first_tx },
                  }"
                  style="color: #409eff"
                >
                  {{ info.first_tx }}</router-link
                >
              </td>
            </tr>

            <tr>
              <td>最近出现时间</td>
              <td>{{ info.lasttime }}</td>
            </tr>

            <tr>
              <td>最近出现区块号</td>
              <td>
                {{ info.lastblock }}
                <!-- {{info.last_tx}} -->
              </td>
            </tr>
            <tr>
              <td>最近交易哈希</td>
              <td>
                <router-link
                  :to="{
                    name: 'ethTransactionQuery',
                    params: { msgKey: info.last_tx },
                  }"
                  style="color: #409eff"
                >
                  {{ info.last_tx }}</router-link
                >
              </td>
            </tr>
            <tr>
              <td>发送交易次数</td>
              <td>{{ info.sendcount }}</td>
            </tr>
            <tr>
              <td>接收交易次数</td>
              <td>{{ info.reccount }}</td>
            </tr>
            <tr>
              <td>交易总次数</td>
              <td>{{ info.txcount }}</td>
            </tr>

          </table>
          <div class="TransactionTable">
            <br />相关的交易哈希列表<br />
            <div>
              <label for="type">所在位置:</label>
              <el-select
                v-model="type"
                placeholder="请选择"
                @change="changetype"
                style="margin-right: 5px; width: 17%; margin-left: 5px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                </el-option>
              </el-select>
              <!-- <label for="start_date" style="margin-left:10px">开始时间:</label>
            <el-date-picker v-model="form.start_time"
                            type="datetime"
                            language="zh"
                            :picker-options="pickerOptions"
                            style="width:23%;margin-left:5px"></el-date-picker>
            <label for="end_date" style="margin-left:10px">结束时间:</label>
            <el-date-picker v-model="form.end_time"
                            type="datetime"
                            language="zh"
                            :picker-options="pickerOptions"
                            style="width:23%;margin-left:5px"></el-date-picker> -->
              <b-button
                variant="primary"
                id="srh_btn"
                @click="choose_date"
                style="
                  margin-left: 10px;
                  width: 50px;
                  font-size: 10px;
                  background-color: #50a6fc;
                  height: 33px;
                "
                >查询</b-button
              >
            </div>
            <el-table
              :data="
                txlist.slice(
                  (currentPage - 1) * pagesize,
                  currentPage * pagesize
                )
              "
              :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
              class="table"
              v-loading="loadingShow"
              element-loading-text="数据正在加载中..."
              >
              <el-table-column prop="th" label="交易哈希">
                <template slot-scope="scope">
                  <router-link
                    :to="{
                      name: 'ethTransactionQuery',
                      params: { msgKey: scope.row.th },
                    }"
                    >{{ scope.row.th }}</router-link
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
              :total="txlist.length"
            >
            </el-pagination>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
import Nav from "../../../../components/nav/Nav";
import Footer from "../../../../components/nav/Footer";
import router from "../../../../router";
import moment from "moment";
import { zh } from "vuejs-datepicker";
export default {
  data() {
    return {
      loadingShow : false,
      length: 0,
      start_time: "",
      end_time: "",
      type: "all",
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      transactionList: [],
      List: [],
      show2: false,
      pickerOptions: {
        disabledDate: (time) => {
          // return new Date(2019, 5, 1) < time || time < new Date(2009, 0, 12)
          time < new Date(2009, 0, 12);
        },
      },
      options: [
        {
          value: "all",
          label: "全部交易",
        },
        {
          value: "from",
          label: "作为交易输入",
        },
        {
          value: "to",
          label: "作为交易输出",
        },
      ],
      form: {
        address: "",
        type: "all",
        page: 1,
        start_time: undefined,
        end_time: undefined,
      },
      info: "",
      loading: true,
      blockHashQuery: false,
      checktime: false,
      islable: false,
      txlist: [],
      url2: "",
    };
  },
  components: {
    Nav,
    Footer,
  },
  mounted() {
    // if(this.$store.state.isLogin == false) {
    //   console.log('未登录')
    //   router.push('/')
    // }
    if (this.$cookies.get("msgKey")) {
      this.form.address = this.$cookies.get("msgKey");
      console.log(this.$cookies.get("msgKey"));
      this.onSubmit();
    }
    if (this.$route.params.msgKey) {
      console.log("cookies");
      console.log(this.$cookies.get("msgKey"));
      this.form.address = this.$route.params.msgKey;
      this.onSubmit();
    }
    this.initime();
  },
  methods: {
    customFormatter(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss"); //格式化日期对象
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    click_hash() {
      this.form.blockHash = this.info.hash;
      this.onSubmit();
    },
    click_previousblockhash() {
      this.form.blockHash = this.info.previousblockhash;
      this.onSubmit();
    },
    click_nextblockhash() {
      this.form.blockHash = this.info.nextblockhash;
      this.onSubmit();
    },
    initime() {
      console.log("initime");
      this.form.start_time = this.customFormatter(
        new Date(2009, 0, 10, 0, 0, 0)
      );
      this.form.end_time = this.customFormatter(
        new Date(2020, 0, 25, 2, 9, 54)
      );
      console.log(this.form.start_time);
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.form.page = currentPage;
      console.log(this.currentPage); //点击第几页
      console.log("翻页");
      console.log(this.form);
      this.onSubmit();
    },
    changetype() {
      this.form.type = this.type;
      this.form.page = this.currentPage;
      console.log("类型变化");
      console.log(this.form);
      this.onSubmit();
    },
    choose_date() {
      // this.form.start_time = this.customFormatter(this.form.start_time)
      // this.form.end_time = this.customFormatter(this.form.end_time)
      console.log("提交");
      console.log(this.form);
      this.$axios
        .get(
          "http://10.176.34.154:8000/api/basicquery/address/eth/relatedtxs/" +
            this.form.address +
            "/"
        )
        .then((res) => {
          this.txlist = [];
          var from = res.data.from_txs;
          this.loadingShow = true
          var to = res.data.to_txs;
          console.log(res.data)
          console.log(from);
          console.log(to);
          if(res.data.result == true){
            this.loadingShow = false
          }
          if (this.form.type == "all") {
            for (var i in to) {
              var transaction = {};
              transaction["th"] = to[i];
              this.txlist.push(transaction);
            }
            for (var i in from) {
              var transaction = {};
              transaction["th"] = from[i];
              // console.log(tx[i])
              this.txlist.push(transaction);
              // console.log(this.txlist)
            }
          }
          if (this.form.type == "from") {
            for (var i in from) {
              var transaction = {};
              transaction["th"] = from[i];
              // console.log(tx[i])
              this.txlist.push(transaction);
              // console.log(this.txlist)
            }
          }
          if (this.form.type == "to") {
            for (var i in to) {
              var transaction = {};
              transaction["th"] = to[i];
              // console.log(tx[i])
              this.txlist.push(transaction);
              // console.log(this.txlist)
            }
          }
        });
      this.checktime = true;
    },
    onSubmit() {
      this.show2 = true;
      this.islable = false;
      this.$cookies.set("msgKey", "");
      console.log(this.form.address);
      var url =
        "http://10.176.34.154:8000/api/basicquery/address/eth/" +
        this.form.address +
        "/";
      var url2 =
        "http://10.176.34.154:8000/api/basicquery/address/eth/relatedtxs/" +
        this.form.address +
        "/";
      // console.log(url)
      console.log(url2);
      this.$axios.get(url).then((res) => {
        if (res.data.result) {
          console.log(res.data)
          this.show2 = false;
          this.info = res.data;
          // console.log(this.info)
          var temp = this.info.first_time;
          var temp1 = this.info.last_time;
          this.info.first_time = new Date(parseInt(temp) * 1000)
            .toLocaleString()
            .replace(/:\d{1,2}$/, " ");
          this.info.last_time = new Date(parseInt(temp1) * 1000)
            .toLocaleString()
            .replace(/:\d{1,2}$/, " ");
          this.blockHashQuery = true;
          if (this.info.label != "") {
            this.islable = true;
          }
        } else {
          console.log("查询不到");
          this.$alert(
            "不能查询到地址值为" + this.form.address + "的信息",
            "错误信息",
            {
              confirmButtonText: "确定",
            }
          );
          //清除错误信息
          this.form = "";
        }
      });
      this.choose_date();
    },
  },
};
</script>

<style scoped>
.All {
  min-height: 900px;
}
.FundChainTrackingMain {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
.AdressTable {
  border-collapse: collapse;
  width: 60%;
  margin: 0 20%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
}
.AdressTable td {
  border: 1px solid gray;
  height: 40px;
}
.AdressTable th {
  height: 40px;
  background-color: #50a6fc;
  color: white;
  text-align: left;
  border: none;
}
.TransactionTable {
  margin: 0 20%;
  table-layout: fixed;
  width: 60%;
}
ul {
  list-style: none;
  text-indent: -30px;
}
.background {
  background: #e5e9f2;
  padding: 5px;
  color: #409eff;
}
</style>
