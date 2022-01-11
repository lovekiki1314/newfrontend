<template>
  <div>
    <Nav/>
    <div class="divAll" v-bind:style="{minHeight: Height+'px'}">
    <div class="FundChainTrackingMain">
      <el-form ref="form"
               :model="form"
               :inline=true>
        <p>比特币地址信息查询</p>
        <el-form-item title="">
          <el-input type="text"
                    v-model="form.address"
                    style="width:820px"
                    placeholder="请输入待查询的比特币地址" id="input1"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>
          <el-button type="primary" ><router-link to="/singleChainAnalysis/Btc" style="color:white">返回上一级</router-link></el-button>
        </el-form-item>
      </el-form>
     <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
    </div>
    <el-collapse-transition>
      <div v-show="blockHashQuery">
        <table class="AdressTable">
            <tr>
              <th colspan="2">比特币地址信息总览</th>
            </tr>
            <tr>
              <td>地址  </td>
              <td>{{info.address}} <el-tag v-if="info.label!=''" size="small" style="text-indent: 0px">{{info.label}}</el-tag></td>
            </tr>
            <tr>
              <td>当前余额</td>
              <td>{{info.balance}} BTC</td>
            </tr>
            <tr>
              <td>首次出现时间</td>
              <td>{{info.first_time}}</td>
            </tr>
            <tr>
              <td>首次出现交易</td>
              <td>
                <router-link :to="{ name: 'btcTransactionQuery', params: { msgKey: info.first_tx }}">
                  {{info.first_tx}}</router-link>
                <!-- {{info.first_tx}} -->
              </td>
            </tr>
            <tr>
              <td>最近出现时间</td>
              <td>{{info.last_time}}</td>
            </tr>
            <tr>
              <td>最近出现交易</td>
              <td>
                <router-link :to="{ name: 'btcTransactionQuery', params: { msgKey: info.last_tx }}">
                  {{info.last_tx}}</router-link>
                <!-- {{info.last_tx}} -->
              </td>
            </tr>
            <tr>
              <td>发送次数</td>
              <td>{{info.send_times}}</td>
            </tr>
            <tr>
              <td>发送金额</td>
              <td>{{info.send_amount}} BTC</td>
            </tr>
            <tr>
              <td>接收次数</td>
              <td>{{info.receive_times}}</td>
            </tr>
            <tr>
              <td>接收金额</td>
              <td>{{info.receive_amount}} BTC</td>
            </tr>
            <tr>
              <td>总交易次数</td>
              <td>{{info.total_times}}</td>
            </tr>

            <!--<tr>-->
            <!--<td>Activity Tag</td>-->
            <!--<td v-if="info.activity_tag!='null'">{{info.activity_tag}}</td>-->
            <!--<td v-else>null</td>-->
            <!--</tr>-->
        </table>
        <div class="TransactionTable">
          <br >相关的交易哈希列表<br>
          <!-- <el-radio-group v-model="form.type" @change="changetype">
            <el-radio label="all">全部</el-radio>
            <el-radio label="ins">作为输入地址</el-radio>
            <el-radio label="outs">作为输出地址</el-radio>
          </el-radio-group> -->
          
          <div>
            <label for="type">所在位置:</label>
            <el-select v-model="type" 
              placeholder="请选择"
              @change="changetype"
              style="margin-right:5px;width:17%;margin-left:5px">
              <el-option 
                v-for="item in options"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                >
              </el-option>
            </el-select>
            <label for="start_date" style="margin-left:10px">开始时间:</label>
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
                            style="width:23%;margin-left:5px"></el-date-picker>
            <b-button variant="primary"
                  id="srh_btn"
                  @click="choose_date"
                  style="margin-left:10px;width:50px;font-size:10px;background-color: #50a6fc;height:33px">查询</b-button>
          </div> 
          <div v-show="checktime">
            <el-table :data="transactionList"
            :header-cell-style="{background:'#50a6fc',color:'#ffffff'}"
            v-loading="loadingShow" 
	          element-loading-text="数据正在加载中...">
            <!-- <template slot="empty">
              <img src="logo.ico" alt="暂无数据">
            </template> -->
              <el-table-column
                        prop="transactionhash"
                        label="交易哈希"
                        width = "750">
                <template slot-scope="scope">
                            <router-link :to="{ name: 'btcTransactionQuery', params: { msgKey: scope.row.transactionhash}}"
                            >{{scope.row.transactionhash}}</router-link>
                          </template>
              </el-table-column>
              <el-table-column
                        prop="time"
                        label="交易时间"
                         >
              </el-table-column>
            </el-table>
            <el-pagination 
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pagesize"
                    layout="total, prev, pager, next, jumper"
                    :total="length"
                    >
          </el-pagination>
          </div>
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
import moment from 'moment'
import { zh } from 'vuejs-datepicker'
export default {
  data () {
    return {
      loadingShow : false,
      Height: 0,
      length: 0,
      start_time: '',
      end_time: '',
      type: 'all',
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      transactionList: [],
      List: [],
      pickerOptions: {
        disabledDate: time => {
          // return new Date(2019, 5, 1) < time || time < new Date(2009, 0, 12)
          time < new Date(2009, 0, 12)
        }
      },
      show2:false,
      options: [
        {
          value: 'all',
          label: '全部交易'
        },
        {
          value: 'ins',
          label: '作为交易输入'
        },
        {
          value: 'outs',
          label: '作为交易输出'
        }
      ],
      form: {
        address: '',
        type: 'all',
        page: 1,
        start_time: undefined,
        end_time: undefined
      },
      info: '',
      loading: true,
      blockHashQuery: false,
      checktime: false,
      islable: false
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
    if (this.$cookies.get('msgKey')) {
      this.form.address = this.$cookies.get('msgKey')
      console.log('msg')
      console.log(this.$cookies.get('msgKey'))
      this.onSubmit()
    }
    if (this.$route.params.msgKey) {
      console.log('cookies')
      console.log(this.$cookies.get('msgKey'))
      this.form.address = this.$route.params.msgKey
      this.onSubmit()
    }
    this.initime()

  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss') //格式化日期对象
    },
    choose_date(){
      this.loadingShow = true
      this.form.start_time = this.customFormatter(this.form.start_time)
      this.form.end_time = this.customFormatter(this.form.end_time)
      console.log('提交')
      console.log(this.form)
      this.$axios.post('http://10.176.34.154:8000/api/statistics/everyday/stats/btc/address/transactions', this.form).then(res => {
          var content = res.data.content
          var data = res.data
          console.log(data)
          if(data.result) {
            this.loadingShow = false
          }
          this.transactionList = []
          this.length = data.length
          for(var i in content){
            if(content[i]!=null){
              var inputdata = content[i]
              var temp = {}
              temp['transactionhash'] = inputdata[0]
              temp['time'] = inputdata[2]
              this.transactionList.push(temp)
            }
          }
        })
        this.checktime = true

    },
    initime(){
      console.log('initime')
      this.form.start_time = this.customFormatter(new Date(2009,0,10,0,0,0))
      this.form.end_time = this.customFormatter(new Date(2021,7,24,2,9,54))
      console.log(this.form.start_time)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      this.form.page = currentPage
      console.log(this.currentPage) //点击第几页
      console.log('翻页')
      console.log(this.form)
      this.onSubmit()
    },
    changetype(){
      this.form.type = this.type
      this.form.page = this.currentPage
      console.log('类型变化')
      console.log(this.form)
      this.onSubmit()
    },
    onSubmit () {
      this.show2=true
      this.islable = false
      this.$cookies.set('msgKey', '')
      console.log(this.form.address)
      var url = 'http://10.176.34.154:8000/api/basicquery/address/btc/'+this.form.address +'/'
      console.log(url)
      this.$axios.get(url).then(res => {
        if (res.data.result) {
          this.show2 = false
          this.info = res.data
          console.log(this.info)

          this.blockHashQuery = true
          if(this.info.label != '') {
            this.islable = true
          }
        } else {
          console.log('查询不到')
          this.$alert(
            '不能查询到地址值为' + this.form.address + '的信息',
            '错误信息',
            {
              confirmButtonText: '确定'
            }
          )
          //清除错误信息
          this.form = ''
        }
      })
      this.choose_date()
      
    }
  }
}
</script>

<style scoped>
.divAll{
  min-height: 700px;
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
