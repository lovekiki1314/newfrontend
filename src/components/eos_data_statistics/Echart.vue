<template>
  <div :id="id"
       :style="style">
    {{this.option}}

  </div>
</template>

<script>
export default {
  name: 'charts',
  data() {
    return {
      chart: ''
    }
  },
  props: {
    //这里子组件需要接收父组件传递过来的参数
    id: {
      type: String
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    option: {
      type: Object,
      //Object 类型的prop值需要用函数return出来，
      //使用闭包保证一个vue实例拥有自己的一份props
      default() {
        return {
          title: {
            text: '新比特币地址增长曲线'
            //text: '已花费比特币的平均持有时间曲线'
          },
          tooltip: {},
          legend: {
            data: ['销量'],
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line'
            }
          ]
        }
      }
    }
  },
  computed: {
    style() {
      return {
        width: this.width,
        height: this.height
      }
    }
  },
  watch: {
    option: {
      handler(newVal) {
        if (this.chart) {
          this.chart.setOption(newVal, true)
        } else {
          this.init()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(document.getElementById(this.id)) // 初始化表单
      this.chart = this.$echarts.init(dom, 'light')
      this.chart.setOption(this.option)
      //this.chart.showLoading();
      let $this = this
      this.chart.on('legendselectchanged', function(obj) {
        //console.log('selected!!!',obj);
        if ($this.option.series[0].type === 'pie') return
        let selected = obj.selected
        let legend = obj.name
        // 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
        // 使得 无 selected 对象
        if (selected !== undefined) {
          //换miner_fee的x轴数据
          if (legend.startsWith('total_part')) {
            $this.$parent['miner_fee'].xAxis.data =
              $this.$parent['miner_fee'].mf_xAxis_data[
                parseInt(legend[legend.length - 10]) - 1
              ]
            for (let k in $this.$parent['miner_fee'].legend.selected) {
              if (k != legend) {
                $this.$parent['miner_fee'].legend.selected[k] = false
              }
            }
            $this.$parent['miner_fee'].legend.selected[legend] = true
            //$this.$parent['miner_fee'].legend.selected[legend]
            //let $$this = $this;
            /*            setTimeout(function () {
                    $$this.chart.dispatchAction({
                        type: "legendSelect",
                        batch: [{name:legend}]
                    })
                },3000)*/
          } else {
            $this.triggerAction(selected, legend)
          }
        }
      })
      window.addEventListener('resize', this.chart.resize)
    },
    triggerAction(selected, cur_legend) {
      let legend = []

      for (let name in selected) {
        if (cur_legend != name) legend.push({ name: name })
      }

      this.chart.dispatchAction({
        type: 'legendUnSelect',
        batch: legend
      })
      this.chart.dispatchAction({
        type: 'legendSelect',
        batch: [{ name: cur_legend }]
      })
    }
  }
}
</script>

<style scoped>
</style>
