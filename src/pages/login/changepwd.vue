<template>
  <div>
      <Navigation />
      <div style="padding:1px ;height: 90vh">
    <el-form :model="changeForm"
             ref="changeForm"
             label-position="left"
             label-width="0px"
             class="demo-ruleForm login-container"
             method="post">
      <h3 class="title">重置密码</h3>
      <el-form-item prop="character">
      </el-form-item>
      <el-form-item prop="userName">
        <el-input type="text"
                  v-model="changeForm.user_name"
                  auto-complete="off"
                  name="nm"
                  placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" style="width:100%;">
        <el-input type="text"
                  v-model="changeForm.user_mail"
                  auto-complete="off"
                  placeholder="邮箱"
                  style="width:58%"></el-input>
        <el-button type="primary"
            @click="forget_pwd"
            v-if="!isSend"
            style="width:40%"
            >发送验证码</el-button>
        <el-button type="primary"
            @click="forget_pwd"
            v-else
            style="width:40%"
            >已发送</el-button>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input type="text"
                  v-model="changeForm.verify_code"
                  auto-complete="off"
                  placeholder="验证码"></el-input>
      </el-form-item>
      <el-form-item prop="userpasswd">
        <el-input type="password"
                  v-model="changeForm.new_pwd"
                  auto-complete="off"
                  placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item prop="userpasswd">
        <el-input type="password"
                  v-model="passwdrepeat"
                  auto-complete="off"
                  placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;" align='center'>
        <el-button type="primary"
                   style="width:47%"
                   @click="change_pwd"
                   :loading="logining">确认</el-button>
      </el-form-item>
      
    </el-form>
    </div>
  </div>
</template>

<script>
import Navigation from '../../components/nav/Nav1'
import router from '../../router'
import store from '../../store'
export default {
    data(){
        return {
            isSend : false,
            passwdrepeat : '',
            forget_url : 'http://10.176.34.154:8000/api/userManagement/forgetpwd',
            change_url : 'http://10.176.34.154:8000/api/userManagement/resetpwd',
            logining: false,
            changeForm: {
                user_name: '',
                user_mail: '',
                verify_code: '',
                new_pwd: ''
            },
        }
    },
    components: {
        Navigation
    },
    methods: {
        forget_pwd() {
            var forgetform = {
                'user_name' : this.changeForm.user_name,
                'user_mail' : this.changeForm.user_mail
            }
            
            this.$axios.post(this.forget_url,forgetform)
            .then(res=>{
                console.log(res.data)
                if(res.data.result == true){
                    this.isSend = !this.isSend
                }
                else {
                    alert('请检查您输入的邮箱是否正确')
                }
            })
        },
        change_pwd() {
            if (this.changeForm.new_pwd != this.passwdrepeat) 
            {
                alert('确认密码不一致')
            } 
            else {
                console.log(this.changeForm)
                this.$axios.post(this.change_url,this.changeForm)
                .then(res=>{
                    console.log(res.data)
                    var result = res.data.result
                    if(result == true){
                        alert('密码重置成功！')
                        router.push('/Login')
                    } 
                    else{
                        alert('重置密码失败，请检查您的输入！')
                    }
                })
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
</style>