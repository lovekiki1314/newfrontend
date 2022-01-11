<template>
  <div class="TransactionDetail">
    <Nav />
      <div id='div_span'  v-show="show4" >
      <div v-for="(value,key,index) in spanData" :key="index">
          <span style="width:5%;font-weight:bold">{{key}} : </span> 
          <span style="width:5%">{{value}}</span>
      </div>
      </div>
    <div class='divAll'>
      <el-form ref="form"
               :model="form"
               :inline="true"
               class="transaction-main-body1">
        <p v-show="input">柚子币交易信息查询</p>
        <el-form-item title="请输入待查询的指定交易哈希" v-show="input"
                      >
          <el-input type="text"
                    v-model="form.blockHash"
                    style="width:800px"
                    placeholder="请输入待查询的指定交易哈希" id="input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="input"
                     @click="onSubmit" >提交</el-button>
           <el-button type="primary" v-show="input"><router-link to="/singleChainAnalysis/Eos" style="color:white">返回上一级</router-link></el-button>     
        </el-form-item>
        <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
      </el-form>
      <div v-show="show" class="transaction-main-body" >
        <el-button style="margin:5px 20%" type="danger" @click="onReset">继续查询</el-button>
         <table class="table">            
          <tbody>
            <tr>
              <th colspan="2" class="th">柚子币交易信息总览</th>
            </tr>
            <tr>
              <td >时间戳</td>
              <td>{{info.timestamp}}</td>
            </tr>
            <tr>
              <td>区块高度</td>
              <td>{{info.block_num}}</td>
            </tr>
            <tr>
              <td>交易状态</td>
              <td>{{info.status}}</td>
            </tr>
            <tr>
              <td>cpu使用量</td>
              <td>{{info.cpu_usage_us}} 微秒</td>
            </tr>
            <tr>
              <td>net使用量</td>
              <td>{{info.net_usage_words}} 字</td>
            </tr>
            <tr>
              <td>交易哈希</td>
              <td>{{info.transaction_hash}}</td>
            </tr>
            <tr v-for="(item,index) in signNature" :key="index">
              <td>签名</td>
              <td >{{item}}</td>
            </tr>
            <tr>
              <td>交易过期时间</td>
              <td>{{info.expiration}} </td>
            </tr>
            <tr>
              <td>引用区块高度前缀</td>
              <td>{{info.ref_block_num}} </td>
            </tr>
             <tr>
              <td>引用区块哈希前缀</td>
              <td>{{info.ref_block_prefix}} </td>
            </tr>
            <tr>
              <td>交易所含动作数量</td>
              <td>{{info.action_num}} </td>
            </tr>
          </tbody>
        </table>
       
        <el-button style="margin:5px 20%" type="primary" @click="action">查看详细信息</el-button>
        <el-button v-show="show3" type="primary" :loading='true' style="margin-left:-20%">努力加载中</el-button>
      </div>
      <el-button v-show ="show1" style="margin:5px 20%" type="danger" @click="onReset">继续查询</el-button>
      <el-button v-show ="show1" style="margin:5px -19.6%" type="primary" @click="Reset">返回上一级</el-button>
    
        <div class="TransactionTable" v-show ="show1">
        <el-table :data="table2.slice((currentPage-1)*pagesize,currentPage*pagesize)" 
                  :header-cell-style="{background:'#50a6fc',color:'#ffffff'}" 
                  >
          <el-table-column
                       prop="account"
                       label="账户名"
                       width="120px"
                       >  
                       <template slot-scope="scope" class="templateAll">
                       <p class="templateAll"> {{scope.row.account}}</p>
                       </template>
          </el-table-column>
           <el-table-column
                       prop="name"
                       label="账户名"
                        width="120px"
                       >  
                       <template slot-scope="scope" class="templateAll">
                       <p class="templateAll"> {{scope.row.name}}</p>
                       </template>
          </el-table-column>
            <el-table-column
                       prop="authorization"
                       label="授权"
                       width="280px"
                       >  
                       <template slot-scope="scope">
                         <!-- <span plain @click="dataAction(scope.row.data)" id="spanF">{{scope.row.data}}</span> -->
                         <vueJsonEditor :value = "scope.row.authorization" :expand-depth=2 copyable></vueJsonEditor>
                       </template>
          </el-table-column>
            <el-table-column
                       prop="data"
                       label="动作数据"
                       >
                       <template slot-scope="scope">
                         <!-- <span plain @click="dataAction(scope.row.data)" id="spanF">{{scope.row.data}}</span> -->
                         <vueJsonEditor :value = "scope.row.data" copyable></vueJsonEditor>
                       </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[2, 5, 10, 20]"
                   :page-size="pagesize"
                   layout="total, prev, pager, next, jumper"
                   :total="table2.length" style="text-align:center;margin:20px 20%">
        </el-pagination>
        </div>
    </div>

  </div>
  
