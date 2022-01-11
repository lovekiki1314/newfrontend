<template>
  <div name='top'>
    <Navigation />
    <div class="All" >
         
    <div class="homeBody_Single">
      <router-link to="/singleChainAnalysis/Btc"> <el-button type="primary" class="buttonTXC">返回上一页</el-button></router-link>
      <h3 style="text-align:center">比特币地址关联分析</h3>
      <el-form :model="form"
               :label-position="labelPosition">
        
        <el-form-item label="待查询的地址">
          <el-input type="text"
                    v-model="form.target_address"
                    placeholder="输入地址"
                    style="width:680px"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="多输入规则的权重">
              <el-input-number v-model="form.rule_weight"
                               :precision="2"
                               :step="0.1"
                               :min="0.01"
                               :max="1"
                               style="width:130px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="挖矿规则的权重">
              <el-input-number v-model="form.coinbase_weight"
                               :precision="2"
                               :step="0.1"
                               :min="0.01"
                               :max="1"
                               style="width:130px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="查询深度">
              <el-input-number v-model="form.deep"
                               :step="1"
                               style="width:130px"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19">
            <el-form-item label="找零规则的选择和权重">
              <el-select v-model="form.rule_map_key"
                         placeholder="选择规则"
                         style="width:200px;margin-right:30px">
                <el-option label="新地址"
                           value="na"></el-option>
                <el-option label="小数点限制"
                           value="dp"></el-option>
                <el-option label="剥离链"
                           value="pc"></el-option>
                <el-option label="锁定时间"
                           value="lt"></el-option>
                <el-option label="锁定时间_剥离链"
                           value="lt_pc"></el-option>
                <el-option label="锁定时间_小数点限制"
                           value="lt_dp"></el-option>
                <el-option label="锁定时间_新地址"
                           value="lt_na"></el-option>
                <el-option label="锁定时间_剥离链_小数点限制"
                           value="lt_pc_dp"></el-option>
                <el-option label="锁定时间_剥离链_新地址"
                           value="lt_pc_na"></el-option>
                <el-option label="锁定时间_剥离链_小数点限制_新地址"
                           value="lt_pc_dp_na"></el-option>
              </el-select>
              <el-input-number v-model="form.rule_map_weight"
                               :precision="2"
                               :step="0.1"
                               style="width:180px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary"
                       @click="onSubmit">提交</el-button>
          </el-col>
        </el-row>
        <el-form-item>
        </el-form-item>
      </el-form>
      <div>
        <div>地址聚类可视化</div>
      </div>
      <div id="container"></div>
      
    </div>
    </div>

  </div>
</template>

