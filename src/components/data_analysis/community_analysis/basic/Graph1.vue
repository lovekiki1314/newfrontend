<template>
  <!-- 行业用户及交易情况统计 -->
  <div>
    <h5>行业交易情况统计</h5>
    <div id="community_container1_1"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chart: null
    }
  },
  props: {
    data: {}
  },
  mounted () {
  },
  methods: {
    paint (data) {
      document.getElementById('community_container1_1').innerHTML = ''
      // 将形式为[{},{}]整理为可视化引擎G2所需要的数据
      var array = []
      for (var i = 0; i < 2; i++) {
        array[i] = this.data[i].industry_user
      }
      var dataFormat = []
      for (var i in array) {
        for (var key in array[i]) {
          var temp = {}
          switch (key) {
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
              temp['genre'] = '服务'
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
          temp['num'] = array[i][key]
          dataFormat.push(temp)
        }
      }
      console.log(dataFormat)
      var data = dataFormat
      // 去重加和
      var result = {}
      for (i = 0; i < data.length; i++) {
        if (result[data[i].genre]) {
          result[data[i].genre] += data[i].num
        } else {
          result[data[i].genre] = data[i].num
        }
      }
      console.log(result)
      data = []
      for (var key in result) {
        data.push({ genre: key, num: result[key] })
      }
      console.log(data)
      const chart = new this.$Chart({
        container: community_container1_1,
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
      // 载入数据源
      chart.data(data)
      chart.scale('num', {
        alias: '流动金额'
      })
      chart.axis('num', {
        title: {}
      })
      chart
        .interval()
        .position('genre*num')
        .color('genre')
      // 渲染图表
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
