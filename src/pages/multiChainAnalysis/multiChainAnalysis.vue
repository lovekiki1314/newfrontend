<template>
  <div>
    <Nav></Nav>
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">跨链数据分析</h2>
        <span>Analysis</span>
      </div>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-card shadow="hover" class="multicard" @click="test" id="card1">
            <img src="../../assets/icon/btc.svg" class="imgAll" @click="test" />
            <br /><br />
            <h2 class="title" @click="test">比特币</h2>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card shadow="hover" class="multicard" @click="test2">
            <img
              src="../../assets/icon/eth.svg"
              class="imgAll"
              @click="test2"
            />
            <br /><br />
            <h2 class="title" @click="test2">以太坊</h2>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="multicard" @click="test1">
            <img
              src="../../assets/icon/eos.svg"
              class="imgAll"
              @click="test1"
            />
            <br /><br />
            <h2 class="title" @click="test1">柚子币</h2>
          </el-card>
        </el-col>
      </el-row>
      <div class="div1" @click="showthen">
        <el-card shadow="hover" class="multicard">
          <img src="../../assets/icon/区块链.svg" class="imgAll" />
          <br /><br />
          <h2 class="title">开始按钮</h2>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import Nav from "../../components/nav/Nav";
import Footer from "../../components/nav/Footer";
import router from "../../router";
export default {
  data() {
    return {
      card1: true,
      card2: true,
      card3: true,
    };
  },
  components: {
    Nav,
  },
  methods: {
    showthen() {
      alert("该部分仍在开发中，敬请期待");
    },
    test() {
      if (this.card1) {
        var a = document.getElementsByClassName("multicard");
        a[0].style.borderColor = "#50a6fc";
        this.card1 = false;
        console.log(this.card1);
      } else {
        var a = document.getElementsByClassName("multicard");
        a[0].style.borderColor = "white";
        this.card1 = true;
        console.log(this.card1);
      }
    },
    test1() {
      if (this.card2) {
        var a = document.getElementsByClassName("multicard");
        a[2].style.borderColor = "#50a6fc";

        this.card2 = false;
        console.log(this.card2);
      } else {
        var a = document.getElementsByClassName("multicard");
        a[2].style.borderColor = "white";
        this.card2 = true;
        console.log(this.card2);
      }
    },
    test2() {
      if (this.card3) {
        var a = document.getElementsByClassName("multicard");
        a[1].style.borderColor = "#50a6fc";
        a[1].style.borderSize = 1000;
        this.card3 = false;
        console.log(this.card3);
      } else {
        var a = document.getElementsByClassName("multicard");
        a[1].style.borderColor = "white";
        this.card3 = true;
        console.log(this.card3);
      }
    },
  },
};
</script>
<style>
.container {
  width: 100%;
  min-height: 700px;
  height: auto;
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
  /* position: absolute;
  top: 140px;
  left: 0; */
  width: 100%;
}

.multicard {
  cursor: pointer;
  border-color: white;
}

.word {
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
.div1 {
  margin: 30px auto;
  width: 31.5%;
}
</style>