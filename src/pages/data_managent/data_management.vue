<template>
  <div>
    <Nav />
    <div class="divAll">
      <div class="section-header3">
        <h1 class="section-title">数据源管理</h1>
        <span>Dataset</span>
        <p class="section-subtitle">提供公链数据的下载导出、上传服务</p>
      </div>
      <br />
      <hr style="background-color: #50a6fc; height: 2px; border: none" />
      <br />
      <div class="section-header4">
        <h2 class="section-title">数据下载</h2>
      </div>
      <el-form ref="form" :model="downloadForm" label-width="150px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6" style="margin-left:2%;"
            ><div class="grid-content bg-purple">
              <el-form-item label="公链名称：">
                <el-select
                  v-model="downloadForm.currency"
                  placeholder="请选择公链名称"
                >
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
              <el-form-item label="待下载数据类型:">
                <el-select
                  v-model="downloadForm.data_type"
                  placeholder="请选择数据类型"
                >
                  <el-option
                    v-for="item in dataTypes"
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
                  v-model="downloadForm.start_date"
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

          <el-col :span="6"
            ><div class="grid-content bg-purple">
              <el-form-item label="请选择结束时间：">
                <el-date-picker
                  v-model="downloadForm.end_date"
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
        </el-row>
        <el-button
          type="primary"
          @click="download"
          icon="el-icon-download "
          class="loadButton"
          >点击下载</el-button
        >
      </el-form>

      <br />
      <br />
      <hr style="background-color: #50a6fc; height: 2px; border: none" />
      <br /><br /><br />


      <div class="section-header4">
        <h2 class="section-title">数据上传</h2>
      </div>
      <el-form ref="form" :model="uploadForm" label-width="150px">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6"
            ><div class="grid-content bg-purple">
              <el-form-item label="公链名称：">
                <el-select
                  v-model="uploadForm.type"
                  placeholder="请选择公链名称"
                >
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
              <el-form-item label="待上传钱包地址:">
                <el-input
                  size="medium"
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                  placeholder="请输入钱包地址"
                  v-model="uploadForm.address"
                  style="width: 100%"
                >
                </el-input>
              </el-form-item></div
          ></el-col>

          <el-col :span="5"
            ><div class="grid-content bg-purple">
              <el-form-item label="标签类型：">
                <el-select
                  v-model="uploadForm.label"
                  placeholder="请选择地址标签种类"
                >
                  <el-option
                    v-for="item in labelType"
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
              <el-form-item label="上传信息:" style="margin-right: 5%">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  placeholder="请输入内容"
                  v-model="uploadForm.info"
                  style="margin-right: 5px"
                >
                </el-input>
              </el-form-item></div
          ></el-col>
        </el-row>

        <el-button
          type="primary"
          icon="el-icon-upload2"
          class="loadButton"
          @click="upload"
          >点击上传</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/nav/Nav";
import Footer from "../../components/nav/Footer";
export default {
  name: "data_management",
  components: { Nav, Footer },
  data() {
    return {
      range: [],
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      chainName: [
        {
          value: 1,
          label: "比特币",
        },
        {
          value: 2,
          label: "以太坊",
        },
        {
          value: 3,
          label: "柚子币",
        },
      ],
      labelType: [
        {
          value: 1,
          label: "勒索地址",
        },
        {
          value: 2,
          label: "欺诈地址",
        },
        {
          value: 3,
          label: "暗网",
        },
        {
          value: 4,
          label: "赌场",
        },
        {
          value: 5,
          label: "矿工",
        },
        {
          value: 6,
          label: "服务商",
        },
        {
          value: 7,
          label: "其他",
        },
      ],

      dataTypes: [
        {
          value: 1,
          label: "区块数据",
        },
        {
          value: 2,
          label: "交易数据",
        },
      ],

      fileList: [],
      downloadForm: {
        user_id: "",
        currency: "",
        data_type: "",
        start_date: "",
        end_date: "",
      },
      uploadForm: {
        type: "",
        info: "",
        address: "",
        label: "",
        user_id: this.$store.state.id,
      },

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

  methods: {
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
    download() {
      var cointocn = ["BTC", "ETH", "EOS"];
      var typetocn = ["block", "tx"];
      console.log(this.downloadForm);
      const fileName =
        cointocn[this.downloadForm.currency - 1] +
        "_" +
        typetocn[this.downloadForm.data_type - 1] +
        "_" +
        this.downloadForm.start_date +
        "_" +
        this.downloadForm.end_date +
        ".csv";
      if (this.downloadForm.start_date > this.downloadForm.end_date) {
        alert("输入日期非法");
      } else {
        this.$axios
          .post(
            "http://10.176.34.154:8000/api/userManagement/download",
            this.downloadForm
          )
          .then((res) => {
            const contentDisposition = res.headers["content-disposition"];

            // 以上两行代码获取服务端返回的文件名，当然也可以前端在此定义指定文件名 如：const fileName = test.xls
            let blob = new Blob([res.data], {
              type: "text/csv", // 将会被放入到 blob 中的数组内容的 MIME 类型,常用 ：application/vnd.ms-excel
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          });
      }
    },
    upload() {
      const addressReg = /^[a-zA-Z0-9_-]{26,34}$/;
      if (
        this.uploadForm.address === "" ||
        this.uploadForm.info === "" ||
        this.uploadForm.type === ""
      ) {
        alert("输入不能为空");
      } else if (!addressReg.test(this.uploadForm.address)) {
        alert("输入非法地址，请重新输入地址");
      } else {
        console.log(this.uploadForm);
        this.$axios
          .post(
            "http://10.176.34.154:8000/api/userManagement/upload",
            this.uploadForm,
            { "Content-Type": "application/json;charset=UTF-8" }
          )
          .then((res) => {
            console.log("后端获取结果");
            console.log(res.data);
            if (res.data.result) {
              this.$alert("上传成功", "上传提示", {
                confirmButtonText: "确定",
              });
            } else {
              this.$alert("上传失败", "上传提示", {
                confirmButtonText: "确定",
              });
            }
          });
      }
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
.divAll {
  min-height: 750px;
  padding-top: 7.5%;
  padding-bottom: 100px;
}
.loadButton {
  position: relative;
  left: 48%;
}
.inputText {
  width: 50%;
  margin-left: 24%;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
/*.bg-purple {*/
/*  background: #d3dce6;*/
/*}*/
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
/*.row-bg {*/
/*  padding: 10px 0;*/
/*  background-color: #f9fafc;*/
/*}*/

.section {
  padding: 80px 0;
}

.section-header3 {
  color: #fff;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}
.section-header4 {
  color: #fff;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}
.section-header3.section-title {
  font-size: 36px;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #263238;
  position: relative;
}
.section-header4.section-title {
  font-size: 16px;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  color: #263238;
  position: relative;
}
.section-subtitle {
  font-size: 20px;
  text-transform: uppercase;
  font-family: "Montserrat", sans-serif;
  color: #2c3e50;
}
.section-header3 .section-title:before {
  content: "";
  position: absolute;
  top:55%;
  width: 80px;
  height: 2px;
  background: #50a6fc;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  transition: 0.3s;
}

.section-header3 span {
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
</style>
