<template>
  <div class="TransactionDetail" >
    <Nav />
    <div class="divAll" v-bind:style="{minHeight: Height+'px'}">
      <el-form ref="form"
               :model="form"
               :inline="true"
               class="transaction-main-body1">
        <p v-show="input">比特币交易信息查询</p>
        <el-form-item title="请输入待查询的指定交易哈希"
                      v-show="input">
          <el-input type="text"
                    v-model="form.blockHash"
                    style="width:800px"
                    @input="change($event)"
                    placeholder="请输入待查询的指定交易哈希" id='input'></el-input>
        </el-form-item>
        <el-form-item v-show="input">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button type="primary" ><router-link to="/singleChainAnalysis/Btc" style="color:white">返回上一级</router-link></el-button>       
        </el-form-item>
         <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
      </el-form>
      <div v-show="show" class="transaction-main-body">
        <h3 style="text-align: center;">比特币交易详细信息</h3>  
         <table class="table">
          <tbody>
            <tr>
              <th colspan="2"> <el-button  type="primary" @click="showInfo">展开详细信息</el-button> 
              <el-button type="danger" @click="onReset">继续查询</el-button></th>   
                       
            </tr>
            <tr>
              <th colspan="3">交易哈希： {{info.txhash}}</th>
            </tr>
            <tr>
              <td colspan="3">
                <p v-for="index in vin.length"
                   :key="index">{{[index-1]}}<router-link :to="{ name: 'btcAddressQuery', params: { msgKey: vin[index-1].address}}"><span style="color: #50a6fc">{{vin[index-1].address}}</span></router-link>
                   <el-tag v-if="vin[index-1].label!=''" size="small">{{vin[index-1].label}}</el-tag>{{vin[index-1].value}} BTC
                </p>

              </td>
              <td><img align="center" src="../../../../assets/arrow_right.png"></td>
              <td colspan="3">
                 <p v-for="index in vout.length"
                   :key="index">{{[index-1]}}<router-link :to="{ name: 'btcAddressQuery', params: { msgKey: vout[index-1].address}}"><span style="color: #50a6fc">{{vout[index-1].address}}</span></router-link>
                   <el-tag v-if="vout[index-1].label!=''" size="small">{{vout[index-1].label}}</el-tag> {{vout[index-1].value}}  BTC
                </p>
              </td>
            </tr>
            <tr>
              <th colspan="2" class="th">交易总览</th>
              <th colspan="2" class="th">输入&输出信息</th>
            </tr>
            <tr>
              <td>交易大小</td>
              <td>{{info.size}} 字节</td>
              <td>输入笔数</td>
              <td>{{info.n_in}}</td>
            </tr>
            <tr>
              <td>锁定时间</td>
              <td>{{info.locktime}}</td>
              <td>输入总金额</td>
              <td>{{amount_in}} BTC</td>

            </tr>
            <tr>
              <td>时间</td>
              <td>{{info.timestamp}}</td>
              <td>输出笔数</td>
              <td>{{info.n_out}}</td>
            </tr>
            <tr>
              <td>矿工费</td>
              <td>{{info.minerFee}} BTC</td>
              <td>输出总金额</td>
              <td>{{amount_out}} BTC</td>
            </tr>
          </tbody>
       </table>
        <table v-show="show1" style="padding-bottom:5%">
          <tbody>
            <tr>
              <th>输入脚本</th>
            </tr>
            <tr>
              <td>{{script_in}}</td>
            </tr>
            <tr>
              <th>输出脚本</th>
            </tr>
            <tr>
              <td>{{script_out}}</td>
            </tr>
          </tbody>
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
      label1 : 'bigtiger',
      Height : 0,
      input: true,
      info: '',
      vin: '',
      vout: '',
      amount_in: 0,
      amount_out: 0,
      script_in: [],
      script_out: [],
      display: false,
      show1:false,
      form: {
        blockHash: ''
      },
      show2:false,
      loading: true,
      errored: false,
      show: false
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
      this.show2 = true
      this.sendGet(this.form.blockHash)
      this.form.blockHash = ''
    },
    sendGet (url_parmas) {
      console.log(url_parmas)
      var url = 'http://10.176.34.154:8000/api/basicquery/transaction/btc/'+ url_parmas
      this.loading = true
      this.errored = false
      console.log(url)
      this.$axios.get(url).then(res => {
          this.show2 = false
          this.input = false
          this.display = true
          console.log(this.display)
          if (res.data.result) {
            this.info = res.data
            console.log(this.info)
            this.vin = this.info.vin
             console.log('交易test')
            console.log(this.vin)
            this.vout = this.info.vout
            var temp = this.info.timestamp
            this.info.timestamp = new Date(parseInt(temp) * 1000)
              .toLocaleString()
              .replace(/:\d{1,2}$/, ' ')
            var vin = this.vin
            for (var i in vin) {
              this.script_in.push(vin[i]['address'] + ': ' + vin[i]['scriptSig'])
              this.amount_in += vin[i]['value']
            }
            var vout = this.vout
            for (var i in vout) {
              this.script_out.push(vout[i]['address'] + ': ' + vout[i]['pubkeyhash'])
              this.amount_out += vout[i]['value']
            }
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
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.divP{
  height: 5%;
}
.btctable{
  border-collapse: collapse;
  width: 50%;
  margin: 0 20% 4% 20%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
  font-size: 15px;
}
.btctable td {
  border: 1px solid gray;
  height: 35px;
}
.btctable th {
  height: 40px;
  background-color: #50a6fc;
  color: white;
  text-align: left;
  border: none;
}
.divAll{
  min-height: 700px;
}
a {
  color: #42b983;
}
table {
  table-layout: fixed;
  padding: 10px;
  width: 700;
}
td {
  word-break: break-all;
  word-wrap: break-word;
}


.transaction-main-body1 {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
 
}

.transaction-main-body {
  
  top: 70px; /* 距离窗口顶部距离 */
  /*vertical-align: middle;*/
  width: 100%;
  margin: 0 3%;
}
</style>
