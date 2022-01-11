<template>
  <div id="container">
    <div v-if="this.click_flag!=''">
      <chart id="demo"
             height="450px"
             :option="option"></chart>

      <div v-if="this.show_flag=='p'">
        <h4>比特币地址余额分布明细：</h4>
        <b-table striped
                 hover
                 :items="items"
                 :fields="distribution_rank"></b-table>
        <h4>余额Top50地址详细信息</h4>
        <el-table :data="balancetop.slice((currentPage-1)*pagesize,currentPage*pagesize)">
            <el-table-column 
                  prop="address"
                  label="地址"
                  width="700"
            >
            <template slot-scope="scope">
                          <router-link :to="{ name: 'addressQuery', params: { msgKey: scope.row.address}}"
                          >{{scope.row.address}}</router-link>
                        </template>
            </el-table-column>
            <el-table-column 
                  prop="balance"
                  label="余额/BTC"
            ></el-table-column>
            <el-table-column 
                  prop="first_time"
                  label="首次交易时间"
            ></el-table-column>
            <el-table-column 
                  prop="last_time"
                  label="最近交易时间"
            ></el-table-column>
            <el-table-column 
                  prop="lable"
                  label="标签"
            ></el-table-column>
        </el-table>
        <el-pagination 
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-size="pagesize"
                   layout="total, prev, pager, next, jumper"
                   :total="balancetop.length">
        </el-pagination>
      </div>
     
      <div v-if="this.show_flag!='p'"
           class="date_picker_container"
           align="center">
        <label for="start_date">开始时间:</label>
        <el-date-picker v-model="form.start_date"
                        id="start_date"
                        :language="zh"
                        :picker-options="pickerOptions"></el-date-picker>
        <label for="end_date"
               style="margin-left:3%;">结束时间:</label>
        <el-date-picker v-model="form.end_date"
                        id="end_date"
                        :language="zh"
                        :picker-options="pickerOptions"></el-date-picker>
        <el-button type="primary"
                  id="srh_btn"
                  @click="validate_choose_date">查询</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import chart from './Echart'
import { zh } from 'vuejs-datepicker/dist/locale'
import moment from 'moment'

