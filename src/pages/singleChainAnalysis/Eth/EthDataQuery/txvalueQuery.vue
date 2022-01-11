<template>
  <div>
    <Nav />
    <div class="All">
      <div class="FundChainTrackingMain">
        <el-form ref="form" :model="form" :inline="true" label-width="500px">
          <p>以太坊模糊查询</p>
          <el-form-item title="请输入待查询的相关信息">
            <el-input
              type="text"
              v-model="form.value"
              style="width: 440px"
              placeholder="输入待查询的交易金额"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 5%">
            <el-date-picker
              v-model="form.date"
              style="width: 440px"
              type="datetime"
              placeholder="请选择日期"
              format="yyyy年 MM月 dd日 HH时 mm分 ss秒"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button v-show="loadReady" type="primary" :loading="true"
              >努力加载中</el-button
            >
            <el-button type="primary"
              ><router-link to="/singleChainAnalysis/Eth" style="color: white"
                >返回上一级</router-link
              ></el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-collapse-transition>
        <div v-show="txvalueQuery">
          <div class="TransactionTable">
            <el-table
              :data="
                data.slice((currentPage - 1) * pagesize, currentPage * pagesize)
              "
              :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
              class="table"
            >
              <el-table-column prop="txhash" label="交易哈希">
                <template slot-scope="scope">
                  <router-link
                    :to="{
                      name: 'ethTransactionQuery',
                      params: { msgKey: scope.row.txhash },
                    }"
                    >{{ scope.row.txhash }}</router-link
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="time"
                label="交易时间"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="from"
                label="发送方"
                width="370"
              ></el-table-column>
              <el-table-column
                prop="to"
                label="接收方"
                width="370"
              ></el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next, jumper"
              :total="data.length"
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
export default {
  data() {
    return {
      data: [],
      txvalueQuery: false,
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      transactionlist: [],
      loadReady: false,
      datatmp: [
        {
          txhash:
            "0x248106fd43c0629d2d193fd4c082af46179e0e84e492d5d8108464f820127ee3",
          time: "2021-05-01 00:00:34",
          from: "0xc098b2a3aa256d2140208c3de6543aaef5cd3a94",
          to: "0xb3f923eabaf178fc1bd8e13902fc5c61d3ddef5b",
        },
        {
          txhash:
            "0x3d74bcc8b3fddff0507a881afaecca05e0b591282343fc21350fcdcf5fa90ce6",
          time: "2021-05-01 00:00:56",
          from: "0xf05e2a70346560d3228c7002194bb7c5dc8fe100",
          to: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
        },
        {
          txhash:
            "0x137a7b3d3efe0ed18e32e0d273e8acfa749c4c367e08e28815725495e8864896",
          time: "2021-05-01 00:01:27",
          from: "0x32771c5639d7c098daa0c39a199741c3ec562594",
          to: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
        },
      ],
      form: {
        value: "",
        date: "2021-05-01 13:33:33",
      },
    };
  },
  components: {
    Nav,
    Footer,
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    onSubmit() {
      console.log(this.form);
      this.loadReady = true;

      this.$axios
        .post(
          "http://10.176.34.154:8000/api/analysis/eth/fuzzy_query",
          this.form
        )
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            this.loadReady = false;
            this.txvalueQuery = true;
            this.data = res.data;
          }
        });
    },
  },
};
</script>

<style>
.TransactionTable {
  margin: 0 10%;
  table-layout: fixed;
  width: 80%;
}
.All {
  min-height: 900px;
}
.FundChainTrackingMain {
  padding: 150px 20% 10px 10%;
  font-family: PingFang SC;
  font-weight: bold;
}
</style>