<template>
    <div id="header">
        <div class="logo" >
          <img src="../../assets/logo_232.png" alt="logo">
          <span class="span_word">区块链数据智能分析平台</span>
          
        </div>
        <ul class="nav">
            <!-- <a href="../../../static/data_driving/dataDriving.html" >数据驾驶舱</a> -->
            <router-link class="menu-item" to='/home'>首页</router-link>
            <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">链内分析</a>
            <router-link class="menu-item" v-else to="/singleChainAnalysis">链内分析</router-link>
            
            <!-- <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">图分析</a>
            <router-link class="menu-item" v-else to="/graphAnalysis">图分析</router-link> -->
            <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">虚拟现实</a>
            <router-link class="menu-item" v-else to="/realvirtuetx">虚拟现实</router-link>
            <!-- <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">跨链分析</a> -->
            <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">恶意地址</a>
            <router-link class="menu-item" v-else to="/maliciousAddress">恶意地址</router-link>

            <a class="menu-item disabled" v-if="!IsLogin" @click="check()">数据源管理</a>
            <router-link class="menu-item" v-else to="/dataManagement">数据源管理</router-link>
            <a class="menu-item disabled" v-if="!IsLogin" @click="check()">暗网数据</a>
            <router-link class="menu-item" v-else to="/darknet">暗网数据</router-link>
            <router-link class="menu-item-button" v-if="!IsLogin" to="/login">登录</router-link>
            <router-link class="menu-item" v-else to="/userCenter">个人信息</router-link>
            <!-- <router-link class="menu-item" to="/about">论文推荐</router-link> -->
            <router-link class="menu-item" to="/aboutus">关于我们</router-link>
            
            
        </ul>
      <el-row id="price">
        <el-col :span="5">
          <span class="classspan"> 币价数据来源：coincap</span>
        </el-col>
        <el-col :span="4" >
          <span> <strong>BTC</strong> &nbsp;&nbsp; $&nbsp;{{BTC}}</span>
          <span  v-if="BTCGap>0" class="green">↑ +{{BTCGap}}%</span>
          <span v-else class="red">↓ {{BTCGap}}%</span>
        </el-col>
        <el-col :span="4" :offset="1">
          <span> <strong>ETH</strong> &nbsp;&nbsp; $&nbsp;{{ETH}}</span>
          <span  v-if="ETHGap>0" class="green">↑ +{{ETHGap}}%</span>
          <span v-else class="red">↓ {{ETHGap}}%</span>
        </el-col>
        <el-col :span="4" :offset="1">
          <span><strong>EOS</strong> &nbsp;&nbsp; $&nbsp;{{EOS}}</span>
          <span  v-if="EOSGap>0" class="green">↑ +{{EOSGap}}%</span>
          <span v-else class="red">↓ {{EOSGap}}%</span>
        </el-col>
        <el-col :span="5">
          <span style="float:right">{{time}}</span>
        </el-col>
      </el-row>
    </div>
</template>

<script>

export default {
  name: 'Nav',
  data () {
    return {
      IsLogin: this.$store.state.isLogin,
      Isnot : false,
      time: this.timeFormat(new Date()),
      BTC: 0.00,
      BTCGap: 0.00,
      EOS: 0,
      EOSGap: 0,
      ETH: 0,
      ETHGap:0,
    }
  },
  beforeMount() {
    // this.get();
  },
  mounted() {
    this.BTC = this.BTC.toFixed(2);
    this.BTCGap = this.BTCGap.toFixed(2);
    this.ETH = this.ETH.toFixed(2);
    this.ETHGap = this.ETHGap.toFixed(2);
    this.EOS = this.EOS.toFixed(2);
    this.EOSGap = this.EOSGap.toFixed(2);
    // this.timer = setInterval(this.get, 20000);
    this.timer1 = setInterval(this.updateTime, 1000);
    if(sessionStorage.getItem("userid") && sessionStorage.getItem("isLogin")){
      this.$store.state.isLogin = sessionStorage.getItem("isLogin")
      this.$store.state.id = sessionStorage.getItem("userid")
      this.$store.state.userName = sessionStorage.getItem("username")
      this.$store.state.isAdmin = sessionStorage.getItem("isAdmin")
      this.IsLogin = this.$store.state.isLogin
    }
  },
  methods: {
    sleep(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
},
    timeFormat(timestamp){
      let time = new Date(timestamp);
      let year = time.getFullYear();
      let month = time.getMonth()+1;
      let date = time.getDate();
      let week = time.getDay();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      return year + '-' + this.addZero(month) + '-' + this.addZero(date) + ' ' + this.addZero(hours) + ':' + this.addZero(minutes) + ':' + this.addZero(seconds) + '  星期' + "日一二三四五六".charAt(week)
    },
    updateTime(){
      this.time = this.timeFormat(new Date())
    },
    addZero(num) { return num < 10 ? '0' + num : num },
    get(){
      this.$axios.get('https://api.coincap.io/v2/rates/ethereum')
      .then(res => {
        console.log(res)
        // this.time = this.timeFormat(res.data.timestamp);
        let t = this.ETH;
        this.ETH = parseFloat(res.data.data.rateUsd).toFixed(2);
        if(t!=0){
          this.ETHGap = parseFloat((this.ETH/t-1)*100).toFixed(2);
        }
      })
      this.$axios.get('https://api.coincap.io/v2/rates/eos').then(res => {
        let t = this.EOS;
        this.EOS = parseFloat(res.data.data.rateUsd).toFixed(2);
        if(t!=0){
          this.EOSGap = parseFloat((this.EOS/t-1)*100).toFixed(2);
        }
      })
      this.$axios.get('https://api.coincap.io/v2/rates/bitcoin').then(res => {
        let t = this.BTC;
        this.BTC = parseFloat(res.data.data.rateUsd).toFixed(2);
        if(t!=0){
          this.BTCGap = parseFloat((this.BTC/t-1)*100).toFixed(2);
        }
      })
    },
    check () {
      if (!this.IsLogin) {
        alert('请先登录')
      }
    }
  }
}
</script>

<style scoped>
.price span {
  display: inline-block;
}

#header{
  padding-right: 20px;
  padding-left: 20px;
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 13.7vh;
  background-color: rgb(255, 255, 255);
  /* background-color:rgb(255, 255, 255,0); */
  box-shadow: 0px 0px 2px rgb(199, 199, 199);
}
.span_word{
  position:relative;
  top:25%;
  font-size:25px;
  color: black;
}
.logo {
  width: 500px;
  height: 20px;
  background: rgba(255, 255, 255,0);
  float: left;
  line-height: 31px;
}
.menu-item{
  width: auto;
  margin-left: 10px;
  margin-right: 10px;
  color: black;
}
.disabled{
  color:gray;
}
.menu-item-button{
  margin-top:-1%;
  padding-top:1%;
  width: 50px;
  text-align:center;
  
  margin-left: 10px;
  margin-right: 10px;
  color: black;
  border:1px solid;
  border-radius: 10px;
  height:35px;
}
.nav{
  margin-top:1.5%;
  margin-right: 20px;
  float: right;
  font-size: 15px;
}
#price{
  width: 100%;
  border-top: 1px solid;
  font-weight: 600;
  margin-top: 9vh;
  padding-top: 0.5vh;

}
#price span{
  font-style:Segoe UI Light;
  font-size: large;
}
#price span.classspan{
  font-size:smaller;
  color: rgb(168, 161, 161);
  font-weight:200;
}
.red{
  color:red;
}
.green{
  color: green;
}
a.router-link-active{
  color: #50a6fc;
}
</style>
