<template>
  <!-- 重要的行业成员情况 -->
  <div>
    <div id="community_container2_1">
      <h5>重要的行业成员情况</h5>
      <el-table :data="dataForRole.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                stripe
                style="width: 100%"
                :header-cell-style="{background:'#409EFF',color:'#ffffff'}">
        <el-table-column prop="role"
                         label="重要成员"
                         sortable
                         width="180">
        </el-table-column>
        <el-table-column prop="num"
                         label="交易次数"
                         sortable
                         width="180">
        </el-table-column>
        <el-table-column prop="amount"
                         sortable
                         label="交易金额">
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[2, 5, 10, 20]"
                     :page-size="pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="dataForRole.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1, //初始页
      pagesize: 5, //    每页的数据
      dataForRole: []
    }
  },
  props: {
    data: {}
  },
  methods: {
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size
      console.log(this.pagesize) //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
      console.log(this.currentPage) //点击第几页
    },
    paint (val) {
      var dataForRole = []
      for (var i in val) {
        var array = val[i]
        for (var key in array) {
          var temp = {}
          temp['role'] = key
          temp['num'] = array[key][0]
          temp['amount'] = array[key][1]
          dataForRole.push(temp)
        }
      }
      // var array = val[0]
      // console.log(array)
      console.log(dataForRole)
      var data = dataForRole
      // 去重加和num属性
      var result = {}
      for (i = 0; i < data.length; i++) {
        if (result[data[i].role]) {
          result[data[i].role] += data[i].num
        } else {
          result[data[i].role] = data[i].num
        }
      }
      // 去重加和amount属性
      var result1 = {}
      for (i = 0; i < data.length; i++) {
        if (result1[data[i].role]) {
          result1[data[i].role] += data[i].amount
        } else {
          result1[data[i].role] = data[i].amount
        }
      }
      data = []
      for (var key in result) {
        data.push({ role: key, num: result[key], amount: result1[key] })
      }
      console.log(data)
      this.dataForRole = data
    }
  },
  watch: {
    data: function (val) {
      this.paint(val)
    }
  }
}
</script>

<style scoped>
</style>
