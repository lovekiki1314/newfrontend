<template>
    <div class="divAll1" style="margin-bottom:5%;">
        <Nav />
         <div class="BtcSystemDevelopmentDetail">
     
           <div class="block-main-body">
               
            <div>
                
               
                          <router-link to="/singleChainAnalysis/Btc"> <el-button type="primary" class="buttonTXC">返回上一页</el-button></router-link>
                          <Present 
                                  :url_detail="'transaction_curve'"
                                  :miner_search_flag="'0'"> </Present>
                    
                    <!-- <b-tab title="每日平均区块大小及区块内打包交易数量"
                           name="BKC"
                           @click="handleClick('BKC')">
                           <Present v-if='is_BKC_Update'
                                   :url_detail="'block_curve'"
                                   :miner_search_flag="'0'"> </Present>
                    </b-tab>
                    <b-tab title="每日新比特币地址增长情况"
                           name="NAC"
                           @click="handleClick('NAC')">
                           <Present v-if='is_NAC_Update'
                                   :url_detail="'new_address_curve'"
                                   :miner_search_flag="'0'"> </Present>
                    </b-tab> -->
               
            </div>
        </div>
    </div>
 </div>
</template>

<script>
import Nav from '../../../../components/nav/Nav'
import Footer from '../../../../components/nav/Footer'
import Present from '../../../../components/btc_data_statistics/Show'
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
.divAll{
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