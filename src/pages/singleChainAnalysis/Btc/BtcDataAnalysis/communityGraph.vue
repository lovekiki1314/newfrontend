<template>
  <div>
    <Navigation />
   <div class="divAll">
    <div class="communityGraph">
      <Graph1_1 :data="data.industry_information"
                v-show="show1_1" />
                <br /><br />
      <!-- <Graph1_2 v-show="show1_2" /> -->
      <Graph2_1 :data="data.entity_value"
                v-show="show2_1" />
                <br /><br />
      <Graph2_2 :data="data.industry_value"
                v-show="show2_2" />
                <br /><br />
      <Graph2_3 :data="data.user_flow"
                v-show="show2_3" />
    </div>
  </div>
  </div>
</template>

<script>
import Navigation from '../../../../components/nav/Nav'
import Graph1_1 from '../../../../components/data_analysis/community_analysis/basic/Graph1'
import Graph1_2 from '../../../../components/data_analysis/community_analysis/basic/Graph2'
import Graph2_1 from '../../../../components/data_analysis/community_analysis/active/Graph1'
import Graph2_2 from '../../../../components/data_analysis/community_analysis/active/Graph2'
import Graph2_3 from '../../../../components/data_analysis/community_analysis/active/Graph3'

import store from '../../../../store'
export default {
  data () {
    return {
      resetShow: true,
      loading: false,
      show: false,
      show1_1: false,
      show1_2: false,
      show2_1: false,
      show2_2: false,
      show2_3: false,
      chart: null,
      data: [1], // 储存后端返回的数据
      dataG2: [],
      msg: '',
      form: {
        startTime: '2010-05-01', // 开始时间
        endTime: '2010-05-03', // 结束时间
        timeUnit: 2, // 基本时间单位（天）
        basic_info: [], // ⾏业基础特征展示维度
        industry_active_info: [], // ⾏业活跃度分析维度
        address: '', // 指定⽐特币地址
        txhash: '' // 指定交易hash
      }
    }
  },
  components: {
    Navigation,
    Graph1_1,
    // Graph1_2,
    Graph2_1,
    Graph2_2,
    Graph2_3
  },
  mounted () {
    if (this.$cookies.get('form') != '') {
      this.form = this.$cookies.get('form')
      console.log('表单')
      console.log(this.$cookies.get('form'))
      console.log(this.$cookies.get('task_id'))
      this.showGraph(this.$cookies.get('task_id'))
      this.$cookies.set('task_id', '')
      this.$cookies.set('form', '')
    } else {
      this.$cookies.set('task_id', '')
      this.$cookies.set('form', '')
    }
  },
  methods: {
    showGraph (task_id) {
      console.log(task_id)
      this.$axios.post('http://10.176.34.154:8000/api/getTaskResult', {
        user_id: this.$store.state.id,
        task_id: task_id,
      }).then(res => {
        console.log(res)
        console.log(this.data)
        this.data = res.data
        console.log(this.data)
      })
      this.resetShow = false
      var temp = []
      var temp1 = []
      temp = this.form.basic_info
      temp1 = this.form.industry_active_info
      for (var i in temp) {
        if ((temp[i] == '1') & !this.show1_1) {
          this.show1_1 = true
        }
        if ((temp[i] == '2') & !this.show1_2) {
          this.show1_2 = true
        }
      }
      for (var i in temp1) {
        if ((temp1[i] == '1') & !this.show2_1) {
          this.show2_1 = true
        }
        if ((temp1[i] == '2') & !this.show2_2) {
          this.show2_2 = true
        }
        if ((temp1[i] == '3') & !this.show2_3) {
          this.show2_3 = true
        }
      }
    },
    onReset () {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style scoped>
.CommunityAnalysisMain {
  padding: 0 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
.communityGraph {
  width: 60%;
  margin: 10px 20%;
}
.divAll{
  min-height: 750px;
 padding-top: 8%;;
}
</style>