</template>

<script>
import Nav from '../../../../components/nav/Nav'
import Footer from '../../../../components/nav/Footer'
import router from '../../../../router'
import vueJsonEditor from 'vue-json-viewer'
export default {
  data () {
    return {
      loading: false,
      hover_diff: false,
      hover_nonce: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      info: '',
      table2: '',
      transactionhash:'',
      signNature:'',
      input: true,
      show1: false,
      show2:false,
      show3:false,
      show4:false,
      spanData:'',
      form: {
        blockHash: ''
      },
      show: false
    }
  },
  components: {
    Nav,Footer,vueJsonEditor
  },
  mounted () {
    // if(this.$store.state.isLogin == false) {
    //   console.log('未登录')
    //   router.push('/')
    // }
    if (this.$route.params.msgKey) {
      this.form.blockHash = this.$route.params.msgKey
      this.onSubmit()
    }
  },
  methods: {
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
    change (e) {
      this.$forceUpdate()
    },
    onSubmit () {
      this.show2 = true;
      this.transactionhash = document.getElementById('input').value
      console.log(this.transactionhash)
      var url = 'http://10.176.34.154:8000/api/basicquery/transaction/eos/'+this.form.blockHash+'/'
      console.log(url)
      this.$axios
        .get(url)
        .then(res => {
          if (res.data.result) {
            this.show2 = false
            this.input =false
            this.info = res.data
            this.signNature = eval("("+res.data.signature+")")
            console.log(this.signNature)
            this.show = true
          } else {
            this.$alert(
            '不能查询到hash值为' + this.form.blockHash + '区块的交易信息',
            '错误信息',
            {
              confirmButtonText: '确定'
            }
          )
          }
        })
    },
    action() {
      this.show3 =true
      var url_table = 'http://10.176.34.154:8000/api/basicquery/action/eos/'+ this.form.blockHash+'/'
      console.log(url_table)
      this.$axios.get(url_table).then( res =>{
        if (false) {
          this.$alert(
            '不能查询到hash值为' + this.form.blockHash + '区块的交易信息',
            '错误信息',
            {
              confirmButtonText: '确定'
            }
          )   
      }else{
            this.show3 =false
            this.show = false
            this.show1 = true
            this.table2 = res.data
      }
      })
    },
    dataAction(a) {
      console.log(a)
      this.spanData =eval('('+a+')')
    
    },
    onReset () {
      Object.assign(this.$data, this.$options.data())
    },
    Reset(){
       this.show = true
       this.show1 = false
       this.show4 =false
    }

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.FundChainTrackingMain {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
h1,h2 {
  font-weight: normal;
}
.divAll{
  min-height: 700px;
}

a {
  color: #42b983;
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
  min-width: 150px;
  
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
.transaction-main-body1 {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
 
}

.transaction-main-body {
  position: relative;
  right: 100px;
  width: 80%;
  margin: 20px 10%;
}
.action_td{
  font-weight: bolder;
  text-align: center;
 background-color: #50a6fc;
  height: 50px;
}
#div_span{
  position:absolute;
  top:10%;
  left: 80%;
  border: 3px solid #50a6fc;
  z-index: 1;
}
#spanF:hover{
  color: #50a6fc;
  cursor: pointer;
}
.templateAll{
  color: #111111;
}
</style>
