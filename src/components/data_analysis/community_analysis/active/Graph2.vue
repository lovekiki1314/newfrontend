<template>
  <!-- 是否需要分析资金在行业间流动情况 -->
  <div>
    <h5>资金在行业间流动情况</h5>
    <div id="community_container2_2"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {}
  },
  methods: {
    paint (val) {
      document.getElementById('community_container2_2').innerHTML = ''
      // 将形式为{{{}，{}}，{{}，{}}}
      var array = val
      var data = []
      for (var i in array) {
        for (var j in array[i]) {
          for (var k in array[i][j]) {
            var temp = {}
            switch (j) {
              case 'd':
                temp['genre'] = '暗网'
                break
              case 'e':
                temp['genre'] = '交易所'
                break
              case 'g':
                temp['genre'] = '赌博'
                break
              case 'm':
                temp['genre'] = '挖矿'
                break
              case 's':
                temp['genre'] = '服务商'
                break
              case 'do':
                temp['genre'] = '暗网组织者'
                break
              case 'dp':
                temp['genre'] = '暗网参与者'
                break
              case 'eo':
                temp['genre'] = '交易所组织者'
                break
              case 'ep':
                temp['genre'] = '交易所参与者'
                break
              case 'go':
                temp['genre'] = '赌博组织者'
                break
              case 'gp':
                temp['genre'] = '赌博参与者'
                break
              case 'mo':
                temp['genre'] = '挖矿组织者'
                break
              case 'mp':
                temp['genre'] = '挖矿参与者'
                break
              case 'so':
                temp['genre'] = '服务商组织者'
              case 'sp':
                temp['genre'] = '服务商参与者'
                break
              default:
                break
            }
            switch (k) {
              case 'd':
                temp['type'] = '暗网'
                break
              case 'e':
                temp['type'] = '交易所'
                break
              case 'g':
                temp['type'] = '赌博'
                break
              case 'm':
                temp['type'] = '挖矿'
                break
              case 's':
                temp['type'] = '服务商'
                break
              case 'stable':
                temp['type'] = '稳定用户'
                break
              case 'in':
                temp['type'] = '流入用户'
                break
              case 'out':
                temp['type'] = '流出用户'
                break
              case 'new':
                temp['type'] = '新用户'
                break
              default:
                break
            }
            // temp['genre'] = j
            // temp['type'] = k
            temp['num'] = array[i][j][k][0]
            temp['amount'] = array[i][j][k][1]
            data.push(temp)
          }
        }
      }
      console.log('流动')
      console.log(data)

      // 对不同数组中的数据进行加和主要是num、amount参数
      // num
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
      // amount
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

      var result = []
      for (var i in result_num) {
        for (var j in result_num[i]) {
          var temp = {}
          temp['genre'] = i
          temp['type'] = j
          temp['num'] = result_num[i][j]
          temp['amount'] = result_amount[i][j]
          result.push(temp)
        }
      }
      console.log(result)
      data = result
      const chart = new this.$Chart({
        container: community_container2_2,
        width: 600,
        height: 300
      })
      const view = chart.createView({
        region: {
          start: { x: 0.2, y: 0.2 }, // 指定该视图绘制的起始位置，x y 为 [0 - 1] 范围的数据
          end: { x: 1, y: 1 } // 指定该视图绘制的结束位置，x y 为 [0 - 1] 范围的数据
        },
        padding: [20, 40] // 指定视图的留白
      })
      chart.data(data)

      chart.scale('num', {
        alias: '比特币流动金额'
      })
      chart.axis('num', {
        title: {}
      })
      chart
        .interval()
        .adjust([
          {
            type: "dodge",
            dodgeBy: "type", // 按照 type 字段进行分组
            marginRatio: 0, // 分组中各个柱子之间不留空隙
          },
          {
            type: "stack",
          },
        ])
        .position('genre*num')
        .color('type')
      chart.render()
    }
  },
  watch: {
    data: function (val) {
      this.paint(val)
    }
  }
}
</script>

<style>
</style>
