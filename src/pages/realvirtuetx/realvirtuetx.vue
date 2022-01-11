<template>
  <div>
    <Nav />
    <div class="mainbody2">
      <h2>虚拟与现实匹配分析</h2>

      <div class="mainbody3">
        <h5>
          本功能将现实中的法币交易行为与虚拟货币的交易行为进行匹配，以此来挖掘更多不法分子持有的交易地址。同时，本功能也可以配合公安机关，进一步将银行账户信息与虚拟币地址的实际控制人进行关联。
        </h5>
        <el-form :model="form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="选择虚拟币种：">
                <el-select
                  v-model="checkboxGroup"
                  multiple
                  placeholder="请选择"
                  style="margin-left: 10px; width: 430px"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择法币种类：">
                <el-select
                  v-model="form.currency"
                  placeholder="请选择法币种类"
                  style="margin-left: 10px; width: 430px"
                >
                  <el-option
                    v-for="item in chainName"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="向前时间范围：">
                <el-input-number
                  v-model="form.frontDay"
                  :precision="0"
                  :min="0"
                  size="small"
                  :step="1"
                  style="width: 105px; margin-left: 5px"
                ></el-input-number
                >（天）
                <el-input-number
                  v-model="form.frontHour"
                  :precision="0"
                  size="small"
                  :min="0"
                  :max="23"
                  :step="1"
                  style="width: 105px; margin-left: 5px"
                ></el-input-number>
                (时)
                <el-input-number
                  v-model="form.frontMin"
                  :precision="0"
                  size="small"
                  :min="0"
                  :max="59"
                  :step="1"
                  style="width: 105px; margin-left: 15px"
                ></el-input-number>
                (分)
              </el-form-item>
              <el-form-item label="特定查询地址：">
                <el-input
                  v-model="form.address"
                  placeholder="请输入内容"
                  style="width: 430px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="向后时间范围：">
                <el-input-number
                  v-model="form.behindDay"
                  :precision="0"
                  size="small"
                  :min="0"
                  :step="1"
                  style="width: 105px; margin-left: 10px"
                ></el-input-number
                >（天）
                <el-input-number
                  v-model="form.behindHour"
                  :precision="0"
                  size="small"
                  :min="0"
                  :max="23"
                  :step="1"
                  style="width: 105px; margin-left: 5px"
                ></el-input-number>
                (时)
                <el-input-number
                  v-model="form.behindMin"
                  :precision="0"
                  size="small"
                  :min="0"
                  :max="59"
                  :step="1"
                  style="width: 105px; margin-left: 15px"
                ></el-input-number>
                (分)
              </el-form-item>

              <el-form-item label="浮动金额比例：">
                <el-input-number
                  v-model="form.perc"
                  :precision="2"
                  size="small"
                  :step="0.01"
                  :min="0"
                  style="width: 110px; margin-left: 10px"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row> </el-row>
          <el-row>
            <el-col :span="6">
              <!-- <label
                >上传文件
                <input
                  type="file"
                  id="file"
                  ref="file"
                  v-on:change="handleFileUpload()"
                />
              </label>
              <button v-on:click="submitFile()">Submit</button> -->

              <!-- <el-upload
                
                ref="refFile"
                :on-change="filelistchange"
                action="https://10.176.34.154:8000/home/"
                :file-list="fileList1"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="normal" type="primary"
                  >选取待分析文件</el-button
                >
                <el-button
                  style="margin-left: 30px"
                  size="normal"
                  type="success"
                  @click="Submit"
                  >提交</el-button
                >
              </el-upload> -->
              <input  type="file" id="files" ref="refFile" v-on:change="importCsv">
              <el-button
                  style="width:20%"
                  size="small"
                  type="success"
                  @click="Submit"
                  >提交</el-button
                >
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="3">
              <el-button
                type="text"
                @click="download"
                icon="el-icon-download "
                size="normal"
                class="loadButton"
                >点击下载样例待分析文件</el-button
              >
            </el-col>
          </el-row>
          <el-form-item> </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse'
