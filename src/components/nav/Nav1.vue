<template>
    <div id="header">
        <div class="logo" >
          <img src="../../assets/logo_48.png" alt="logo"> 
          <span class="span_word">区块链数据智能分析平台</span>   
        </div>
        <ul class="nav">
            <router-link class="menu-item" to='/home'>首页</router-link>
            <router-link class="menu-item" to="/infor">关于</router-link>
            <a class="menu-item disabled" v-if="!IsLogin"  @click="check()">链内分析</a>
            <router-link class="menu-item" v-else to="/singleChainAnalysis">链内分析</router-link>
            <a class="menu-item disabled" v-if="!IsLogin" @click="check()">跨链分析</a>
            <router-link class="menu-item" v-else to="/multiChainAnalysis">跨链分析</router-link>
            <a class="menu-item disabled" v-if="!IsLogin" @click="check()">数据源管理</a>
            <router-link class="menu-item" v-else to="/dataManagement">数据源管理</router-link>
            <router-link class="menu-item-button" v-if="!IsLogin" to="/login">登录</router-link>
            <router-link class="menu-item" v-else to="/userCenter">个人信息</router-link>
        </ul>
    </div>
</template>

<script>

export default {
  name: 'Nav',
  data () {
    return {
      IsLogin: this.$store.state.isLogin,
    }
  },
  methods: {
    check () {
      if (!this.IsLogin) {
        alert('请先登录')
      }
    }
  }
}
</script>

<style scoped>
#header{
  padding-right: 20px;
  padding-left: 20px;
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 66px;
  background-color: rgb(255, 255, 255);
  /* background-color:rgb(255, 255, 255,0); */
  box-shadow: 0px 0px 2px rgb(199, 199, 199);
}
.span_word{
  position:relative;
  top:25%;
  font-size:25px;
  color: #50a6fc;
}
.logo {
  width: 500px;
  height: 31px;
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
  margin-top:-2%;
  padding-top:2%;
  width: 50px;
  text-align:center;
  margin-left: 10px;
  margin-right: 10px;
  color: black;
  border:1px solid; 
  border-radius: 10px;
  height:40px;
}
.nav{
  margin-top:1.5%;
  margin-right: 20px;
  float: right;
}
a.router-link-active{
  color: #50a6fc;
}
</style>
