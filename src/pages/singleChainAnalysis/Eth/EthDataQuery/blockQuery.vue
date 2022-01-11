<template>
  <div>
    <Nav />
    <div class="All">
    <div class="FundChainTrackingMain">
      <el-form ref="form"
               :model="form"
               :inline="true"
               label-width="500px">
        <p>以太坊区块信息查询</p>
          <el-form-item title="请输入待查询的指定信息">
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
                      placeholder="输入待查询的区块信息"></el-input>
            <div class="mt-3"
                 v-if="value">{{placeholder[value]}}</div>
          </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>
         <el-button type="primary" ><router-link to="/singleChainAnalysis/Eth" style="color:white">返回上一级</router-link></el-button>
        </el-form-item>
      </el-form>
       <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
    </div>
    <el-collapse-transition>
      <div v-show="blockHashQuery" >
        <table class="table">
            <tr>
              <th colspan="2">区块信息总览</th>
            </tr>
            <tr>
              <td>区块哈希</td>
              <td>  {{info.hash}}                                          
                <!-- {{info.hash}} -->
              </td>
            </tr>
            <tr>
              <td>区块高度</td>
              <td>{{info.number}}</td>
            </tr>

            <tr>
              <td>前一区块哈希</td>
              <td @click="click_parenthash">
                <router-link :to="{name:'ethBlockQuery',params:{msgKey:info.parenthash}}">  {{info.parenthash}}</router-link>
                </td>
            </tr>
            <tr>
              <td>后一区块哈希</td>
              <td @click="click_nexthash">
                <router-link :to="{name:'ethBlockQuery',params:{msgKey:info.nexthash}}">  {{info.nexthash}}</router-link>
                </td>
            </tr>            
            <tr>
              <td>收据树根哈希</td>
              <td >
                  {{info.receiptsroot}}
                </td>
            </tr>
            <tr>
              <td>随机数</td>
              <td>{{info.nonce}}</td>
            </tr>

            <tr>
                <td>
                   叔块列表哈希
                </td>
                <td>{{info.sha3uncles}}</td>

            </tr>

            <tr>
                <td>
                    交易树根哈希
                </td>
                <td>{{info.transactionsroot}}</td>
            </tr>
            <tr>
              <td>状态树根哈希</td>
              <td>{{info.stateroot}}</td>
            </tr>

            <tr>
              <td>矿工地址</td>
              <td>{{info.miner}}</td>
            </tr>
            <tr>
              <td>困难度</td>
              <td>{{info.difficulty}} </td>
            </tr>
            
            
            <tr>
              <td>总难度</td>
              <td >
                {{info.totaldifficulty}}
              </td>
            </tr>
            <tr>
              <td>额外数据</td>
              <td > {{info.extradata}} </td>
            </tr>
            <tr>
              <td>区块大小</td>
              <td>{{info.size}} 字节</td>
            </tr>
            <tr>
              <td>燃料限额</td>
              <td>{{info.gaslimit}} wei</td>
            </tr>
            <tr>
              <td>已使用燃料</td>
              <td>{{info.gasused}} wei</td>
            </tr>
            <tr>
              <td>时间戳</td>
              <td>{{info.timestamp}}</td>
            </tr>

           <tr>
              <td>叔块列表</td>
              <td>{{info.uncles}}</td>
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
                          <router-link :to="{ name: 'ethTransactionQuery', params: { msgKey: scope.row.th }}"
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
      show2: false,
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
    // if(this.$store.state.isLogin == false) {
    //   console.log('未登录')
    //   router.push('/')
    // }
    if (this.$route.params.msgKey) {
      this.form.blockHash += this.$route.params.msgKey
      this.onSubmit()
    }
    // var url = 'http://10.176.34.154:8001/api/basicquery/1/block'
    // console.log(url)
    // this.$axios.get(url).then(res => {
    //   console.log(res.data)
    //   if (res.data.result) {
    //     this.info = res.data
    //   }
    // })
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
    click_parenthash () {
      this.form.blockHash = this.info.parenthash
      this.onSubmit()
    },
    click_nexthash () {
      this.form.blockHash = this.info.nexthash
      this.onSubmit()
    },
    onSubmit () {
      this.show2 = true
      // var form = {
      //   user_id : this.$store.state.id,
      //   block : this.form.blockHash
      // }
      const numcheck = /^[1-9]\d*|0$/
      if(numcheck.test(this.form.blockHash)){
        this.value = '区块高度'
        var url = 'http://10.176.34.154:8000/api/basicquery/block/eth/' + this.form.blockHash 
      }else{
        this.value = '区块哈希'
        var url = 'http://10.176.34.154:8000/api/basicquery/blockhash/eth/' + this.form.blockHash 
      }
      this.$axios.get(url).then(res => {
        if (res.data.result) {
          this.show2 =false
         var str=res.data.sha3uncles
          str=str.replace('[','')
          str=str.replace(']','')
          res.data.sha3uncles=str
          var str1=res.data.uncles
          str1=str1.replace('[','')
          str1=str1.replace(']','')
          res.data.uncles=str1
          this.info = res.data
          var tx = eval("("+res.data.transactions+")")
         for(var i=0;i<tx.length;i++){
           var transaction={}
           transaction ['th']=tx[i]
           this.transactionlist.push(transaction)
         }        
          console.log(res)  
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
.All{
  min-height: 900px;
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

</style>
