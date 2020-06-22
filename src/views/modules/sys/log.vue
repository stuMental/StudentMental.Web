<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
      <el-form-item label="log_key">
        <el-input v-model="dataForm.key" placeholder="log_key" clearable></el-input>
      </el-form-item>
      <el-form-item label="log_type">
        <el-input v-model="dataForm.key" placeholder="log_type" clearable></el-input>
      </el-form-item>
      <el-form-item label="log_level">
        <el-input v-model="dataForm.key" placeholder="log_level" clearable></el-input>
      </el-form-item>
      <el-form-item label="查询时间">
        <el-date-picker
          v-model="dt"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
      <!-- <el-button>导出excel</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID"></el-table-column>
      <el-table-column prop="logType" header-align="center" align="center"  width="110" label="log_type"></el-table-column>
      <el-table-column prop="logKey" header-align="center" align="center"  width="80" label="log_key"></el-table-column>
      <el-table-column prop="logLevel" header-align="center" align="center" width="80"  label="log_level"></el-table-column>
      <el-table-column prop="time" sortable header-align="center" align="center"  width="160" label="time"></el-table-column>
      <el-table-column prop="msg" header-align="center" align="center" label="msg"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dt:[],
      dataForm: {
        logKey: "",
        logType:"",
        logLevel:"",
        startime:"",
        endtime:""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      if(this.dt.length>0)
      {
        this.dataForm.startime=this.dt[0]
        this.dataForm.endtime=this.dt[1]
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/log/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          logKey: this.dataForm.logKey,
          logType:this.dataForm.logType,
          logLevel:this.dataForm.logLevel,
          startime:this.dataForm.startime,
          endtime:this.dataForm.endtime
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    }
  }
};
</script>
