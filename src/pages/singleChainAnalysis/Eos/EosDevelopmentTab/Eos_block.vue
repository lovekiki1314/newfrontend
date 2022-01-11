<template>

    <div class="divAll1">
        <Nav />
         <div class="BtcSystemDevelopmentDetail">
           <div class="block-main-body">  
            <div>
                <router-link to="/singleChainAnalysis/Eos"> <el-button type="primary" class="buttonTXC">返回上一页</el-button></router-link>         
                <!-- <h1 style="text-align:center;margin-bottom:-80px;margin-top:20px;font-weight:bold">每日新柚子币地址增长情况</h1> -->
                <Present 
                        :url_detail="'blocks'"
                        :miner_search_flag="'0'"> </Present>
            </div>
        </div>
    </div>
 </div>
</template>

<script>
import Nav from '../../../../components/nav/Nav'
import Footer from '../../../../components/nav/Footer'
import Present from '../../../../components/eos_data_statistics/EosShowing'
import router from '../../../../router'


   

    
export default {
  name: 'BtcSystemDevelopment',
  data () {
    return {
    
    }
  },
  mounted () { },
  methods: {
   
  },
  fliters: {},
   components:{
        Nav,Footer,Present,router
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divAll1{
  min-height: 700px;
}
.buttonTXC{
  
  margin-top: 5%;
  margin-left: 10%;
}
.block-main-body {
  position: relative;
  vertical-align: middle;
  width: 90%;
  margin: 0 auto;
  padding-top: 6%;
}
b-card {
  width: 90%;
}
</style>