<template>
  <div>
    <Nav />
    <div class="mainbody2">
      <h2>公链图分析</h2>
      <br />
      <el-form ref="form" :model="form" label-width="150px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6" style="margin-left: 2%"
            ><div class="grid-content bg-purple">
              <el-form-item label="公链名称：">
                <el-select v-model="form.currency" placeholder="请选择公链名称">
                  <el-option
                    v-for="item in chainName"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item></div
          ></el-col>

          <el-col :span="6"
            ><div class="grid-content bg-purple">
              <el-form-item label="请选择开始时间:">
                <el-date-picker
                  v-model="form.start_date"
                  align="right"
                  type="date"
                  placeholder="请选择日期"
                  format="yyyy年 MM月 dd日"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDatePicker"
                >
                </el-date-picker>
              </el-form-item></div
          ></el-col>

          <el-col :span="5"
            ><div class="grid-content bg-purple">
              <el-form-item label="请选择结束时间：">
                <el-date-picker
                  v-model="form.end_date"
                  align="right"
                  type="date"
                  placeholder="请选择日期"
                  value-format="yyyy-MM-dd"
                  format="yyyy年 MM月 dd日"
                  :picker-options="endDatePicker"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4"
            ><div class="grid-content bg-purple">
              <el-button v-if="!show2" type="primary" @click="onSubmit" class="loadButton"
                >提交</el-button
              >
              <el-button v-else type="primary" @click="onSubmit" class="loadButton" :loading='true'
                >加载中</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form>
      <br />
      <br /><br /><br />
      <el-collapse>
        <div
          v-show="resResult"
          style="margin-left: 25%; margin-top: 3%; width: 60%"
        >
          <h4>交易活动图分析系数</h4>
          <table class="table">
            <tr>
              <td>节点数</td>
              <td>{{ info.Numberofnodes }}</td>
            </tr>
            <tr>
              <td>边数</td>
              <td>{{ info.Numberofedges }}</td>
            </tr>

            <tr>
              <td>平均入度</td>
              <td>{{ info.Averageindegree }}</td>
            </tr>

            <tr>
              <td>平均出度</td>
              <td>{{ info.Averageoutdegree }}</td>
            </tr>
            <tr>
              <td>平均聚类系数<sup>1</sup></td>
              <td>{{ info.pjjlxs }}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#50a6fc">(数值较低平均聚类程度不高)</span></td>
            </tr>
            <tr>
              <td>同配性系数<sup>2</sup></td>
              <td>{{ info.tpxxs }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#50a6fc">(显著，大度节点间连接倾向性更强)</span></td>
            </tr>
            <tr>
              <td>皮尔森系数<sup>3</sup></td>
              <td>{{ info.pesxs }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#50a6fc">(不显著)</span></td>
            </tr>
            <tr>
              <td>弱连通图个数<sup>4</sup></td>
              <td>{{ info.rlttgs }}</td>
            </tr>
            <tr>
              <td>最大弱连通图节点个数<sup>4</sup></td>
              <td>{{ info.zdrlttjdgs }}</td>
            </tr>
            <tr>
              <td>最大弱连通图边数</td>
              <td>{{ info.zdrltttbs }}</td>
            </tr>
            <tr>
              <td>强连通图图个数<sup>5</sup></td>
              <td>{{ info.qltttgs }}</td>
            </tr>
            <tr>
              <td>最大强连通图节点个数</td>
              <td>{{ info.zdqlttjdgs }}</td>
            </tr>
          </table>
          <span style="font-size: 1px"
            >[1]用于衡量网络图中平均每个节点聚集的程度。C接近1代表节点聚类合适，C接近-1代表节点聚类到相邻簇中更合适，C接近于0代表节点在两个簇交集处（-1&lt;C&lt;1）</span
          ><br />
          <span style="font-size: 1px"
            >[2]表示在网络图中度值相近的顶点互相连接的倾向。r>0代表度值较大节点倾向于与其他度值较大节点连接，r&lt;0代表度值较大节点倾向于与度值较小节点连接，|r|的大小代表倾向性强弱（-1&lt;r&lt;1）。
            <br /><span style="font-size: 1px"
              >[3]反应两个节点线性相关性的强弱程度。r>0代表节点间度值线性正相关，r&lt;0代表节点间度值线性负相关，r=0代表节点间度值非线性相关，|r|的大小代表相关性强弱（-1&lt;r&lt;1）。</span
            ><br />
            <span style="font-size: 1px"
              >[4]将有向图的有向边替换为无向边得到基图，若基图连通，则有向图是弱连通图。</span
            ><br />
            <span style="font-size: 1px"
              >[5]有向图中任意两个节点间都存在路径，则为强连通图。</span
            ><br />
          </span>
          <br /><br />
          <h4>地址交易活动有向图</h4>
          
          <img
            style="padding-left: 15%"
            src="../../assets/graph1.png"
          /><br /><span style="font-size: 1px"
              >通过力导向（Force-directed）布局算法进行绘图。将每个节点看作一个电荷，节点间存在斥力，同时节点被边牵连产生引力，节点不断位移后趋于平衡。
              交易量（节点的度）越大的节点在力的平衡状态下，更趋近于画布的中心位置；交易量越小的节点，受斥力影响越大，更趋近于画布的边缘；
              其中图中部分点连成了线说明这些节点存在聚集现象（线中的节点交易频繁，产生更大引力）。</span
            ><br />
          <br /><br />
          
          <h4>地址入度频次分布图</h4>
          <img
            style="padding-left: 15%"
            src="../../assets/graph2.png"
          /><br />
          <h4>地址入度频次top10节点</h4>
          <el-table
            :data="indegreeData"
            :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
            class="table"
            v-loading="loadingShow"
            element-loading-text="数据正在加载中..."
          >
            <el-table-column prop="address" label="节点地址"></el-table-column>
            <el-table-column prop="indegree" label="节点入度"></el-table-column>
          </el-table><br />
          <br /><br />
          
          <h4>地址出度频次分布图</h4>
          <img
            style="padding-left: 15%"
            src="../../assets/graph3.png"
          />
          <h4>地址出度频次top10节点</h4>
          <el-table
            :data="outdegreeData"
            :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
            class="table"
            v-loading="loadingShow"
            element-loading-text="数据正在加载中..."
          >
            <el-table-column prop="address" label="节点地址"></el-table-column>
            <el-table-column
              prop="outdegree"
              label="节点出度"
            ></el-table-column>
          </el-table><br /><br />
          <br /><br />
          
          <h4>地址度数频次分布图</h4>
          <img style="padding-left: 15%" src="../../assets/graph4.png" />
          <h4>地址度数频次top10节点</h4>
          <el-table
            :data="degreeData"
            :header-cell-style="{ background: '#50a6fc', color: '#ffffff' }"
            class="table"
            v-loading="loadingShow"
            element-loading-text="数据正在加载中..."
          >
            <el-table-column prop="address" label="节点地址"></el-table-column>
            <el-table-column prop="alldegree" label="节点度"></el-table-column>
          </el-table><br />

          <!-- <div id="mountNode"></div> -->
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
export default {
  data() {
    return {
      loadingShow: false,
      show2: false,
      info: {
        Numberofnodes: 645778,
        Numberofedges: 920005,
        Averageindegree: 1.4246,
        Averageoutdegree: 1.4246,
        pjjlxs: 0.238,
        tpxxs: 0.626,
        pesxs: 0.166,
        rlttgs: 27471,
        zdrlttjdgs: 563317,
        zdrltttbs: 862867,
        qltttgs: 603994,
        zdqlttjdgs: 38366,
      },
      range: [],
      resResult: false,
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      form: {
        currency: "",
        start_date: "2021-05-01",
        end_date: "2021-05-02",
      },
      indegreeData: [],
      outdegreeData: [],
      degreeData: [],
      chainName: [
        {
          value: 1,
          label: "以太坊",
        },
        {
          value: 2,
          label: "柚子币",
        },
        {
          value: 3,
          label: "泰达币",
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  components: {
    Nav,
  },
  methods: {
     sleep(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
},
    paint() {
      const width = 1000;
      const height = 400;
      const data = {
        nodes: [
          { id: "ha3timbsgyge", size: 40 },
          { id: "heztcnbugige", size: 40 },
          { id: "newdexpocket", size: 40 },
        ],
        edges: [
          {
            source: "heztcnbugige",
            target: "newdexpocket",
            type: "arc",
            value: 1699,
            style: {
              endArrow: true,
            },
          },
          {
            source: "newdexpocket",
            target: "heztcnbugige",
            type: "arc",
            value: 2125,
            style: {
              endArrow: true,
            },
          },

          {
            source: "ha3timbsgyge",
            target: "ha3timbsgyge",
            type: "loop",
            value: 144,
            style: {
              endArrow: true,
            },
          },
        ],
      };

      const graph = new this.$g6.Graph({
        container: "mountNode",
        width,
        height,
        modes: {
          default: [
            "drag-canvas",
            "drag-node",
            "zoom-canvas",
            {
              type: "tooltip", // 提示框
              formatText(model) {
                console.log(model);
                //提示框文本内容
                let text = "id: " + model.id;
                return text;
              },
            },
            {
              type: "edge-tooltip", // 提示框
              formatText(model) {
                //提示框文本内容
                let text1 = "相似度：" + 100 / model.length;
                return text1;
              },
            },
          ],
        },
        layout: {
          type: "force",
          preventOverlap: true,
          linkDistance: 100,
          nodeSize: 30,
        },
        linkCenter: true, // 使边连入节点的中心
      });
      graph.data(data);
      graph.render();
    },
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          let endTime = self.range[1];
          if (endTime) {
            // 如果结束时间不为空，则小于结束时间
            endTime = endTime.replace(/-/g, "/"); // 正则匹配转换，例如‘2020-01-01’ 转成 ‘2020/01/01’
            return time.getTime() > new Date(endTime).getTime();
          }
        },
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          let startTime = self.range[0];
          if (startTime) {
            // 如果开始时间不为空，则结束时间大于开始开始时间
            startTime = startTime.replace(/-/g, "/"); // 正则匹配转换，例如‘2020-01-01’ 转成 ‘2020/01/01’
            return time.getTime() < new Date(startTime).getTime();
          }
        },
      };
    },
    onSubmit() {
      this.loadingShow = true;
      this.show2 = true;
      console.log("123");
      let form = {
        start_date: "",
        end_date: "",
      };

      form.start_date = this.form.start_date;
      form.end_date = this.form.end_date;
      console.log(form);
      this.$axios
        .post("http://10.176.34.154:8000/api/analysis/graphAnalysis/eth", form)
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            this.indegreeData = res.data[0];
            this.outdegreeData = res.data[1];
            this.degreeData = res.data[2];
            this.loadingShow = false;
            this.sleep(2000)
            this.show2 = false
            this.resResult = true;
          }
        });
    },
  },
  watch: {
    range(val) {
      let endTime = val[1];
      if (endTime) {
        endTime = endTime.replace(/-/g, "/");
        val1[1] = new Date(
          new Date(endTime).getTime() + (3600 * 1000 * 24 - 1)
        );
        // 手动将日期设置endTime为当天的23:59:59
      }
    },
  },
};
</script>

<style scoped>
td {
  border: 1px solid gray;
  height: 35px;
}
th {
  height: 40px;
  background-color: #50a6fc;
  color: white;
  text-align: left;
  border: none;
}
table {
  border-collapse: collapse;
  width: 90%;
  margin: 0%;
  border: 1px solid #50a6fc;
  text-indent: 10px;
}
.divAll {
  min-height: 900px;
}
.loadButton {
  position: relative;
  left: 48%;
}
.mainbody2 {
  padding-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
  font-family: "Montserrat", sans-serif;
}
</style>