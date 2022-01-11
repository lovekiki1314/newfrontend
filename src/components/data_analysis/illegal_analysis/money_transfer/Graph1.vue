<template>
  <!--社区间资金流动情况-->
  <div>
    <h5>行业间资金流动情况</h5>
    <el-table :data="dataForMoneyFlow"
              :header-cell-style="{background:'#409EFF',color:'#ffffff'}">
      <el-table-column prop="type"
                       label="成员名称"
                       sortable></el-table-column>
      <el-table-column prop="num"
                       label="交易次数"
                       sortable></el-table-column>
      <el-table-column prop="amount"
                       label="交易金额"
                       sortable></el-table-column>
    </el-table>
    <div id="illegal_container2_1"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForMoneyFlow: []
    }
  },
  props: {
    data: {}
  },
  methods: {
    paint (val) {
      this.dataForMoneyFlow=[]
      var array = val
      console.log('流动')
      // 将形式为{{{}，{}}，{{}，{}}}
      var data = []
      for (var i in array) {
        for (var j in array[i]) {
          for (var k in array[i][j]) {
            var temp = {}
            temp['genre'] = j
            temp['type'] = k
            temp['num'] = array[i][j][k][0]
            temp['amount'] = array[i][j][k][1]
            data.push(temp)
          }
        }
      }
      //对不同数组中的数据进行加和主要是num、amount参数
      //num
      var result_num = {}
      for (i = 0; i < data.length; i++) {
        result_num[data[i].genre] = {}
      }
      for (i = 0; i < data.length; i++) {
        if (result_num[data[i].genre][data[i].type]) {
          result_num[data[i].genre][data[i].type] += data[i].num
        } else {
          result_num[data[i].genre][data[i].type] = data[i].num
        }
      }
      //amount
      var result_amount = {}
      for (i = 0; i < data.length; i++) {
        result_amount[data[i].genre] = {}
      }
      for (i = 0; i < data.length; i++) {
        if (result_amount[data[i].genre][data[i].type]) {
          result_amount[data[i].genre][data[i].type] += data[i].amount
        } else {
          result_amount[data[i].genre][data[i].type] = data[i].amount
        }
      }
      console.log('12343')
      console.log(result_num)

      var result = []
      for (var i in result_num) {
        for (var j in result_num[i]) {
          var temp = {}
          temp['genre'] = i
          
          switch(j) {
            case 'e':
              temp['type'] = '交易所'
              break
            case 'g':
              temp['type'] = '赌博'
              break
            case 'd':
              temp['type'] = '暗网'
              break
            case 's':
              temp['type'] = '服务商'
              break
            case 'm':
              temp['type'] = '矿工'
              break
            case 't':
              temp['type'] = '其他'
              break
          }
          temp['num'] = result_num[i][j]
          temp['amount'] = result_amount[i][j]
          console.log(temp['genre'])
          result.push(temp)
        }
      }
      array = result
      result = []
      for (var i in array) {
        if (array[i]['genre'] == 'community_label_tx_count_amount') {
          result.push(array[i])
        }
      }
      console.log('result')
      console.log(result)
      this.dataForMoneyFlow = result
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
