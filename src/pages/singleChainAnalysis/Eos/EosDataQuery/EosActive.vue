<template>
  <div>
    <Nav/>
    <div class="divAll">
    <div class="FundChainTrackingMain">
      <el-form ref="form"
               :model="form"
               :inline=true>
        <p>活跃用户信息查询</p>
        <el-form-item title="">
          <el-input type="text"
                    v-model="form.owner"
                    style="width:820px"
                    placeholder="请输入待查询的owner用户" id="input1"></el-input>
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
              <th colspan="2">账户信息</th>
              <th colspan="1">账户总数：{{totalList.length}}</th>
            </tr>
              <tr v-for="index in entropy" :key="index" >
              <td v-if="entropy != 0"> <i class="el-icon-user-solid">  {{List[3*index -3]}}</i></td>
              <td v-if="entropy != 0"> <i class="el-icon-user-solid">  {{List[3*index -2]}}</i></td>
              <td v-if="entropy != 0"> <i class="el-icon-user-solid">  {{List[3*index -1]}}</i></td>   
            </tr>
            <tr>
              <td v-if="entropy == 0 && remainder ==1"><i class="el-icon-user-solid"> {{List[remainder-1]}}</i></td>
              <td v-if="entropy == 0 && remainder ==2"><i class="el-icon-user-solid"> {{List[remainder-2]}}</i></td>
              <td v-if="entropy == 0 && remainder ==2"><i class="el-icon-user-solid"> {{List[remainder-1]}}</i></td>
            </tr>
            <tr>
              <td v-if="entropy!= 0 && remainder ==1"><i class="el-icon-user-solid"> {{List[number-1]}}</i></td>
              <td v-if="entropy != 0 && remainder ==2"><i class="el-icon-user-solid"> {{List[number-2]}}</i></td>
              <td v-if="entropy != 0 && remainder ==2"><i class="el-icon-user-solid"> {{List[number-1]}}</i></td>
            </tr>
        </table>
       <el-button type="primary" @click="continueTo" style="margin-left:20%;margin-bottom:4%">查看更多信息</el-button>
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
      length: 0,
      start_time: '',
      end_time: '',
      type: 'all',
      currentPage: 1, //初始页
      pagesize: 60, //    每页的数据
      transactionList: [],
      List: [],
      totalList:[],
      singleList: [],
      doubleList:[],
      active:'',
      number:0,
      entropy:0,
      remainder:0,
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
        aowner: '',
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
      console.log(this.form.owner)
      var url = 'http://10.176.34.154:8000/api/basicquery/address/eosaccount/'+this.form.owner 
      console.log(url)
      this.$axios.get(url).then(res => {
        if (res.data.result) {
          this.show2 = false
          this.info = res.data
         var num = this.info.active.length
         console.log(num)
         this.active = this.info.active.substring(1,num-1)
        
  
         this.List = this.active.split(",")
         console.log(this.List[1])
         for(var i= 0;i<this.List.length; i++){
             var str = this.List[i].trim()
             this.List[i] =str.substring(1,this.List[i].length-2)
         }
         console.log(this.List.length)
         this.totalList =this.List
         this.List =this.List.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
          this.number =this.List.length
         this.remainder = this.List.length % 3
         this.entropy = (this.List.length - this.remainder) /3
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
      
    },
    continueTo() {
        this.List =this.totalList
         this.number =this.List.length
         this.remainder = this.List.length % 3
         this.entropy = (this.List.length - this.remainder) /3
    },
  }
}
</script>

<style scoped>
.divAll{
  min-height: 700px;
}
.page{
    text-align: center;
}
.FundChainTrackingMain {
  padding: 150px 20% 10px 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
.AdressTable {
  border-collapse: collapse;
  width: 50%;
  margin: 0 20% 2% 20%;
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
