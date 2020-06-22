<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-row>
          <el-button v-if="isAuth('sys:dept:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-row>
        <el-row>
          <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick" highlight-current></el-tree>
        </el-row>
      </el-col>
      <el-col :span="19">
        <el-tabs v-model="targetName" type="border-card">
          <el-tab-pane label="摄像头信息">
            <Caminfos ref="caminfos" showbutton="true"></Caminfos>
          </el-tab-pane>
          <el-tab-pane label="学生信息">
            <studentclas ref="studentclas" showbutton="true"></studentclas>
          </el-tab-pane>
          <el-tab-pane label="课程信息">
            <classtable ref="classtable" showbutton="true"></classtable>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>

</template>

<script>
import AddOrUpdate from "./dept-add-or-update";
import Caminfos from "../eyereport/caminfos";
import studentclas from "../eyereport/studentclas";
import classtable from "../eyereport/classtable";
import { treeDataTranslate } from "@/utils";
export default {
  name: "datacenter",
  data() {
    return {
      addOrUpdateVisible: false,
      clsid: "0",
      targetName: 0,
      treedata: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  activated() {
    this.getDataList();
  },
  components: {
    Caminfos,
    studentclas,
    classtable,
    AddOrUpdate
  },
  methods: {
    handleNodeClick(data) {
      this.clsid = data.deptId;
      if (this.targetName == 0) {
         this.$refs.studentclas.getDataList(this.clsid);
        this.$refs.caminfos.getDataList(this.clsid);
      } else if (this.targetName == 1) {
         this.$refs.classtable.getDataList(this.clsid);
      } else {
      
      }
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    getDataList() {
      this.$http({
        url: this.$http.adornUrl("/sys/dept/list"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.treedata = treeDataTranslate(data, "deptId");
        //console.log(this.treedata);
        this.dataListLoading = false;
      });
    }
  }
};
</script>

<style   lang="scss">
.sys-datacenter {
  .el-tree-node:focus > .el-tree-node__content {
    background-color: rgb(245, 247, 250);
  }
}
</style>



