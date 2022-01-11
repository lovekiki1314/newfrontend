<template>
  <div id="app">
    <div v-bind:style="{minHeight: Height+'px'}">
      <router-view />
   </div>
    <Footer />
  </div>
</template>

<script>
import Nav from '../src/components/nav/Nav'
import Footer from '../src/components/nav/Footer'
import router from '../src/router'
export default {
  name: 'App',
  components:{
    Nav,
    Footer
  },
  data(){
    return {
      Height : 0,
    }
  },
  mounted(){
    //动态设置内容高度 让footer始终居底   header+footer的高度是100
      this.Height = document.documentElement.clientHeight - 70;  　　//监听浏览器窗口变化　
      window.onresize = ()=> {this.Height = document.documentElement.clientHeight -70}
  }
}
</script>

<style>

</style>
