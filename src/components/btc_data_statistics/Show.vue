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
                  width="650"
            >
            <template slot-scope="scope">
                          <router-link :to="{ name: 'btcAddressQuery', params: { msgKey: scope.row.address}}"
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
      // if (url == 'history') {
      //   root_api = 'price'
      // }
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
            data: [],
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

        var top_url = this.HOST + '/statistics/everyday/' + root_api + '/btc/address/top_balance' 
        console.log(top_url)     //余额top50的接口URL
        var form = {
          user_id : this.$store.state.id
        }
        this.$axios
          .post(top_url,form).then(res => {
            if(res.data.result){
              var content = res.data.content
              console.log(content)
              this.balancetop = []
              for(var i in content){
                if(content[i]!=null){
                  var inputdata = content[i]
                  var temp = {}
                  temp['address'] = inputdata[0]
                  temp['balance'] = inputdata[1]
                  temp['first_time'] = inputdata[2]
                  temp['last_time'] = inputdata[3]
                  temp['lable'] = inputdata[4]
                  this.balancetop.push(temp)
                }
              }

            }
          })

        var full_url = this.HOST + '/statistics/everyday/' + root_api + '/btc/' + url
        // var full_url = 'http://10.176.34.154:8001/api/statistics/stats/transaction_curve'
        // if (url== 'new_address_curve'){
        //     this.form.start_date = this.customFormatter(new Date(2019, 0, 1))
        //     this.form.end_date = this.customFormatter(new Date(2019, 4, 1))
        //     // this.form.start_date = this.customFormatter()
        //     // this.form.end_date = this.customFormatter()
        // }
        var jsonpara = this.form
        console.log(jsonpara)
        this.$axios
          .post(full_url, jsonpara)
          .then(function (res) {
            console.log('发送了post')
            console.log(full_url)
            console.log(res.data)
            let date_arr = [],
              svg_obj = {},
              svg_obj_key = [],
              svg_obj_key_origin = [] //横纵坐标
            let xAxis_key //stats类的路由x轴用date,其他用_id(price类)
            if (root_api === 'stats') {
              if (url === 'miner_fee') xAxis_key = 'blk_timestamp'
              else xAxis_key = 'date'
            } else if (root_api === 'price') {
              xAxis_key = 'date'
            }
            let arr = res.data['contents']
            _this.items = arr
            for (let d in arr) {
              arr[d]['date'] = moment(arr[d]['date'] * 1000).format(
                'YYYY-MM-DD'
              )
            }
            for (let k in arr[0]) {
              //取date字段外的项
              if (k !== xAxis_key) {
                //svg_obj[k]=[];
                svg_obj_key.push(k)
              }
            }
            svg_obj_key_origin = [...svg_obj_key]
            // console.log(arr)
            // console.log(svg_obj)
            // console.log(svg_obj_key)
            // console.log(svg_obj_key_origin)
            switch (url) {
              case 'new_address_curve': {
                //1
                _this[url].title.text = '新比特币地址增长曲线'
                // _this[url].yAxis.name = '地址个数';
                svg_obj_key[0] = '地址数（个）'
                break
              }
              case 'transaction_curve': {
                //2
                _this[url].title.text = '每日交易情况曲线'
                // _this[url].yAxis.name = 'BTC';
                svg_obj_key[0] = '交易数量（笔）'
                svg_obj_key[1] = '累计比特币（BTC）'
                break
              }
              case 'block_curve': {
                //3
                _this[url].title.text =
                  '平均区块大小及区块内打包交易数量变化曲线'
                _this[url].yAxis_names = {
                  '(平均区块大小（字节）)': '字节',
                  '(打包交易数量（笔）)': '交易笔数'
                }
                svg_obj_key[0] = '平均区块大小（字节）'
                svg_obj_key[1] = '打包交易数量（笔）'
                break
              }
              case 'holding_time_curve': {
                //5
                _this[url].title.text = '已花费比特币的平均持有时间曲线'
                svg_obj_key[0] = '平均持有时间（日）'
                svg_obj_key[1] = '输出（笔）'
                break
              }
              case 'balance_distribution': {
                //6
                _this[url].title = [
                  {
                    text: '比特币地址余额分布图',
                    x: 'center',
                    y: 'top'
                  },
                  {
                    text: '不同余额区间下地址数占比分布',
                    top: '10%',
                    left: '25.5%',
                    textStyle: {
                      fontSize: 16
                    }
                  },
                  {
                    text: '不同余额区间下总余额占比分布',
                    top: '10%',
                    left: '55.5%',
                    textStyle: {
                      fontSize: 16
                    }
                  }
                ]
                _this[url].legend = {
                  data: [],
                  x: 'right',
                  y: 'top',
                  orient: 'vertical',
                  selected: {}
                }
                const pie_label = 'balance_interval'
                let pie_data = {}
                for (let k in arr[0]) {
                  if (k != pie_label && k != 'date') {
                    pie_data[k] = []
                  }
                }
                for (let obj of arr) {
                  for (let key in pie_data) {
                    pie_data[key].push([obj[pie_label], obj[key]])
                  }
                }

                let ratio = 35
                for (let [k, v] of Object.entries(pie_data)) {
                  let series_obj = {
                    name:
                      k === 'address_count'
                        ? '不同余额区间下地址数占比分布'
                        : '不同余额区间下总余额占比分布',
                    type: 'pie',
                    radius: '55%',
                    center: [ratio + '%', '60%'],
                    data: []
                  }
                  ratio += 30
                  let k_v_arr = v.sort()
                    ;[k_v_arr[0], k_v_arr[1]] = [k_v_arr[1], k_v_arr[0]] // 第一第二位交换位置
                  for (let [key, value] of k_v_arr) {
                    series_obj.data.push({ value: value, name: key })
                    _this[url].legend.data.push(key)
                  }
                  _this[url].series.push(series_obj)
                }
                //设置鼠标悬浮提示
                _this[url].tooltip = {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                }
                _this[url].calculable = true
                //_this[url].legend.icon='circle';
                _this[url].xAxis.show = false
                _this[url].yAxis.show = false
                break
              }
              case 'unspent_distribution': {
                //7
                _this[url].title.text = '长时间未花费比特币的数量分布曲线'
                svg_obj_key[0] = '未花费数量（笔）'
                svg_obj_key[1] = '未花费金额（BTC）'
                break
              }
              case 'price': {
                //8(对应API-12)
                _this[url].title.text = '比特币历史价格走势曲线'
                svg_obj_key[0] = '开盘价（美元）'
                svg_obj_key[1] = '收盘价（美元）'
                svg_obj_key[2] = '最高价（美元）'
                svg_obj_key[3] = '最低价（美元）'
                // svg_obj_key[4] = '平均价/美元'
                // svg_obj_key[5] = '比特币流通总金额/美元'
                break
              }
            }
            if (url !== 'balance_distribution') {
              //折线图通用部分
              _this[url].xAxis.show = true
              _this[url].yAxis.show = true
              let l = svg_obj_key.length
              for (let o of arr) {
                date_arr.push(o[xAxis_key])
                console.log(xAxis_key)
                for (let i = 0; i < l; i++) {
                  let k = svg_obj_key[i] //将date以外的每一项数据各存为一个数组
                  if (!Object.prototype.hasOwnProperty.call(svg_obj, k)) svg_obj[k] = []
                  svg_obj[k].push(o[svg_obj_key_origin[i]])
                }
              }
              if (url === 'holding_time_curve') {
                //第五个api秒转日
                let temp_arr = svg_obj[Object.keys(svg_obj)[0]]
                svg_obj[Object.keys(svg_obj)[0]] = temp_arr.map(x =>
                  Math.round(x / 86400)
                )
              }

              _this[url].xAxis.data = [...date_arr]
              // console.log(_this[url].xAxis.data)
              for (let k of svg_obj_key) {
                //设置每一条折线
                _this[url].series.push({
                  name: k,
                  data: svg_obj[k],
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
                _this[url].legend.data.push(k) //设置图例名称
                _this[url].legend.selected[k] = false
              }
              _this[url].legend.selected[svg_obj_key[0]] = true // 默认选中图例第一个
            }
          })
          .then(function (err) {
            console.log('error', err)
          })
      }
      this.option = this[url]
      console.log('完成get' + url)
    },
    switch_data: function (url) {
      if (url === 'miner_fee') {
        // this.miner_fee_show = true; //显示日期选择器的相关元素
        if (Object.keys(this[url]).length == 0)
          this[url] = Object.assign({}, this[url], {
            title: {
              text: '区块矿工费变化曲线',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              show: true,
              trigger: 'axis'
            },
            legend: {
              data: [],
              /*left:"10%",*/
              x: 'center',
              top: '8%',
              width: '45%',
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
              data: [],
              name: '时间戳',
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
        this.option = this[url]
      }
      console.log('完成switch_data')
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
    srh_data: function () {
      //查询按钮点击事件
      //获取当前选择的开始和结束日期,并格式化
      // const [start_date, end_date] = [
      //   this.customFormatter(this.form.start_date),
      //   this.customFormatter(moment(this.form.end_date).add(1, 'days'))
      // ]
      const url = 'miner_fee',
        xAxis_key = 'timestamp'
      let svg_obj_key = [],
        svg_obj_key_origin = [],
        svg_obj = {},
        date_arr = []
      //console.log(start_date,end_date);
      let _this = this
      console.time('请求消耗时间')

      //请求和处理的方法与普通折线图基本一致
      var full_url = this.HOST + '/statistics/everyday/stats/btc/miner_fee'
      var jsonpara = this.form
      console.log(full_url)
      console.log(jsonpara)
      this.$axios
        .post(full_url, jsonpara)
        .then(function (res) {
          _this[url].xAxis.show = true
          _this[url].yAxis.show = true
          let arr = res.data['contents']
          console.log(arr)
          for (let d in arr) {
            arr[d]['timestamp'] = moment(arr[d]['timestamp'] * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }
          var tmpName = [
            '总矿工费'
            // '最小矿工费',
            // '最大矿工费',
            // '平均矿工费',
            // '矿工费中位数',
            // '矿工费方差'
          ]
          
          for (let k in arr[0]) {
            //取date字段外的项
            if (k !== xAxis_key) {
              svg_obj_key.push(tmpName[0])
              svg_obj_key_origin.push(k)
              console.log(tmpName)
              tmpName.shift()
              
            }
          }
          
          let l = svg_obj_key.length
          console.log(xAxis_key)
          for (let o of arr) {
            date_arr.push(o[xAxis_key])
            for (let i = 0; i < l; i++) {
              let k = svg_obj_key[i] //将date以外的每一项数据各存为一个数组
              if (!Object.prototype.hasOwnProperty.call(svg_obj, k)) svg_obj[k] = []
              svg_obj[k].push(o[svg_obj_key_origin[i]])
            }
          }

          _this[url].xAxis.data = [...date_arr]
          console.log(date_arr)
          _this[url].series.length = 0
          _this[url].legend.data.length = 0
          for (let k of svg_obj_key) {
            //设置每一条折线
            _this[url].series.push({
              name: k,
              data: svg_obj[k],
              type: 'line'
            })
            _this[url].legend.data.push(k) //设置图例名称
            _this[url].legend.selected[k] = false
          }
          _this[url].legend.selected[svg_obj_key[0]] = true // 默认选中图例第一个
          console.timeEnd('处理消耗时间')
        })
        .then(function (err) { console.log(err) })
      console.log('完成srh_data' + url)
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
          this.form.start_date = this.customFormatter(new Date(2021, 8, 5))
          this.form.end_date = this.customFormatter(new Date(2021, 8, 5))
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
            this.form.start_date = this.customFormatter(new Date(2021, 4, 5))
            this.form.end_date = this.customFormatter(new Date(2021, 8, 5))

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
