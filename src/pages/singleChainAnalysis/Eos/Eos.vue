<template>
  <div class="hello">
    <Nav />

    <div class="section-header">
      <h1 class="section-title">链 上 数 据 分 析</h1>
      <span>EOS.IO</span>
      <h2 class="section-title1">柚子币</h2>
    </div>
    <p style="text-align: center; margin-top: -20px; font-size: 20px">
      提供区块链链内数据分析服务
    </p>
    <div class="row">
      <el-button type="primary" class="buttonall" id="button0" @click="all()"
        >所有服务</el-button
      >
      <el-button type="primary" class="buttonall" id="button1" @click="basic()"
        >基础数据查询</el-button
      >
      <el-button
        type="primary"
        class="buttonall"
        id="button2"
        @click="develop()"
        >柚子币发展情况</el-button
      >
      <el-button type="primary" class="buttonall" id="button3" @click="cost()"
        >柚子币花费情况</el-button
      >
    </div>

    <div class="section-block">
      <el-row :gutter="30">
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/eosBlockQuery"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币区块查询</p>
              <img class="box-img" src="../../../assets/figures/柚子区块.png" />
            </el-card>
          </router-link>
        </el-col>


        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/eosTransactionQuery"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币交易查询</p>
              <img
                id="img3"
                class="box-img"
                src="../../../assets/figures/柚子区块.png"
              />
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/eosAddressQuery"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币地址查询</p>
              <img
                id="img2"
                class="box-img"
                src="../../../assets/figures/柚子区块.png"
              />
            </el-card>
          </router-link>
        </el-col>
        
      </el-row>

      <el-row :gutter="30">
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/EosTransactionChart"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币交易信息统计</p>
              <img
                class="box-img1"
                src="../../../assets/figures/柚子交易统计.png"
              />
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/EosBlockChart"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子区块信息统计</p>
              <img
                id="img2"
                class="box-img1"
                src="../../../assets/figures/柚子区块信息统计.png"
              />
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/EosSourceChart"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币使用信息统计</p>
              <img
                id="img3"
                class="box-img1"
                src="../../../assets/figures/柚子币使用信息统计.png"
              />
            </el-card>
          </router-link>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/eosActive"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">活跃账户信息统计</p>
              <img
                id="img10"
                class="box-img1"
                src="../../../assets/figures/活跃.png"
              />
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link
            to="/singleChainAnalysis/Eos/EosPriceChart"
            class="section-img"
          >
            <el-card shadow="always" class="cardAll">
              <p class="img-p">柚子币历史行情统计</p>
              <img
                id="img10"
                class="box-img1"
                src="../../../assets/figures/EOS历史行情.png"
              />
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Nav from "../../../components/nav/Nav";
import Footer from "../../../components/nav/Footer";
export default {
  components: {
    Nav,
    Footer,
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  methods: {
    all() {
      const buttonall = document.getElementsByClassName("buttonall");
      for (let a = 0; a < buttonall.length; a++) {
        const b = buttonall[a];
        if (a === 0) {
          b.style.backgroundColor = "#60d3d3";
        } else {
          b.style.backgroundColor = "#50a6fc";
        }
      }
      var img = document.getElementsByClassName("section-img");
      for (var a = 0; a < img.length; a++) {
        var b = img[a];
        b.style.display = "inline";
      }
    },
    basic() {
      var buttonall = document.getElementsByClassName("buttonall");
      for (var a = 0; a < buttonall.length; a++) {
        var b = buttonall[a];
        if (a == 1) {
          b.style.backgroundColor = "#60d3d3";
        } else {
          b.style.backgroundColor = "#50a6fc";
        }
      }
      var img = document.getElementsByClassName("section-img");
      for (var a = 0; a < img.length; a++) {
        var b = img[a];
        if (a >= 0 && a <= 2) {
          b.style.display = "inline";
        } else {
          b.style.display = "none";
        }
      }
    },
    develop() {
      const buttonall = document.getElementsByClassName("buttonall");
      for (let a = 0; a < buttonall.length; a++) {
        const b = buttonall[a];
        if (a === 2) {
          b.style.backgroundColor = "#60d3d3";
        } else {
          b.style.backgroundColor = "#50a6fc";
        }
      }

      var img = document.getElementsByClassName("section-img");
      for (var a = 0; a < img.length; a++) {
        var b = img[a];
        if (a >= 3 && a <= 5) {
          b.style.display = "inline";
        } else {
          b.style.display = "none";
        }
      }
    },
    cost() {
      const buttonall = document.getElementsByClassName("buttonall");
      for (let a = 0; a < buttonall.length; a++) {
        const b = buttonall[a];
        if (a === 3) {
          b.style.backgroundColor = "#60d3d3";
        } else {
          b.style.backgroundColor = "#50a6fc";
        }
      }
      var img = document.getElementsByClassName("section-img");

      for (var a = 0; a < img.length; a++) {
        var b = img[a];
        if (a >= 6 && a <= 8) {
          b.style.display = "inline";
        } else {
          b.style.display = "none";
        }
      }
    },
    intel() {
      const buttonall = document.getElementsByClassName("buttonall");
      for (let a = 0; a < buttonall.length; a++) {
        const b = buttonall[a];
        if (a === 4) {
          b.style.backgroundColor = "#60d3d3";
        } else {
          b.style.backgroundColor = "#50a6fc";
        }
      }
      var img = document.getElementsByClassName("section-img");
      for (var a = 0; a < img.length; a++) {
        var b = img[a];
        if (a >= 9) {
          b.style.display = "inline";
        } else {
          b.style.display = "none";
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cardAll {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 15px;
  border-radius: 12.5%;
  height: 290px;
  padding-top: 10px;
  display: block;
}

.cardAll:hover {
  animation: mymove 0.5s;
  animation-fill-mode: forwards;
}
@keyframes mymove {
  form {
    transform: scale(0.7);
  }
  to {
    transform: scale(0.75);
  }
}
.img-p {
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  margin-bottom: -3px;
}
.box-img {
  /* margin-right: -150px;
  margin-top: -100px;
  transform: scale(0.7);
  overflow: hidden; */
  width: 100%;
  height: 95%;
  padding-bottom: 10px;
  margin-top: 3%;
  display: block;
}
.box-img1 {
  /* margin-right: -150px;
  margin-top: -100px;
  transform: scale(0.7);
  overflow: hidden; */
  width: 100%;
  height: 95%;
  margin-top: 3%;
  display: block;
}

.buttonall {
  font-size: 16px;
  width: 140px;
  height: 50px;
  border-radius: 30px;
  color: white;
  border-color: white;
}
.buttonall:hover {
  color: #0b6464;
  /*color: #457BF4;*/
}
.buttonall:focus {
  outline: 0;
}
.section-header {
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  padding-top: 140px;
}

.section-header .section-title {
  /* font-size: 36px; */
  margin-bottom: -40px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #263238;
  position: relative;
}
.section-header .section-title1 {
  /* font-size: 36px; */
  margin-top: -40px;
  margin-bottom: 30px;
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
  /* position: absolute;
  top: 140px;
  left: 0; */
  width: 100%;
}

.row {
  margin-left: 30%;
  margin-bottom: 150px;
  margin-top: 30px;
}
.section-block {
  margin-top: -7%;
  padding-left: 12.5%;
  padding-right: 12.5%;
  margin-bottom: 5%;
}
.section-img {
  display: inline;
}

#button0 {
  background-color: #60d3d3;
}

#button3 {
  width: 160px;
}

#button2 {
  width: 160px;
}

#button4 {
  width: 180px;
}
</style>
