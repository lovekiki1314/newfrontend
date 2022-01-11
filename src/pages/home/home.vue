<template>
  <div>
    <Nav></Nav>
    <div class="main-content">
      <div id="top">
        <img src="../../assets/bg-1.jpg" style="width: 100%; height: 450px" />
      </div>
      <div style="position: absolute; width: 100%; top: 200px">
        <div class="block11" style="margin-left: 8%">
          <!-- 需要修改routerLink -->
          <a class="left" @click="go(1)">
            <h3>链内数据分析</h3>
            
          </a>
        </div>
        <div class="block11">
          <!-- 需要修改routerLink -->
          <a class="center" @click="go(2)">
            <h3>跨链数据分析</h3>
            
          </a>
        </div>
        <div class="block11">
          <!-- 需要修改routerLink -->
          <a class="right" @click="go(3)">
            <h3>数据源管理</h3>
            
          </a>
        </div>
        <!-- 引导到注册登录 -->
        <a class="startButton" href="../../../static/data_driving/dataDriving.html">即刻开始！</a>
      </div>
      <div class="content">
        <div class="section-header1">
          <h2>我们的服务</h2>
          <span>Services</span>
          <p>对公链的链内及链间数据进行分析</p>
        </div>
        <div class="section">
          <div style="padding: 2% 5% 0% 15%">
            <a-row>
              <!-- 第一个blcok -->

              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  popper-class="my-el-popover"
                  content="实时同步三条区块链的数据，提供区块、地址、交易数据的查询服务"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color1">
                          <a-icon type="search" />
                        </div>
                        <h4>链上数据查询</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第二个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="提供三条区块链的历史数据统计服务，例如每日交易量等，展现区块链整体的发展趋势"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color2">
                          <a-icon type="line-chart" />
                        </div>

                        <h4>历史数据行情</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第三个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="提供地址智能聚类服务，挖掘地址之间的关联，实现区块链地址去匿名"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color3">
                          <a-icon type="cluster" />
                        </div>

                        <h4>地址智能关联</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第四个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="集成主流的资金追踪算法，从四种维度分析资金流动情况，展示非法资金转移信息"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color4">
                          <a-icon type="monitor" />
                        </div>

                        <h4>资金追踪分析</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第五个blcok -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="首次引入“行业”概念描述网络中的模块化结构，从宏观经济角度分析区块链数据"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color5">
                          <a-icon type="global" />
                        </div>

                        <h4>行业活动分析</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第六个block -->
            </a-row>
          </div>
        </div>
        <div class="section">
          <div style="padding: 0% 5% 2.5% 25%">
            <a-row>
              <!-- 第一个blcok -->

              <!-- 第六个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="针对链上多种非法活动展开分析，展现其发展历程、资金转移方式等情况"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color6">
                          <a-icon type="close-circle" />
                        </div>

                        <h4>非法活动分析</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第七个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="根据多条链上的交易行为，挖掘不同区块链中地址的关联程度"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color7">
                          <a-icon type="api" />
                        </div>

                        <h4>跨链地址关联</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <!-- 第八个block -->
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="根据多条区块链中的交易数据，分析一个链上发生的活动对其他链的辐射影响"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color8">
                          <a-icon type="deployment-unit" />
                        </div>

                        <h4>跨链活动分析</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
              <a-col
                :xs="15"
                :sm="15"
                :md="{ span: 6, offset: 1 }"
                :lg="{ span: 6, offset: 1 }"
                :xl="{ span: 3, offset: 0.5 }"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  font-size="20px"
                  content="提供指定时间段的区块数据和交易数据下载"
                >
                  <label slot="reference">
                    <div class="sectionDiv">
                      <div class="inner-box">
                        <div class="icon color9">
                          <a-icon type="cloud-download" />
                        </div>

                        <h4>链上数据下载</h4>
                      </div>
                    </div></label
                  >
                </el-popover>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <div class="section2">
        <div>
          <div class="section-header2">
            <h2>准备好开始了吗？</h2>
            <p>在比特币 以太坊 柚子币区块链中<br />探索更多发现</p>
            <a class="button" @click="goTop()">点击查看更多</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
import Footer from "../../components/nav/Footer";
export default {
  name: "Home",
  components: { Footer, Nav },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      isLogin: this.$store.state.isLogin, // 修改为登录状态
    };
  },
  mounted() {
    this.$axios.get();
    if (sessionStorage.getItem("userid") && sessionStorage.getItem("isLogin")) {
      
      this.$store.state.isLogin = sessionStorage.getItem("isLogin");
      this.$store.state.id = sessionStorage.getItem("userid");
      this.$store.state.userName = sessionStorage.getItem("username");
      this.$store.state.isAdmin = sessionStorage.getItem("isAdmin");
      this.$router.push("/");
    } else {
      console.log("未登录");
      this.$router.push("/Login");
    }
  },
  methods: {
    test222() {
      console.log("2222");
    },
    goTop() {
      document.getElementById("top").scrollIntoView();
    },
    go(a) {
      if (a === 4) {
        this.$router.push("/login");
      } else if (!this.isLogin) {
        alert("请先登录");
        return;
      }
      switch (a) {
        // 根据router进行添加
        case 1:
          this.$router.push("/singleChainAnalysis");
          break;
        case 2:
          this.$router.push("/multiChainAnalysis");
          break;
        case 3:
          this.$router.push("/dataManagement");
          break;
      }
    },
  },
};
</script>

