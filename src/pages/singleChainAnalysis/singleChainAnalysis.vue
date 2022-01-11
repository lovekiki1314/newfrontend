<template>
  <div style="margin-bottom: 5%;">
    <Nav></Nav>
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">链内数据分析</h2>
        <span>Analysis</span>
      </div>

      <el-row :gutter="40">
        <el-col :span="8">
          <el-card shadow="hover" class="card">
            <router-link to="/singleChainAnalysis/Btc">
              <img src="../../assets/icon/btc.svg" class="imgAll" />
              <br /><br />
              <h3 class="title">比特币</h3>
              <p class="word">
                提供比特币的数据查询和智能分析服务
              </p></router-link
            >
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover" class="card">
            <router-link to="/singleChainAnalysis/Eth">
              <img src="../../assets/icon/eth.svg" class="imgAll" />
              <br /><br />
              <h3 class="title">以太坊</h3>
              <p class="word">
                提供以太坊的数据查询和智能分析服务
              </p></router-link
            >
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="card">
            <router-link to="/singleChainAnalysis/Eos">
              <img src="../../assets/icon/eos.svg" class="imgAll" />
              <br /><br />
              <h3 class="title">柚子币</h3>
              <p class="word">
                提供柚子币的数据查询和智能分析服务
              </p></router-link
            >
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- <Footer class="footer"> </Footer> -->
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
import Footer from "../../components/nav/Footer";
import router from "../../router";
export default {
  data() {
    return {
      Height: 0,
    };
  },
  components: {
    Nav,
    Footer,
  },
  mounted() {

  },
};
</script>

<style>
.container {
  width: 100%;
  min-height: 100%;
  height: 100%;
}
.section-header {
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  padding-top: 140px;
}

.section-header .section-title {
  font-size: 36px;
  margin-bottom: -40px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #263238;
  position: relative;
}

.section-header .section-title:before {
  content: "";
  position: absolute;
  bottom: -8px;
  width: 80px;
  height: 2px;
  background: #50a6fc;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  transition: 0.3s;
}
.section-header span {
  font-size: 60px;
  color: rgba(0, 0, 0, 0.07);
  z-index: 2;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  text-transform: capitalize;
  position: relative;
  /* position: absolute;
  top: 140px;
  left: 0; */
  width: 100%;
}

.card {
  cursor: pointer;
}
.word {
  color: black;
  text-decoration: none;
  padding-left: 33px;
}
.word:hover {
  color: dodgerblue;
}

.imgAll {
  margin-left: 55px;
}
.title {
  text-align: center;
}
.title:hover {
  color: dodgerblue;
}
.footer {
  margin-bottom: 0%;
}
</style>