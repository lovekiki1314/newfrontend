<template>
  <div>
    <Navigation />
    <a name="go"></a>
    <div class="All">
       
    <div class="illegalActivitiyAnalysisMain">
       <router-link to="/singleChainAnalysis/Btc"> <el-button type="primary" class="buttonTXC">返回上一页</el-button></router-link>
      <h3 style="text-align:center">比特币非法活动分析</h3>
      <p style="color:#409eff">请选择您需要分析的非法活动及分析维度</p>
      <el-form ref="form"
               :model="form"
               @submit="onSubmit"
               @reset="onReset">
        <div v-show="resetShow">
          <p>非法活动类型</p>
          <el-form-item title="非法活动类型">
            <el-select v-model="form.illegalAcitivities"
                       placeholder="请选择需要分析的非法活动及分析维度">
              <el-option v-for="item in illegalType"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
              </el-option>
            </el-select>
            <div class="mt-3"
                 v-if="form.illegalAcitivities"> 类型简介：{{illegalIntro[form.illegalAcitivities]}}</div>
          </el-form-item>

          <p>指定非法活动名称</p>
          <el-form-item title="指定非法活动名称">
            <el-select v-model="form.desc"
                       placeholder="请选择需要分析的非法活动名称">
              <el-option v-for="item in activityTypes[form.illegalAcitivities]"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">
              </el-option>
            </el-select>
            <div class="mt-3"
                 v-if="form.desc"> 类型简介：{{activityIntro[form.illegalAcitivities][form.desc]}}</div>
          </el-form-item>

          <p>非法活动基础信息展示维度</p>
          <el-form-item title="非法活动基础信息展示维度">
            <el-checkbox-group v-model="form.basic_info">
              <el-checkbox label="1">非法活动活跃时间段</el-checkbox>
              <el-checkbox label="2">非法活动交易量统计</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <p>非法资金转移展示维度</p>
          <el-form-item title="非法资金转移展示维度">
            <el-checkbox-group v-model="form.money_transfer">
              <el-checkbox label="1">行业间资金流经情况</el-checkbox>
              <el-checkbox label="2">行业间资金沉积情况</el-checkbox>
              <el-checkbox label="3">重要成员情况</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <p>是否分析受害者的迁移情况</p>
          <el-form-item title="是否分析受害者的迁移情况">
            <el-checkbox-group v-model="form.victim_migration">
              <el-checkbox label="1">需要</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <p>指定比特币地址</p>
          <el-form-item title="指定比特币地址">
            <el-input type="text"
                      v-model="form.address"></el-input>
          </el-form-item>
          <p>指定交易哈希</p>
          <el-form-item title="指定交易哈希">
            <el-input type="text"
                      v-model="form.hash"></el-input>
          </el-form-item> -->
        </div>
        <el-form-item>
          <el-button type="primary"
                     @click="submit"
                     v-show="resetShow">提交分析请求</el-button>
          <el-button type="danger"
                     @click="onReset">重置分析维度</el-button>
        </el-form-item>
      </el-form>
      <el-collapse-transition>
      </el-collapse-transition>
    </div>
    <div class="illegalGraph">
      <Graph1_1 :data="data.time_window"
                v-show="show1_1" />
      <Graph1_2 :data="data.total"
                v-show="show1_2" />
      <Graph2_1 :data="data.money_flow"
                v-show="show2_1" />
      <Graph2_2 :data="data.money_flow"
                v-show="show2_2" />
      <Graph2_3 :data="data.money_flow"
                v-show="show2_3" />
      <Graph3_1 :data="data.user_flow"
                v-show="show3_1" />
    </div>
    </div>
    <a href="#go"></a>

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
import Footer from '../../../../components/nav/Footer'
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
          { text: 'Trojan', value: 'skycoin' },
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
      activity_name: {
        "ponzi": ['1getpaid.me', '1hourbtc.pw', '10PERCENTBTC', '120cycle', 'bestdoubler.eu',
          'bitcoindoubler.fund', 'BTC-doubler.com', 'BTC-doubler.us', 'ClearHash.net', 'CoinDouble',
          'Cryptory', 'ebitinvest.com', 'GrandAgoFinance', 'investorbitcoin.com', 'LaxoTrade', 'Leancy',
          'Longtermpaying', 'Nanoindustryinv.com', 'Ponzi.io', 'PonziCoin', 'RockwellPartners', 'Twelverized'],
        "theft": ['2012Trojan', '201250BTCTheft', 'AllinvainTheft',
          'BetcoinTheft', 'BIPSHack', 'Bitcash', 'BitcoinicaHack',
          'BitfloorTheft', 'CdeckerTheft', 'FlexcoinTheft', 'Inputs',
          'JustDiceIncident', 'LinodeHacks', 'PicoStocksHack', 'VircurexTheft'],
        "ransomware": ['Locky', 'APT', 'CryptConsole', 'CryptXXX', 'DMALockerv3',
          'Flyper', 'Globe', 'GlobeImposter', 'Globev3', 'JigSaw', 'NoobCrypt', 'Sam',
          'SamSam', 'VenusLocker', 'WannaCry', 'XLockerv5.0']
      },
      activityIntro: {
        ransomware: {
          WannaCry:
            '该病毒利用AES-128和RSA算法恶意加密用户文件以勒索比特币，使用Tor进行通讯，为WanaCrypt0r 1.0的变种。',
          Locky:
            '通过RSA-2048和AES-128算法对100多种文件类型进行加密，同时在每个存在加密文件的目录下释放一个名为_Locky_recover_instructions.txt的勒索提示文件。这是一类利用垃圾邮件进行传播的勒索软件，是首例具有中文提示的比特币勒索软件。'
        },
        theft: { skycoin: '2012年著名比特币交易所失窃活动', tft1: 'BIPS遭攻击，被窃走价值超100万美元比特币' },
        blackmail: { bkl1: '黑客是通过邮件数据库光撒网发送或针对性发送', bkl2: '汇总发送的邮件地址、代理服务器等信息可以用来定位黑客的网络地址、网络身份' },
        ponzi: { pz1: '诈骗贩子收钱后即卷款跑路、消失', pz2: '不法分子还会通过模仿比特币构建平台系统,操纵山寨币的产生及交易行情,吸引投资人购买' }
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
    Graph3_1,
    Footer
  },
  mounted () {
    // if (this.$cookies.get('illegal_form') != '') {
    //   this.form = this.$cookies.get('illegal_form')
    //   console.log('表单')
    //   console.log(this.$cookies.get('illegal_form'))
    //   this.data = this.$cookies.get('json')
    //   this.show()
    //   this.$cookies.set('json', '')
    //   this.$cookies.set('illegal_form', '')
    // } else {
    //   this.$cookies.set('json', '')
    //   this.$cookies.set('illegal_form', '')
    // }
  },
  methods: {
    submit () {
      this.resetShow = false
      var form = {
        user_id: this.$store.state.id,
        illegalAcitivitycategory: this.form.illegalAcitivities,
        illegalAcitivityName: this.form.desc,
        desc: this.form.desc,
        basic_info: JSON.stringify(this.form.basic_info),
        money_transfer: JSON.stringify(this.form.money_transfer),
        victim_migration: JSON.stringify(this.form.victim_migration),
        address: this.form.address,
        hash: this.form.hash
      }
      alert('任务请求已提交！')
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
.All{
  padding-top:8% ;
  padding-bottom: 5%;
  min-height: 700px;
}
.illegalActivitiyAnalysisMain {
  padding: 0 20%;
  font-family: PingFang SC;
  font-weight: bold;
}
.illegalGraph {
  width: 60%;
  margin: 10px 20%;
}
.buttonTXC{
  
  margin-top: 5%;
  margin-bottom: 3%;
}
h3{
  margin-bottom: 5%;
}
</style>