<style>
.el-popover{
  position: absolute;
  background: #50a6fc;
  min-width: 23%;
  width: 10%;
  border: 0px solid #50a6fc;
  padding: 12px;
  z-index: 2000;
  margin-right: 55px;
  color: #fff;
  line-height: 1.4;
  text-align: justify;
  font-size: 16px;
  word-break: break-all;
}
.el-popper[x-placement^="top"] .popper__arrow::after {
  bottom: -0.2px;
  margin-left: -6px;
  border-top-color: #50a6fc;

}
.main-content {
  width: 100%;
  min-height: 700px;
  height: auto;
}
.left {
  text-align: left;
}
.right {
  text-align: right;
}
.startButton {
  font-size: large;
  padding-left: 35px;
  padding-top: 8px;
  width: 150px;
  height: 50px;
  color: #fff;
  border: white 2px solid;
  border-radius: 25px;
  position: absolute;
  right: 46%;
  top: 100px;
}
.block11 {
  width: 28%;
  display: inline-block;
  text-align: center;
}
@keyframes scaleDraw {
  form {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}
.block11:hover {
  animation: scaleDraw 1s linear;
  animation-fill-mode: forwards;
}
.block11 h3 {
  font-size: x-large;
  color: white;
}
.block11 h4 {
  font-size: large;
  margin-top: -10px;
  color: white;
}
.button {
  margin-top: 20px;
  padding: 8px 0 16px 0;
  font-size: large;
  width: 150px;
  height: 50px;
  color: #fff;
  border: white 2px solid;
  border-radius: 25px;
  position: absolute;
  transform: translateX(-75px);
}
.content {
  width: 100%;
  margin-top: 75px;
  padding-right: 15px;
  padding-left: 15px;
  margin-bottom: -100px;
}
.section-header1 {
  color: #fff;
  text-align: center;
  position: relative;
}
.section-header1 span {
  font-size: 60px;
  color: rgba(0, 0, 0, 0.07);
  z-index: 2;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-transform: capitalize;
  position: absolute;
  top: 7px;
  left: 0;
  width: 100%;
}
.section-header1 p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 14px;
  color: #546e7a;
  line-height: 26px;
  font-family: "Open Sans", sans-serif;
  margin-bottom: 0;
}
.section-header1 h2 {
  font-size: xx-large;
  font-weight: 800;
}
.section-header1 h2:before {
  content: "";
  position: absolute;
  bottom: 35px;
  width: 80px;
  height: 2px;
  background: #50a6fc;
}

.section {
  width: 100%;
}
.sectionDiv {
  margin-bottom: 10%;
  /* width: 60%; */
  border: 1px solid #eaeaea;
}
.sectionDiv:hover {
  box-shadow: 0px 10px 50px 0px rgba(84, 110, 122, 0.35);
}
@keyframes changeBG {
  form {
    background-color: inherit;
  }
  to {
    background: transparent;
  }
}
.sectionDiv:hover i {
  animation: changeBG 0.3s linear;
  animation-fill-mode: forwards;
}
.inner-box {
  text-align: center;
  height: auto;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 30px;
}
.sectionDiv h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
}
.icon {
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.icon i {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 15px;
  font-size: 32px;
}
/* 图标颜色 */
.color1 i {
  background: #fae3e3;
  color: #d82928 !important;
}
.color2 i {
  background: #e6f8ed;
  color: #57d283 !important;
}
.color3 i {
  background: #e3eafa;
  color: #457bf4 !important;
}
.color4 i {
  background: #f3ead6;
  color: #f1a90a !important;
}
.color5 i {
  background: #e7e6ff;
  color: #7271ff !important;
}
.color6 i {
  background: #dedede;
  color: #35393d !important;
}
.color7 i {
  background: #c0d9ef;
  color: #32a4e5 !important;
}
.color8 i {
  background: #f1c1c1;
  color: #ea3047 !important;
}
.color9 i {
  background: #f3ebb2;
  color: #d9ad39 !important;
}

.section2 {
  margin-top: 75px;
  width: 100%;
  height: 250px;
  text-align: center;
  background-color: #f9f9f9;
}
.section-header2 {
  width: 100%;
  padding-top: 25px;
  margin-bottom: 150px;
}
.section2 a {
  font-size: medium;
  background-color: #50a6fc;
  padding: 12.5px;
  border: none;
  border-radius: 30px;
}
.section2 a:hover {
  color: white;
  background-color: #60d3d3;
}
</style>
