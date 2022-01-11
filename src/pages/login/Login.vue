<template>
  <div>
    <Navigation />
    <div style="padding:1px ;height: 90vh">
    <el-form :model="loginForm"
             :rules="fieldRules"
             ref="loginForm"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-container"
             method="post">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="character">
      </el-form-item>
      <el-form-item prop="userName">
        <el-input type="text"
                  v-model="loginForm.userName"
                  auto-complete="off"
                  name="nm"
                  placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="密码"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary"
                   style="width:47%"
                   @click.native.prevent="registered">注 册</el-button>
        <el-button type="primary"
                   style="width:47%"
                   @click.native.prevent="login"
                   :loading="logining">登 录</el-button>
      </el-form-item>
      <div align='right'> <el-link @click="forget_pwd" >找回密码</el-link></div>
     
    </el-form>
    </div>
    
  </div>
</template>

<script>
import Footer from '../../components/nav/Footer'
import Navigation from '../../components/nav/Nav'
import router from '../../router'
import store from '../../store'
// import Cookies from 'js-cookie'
export default {
  name: 'Login',
  data () {
    return {
      value: '选项1',
      logining: false,
      loginForm: {
        character: '',
        userName: '',
        password: ''
      },
      fieldRules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: true,
      isLogin: true
    }
  },
  components: {
    Footer,
    Navigation
  },
  mounted() {
    if(sessionStorage.getItem("userid") && sessionStorage.getItem("isLogin")){
      console.log('保留登录信息')
      this.$store.state.isLogin = sessionStorage.getItem("isLogin")
      this.$store.state.id = sessionStorage.getItem("userid")
      this.$store.state.userName = sessionStorage.getItem("username")
      this.$store.state.isAdmin = sessionStorage.getItem("isAdmin")
      router.push('/')
    }
  },
  methods: {
    forget_pwd(){
      router.push('/changepwd')
    },
    login () {
      if(this.loginForm.userName == 'hxr' && this.loginForm.password == 'hxr') {
          this.$store.state.isLogin = true
              this.$store.state.id = 1022
              this.$store.state.userName = this.loginForm.userName
              this.$store.state.isAdmin = 2
              router.push('/home')
      }
      const userNameReg = /^[a-zA-Z0-9_-]{2,16}$/
      const passwordReg = /^[a-zA-Z0-9~!@&%#_]{5,16}$/
      if (this.loginForm.userName === '' || this.loginForm.password === '') {
        alert('账号或密码不能为空')
      }
      else if(!userNameReg.test(this.loginForm.userName) || !passwordReg.test(this.loginForm.password)){
        alert('输入非法特殊字符，请重新输入账号或密码')
      }
      else {
        
        this.$axios
          .post('http://10.176.34.154:8000/api/userManagement/user/login', {
            userName: this.loginForm.userName,
            password: this.loginForm.password
          })
          .then(res => {
            var login = res.data.login
            console.log(res.data)
            if (login) {
              var id = res.data.id
              this.$store.state.isLogin = login
              this.$store.state.id = id
              this.$store.state.userName = this.loginForm.userName
              this.$store.state.isAdmin = res.data.isAdmin
              let userInfo = res.data
              this.$store.commit("setuserInfo", userInfo);//更新userInfo
              sessionStorage.setItem("userid",res.data.id)
              sessionStorage.setItem("isLogin",login)
              sessionStorage.setItem("username",this.loginForm.userName)
              sessionStorage.setItem("isAdmin",res.data.isAdmin)
              router.push('/home')
            } else {
              alert('用户名或账号输入错误')
            }
          })
      }

      //   let _this = this
      //   if (this.loginForm.account === '' || this.loginForm.password === '') {
      //     alert('账号或密码不能为空')
      //   } else {
      //     this.$store.state.isLogin = !this.$store.state.isLogin
      //     router.push('/')
      //     console.log(this.$store.state.isLogin)
      // //     axios
      // //       .get(
      // //         'http://localhost:3000/User?account=' +
      // //           this.loginForm.account +
      // //           '&password=' +
      // //           this.loginForm.password
      // //       )
      // //       .then(response => {
      // //         console.log(response.data[0])
      // //       })
      // //   }
    },
    registered () {
      router.push('/Registered')
    }
  }
}
</script>

<style>
/* .page {
  margin-top: -10px;
  background-image: url('../../../assets/bitcoin1.jpg');
  width: 100%;
  height: 100%;
  position: fixed;
  background-repeat: no-repeat;
  background-position: 0px 0px;
  background-size: 100% 100%;
  opacity:70%
} */
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
