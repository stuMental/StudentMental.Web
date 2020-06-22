<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item label="班年级" prop="deptName">
          <el-popover placement="bottom-start" trigger="click" ref="deptpopover">
            <el-tree
              :data="deptList"
              :props="deptListTreeProps"
              node-key="deptId"
              ref="deptListTree"
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false"
            ></el-tree>
            <el-input
              v-model="dataForm.deptName"
              slot="reference"
              :readonly="true"
              placeholder="点击选择班年级"
            ></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="是否有照片" prop="isphon" >
          <el-select v-model="dataForm.isphon"  >
            <el-option label="所有" value="0"></el-option>
            <el-option label="有照片" value="1"></el-option>
            <el-option label="无照片" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号" prop="studentnumber" >
          <el-input v-model="dataForm.studentnumber"  placeholder=""></el-input>
        </el-form-item>
        <el-button @click="query" :loading="false">查询</el-button>
        <el-button @click="addOrUpdateHandle(1)" :loading="false">新增</el-button>
        <el-button @click="pholist" :loading="false">证件照批量上传</el-button>
      </el-form>
    </div>
    <el-table :data="dataList" border v-loading="dataListLoading"> 
      <el-table-column prop="studentNumber" header-align="center" align="center" label="学号"></el-table-column>
      <el-table-column prop="studentName" header-align="center" align="center" label="学生姓名"></el-table-column>
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:dept:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
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
     <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="query()"></add-or-update>
     <studentmanger v-if="studentmangerVisble" ref="studentManger" @refreshDataList="query()"></studentmanger>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import AddOrUpdate from './studentlist-add-or-update'
import studentmanger from "./studentmanger"
export default {
  data() {
    return {
        dataListLoading:false,
      addOrUpdateVisible: false,
      studentmangerVisble:false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataForm: {
        deptName: "",
        deptId: 0,
        isphon: "0"
      },
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  components: {
    AddOrUpdate,
    studentmanger
  },
  mounted() {
    this.init();
  },
  methods: {
    pholist(){
      this.studentmangerVisble=true
      this.$nextTick(()=>{
        this.$refs.studentManger.init();
      })
    },
        addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
    init() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.deptList = treeDataTranslate(data.deptList, "deptId");
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.query();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.query();
    },
    query() {
      // console.log(this.dataForm)
     // return
        this.dataListLoading=true
      this.$http({
        url: this.$http.adornUrl("/course/studentall"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          deptId: this.dataForm.deptId,
          isphon:this.dataForm.isphon,
          student_number:this.dataForm.studentnumber
        })
      }).then(({ data }) => {
          this.dataListLoading=false
        if (data && data.code === 0) {
          this.dataList = data.data.list;
           this.totalPage = data.data.totalCount;
        } else {
          this.dataListLoading=false
             this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
      });
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.$refs["deptpopover"].doClose();
    }
  }
};
</script>