<template>
  <div>
    <Navigation />
     <div class="divAll">
    <div class="illegalGraph">
      <Graph1_1 :data="data.time_window"
                v-show="show1_1" />
                <br /><br />
      <Graph1_2 :data="data.total"
                v-show="show1_2" />
                <br /><br />
      <Graph2_1 :data="data.money_flow"
                v-show="show2_1" />
                <br /><br />
      <Graph2_2 :data="data.money_flow"
                v-show="show2_2" />
                <br /><br />
      <Graph2_3 :data="data.money_flow"
                v-show="show2_3" />
                <br /><br />
      <Graph3_1 :data="data.user_flow"
                v-show="show3_1" />
    </div>
  </div>
  </div>
</template>

<script>
import Navigation from '../../../../components/nav/Nav.vue'
import Graph1_1 from '../../../../components/data_analysis/illegal_analysis/basic/Graph1.vue'
import Graph1_2 from '../../../../components/data_analysis/illegal_analysis/basic/Graph2.vue'
import Graph2_1 from '../../../../components/data_analysis/illegal_analysis/money_transfer/Graph1.vue'
import Graph2_2 from '../../../../components/data_analysis/illegal_analysis/money_transfer/Graph2.vue'
import Graph2_3 from '../../../../components/data_analysis/illegal_analysis/money_transfer/Graph3.vue'
import Graph3_1 from '../../../../components/data_analysis/illegal_analysis/victim_migration/Graph1.vue'
import store from '../../../../store'
export default {
  data () {
    return {
      resetShow: true,
      show1_1: false,
      show1_2: false,
      show2_1: false,
      show2_2: false,
      show2_3: false,
      show3_1: false,
      illegalType: [
        { text: '比特币勒索病毒', value: 'ransomware' },
        { text: '比特币勒索邮件', value: 'blackmail' },
        { text: '庞氏骗局', value: 'ponzi' },
        { text: '比特币偷盗', value: 'theft' }
      ],
      illegalIntro: {
        '': '',
        ransomware: '使用比特币进行支付的勒索病毒软件。',
        blackmail: '使用比特币进行支付的勒索邮件。',
        ponzi:
          '比特币金融投资诈骗。利用新投资人的钱来向老投资者支付利息和短期回报，以制造赚钱的假象进而骗取更多的投资。',
        theft: '账户比特币盗取。'
      },
      activityTypes: {
        ransomware: [
          { text: 'WannaCry', value: 'WannaCry' },
          { text: 'Locky', value: 'Locky' }
        ],
        theft: [
          { text: 'Trojan', value: '2012年著名比特币交易所失窃活动' },
          { text: 'BIPS Hack', value: 'tft1' }
        ],
        blackmail: [
          { text: 'Buddy', value: 'bkl1' },
          { text: 'Sam', value: 'bkl2' }
        ],
        ponzi: [
          { text: 'Leancy', value: 'pz1' },
          { text: 'Cryptory', value: 'pz2' }
        ]
      },
      activityIntro: {
        ransomware: {
          WannaCry:
            '该病毒利用AES-128和RSA算法恶意加密用户文件以勒索比特币，使用Tor进行通讯，为WanaCrypt0r 1.0的变种。',
          Locky:
            '通过RSA-2048和AES-128算法对100多种文件类型进行加密，同时在每个存在加密文件的目录下释放一个名为_Locky_recover_instructions.txt的勒索提示文件。这是一类利用垃圾邮件进行传播的勒索软件，是首例具有中文提示的比特币勒索软件。'
        },
        theft: { skycoin: '2012年著名比特币交易所失窃活动', tft1: 'tft1' },
        blackmail: { bkl1: 'bkl1', bkl2: 'bkl2' },
        ponzi: { pz1: 'pz1', pz2: 'pz2' }
      },
      form: {
        illegalAcitivities: '',
        desc: '',
        basic_info: [],
        money_transfer: [],
        victim_migration: ['0'],
        address: '',
        hash: ''
      },
      data: ''
    }
  },
  components: {
    Navigation,
    Graph1_1,
    Graph1_2,
    Graph2_1,
    Graph2_2,
    Graph2_3,
    Graph3_1
  },
  mounted () {
    if (this.$cookies.get('illegal_form') != '') {
      this.form = this.$cookies.get('illegal_form')
      console.log('表单')
      console.log(this.$cookies.get('illegal_form'))
      console.log(this.$cookies.get('task_id'))
      this.showGraph(this.$cookies.get('task_id'))
      this.$cookies.set('task_id', '')
      this.$cookies.set('illegal_form', '')
    } else {
      this.$cookies.set('task_id', '')
      this.$cookies.set('illegal_form', '')
    }
  },
  methods: {
    showGraph (task_id) {
      this.resetShow = false
      this.$axios.post('http://10.176.34.154:8000/api/getTaskResult', {
        user_id: this.$store.state.id,
        task_id: task_id,
      }).then(res => {
        this.data = res.data
        console.log('非法活动图示数据')
        console.log(res.data.money_flow)
      })
      var temp = []
      var temp1 = []
      var temp2 = []
      temp = this.form.basic_info
      temp1 = this.form.money_transfer
      temp2 = this.form.victim_migration
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
      for (var i in temp2) {
        if ((temp2[i] == '1') & !this.show3_1) {
          this.show3_1 = true
        }
      }
      this.$axios.post('http://10.176.34.154:8000/api/analysis/btc/illegal_activity').then(res => {
        this.data = res.data
      })
    },
    submit () {
      this.resetShow = false
      var form = {
        user_id: this.$store.state.id,
        illegalAcitivitycategory: this.form.illegalAcitivitycategory,
        illegalAcitivityName: this.form.illegalAcitivityName,
        desc: this.form.desc,
        basic_info: JSON.stringify(this.form.basic_info),
        money_transfer: JSON.stringify(this.form.money_transfer),
        victim_migration: JSON.stringify(this.form.victim_migration),
        address: this.form.address,
        hash: this.form.hash
      }
      this.$axios.post('http://10.176.34.154:8000/api/analysis/btc/illegal/add', form).then(res => {
        this.data = res.data
      })
    },
    onReset () {
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style scoped>
.illegalActivitiyAnalysisMain {
  padding: 0 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
.illegalGraph {
  width: 60%;
  margin: 10px 20%;
}
.divAll{
  min-height: 750px;
  padding-top: 8%;
}
</style>

