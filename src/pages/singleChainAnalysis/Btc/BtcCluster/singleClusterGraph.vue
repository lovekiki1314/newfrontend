<template>
  <div>
    <Navigation />
     <div class="divAll">
    <div class="homeBody_Single">
      <div>
        <el-table :data="addressList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                  stripe
                  style="width: 100%"
                  :header-cell-style="{background:'#409EFF',color:'#ffffff'}">
          <el-table-column prop="address"
                           label="地址">
                           <template slot-scope="scope">
                          <router-link :to="{ name: 'btcAddressQuery', params: { msgKey: scope.row.address}}"
                          >{{scope.row.address}}</router-link>
                        </template>
          </el-table-column>
        </el-table>
        <el-pagination 
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pagesize"
                       layout="total, prev, pager, next, jumper"
                       :total="addressList.length">
        </el-pagination>
      </div>
      <div id="container"></div>
    </div>
     </div>
  </div>
</template>

<script>
import Navigation from '../../../../components/nav/Nav'
import store from '../../../../store'
import insertCss from 'insert-css'
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
      des: '',
      resetShow: false,
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      addressList: [],
      labelPosition: 'right',
      form: {
        target_address: '',
        rule_map_key: '',
        rule_map_weight: '',
        rule_weight: '',
        coinbase_weight: '',
        deep: ''
      }
    }
  },
  components: {
    Navigation
  },
  mounted () {
    if (this.$cookies.get('focluster_formrm') != '') {
      this.paint()
      this.form = this.$cookies.get('cluster_form')
      console.log('表单')
      console.log(this.$cookies.get('cluster_form'))

      console.log(this.$cookies.get('task_id'))
      this.des = this.$cookies.get('cluster_form')
      // this.showGraph(this.$cookies.get('task_id'))
      this.$cookies.set('task_id', '')
      this.$cookies.set('cluster_form', '')
    } else {
      this.paint()
      this.$cookies.set('task_id', '')
      this.$cookies.set('cluster_form', '')
      alert(2)
    }
    // this.test()

  },
  methods: {
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
    paint () {
      const width = 1050
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
          default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'activate-relations', {
            type: 'tooltip', // 提示框
            formatText (model) {
              //提示框文本内容
              const text = 'id: ' + model.id + '     ' + '金额: ' + model.value + '     ' + '深度: ' + model.deep;
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
      this.$axios.post('http://10.176.34.154:8000/api/getTaskResult', {
        user_id: this.$store.state.id,
        task_id: this.$cookies.get('task_id'),
      }).then(res => {
        console.log('地址聚类结果')
        console.log(res.data)
        var temp = res.data
        var addresses = temp.address
        console.log(addresses)
        for (var i in addresses) {
          var addressTemp = {}
          addressTemp['address'] = addresses[i]
          this.addressList.push(addressTemp)
        }
        var data = res.data
          console.log('图的数据')
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
      })
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
    }
  }
}
</script>

<style scoped>
.divAll{
  min-height: 750px;
  padding-top: 7%;
}
.homeBody_Single {
  margin: 30px 20% 0 20%;
  font-weight: bold;
}
.homeBody_Single_Title {
  padding-left: 100px;
  font-size: 18px;
}
#container {
  height: 600px;
  position: relative;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>