import Nav from "../../components/nav/Nav";
import Axios from "axios"; // axios
export default {
  data() {
    return {
      chainName: [
        {
          value: 1,
          label: "人民币",
        },
        {
          value: 2,
          label: "美元",
        },
        {
          value: 3,
          label: "日元",
        },
        {
          value: 4,
          label: "韩元",
        },
      ],
      file: "",
      fileList: [],
      fileList1: [],
      options: [
        { value: "BTC", label: "BTC" },
        { value: "ETH", label: "ETH" },
        { value: "USDT", label: "USDT" },
      ],
      checkboxGroup: [],
      form: {
        fileName: "",
        fileData: [],
        perc: "0",
        // currency_type: "1",
        currency: "",
        user_id: "300005",
        address: "",
        frontDay: 0,
        frontHour: 0,
        frontMin: 0,
        frontTime: 0,
        behindDay: 0,
        behindHour: 0,
        behindMin: 0,
        behindTime: 0,
      },
    };
  },

  methods: {
    filelistchange(file,fileList){
      console.log("filelistchange")
      this.fileList1.push(file)
    },
    importCsv(){
        let selectedFile = null
        selectedFile = this.$refs.refFile.files[0];
        console.log(selectedFile)
        
        this.form.fileName = selectedFile.name;
        if (selectedFile === undefined){
          return
        }
        var reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = evt => {
          // 检查编码
          // let encoding = this.checkEncoding(evt.target.result);
          // 将csv转换成二维数组
          Papa.parse(selectedFile, {
            encoding:"ANSI",
            complete: res => {
              // UTF8 \r\n与\n混用时有可能会出问题
              let data = res.data;
              if (data[data.length - 1] == "") {
                //去除最后的空行
                data.pop();
              }
              console.log(data);  // data就是文件里面的数据
              this.form.fileData = data;
            }
          });
        };
      },

    download() {
      console.log("download");
      var url = "/static/test/suoyao.csv";
      var name = "示例文件.csv";
      console.log(url);

      this.$axios
        .get('http://10.176.34.154:8000/api/analysis/fuzzy_test_file')
        .then((res) => {
          // 以上两行代码获取服务端返回的文件名，当然也可以前端在此定义指定文件名 如：const fileName = test.xls
          let blob = new Blob([res.data], {
            type: "text/csv", // 将会被放入到 blob 中的数组内容的 MIME 类型,常用 ：application/vnd.ms-excel
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = name;
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        });
      // this.$axios.get({
      //   url: url,
      //   method: "GET",
      //   responseType: "blob",
      // }).then((response) => {
      //   console.log(response.data);
      //   var fileURL = window.URL.createObjectURL(new Blob([response.data]));

      //   var fileLink = document.createElement("a");

      //   fileLink.href = fileURL;

      //   fileLink.setAttribute("download", name);

      //   document.body.appendChild(fileLink);

      //   fileLink.click();
      // });
    },
    Submit() {
      alert("任务提交成功");
      this.form.virtuecurrency = this.checkboxGroup;
      console.log(this.fileList1)

      var submitform = this.form;
      submitform.frontTime =
        submitform.frontDay * 24 * 60 +
        submitform.frontHour * 60 +
        submitform.frontMin;
      submitform.behindTime =
        submitform.behindDay * 24 * 60 +
        submitform.behindHour * 60 +
        submitform.behindMin;
        submitform.user_id = this.$store.state.id
        delete submitform.behindDay;
        delete submitform.behindHour;
        delete submitform.behindMin;
        delete submitform.frontMin;
        delete submitform.frontDay;
        delete submitform.frontHour;

      console.log(submitform);
      let formData = new FormData()
      formData.append("file",this.$refs.refFile.files[0])
      formData.append("address",submitform.address)
      formData.append("frontTime",submitform.frontTime)
      formData.append("behindTime",submitform.behindTime)
      formData.append("virtuecurrency",submitform.virtuecurrency)
      formData.append("currency",submitform.currency)
      formData.append("user_id",submitform.user_id)
      formData.append("perc",submitform.perc)
      let form = {
        file: this.$refs.refFile.files[0],
        test_para: "123"
      }
      
      let Axios = this.$axios.create({
        // baseURL: 'http://10.176.34.154:8000/',
        timeout: 1000,
        headers: {
            "Content-Type": 'multipart/form-data;'
          }
      })
      Axios.post('http://10.176.34.154:8000/api/analysis/fuzzy_query',formData)
      .then(res=>{
        console.log(res.data)
      })

      // this.$axios
      // .post(
      //   "http://10.176.34.154:8000/api/analysis/test_upload_file",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": 'multipart/form-data;boundary = ' + new Date().getTime()
      //     }
      //   }
      // )
      // .then(function (response) {
      //   if (response.status === 200) {
      //     console.log(response.data);
      //   }
      // });

    },
    Submit11() {
      
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    progress(response, file, fileList) {
      console.log(fileList[0].raw);
      this.fileList = fileList;
      console.log(this.fileList);
    },
    getFile(event) {
      this.form.file = event.target.files[0];
      console.log(this.form.file);
    },
    submitForm(event) {
      event.preventDefault();
      console.log(this.form);
      // let formData = {};
      // formData["range"] = "2";
      // formData["perc"] = "1";
      // formData["user_id"] = "300005";
      // formData["currency_type"] = "1";
      // formData["file111"] = this.form.file;
      let formData = new FormData();
      // formData.append('range', this.form.range);
      // formData.append('perc', this.form.perc);
      // formData.append('user_id', this.form.user_id);
      // formData.append('currency_type', this.form.currency_type);
      formData.append("file111", this.form.file);

      let config = {
        headers: {
          "Content-Type":
            "multipart/form-data;boundary=--------------------------026225975727971465604466",
        },
      };
      console.log(formData.get("file111"));
      this.$axios
        .post(
          "http://10.176.34.154:8000/api/analysis/fuzzy_query",
          formData,
          config
        )
        .then(function (response) {
          if (response.status === 200) {
            console.log(response.data);
          }
        });
    },
  },
  components: {
    Nav,
  },
};
</script>

<style>
.mainbody2 {
  padding-top: 10%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
  font-family: "Montserrat", sans-serif;
}
.mainbody3 {
  margin-top: 3%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 3%;
}
.divAll {
  padding: 8%;
  min-height: 750px;
  padding-top: 9.5%;
  padding-bottom: 100px;
}
.All {
  min-height: 900px;
}
.el-upload-dragger {
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: none;
}
.upload-demo {
  height: 30px;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-direction: row-reverse;
}
.el-upload {
  border: none;
  background-color: transparent;
  height: 30px;
  width: 10%;
}
.el-upload-list {
  display: flex;
  width: 90%;
  justify-content: center;
  align-items: center;
}
.el-upload-list__item {
  margin-top: 0;
}
.el-upload-list__item:first-child {
  margin-top: 0;
}
</style>