<template>
  <div class="TransactionDetail">
    <Nav />
    <div class="All">
      <el-form ref="form"
               :model="form"
               :inline="true"
               class="transaction-main-body1">
        <p v-show="input">以太坊交易信息查询</p>
        <el-form-item title="请输入待查询的指定交易哈希"
                      v-show="input">
          <el-input type="text"
                    v-model="form.blockHash"
                    style="width:800px"
                    @input="change($event)"
                    placeholder="请输入待查询的指定交易哈希" id='input'></el-input>
        </el-form-item>
        <el-form-item v-show="input">
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>  
          <el-button type="primary" ><router-link to="/singleChainAnalysis/Eth" style="color:white">返回上一级</router-link></el-button>
     
        </el-form-item>
        <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
      </el-form>
       
      <div v-show="show" class="transaction-main-body">
         <el-button type="danger" style="margin: 20px 10% 5px 10%" @click="onReset">继续查询</el-button>
         <el-button type="primary" style="margin: 20px 10% 5px -5%" @click="trInfor">查看详细信息</el-button>   
         <table class="table">
           
            <tr>
              <th colspan="2">以太坊交易信息总览</th>
            </tr>
            <tr>
             <td>交易哈希</td>
             <td>{{info.hash}}</td>
           </tr>              
           <tr>
             <td>区块哈希</td>
             <td>{{info.blockhash}}</td>
           </tr>
            <tr>
             <td>区块高度</td>
             <td>{{info.blocknumber}}</td>
           </tr> 
             <tr>
             <td>交易发送地址</td>
             <td><router-link :to="{ name: 'ethAddressQuery', params: { msgKey: info.from }}" style="color:#409eff">{{info.from}}</router-link>  <el-tag v-if="info.from_label!=''" size="small" style="text-indent: 0px">{{info.from_label}}</el-tag></td>
           </tr>
            <tr>
             <td>交易接收地址</td>
             <td><router-link :to="{ name: 'ethAddressQuery', params: { msgKey: info.to }}" style="color:#409eff">{{info.to}}</router-link> <el-tag v-if="info.to_label!=''" size="small" style="text-indent: 0px">{{info.to_label}}</el-tag></td>
           </tr> 
            <tr>
             <td>交易金额</td>
             <td>{{info.value}} ether</td>
           </tr> 
           <tr>
             <td>交易时间</td>
             <td>{{info.timestamp}}</td>
           </tr>                          
            <tr>
             <td>燃料量</td>
             <td>{{info.gas}}</td>
           </tr>
           <tr>
             <td>燃料价格</td>
             <td>{{info.gasprice}}</td>
           </tr>
            <!-- <tr>
             <td>输入信息</td>
             <td>{{info.input}}</td>
           </tr> -->
            <tr>
             <td>随机数</td>
             <td>{{info.nonce}}</td>
           </tr>
            <tr>
             <td>交易序号</td>
             <td>{{info.transactionindex}}</td>
           </tr>
            <tr v-show="tr">
             <td>r</td>
             <td>{{info.r}}</td>
           </tr>                                                                                            
            <tr v-show="tr">
             <td>s</td>
             <td>{{info.s}}</td>
           </tr>
             <tr v-show="tr">
             <td>v</td>
             <td>{{info.v}}</td>
            </tr>
            <tr v-if="usdt && tr">
             <td>usdt调用方法</td>
             <td>{{info.usdt.method}}</td>
            </tr>
            <tr v-if="usdt && tr">
             <td>usdt真实发送方</td>
             <td>{{info.usdt.usdt_real_from}}</td>
            </tr>
            <tr v-if="usdt && tr">
             <td>usdt真实接收方</td>
             <td>{{info.usdt.usdt_to_addr}}</td>
            </tr>
            <tr v-if="usdt && tr">
             <td>usdt交易金额</td>
             <td>{{info.usdt.usdt_value}} u</td>
            </tr>
                     
        </table>
      </div>
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
      usdt: false,
      input: true,
      info: '',
      vin: '',
      vout: '',
      show2: false,
      tr: false,
      amount_in: 0,
      amount_out: 0,
      script_in: [],
      script_out: [],
      display: false,
      show1:false,
      form: {
        blockHash: ''
      },
      loading: true,
      errored: false,
      show: false
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
      this.form.blockHash = this.$route.params.msgKey
      console.log('交易test')
      console.log(this.form.blockHash)
      this.onSubmit()
    }
  },
  methods: {
    change (e) {
      this.$forceUpdate()
    },
    onSubmit () {
      this.sendGet(this.form.blockHash)
      this.form.blockHash = ''
    },
    onReset () {
      Object.assign(this.$data, this.$options.data())
    },
    sendGet (url_parmas) {
      this.show2 = true
      console.log(url_parmas)
      var url = 'http://10.176.34.154:8000/api/basicquery/transaction/eth/'+ url_parmas
      this.loading = true
      this.errored = false
      console.log(url)
      this.$axios.get(url).then(res => {
        this.show2 =false
          this.input = false
          this.display = true
          console.log(this.display)
          if (res.data.result) {
            this.info = res.data
            console.log(this.info)
            if(res.data.usdt){
              this.usdt = true
            }
            var temp = this.info.timestamp
            
            this.show = true
          } else {
            this.errored = true
          }
          console.log(this.show)
        })
        .catch(error => {
          this.errored = true
        })
        .finally(() => (this.loading = false))
    },
    onReset () {
      Object.assign(this.$data, this.$options.data())
    },
    showInfo(){
      this.show1 = !this.show1
    },
      trInfor(){
    this.tr = true
  },
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
  font-weight: normal;
}

/* ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
} */
.All{
  min-height: 900px;
}
a {
  color: #42b983;
}
.table {
  border-collapse: collapse;
  width: 80%;
  margin: 0 10%;
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

.transaction-main-body1 {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
 
}

.transaction-main-body {
  position: relative;
  top: 20px; /* 距离窗口顶部距离 */
  /*vertical-align: middle;*/
  width: 80%;
  margin: 20px 10% 100px 10%;
}
</style>
