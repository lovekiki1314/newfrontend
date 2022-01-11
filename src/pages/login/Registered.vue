<template>
  <div class="page">
    <Navigation/>
    <div style="padding: 0.1%; max-height: 90vh ">
    <el-form :model="registeredForm"
             :rules="fieldRules"
             ref="registeredForm"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-container"
             method="post">
      <h3 class="title">用户注册</h3>
      <el-form-item prop="character">
      </el-form-item>
      <el-form-item prop="userName">
        <el-input type="text"
                  v-model="registeredForm.userName"
                  auto-complete="off"
                  name="nm"
                  placeholder="账号 (不少于6位)"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="registeredForm.password"
                  auto-complete="off"
                  placeholder="密码（不少于6位）"></el-input>
      </el-form-item>
      <el-form-item prop="passwordRepeat">
        <el-input type="password"
                  v-model="registeredForm.passwordRepeat"
                  auto-complete="off"
                  placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="userMail">
        <el-input type="text"
                  v-model="registeredForm.userMail"
                  auto-complete="off"
                  name="nm"
                  placeholder="邮箱"></el-input>
      </el-form-item>
      <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button type="primary"
                   style="width:98%"
                   @click.native.prevent="confirm">确认</el-button>
      </el-form-item>
    </el-form>
    </div>
    
  </div>
</template>

<script>
import Navigation from '../../components/nav/Nav'
import Footer from '../../components/nav/Footer'
import router from '../../router'
import store from '../../store'
export default {
  name: 'Login',
  data () {
    return {
      value: '选项1',
      registeredForm: {
        userName: '',
        password: '',
        passwordRepeat: '',
        userMail: ''
      },
      fieldRules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        passwordRepeat: [
          { required: true, message: '确认密码', trigger: 'blur' }
        ]
      },
      checked: true,
      isLogin: true
    }
  },
  components: {
    Footer,
    Navigation
  },
  methods: {
    confirm () {
      const userNameReg = /^[a-zA-Z0-9_-]{2,16}$/
      const passwordReg = /^[a-zA-Z0-9~!@&%#_]{6,16}$/
      console.log(this.registeredForm.userName)
      if (this.registeredForm.userName != '' && userNameReg.test(this.registeredForm.userName) && passwordReg.test(this.registeredForm.password)) {
        console.log('用户名合格')
        this.$axios
          .post(
            'http://10.176.34.154:8000/api/userManagement/user/checkRegistered',
            {
              userName: this.registeredForm.userName
            }
          )
          .then(res => {
            console.log(res.data)
            if (res.data.check === null) {
              console.log(passwordReg.test(this.registeredForm.password))
              if (
                this.registeredForm.userName === '' ||
                this.registeredForm.password === ''
              ) {
                alert('账号或密码不能为空')
                console.log(1)
              } else if (this.registeredForm.passwordRepeat === '' || !passwordReg.test(this.registeredForm.password)) {
                alert('输入非法特殊字符，请再次输入密码进行确认')
                console.log(2)
              } else if (
                this.registeredForm.passwordRepeat !=
                this.registeredForm.password
              ) {
                alert('确认密码不一致')
              } else {
                var temp = {
                  userName: this.registeredForm.userName,
                  password: this.registeredForm.password,
                  userMail: this.registeredForm.userMail,
                  isAdmin: 0,
                  userNoteInformation: '',
                  finishedTask: [],
                  unfinishedTask: []
                }
                var str = JSON.stringify(temp)
                console.log(str)
                this.$axios.post(
                  'http://10.176.34.154:8000/api/userManagement/user/insertUser',
                  {
                    user_info_form: str
                  }
                ).then(res=>{
                  console.log(res)
                })
                router.push('/Login')
              }
            } else {
              alert('用户名已被注册')
            }
          })
      }
      else {
        alert('输入非法特殊字符，请重新输入账号或密码')
      }
    }
  }
}
</script>

<style>
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
.remember {
  margin: 0px 0px 35px 0px;
}
</style>
