<template>
  <div>
    <Nav />
    <div id="divAll" v-bind:style="{minHeight: Height+'px'}">
    <div class="FundChainTrackingMain">
      <el-form ref="form"
               :model="form"
               :inline="true"
               label-width="500px">
        <p>比特币区块信息查询</p>
          <el-form-item title="请输入待查询的指定交易哈希">
          <el-form-item title="非法活动类型">
            <el-select v-model="value"
                       placeholder="请选择查询维度"
                       style="width:150px">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
              </el-option>
            </el-select>
            <el-input type="text"
                      v-model="form.blockHash"
                      style="width:640px"
                      placeholder="输入待查询的区块信息" id="input"></el-input>
            <div class="mt-3"
                 v-if="value">{{placeholder[value]}}</div>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit" id="buttonSub">提交</el-button>
          <el-button type="primary" ><router-link to="/singleChainAnalysis/Btc" style="color:white">返回上一级</router-link></el-button>
        </el-form-item>
      </el-form>
       <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
    </div>
    <el-collapse-transition>
      <div v-show="blockHashQuery">
        <table class="table">
            <tr>
              <th colspan="2">比特币区块信息总览</th>
            </tr>
            <tr>
              <td>区块哈希</td>
              <td >{{info.hash}}</td>
            </tr>
            <tr>
              <td>时间</td>
              <td>{{info.time}}</td>
            </tr>

            <tr>
              <td>区块高度</td>
              <td>{{info.height}} (主链)</td>
            </tr>

            <tr>
              <td>内含交易笔数</td>
              <td>{{info.nTx}}</td>
            </tr>

            <tr>
                <td>
                    <div class="tooltip_block">困难度
                        <span class="tooltiptext">该参数用于确保比特币区块链能够在当时全网算力下维持10分钟产生一个新区块。</span>
                    </div>
                </td>
                <td>{{info.difficulty}}</td>

            </tr>

            <tr>
                <td>
                    <div class="tooltip_block">随机数
                        <span class="tooltiptext">该参数作为工作过程证明POW（挖矿）的一部分，是矿工在本区块成功找到符合困难度计算要求的自定义数字</span>
                    </div>
                </td>
                <td>{{info.nonce}}</td>
            </tr>
            <tr>
              <td>默克尔树根值</td>
              <td>{{info.merkleroot}}</td>
            </tr>

            <tr>
              <td>版本号</td>
              <td>0x{{info.version}}</td>
            </tr>
            <tr>
              <td>区块大小</td>
              <td>{{info.size}} 字节</td>
            </tr>
            
            
            <tr>
              <td>上一个区块哈希</td>
              <td @click="click_previousblockhash">
                <router-link :to="{ name: 'btcBlockQuery', params: { msgKey: info.previousblockhash }}"
                             style="color:#409eff">{{info.previousblockhash}}</router-link>
                <!-- {{info.previousblockhash}} -->
              </td>
            </tr>
            <tr>
              <td>下一个区块哈希</td>
              <td @click="click_nextblockhash">
                <router-link :to="{ name: 'btcBlockQuery', params: { msgKey: info.nextblockhash }}"
                             style="color:#409eff">{{info.nextblockhash}}</router-link>
              </td>
            </tr>
            
        </table>
        <div class="TransactionTable">
        <el-table :data="transactionlist.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
                  :header-cell-style="{background:'#50a6fc',color:'#ffffff'}"
                  class="table">
          <el-table-column
                       prop="th"
                       label="交易哈希"
                       >
                       <template slot-scope="scope">
                          <router-link :to="{ name: 'btcTransactionQuery', params: { msgKey: scope.row.th }}"
                          >{{scope.row.th}}</router-link>
                        </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[2, 5, 10, 20]"
                   :page-size="pagesize"
                   layout="total, prev, pager, next, jumper"
                   :total="transactionlist.length">
        </el-pagination>
        </div>
      </div>
    </el-collapse-transition>
      </div>

  </div>
  
</template>
<script>
import Nav from '../../../../components/nav/Nav'
import Footer from '../../../../components/nav/Footer'
import router from '../../../../router'
export default {
  data () {
    return {
      Height : 0,
      hover_diff: false,
      hover_nonce: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      info: '',
      erroMsg: '所查询的区块没有信息',
      form: {
        blockHash: ''
      },
      blockHashQuery: false,
      options: [{
        value: '区块高度',
        label: '区块高度'
      },
      {
        value: '区块哈希',
        label: '区块哈希'
      },
      ],
      value: '',
      url: '',
      show2:false,
      placeholder: {
        '': '',
        '区块高度': '请输入区块的高度（高度为数字，例如1、2）',
        '区块哈希': '请输入区块的哈希值'
      },
      transactionlist:[]
    }
  },

  components: {
    Nav,Footer
  },
  mounted () {
    //动态设置内容高度 让footer始终居底   header+footer的高度是100
      this.Height = document.documentElement.clientHeight - 70;  　　//监听浏览器窗口变化　
      window.onresize = ()=> {this.Height = document.documentElement.clientHeight -70}
    // if(this.$store.state.isLogin == false) {
    //   console.log('未登录')
    //   router.push('/')
    // }
    if (this.$route.params.msgKey) {
      this.form.blockHash += this.$route.params.msgKey
      this.onSubmit()
    }
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pagesize = size
      console.log(this.pagesize) //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
    click_hash () {
      this.form.blockHash = this.info.hash
      this.onSubmit()
    },
    click_previousblockhash () {
      this.form.blockHash = this.info.previousblockhash
      this.onSubmit()
    },
    click_nextblockhash () {
      this.form.blockHash = this.info.nextblockhash
      this.onSubmit()
    },
    onSubmit () {
      this.show2 =true
      const numcheck = /^[1-9]\d*|0$/
      if(numcheck.test(this.form.blockHash)){
        this.value = '区块高度'
        this.url ='http://10.176.34.154:8000/api/basicquery/block/btc/'+this.form.blockHash+'/'
      }else{
        this.value = '区块哈希'
        this.url ='http://10.176.34.154:8000/api/basicquery/blockhash/btc/'+this.form.blockHash+'/'
      }
      this.$axios.get(this.url).then(res => {
        if (res.data.result) {
          this.show2 = false
          this.info = res.data
          console.log(res.data)  
          var tx = JSON.parse(res.data.tx)
          this.transactionlist = []
          for(var i in tx){
            var transaction={}
            transaction['th'] = tx[i]
            this.transactionlist.push(transaction)
          }
          console.log(this.transactionlist)
          console.log(this.info)

          this.blockHashQuery = true
        } else {
          this.$alert(
            '不能查询到' + this.form.blockHash + '区块的信息',
            '错误信息',
            {
              confirmButtonText: '确定'
            }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
#divAll{
min-height: 700px;
}
.FundChainTrackingMain {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
    
}
.erroMsg {
  margin: 0 20%;
}
table {
  border-collapse: collapse;
  width: 60%;
  margin: 0 20%;
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
.TransactionTable {
  margin: 0 20%;
  table-layout: fixed;
  width: 60%;
}
.tooltip_block {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
}

.tooltip_block .tooltiptext {
    visibility: hidden;
    width: 300px;
    background-color: #50a6fc;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    /* 定位 */
    position: absolute;
    z-index: 1;
}

.tooltip_block:hover .tooltiptext {
    visibility: visible;
}
#buttonSub:focus{
  outline: 0;
}

</style>