<script>
import Navigation from '../../../../components/nav/Nav.vue'
import store from '../../../../store'
import insertCss from 'insert-css'
import router from '../../../../router'
import Footer from '../../../../components/nav/Footer'
insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);
export default {
  data () {
    return {
      resetShow: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      addressList: [
        {
          address:'1tTPrttnGFzybBKAjV3dYTpx6Y7NxtA8L',
          amount:'1BTC',
          FirstTradingTime:'2016-06-01',
          LastTradingTime:'2017-07-01'
        }
      ],
      labelPosition: 'right',
      form: {
        target_address: '',
        rule_map_key: 'lt_pc_dp_na',
        rule_map_weight: '0.7',
        rule_weight: '0.99',
        coinbase_weight: '1',
        deep: '2'
      }
    }
  },
  components: {
    Navigation,Footer
  },
  mounted () {
    this.paint()
    if(this.$store.state.isLogin == false) {
        console.log('未登录')
        router.push('/')
      }
  },
  
  methods: {
    paint () {
      const width = 1500
      const height = 600
      const colors = [
        '#BDD2FD',
        '#BDEFDB',
        '#C2C8D5',
        '#FBE5A2',
        '#F6C3B7',
        '#B6E3F5',
        '#D3C6EA',
        '#FFD8B8',
        '#AAD8D8',
        '#FFD6E7',
      ];
      const strokes = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3',
      ];

      const graph = new this.$g6.Graph({
        container: 'container',
        width,
        height,
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas', {
            type: 'tooltip', // 提示框
            formatText (model) {
              // 提示框文本内容
              const text = 'id: ' + model.id;
              return text;
            }
          }],
        },
        layout: {
          // type: 'fruchterman',
          // maxIteration: 300,
          type: 'force',
          preventOverlap: true,
          nodeSize: 15,
          workerEnabled: true
        },
        animate: true,
        defaultNode: {
          size: 10,
          style: {
            lineWidth: 2,
            // stroke: '#5B8FF9',
            // fill: '#C6E5FF',
          },
        },
        defaultEdge: {
          size: 1,
          color: '#666',
          style: {
            opacity: 0.2,
          },
        },
        nodeStateStyles: {
          active: {
            stroke: '#5B8FF9',
            fill: '#C6E5FF',
            opacity: 1,
          },
          inactive: {
            opacity: 0.1,
          },
        },
        edgeStateStyles: {
          active: {
            stroke: '#000',
            opacity: 0.7
          },
        }
      });


      function handleNodeClick (event) {
        const item = event.item;
        // 聚焦当前点击的节点（把节点放到视口中心）
        const matrix = item.get('group').getMatrix();
        const point = {
          x: matrix[6],
          y: matrix[7],
        };
        console.log(point)
        const w = graph.get('width');
        const h = graph.get('height');
        // 找到视口中心
        const viewCenter = {
          x: w / 2,
          y: h / 2,
        };
        const modelCenter = graph.getPointByCanvas(viewCenter.x, viewCenter.y);
        let viewportMatrix = graph.get('group').getMatrix();
        if (!viewportMatrix) viewportMatrix = this.$g6.Util.mat3.create();
        // 画布平移的目标位置，最终目标是graph.translate(dx, dy);
        const dx = (modelCenter.x - point.x) * viewportMatrix[0];
        const dy = (modelCenter.y - point.y) * viewportMatrix[4];
        let lastX = 0;
        let lastY = 0;
        let newX = void 0;
        let newY = void 0;
        // 动画每次平移一点，直到目标位置
        console.log(dx)
        console.log(dy)
        graph.get('canvas').animate(
          ratio => {
            newX = dx * ratio;
            newY = dy * ratio;
            graph.translate(newX - lastX, newY - lastY);
            lastX = newX;
            lastY = newY;
          }, {
          duration: 300,
          easing: 'easeCubic',
        },
        );
      }

      // 监听节点上的click事件
      graph.on('node:click', handleNodeClick);
      // 从项目的public文件夹拿json数据
      this.$axios.get('./static/new.json')
        .then(res => {
          var temp = res.data
          var array = temp.dict
          var addresses = temp.addresses
          console.log(addresses)
          for (var i in addresses) {
            var addressTemp = {}
            addressTemp['address'] = addresses[i]
            this.addressList.push(addressTemp)
          }
          var data = res.data
          const nodes = data.nodes;
          const sonCountMap = new Map();
          let sonCountId = 0;
          nodes.forEach(function (node) {
            // sonCount
            if (node.sonCount && sonCountMap.get(node.sonCount) === undefined) {
              sonCountMap.set(node.sonCount, sonCountId);
              sonCountId++;
            }
            const cid = sonCountMap.get(node.sonCount);
            if (!node.style) {
              node.style = {};
            }
            node.style.fill = colors[cid % colors.length];
            node.style.stroke = strokes[cid % strokes.length];
          });
          graph.data(data);
          graph.render();
        });
    },
    onSubmit () {
      this.resetShow = true
      var rule_map_key = this.form.rule_map_key
      var rule_map_weight = this.form.rule_map_weight
      var rule_map = {}
      rule_map[rule_map_key] = rule_map_weight
      var form = {
        user_id: this.$store.state.id,
        target_address: this.form.target_address,
        rule_map: JSON.stringify(rule_map),
        rule_weight: this.form.rule_weight,
        coinbase_weight: this.form.coinbase_weight,
        deep: this.form.deep
      }
      this.$axios
        .post('http://10.176.34.154:8000/api/analysis/btc/cluster/add', form).then(res => {
          console.log(res.data)
        })
      alert('任务请求已提交！')
    }
  }
}
</script>

<style scoped>
.divAll{
  min-height: 700px;
}
.buttonTXC{
  
  margin-top: 2%;
  margin-bottom: 3%;
}
h3{
  margin-bottom: 3%;
}
.homeBody_Single {
  padding:8% ;
  font-weight: bold;
}
.homeBody_Single_Title {
  text-align: center;
  font-size: 18px;
}
#container {
  height: 600px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>