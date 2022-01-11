<template>
  <div>
   <Nav/>
    <div class="divAl">
    <el-container >
      <el-aside width="200px" >
        <el-menu router >
          <el-menu-item @click="userFinishedTaskClick">
            <i class="el-icon-circle-check"></i>已完成任务
          </el-menu-item>
          <el-menu-item @click="userUnfinishedTaskClick">
            <i class="el-icon-edit-outline"></i>正在进行的任务
          </el-menu-item>
          <el-menu-item @click="logout" >
            <template>
              <el-button style="margin-left:20px">退出账号</el-button>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <router-view/>
    </el-container>
    </div>

  </div>
</template>

<script>
  import Nav from '../../components/nav/Nav'
  import Footer from '../../components/nav/Footer'
  import router from '../../router'
  export default {
    name: 'userCenter',
    data () {
      return {
      }
    },
    components: {
      Nav, Footer
    },
    mounted () {
      // if (this.$store.state.isLogin === false) {
      //   console.log('未登录')
      //   this.$alert('请先登录', '登录提示', {
      //     confirmButtonText: '确定'
      //   })
      //   router.push('/')
      // }
    },
    methods: {
      userFinishedTaskClick () {
        router.push('/userCenter/userFinishedTask')
        //   axios.get('http://localhost:3000/User/1').then(response => {
        //       console.log(response.data)
        //   })
      },
      userUnfinishedTaskClick () {
        router.push('/userCenter/userUnfinishedTask')
      },
      logout () {
        sessionStorage.removeItem('userid')
        sessionStorage.removeItem('isLogin')
        sessionStorage.removeItem('username')
        sessionStorage.removeItem('isAdmin')
        this.$store.state.isLogin = !this.$store.state.isLogin
        this.$store.state.id = null
        this.$store.state.userName = null
        this.$store.state.isAdmin = null
        console.log(this.$store.state.isLogin)
        this.$alert('您已成功退出', '退出提示', {
          confirmButtonText: '确定'
        })
        router.push('/')
      }
    }
  }
</script>

<style>
.divAl{
  min-height: 700px;
  padding-top: 10%;
}
  .el_containter{
    min-height:700px;
  }
  .el-aside {
    color: #333;
  }
  .elProgress {
    padding: 20px 200px 20px 10px;
  }
</style>
