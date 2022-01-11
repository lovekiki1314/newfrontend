<template>
  <div>
    <Nav/>
    <div class="divAll">
    <div class="FundChainTrackingMain">
      <el-form ref="form"
               :model="form"
               :inline=true>
        <p>柚子币地址信息查询</p>
        <el-form-item title="">
          <el-input type="text"
                    v-model="form.address"
                    style="width:820px"
                    placeholder="请输入待查询的柚子币地址" id="input1"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">提交</el-button>
          <el-button type="primary" ><router-link to="/singleChainAnalysis/Eos" style="color:white">返回上一级</router-link></el-button>
        </el-form-item>
      </el-form>
     <el-button v-show="show2" type="primary" :loading='true' >努力加载中</el-button>
    </div>
    <el-collapse-transition>
      <div v-show="blockHashQuery">
        <table class="AdressTable">
            <tr>
              <th colspan="2">柚子币地址信息总览</th>
            </tr>
            <tr>
              <td>账户名</td>
              <td>{{info.account_name}}</td>
            </tr>
            <tr>
              <td>权限</td>
              <td>{{info.privileged}}</td>
            </tr>
            <tr>
              <td>首次出现时间</td>
              <td>{{info.created}}</td>
            </tr>
            <tr>
              <td>最近出现时间</td>
              <td>{{info.last_code_update}}</td>
            </tr>
            <tr>
              <td>eos流量</td>
              <td>{{info.core_liquid_balance}}</td>
            </tr>
            <tr>
              <td>内存限额</td>
              <td>{{info.ram_quota}} KB</td>
            </tr>
            <tr>
              <td>net权重</td>
              <td>{{info.net_weight}}</td>
            </tr>
            <tr>
              <td>cpu权重</td>
              <td>{{info.cpu_weight}}</td>
            </tr>
            <tr>
              <td>net限额</td>
              <td>已使用：{{net.used}}，可使用：{{net.available}}，最大值：{{net.max}}</td>
            </tr>
            <tr>
              <td>cpu限额</td>
              <td>已使用：{{cpu.used}}，可使用：{{cpu.available}}，最大值：{{cpu.max}}</td>
            </tr>
              <tr>
              <td>内存使用量</td>
              <td>{{info.ram_usage}} KB</td>
            </tr>
        </table>
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
      length: 0,
      start_time: '',
      end_time: '',
      type: 'all',
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      transactionList: [],
      List: [],
      net: {},
      cpu: {},
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
    // if(this.$store.state.isLogin == false) {
    //   console.log('未登录')
    //   router.push('/')
    // }
  },
  methods: {
    onSubmit () {
      this.show2=true
      this.islable = false
      this.$cookies.set('msgKey', '')
      console.log(this.form.address)
      var url = 'http://10.176.34.154:8000/api/basicquery/address/eos/'+this.form.address 
      console.log(url)
      this.$axios.get(url).then(res => {
        if (res.data.result) {
          this.show2 = false
          this.info = res.data
          console.log(res.data.net_limit)
          this.net = res.data.net_limit 
          console.log(this.net)
          this.cpu =this.info.cpu_limit  
          this.blockHashQuery = true
          // if(this.info.label != '') {
          //   this.islable = true
          // }
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
  width: 50%;
  margin: 0 20% 4% 20%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
  font-size: 15px;
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
