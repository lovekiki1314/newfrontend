<template>
  <div>
    <Nav />
    <div class="mainbody2">
      <h2>恶意地址分析</h2>

      <div class="alist">
        <a-list
          class="demo-loadmore-list"
          bordered
          :grid="{ gutter: 16, column: 3 }"
          
          item-layout="horizontal"
          :data-source="data"
        >
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
                接收货币总量： {{ item.totalbitcoinReceive }}<br />
                恶意类型： {{ item.abuse_type }}
              </template>
              <a
                slot="extra"
                style="color: white"
                @click="downloadReport(item.address)"
                >获取分析报告</a
              >
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
export default {
  components: {
    Nav,
  },
  data() {
    return {
      data: [

        {
          address: "1NVLbQ7mpJvcdepyJtxDKuNA7GN7epRFJo",
          totalbitcoinReceive: "0.67635067  BTC",
          abuse_type: "blackmail scam",
        },
        {
          address: "19vGYNQyE2fqAqZHmhGRyWiQt1oMpUY1x4",
          totalbitcoinReceive: "0.00022189  BTC",
          abuse_type: "blackmail scam",
        },
        {
          address: "18Fh1FsMDRHn8WBYmVB3y7aqGpKD8zKigi",
          totalbitcoinReceive: "0.00022163  BTC",
          abuse_type: "blackmail scam、ransomware",
        },
        {
          address: "14ccJyKymCn8FcL5rhpAuuNEK3GUnjQtgx",
          balatotalbitcoinReceivence: "0.0550112  BTC",
          abuse_type: "blackmail scam、ransomware",
        },
        {
          address: "15f4AbrBjMiGMEuhnynZDz9bBdgWHdHpXC",
          totalbitcoinReceive: "0.18710696  BTC",
          abuse_type: "blackmail scam",
        },
        {
          address: "13cyEdT7kyH2f4j9xchvDGhv1o64MYNLUS",
          totalbitcoinReceive: "1.72932905  BTC",
          abuse_type: "blackmail scam、ransomware",
        },
        {
          address: "15Bqin1NqvvSAcVPWs3oHRhv6Ytgw15aka",
          totalbitcoinReceive: "0.0002577  BTC",
          abuse_type: "blackmail scam",
        },
        {
          address: "16LvSNnfr9Bgp9iJPa4Bm4JfpckBTB6Goh",
          totalbitcoinReceive: "24.003445  BTC",
          abuse_type: "other",
        },
        {
          address: "1GXBRWZaTqTEvxY2NzfdrMwYbPHqfWNNYE",
          totalbitcoinReceive: "0.262521  BTC",
          abuse_type: "sextortion、ransomware、blackmail scam",
        },
        {
          address: "13Y3nPW5fu2btSjEZdUCuV8bR86fJfaKFK",
          totalbitcoinReceive: "0.26086088  BTC",
          abuse_type: "blackmail scam、ransomware",
        },
      ],
    };
  },
  methods: {
    downloadReport(address) {
      console.log("download");
      var url = "/static/" + address + ".pdf";
      var name = address + ".pdf";
      console.log(url);
      this.$axios({
        url: url,

        method: "GET",

        responseType: "blob",
      }).then((response) => {
        console.log(response.data);
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));

        var fileLink = document.createElement("a");

        fileLink.href = fileURL;

        fileLink.setAttribute("download", name);

        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
  },
};
</script>

<style scoped>
.mainbody2 {
  padding-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
  font-family: "Montserrat", sans-serif;
}
.alist {
  margin-top: 3%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
}
.mainbody h2 {
  font-family: "Montserrat", sans-serif;
}
</style>