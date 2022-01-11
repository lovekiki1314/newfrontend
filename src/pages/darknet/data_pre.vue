<template>
  <div>
    <Nav />
    <div>
      <div class="section-header">
       <h2 class="section-title">暗网数据分析</h2>
       <span>Darknet</span>
      </div>   
      <div class="tag11">
        <span>一个暗网市场是商业网站上的网络是通过经营地下网络，如Tor或I2P。他们主要是充当黑市场，销售或中介交易涉及毒品，网络攻击，武器，伪造货币，信用卡被盗细节，伪造证件，无证药品,类固醇，以及其他非法商品以及合法产品的销售。</span><br />
        <span>暗网市场经济的规模可能难以估计。一份经过审查的2013年分析显示，“丝绸之路”每天的总收入为30万美元，一年内可推算为超过1亿美元。来自后来市场的后续数据存在巨大差距，并且与分析多个市场相关的复杂性也很高。</span><br /><br />
        <el-tag
          style="margin-right: 5px"
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-button v-if="dynamicTags == ''" class="button-new-tag" size="" type="text"
          >请选择要查询的暗网市场</el-button
        >
      <el-select v-model="checkboxGroup" multiple placeholder="请选择"  style="margin-left:80px;width:420px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
      </el-select>
      <el-button
          class="button-new-tag"
          :loading="loadshow"
          @click="onSubmit"
          type="primary"
          style="margin-left: 15px"
          size="small"
        >
          确定</el-button
        >
      </div>
      <div class="boxgroup">
        <el-checkbox-group
          v-model="checkboxGroup"
          size="medium"
          @change="testchange"
          border
        >
          <el-checkbox label="AbraxasMarket" border></el-checkbox>
          <el-checkbox label="AgoraMarket" border></el-checkbox>
          <el-checkbox label="BabylonMarket" border></el-checkbox>
          <el-checkbox label="BlackBankMarket" border></el-checkbox>
          <el-checkbox label="BlueSkyMarketplace" border></el-checkbox>
          <el-checkbox label="CannabisRoadMarket" border></el-checkbox>
          <el-checkbox label="EvolutionMarket" border></el-checkbox>
          <el-checkbox label="MiddleEarthMarketplace" border></el-checkbox>
          <el-checkbox label="PandoraOpenMarket" border></el-checkbox>
          <el-checkbox label="SheepMarketplace" border></el-checkbox>
          <el-checkbox label="SilkRoad2Market" border></el-checkbox>
          <el-checkbox label="SilkRoadMarketplace" border></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div v-if="loadfirst" class="alist">
      <a-list
        class="demo-loadmore-list"
        bordered
        :grid="{ gutter: 16, column: 3 }"
        :loading="loading"
        item-layout="horizontal"
        :data-source="data"
      >
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{
            textAlign: 'center',
            marginTop: '12px',
            marginBottom: '24px',
            height: '32px',
            lineHeight: '32px',
          }"
        >
          <a-spin v-if="loadingMore" />
          <label v-else @click="onLoadMore"> 点击加载更多... </label>
        </div>
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card
            :title="item.address"

            style="width: 100%; margin-top: 2%"
            :headStyle="{
              color: 'white',
              backgroundColor: '#50a6fc',
            }"
            :bodyStyle="{
              color: '#50a6fc',
              fontsize: '10px',
            }"
          >
          <template>
            所属市场： {{ item.market }}<br />
            地址余额： {{ item.balance }} BTC<br />
            最新交易时间： {{ item.last_time }}<br />
            总交易次数： {{ item.total_times }}<br />
            转入次数： {{ item.receive_times }}<br />
            转入金额： {{ item.receive_amount }} BTC<br />
            发送次数： {{ item.send_times }}<br />
            发送金额： {{ item.send_amount }} BTC<br />
            
          </template>
          </a-card>
          
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
export default {
  data() {
    return {
      loadfirst: false,
      loading: false,
      loadingMore: false,
      showLoadingMore: false,
      data: [],
      cntt: 0,
      form: {
        market: [],
        cnt: 0,
      },
      loadshow: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      checkboxGroup: [],
      options:[
        {value:'AbraxasMarket' , label:'AbraxasMarket'},
        {value:'AgoraMarket' , label:'AgoraMarket'},
        {value:'BabylonMarket' , label:'BabylonMarket'},
        {value:'BlackBankMarket' , label:'BlackBankMarket'},
        {value:'BlueSkyMarketplace' , label:'BlueSkyMarketplace'},
        {value:'CannabisRoadMarket' , label:'CannabisRoadMarket'},
        {value:'EvolutionMarket' , label:'EvolutionMarket'},
        {value:'MiddleEarthMarketplace' , label:'MiddleEarthMarketplace'},
        {value:'PandoraOpenMarket' , label:'PandoraOpenMarket'},
        {value:'SheepMarketplace' , label:'SheepMarketplace'}, 
        {value:'SilkRoad2Market' , label:'SilkRoad2Market'},
        {value:'SilkRoadMarketplace' , label:'SilkRoadMarketplace'}, 
      ]
    };
  },
  components: {
    Nav,
  },
  methods: {
    onLoadMore() {
      this.loadingMore = true;
      var url = "http://10.176.34.154:8000/api/darknet/marketdata";
      this.cntt += 1;
      this.loadingMore = true;
      var form = {
        market: JSON.stringify(this.checkboxGroup),
        cnt: this.cntt,
      };
      console.log(form);
      this.$axios.post(url, form).then((res) => {
        this.data = this.data.concat(res.data.message);
        console.log(this.data);
        this.loadingMore = false;
        this.$nextTick(() => {
          console.log(res.data);
          if (res.data.result == true) {
            this.loadingMore = false;
          }
          window.dispatchEvent(new Event("resize"));
        });
      });
    },
    onSubmit() {
      var url = "http://10.176.34.154:8000/api/darknet/marketdata";
      this.loadshow = true
      // this.loading = true;
      console.log(this.cntt)
      console.log(this.checkboxGroup)

      // this.form.market = this.dynamicTags;
      // this.form.cnt = this.cntt;
      var form = {
        market: JSON.stringify(this.checkboxGroup),
        cnt: this.cntt,
      };
      console.log(form);
      this.$axios.post(url, form).then((res) => {
        console.log(res.data);
        this.data = res.data.message;
        if (res.data.result == true) {
          this.loading = false;
          this.loadfirst = true;
          this.loadshow = false;
          this.showLoadingMore = true;
        }
      });
    },
    testchange() {
      this.dynamicTags = this.checkboxGroup;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style scoped>
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
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  color: #263238;
  position: relative;
}

.section-header .section-title:before {
  content: '';
  position: absolute;
  bottom: -8px;
  width: 80px;
  height: 2px;
  background:  #50a6fc;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  transition: 0.3s;
}
.section-header span {
  font-size: 60px;
  color: rgba(0, 0, 0, 0.07);
  z-index: 2;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-transform: capitalize;
  /* position: absolute;
  top: 140px;
  left: 0; */
  width: 100%;
}
.alist {
  margin-top: 3%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
}
.tag11 {
  margin-left: 2%;

}
.boxgroup {
  margin-left: 2%;
  margin-top: 1%;
  display: none;
}
.button-new-tag {
  width: 90px;
  height: 1%;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>