<template>

    <div class="divAll1">
        <Nav />
         <div class="BtcSystemDevelopmentDetail">
           <div class="block-main-body">  
            <div>
                <router-link to="/singleChainAnalysis/Eth"> <el-button type="primary" class="buttonTXC">返回上一页</el-button></router-link>         
                <Present 
                        :url_detail="'gasanduncles'"
                        :miner_search_flag="'0'"> </Present>
            </div>
        </div>
    </div>
 </div>
</template>

<script>
import Nav from '../../../../components/nav/Nav'
import Footer from '../../../../components/nav/Footer'
import Present from '../../../../components/eth_data_statistics/EthShowing'
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
  margin-left: 10%;
  
  margin-top: 5%;
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