export default {
  name: 'home',
  data () {
    return {
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      balancetop: [],
      items: [],
      items1:[
        {
          key1:1,
          key2:2,
          key3:3,
          key4:4
        }
      ],
      distribution_rank: [
        {
          label: '余额区间',
          key: 'balance_interval',
          sortable: false
        },
        {
          label: '地址数目/个',
          key: 'address_count',
          sortable: true
        },
        {
          label: '累计余额/BTC',
          key: 'total_balance',
          sortable: true
        }
      ],
      amount_top: [
        {
          label:'地址',
          key: 'key1',
          sortable:false
        },
        {
          label:'余额',
          key: 'key2',
          sortable:true
        },
        {
          label:'首次交易时间',
          key: 'key3',
          sortable:true
        },
        {
          label:'最近交易时间',
          key: 'key4',
          sortable:true
        }
      ],
      option: {
        title: {
          text: ''
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        },
        legend: {
          data: [],
          x: 'right',
          y: 'top',
          orient: 'vertical',
          selected: {},
        },
        xAxis: {
          type: 'category',
          data: [],
          name: '22'
        },
        yAxis: {
          type: 'value',
          name: '33'
        },
        series: []
      },
      normal_start_date: undefined,
      normal_end_date: undefined,
      click_flag: '0',
      show_flag: '',
      whether_show_org: false,
      whether_show_click: false,
      whether_show_pie: false,
      new_address_curve: {},
      transaction_curve: {},
      block_curve: {},
      miner_fee: {},
      miner_fee_show: false,
      holding_time_curve: {},
      balance_distribution: {},
      unspent_distribution: {},

      history: {},
      form: {
        start_date: undefined, //日期格式的月份从0开始计数
        end_date: undefined,
        user_id : this.$store.state.id
      },
      zh: zh,
      pickerOptions: {
        disabledDate: time => {
          // return new Date(2019, 5, 1) < time || time < new Date(2009, 0, 12)
          time < new Date(2009, 0, 12)
        }
      }
    }
  },
  props: ['url_detail', 'miner_search_flag'],
  components: {
    chart
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
    judgeNoteShow () {
      var start_flag = this.form.start_date == this.normal_start_date
      var end_flag = this.form.end_date == this.normal_end_date
      if (start_flag && end_flag) {
        return true
      }
      return false
    },
    init_option () {
      this.option.title.text = ''
      this.option.tooltip.show = true
      this.option.tooltip.show = 'axis'
      this.option.tooltip.show = 'axis'
      this.option.legend = {
        data: [],
        x: 'right',
        y: 'top',
        orient: 'vertical',
        selected: {},
        selectedMode: 'single'
      }
      this.option.xAxis = {
        type: 'category',
        data: [],
        name: '22'
      }
      this.option.yAxis = {
        type: 'value',
        name: '33'
      }
      this.option.series = []
    },
    get: function (url, root_api = 'stats') {
      console.log('开始get' + url)
      this[url] = []
      if (Object.keys(this[url]).length === 0) {
        let _this = this
        this[url] = Object.assign({}, this[url], {
          title: {
            //标题
            text: '',
            x: 'center',
            y: 'top'
          },
          tooltip: {
            //鼠标悬浮工具提示
            show: true,
            trigger: 'axis'
          },
          legend: {
            //图例
            data: [],
            /*left:"10%",*/
            x: 'center',
            top: '8%',
            width: '61%',
            orient: 'horizontal',
            itemGap: 15,
            selected: {},
            selectedMode: 'single'
          },
          grid: {
            top: '22%',
            height: '73%'
          },
          xAxis: {
            type: 'category',
            
            data: '',
            name: '时间/日',
            axisLine: {
              show: true,
              symbol: [
                'none',
                'path://M5,20 L5,5 L8,8 L5,2 L2,8 L5,5 L5.3,6 L5.3,20'
              ],
              symbolOffset: -4,
              symbolSize: [35, 38]
            }
          },
          yAxis: {
            type: 'value',
            min: '',
            name: '',
            axisLine: {
              symbol: [
                'none',
                'path://M5,10 L5,5 L8,8 L5,2 L2,8 L5,5 L5.3,6 L5.3,20'
              ],
              symbolOffset: -1,
              symbolSize: [35, 35]
            }
          },
          series: []
        })
        var full_url = this.HOST + '/statistics/everyday/stats/eos/' + url
        var jsonpara = this.form
        this.$axios
          .post(full_url, jsonpara)
          .then(function (res) {
            console.log('发送了post')
            // console.log('111111')
            console.log(full_url)
            // console.log(jsonpara)
            console.log(res.data)
            let arr_test =  res.data.date
            let str =''
            let date_arr =[],
              svg_obj = {},
              svg_obj_key = [],
              svg_obj_key_origin = [] //横纵坐标
            let num = arr_test.length
            for(var i=0; i < num ; i++){
              str = arr_test[i].substring(0,10)
              console.log(str)
              date_arr.push(str)
            }
            var arr  = []
            switch (url) {
              case 'blocks': {
                _this[url].yAxis.min = 6000
                  arr[0] =  res.data['total_blocks']
                //1
                _this[url].title.text = '柚子币区块信息统计曲线'
                // _this[url].yAxis.name = '地址个数';
                svg_obj_key[0] = '每日区块总数（个）'
                
                break
              }
              case 'transactions': {
                _this[url].yAxis.min = 0
                  arr[0] =  res.data['total_trxs']
                  arr[1] = res.data['total_actions'] 
                  arr[2] = res.data['avg_block_trxs']
                  arr[3] =res.data['avg_trx_actions']
                //1
                _this[url].title.text = '柚子币交易信息统计曲线'
                // _this[url].yAxis.name = '地址个数';
                svg_obj_key[0] = '交易总数（次）'
                svg_obj_key[1] = '动作信息总数（次）'
                svg_obj_key[2] = '平均动作信息总数（次）'
                svg_obj_key[3] = '平均交易（次）'
                break
              }
              case 'source_usage': {
                _this[url].yAxis.min = 0
                  arr[3] =  res.data['total_net_usage']
                  arr[1] = res.data['total_cpu_usage'] 
                  arr[2] = res.data['avg_trx_net_usage']
                  arr[0] =res.data['avg_trx_cpu_usage']
                //1
                _this[url].title.text = '柚子币资源使用信息统计曲线'
                // _this[url].yAxis.name = '地址个数';
                svg_obj_key[3] = '网络使用量(words)'
                svg_obj_key[1] = 'cpu使用量(us)'
                svg_obj_key[2] = '交易平均网络使用量(words)'
                svg_obj_key[0] = '交易平均cpu使用量(us)'
                break
              }
              case 'price':{
                 _this[url].yAxis.min = 0
                 arr[4]=res.data['open']
                 arr[2]=res.data['high']
                 arr[1]=res.data['low']
                 arr[3]=res.data['close']
                 arr[0]=res.data['volume']
                _this[url].title.text = '柚子币历史行情统计曲线'
                // _this[url].yAxis.name = '地址个数';
                svg_obj_key[4] = '开盘价（美元）'
                svg_obj_key[2] = '日最高价（美元）'
                svg_obj_key[1] = '日最低价（美元）'
                svg_obj_key[3] = '收盘价（美元）'
                svg_obj_key[0] = '日成交额（美元）'   
                break     
               }
            }
            if (url !== 'balance_distribution') {
              //折线图通用部分
              _this[url].xAxis.show = true
              _this[url].yAxis.show = true
              let l = svg_obj_key.length
              _this[url].xAxis.data = [...date_arr]
              for (var i=svg_obj_key.length; i>=0;i--) {
                //设置每一条折线
                console.log(i)
                _this[url].series.push({
                  name: svg_obj_key[i],
                  data: arr[i],
                  type: 'line',
                  symbol: 'circle',
                  symbolSize: 4,
                  itemStyle: {
                    normal: {
                      color: '#386db3', //折线点的颜色
                      lineStyle: {
                        color: '#386db3' //折线的颜色
                      }
                    }
                  }
                })
                _this[url].legend.data.push(svg_obj_key[i]) //设置图例名称
                _this[url].legend.selected[svg_obj_key[i]] = false
              }
              _this[url].legend.selected[svg_obj_key[svg_obj_key.length-1]] = true // 默认选中图例第一个
            }
          })
          .then(function (err) {
            console.log('error', err)
          })
      }
      this.option = this[url]
      console.log('完成get' + url)
    },
    validate_choose_date: function () {
      this.click_flag = '1'
      this.show_flag = ''
      if (!this.form.start_date) {
        alert('请输入开始时间!')
        return
      } else if (!this.form.end_date) {
        alert('请输入结束时间!')
        return
      } else if (moment(this.form.start_date).isAfter(this.form.end_date)) {
        alert('结束时间必须晚于开始时间!')
        return
      }
      console.log('validate完成标识符展示判断')
      console.log(this.miner_search_flag)
      this.whether_show_get_before()

      // this.whether_show_get_before();
    },
    customFormatter (date) {
      return moment(date).format('YYYY-MM-DD') //格式化日期对象
    },
    miner_fee_operate: function () {
      this.switch_data('miner_fee')
      this.srh_data()
    },
    whether_show_get_before: function () {
      console.log('start before', this.click_flag)
      if (this.miner_search_flag == '1') {
        this.show_flag = 'm'
        if (this.click_flag == '0') {
          this.form.start_date = this.customFormatter(new Date(2019, 1, 10))
          this.form.end_date = this.customFormatter(new Date(2019, 2, 20))
          this.whether_show_org = true
          this.whether_show_click = false
          this.whether_show_pie = false
          this.normal_start_date = this.form.start_date
          this.normal_end_date = this.form.end_date
        }
        if (this.click_flag == '1') {
          this.whether_show_org = false
          this.whether_show_click = true
          this.whether_show_pie = false
          this.form.start_date = this.customFormatter(this.form.start_date)
          this.form.end_date = this.customFormatter(this.form.end_date)
          this.miner_fee_operate()
        }
      }
      if (this.miner_search_flag == '0') {
        this.show_flag = 'o'
        if (this.click_flag == '0') {
            this.form.start_date = this.customFormatter(new Date(2019, 1, 10))
            this.form.end_date = this.customFormatter(new Date(2019, 2, 20))

            this.whether_show_org = true
            this.whether_show_click = false
            this.whether_show_pie = false
            this.normal_start_date = this.form.start_date
            this.normal_end_date = this.form.end_date
        }
        if (this.click_flag == '1') {
          this.whether_show_org = false
          this.whether_show_click = true
          this.whether_show_pie = false
          this.form.start_date = this.customFormatter(this.form.start_date)
          this.form.end_date = this.customFormatter(this.form.end_date)
          this.get(this.url_detail)
        }
      }
      if (this.miner_search_flag == '2') {
        this.show_flag = 'p'
        this.whether_show_pie = true
        this.whether_show_org = false
        this.whether_show_click = false
        this.normal_start_date = this.form.start_date
        this.normal_end_date = this.form.end_date
      }
    }
  },
  mounted () {
    // this.click_flag='0';
    this.whether_show_get_before()
    if (this.show_flag == 'm') {
      this.miner_fee_operate()
    }
    if (this.show_flag == 'o') {
      this.get(this.url_detail)
    }
    if (this.show_flag == 'p') {
      this.get(this.url_detail)
    }
    console.log(this.show_flag)
    console.log(this.url_detail)
    console.log('finish mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  margin-top: 1vh;
}
#btn_container {
  margin: 2% 0 20% 8.6%;
}
.inner_container {
  width: 47%;
  display: inline-block;
}
.switch_btn {
  margin: 0 0 2vh 0;
  padding: 0;
}
.switch_btn:hover {
  cursor: pointer;
}
.switch_btn > span {
  text-decoration: underline;
}
.date_picker_container {
  margin-left: 8.6%;
  margin-top: 2%;
}

#srh_btn {
  width: 5vw;
  /*height:6vh;*/
  margin-left: 10%;
}
.vdp-datepicker {
  display: inline-block;
}
</style>
