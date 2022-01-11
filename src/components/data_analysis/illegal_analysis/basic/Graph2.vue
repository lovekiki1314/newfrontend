<template>
  <!--非法活动交易量统计-->
  <div>
    <h5>非法活动交易量统计</h5>
    <el-table :data="dataForTx_info"
              :header-cell-style="{background:'#409EFF',color:'#ffffff'}">
      <el-table-column prop="num"
                       label="交易次数"
                       sortable></el-table-column>
      <el-table-column prop="amount"
                       label="交易金额"
                       sortable></el-table-column>
    </el-table>
    <div id="illegal_container1_2"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForTx_info: []
    }
  },
  props: {
    data: {}
  },
  methods: {
    paint (val) {
      this.dataForTx_info = []
      var array = val
      for (var i in array) {
        var temp = {}
        temp['num'] = array[i][0]
        temp['amount'] = array[i][1]
        this.dataForTx_info.push(temp)
      }
    }
  },
  watch: {
    data: function (val) {
      this.paint(val)
    }
  }
}
</script>

<style scoped>
</style>
