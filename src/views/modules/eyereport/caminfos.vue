
<template>
  <div>
    <div v-show="show" style="padding-bottom:20px">
      <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
    </div>
    <div>
      <el-table :data="dataList" border style="width: 100%;"  @selection-change="selectionChangeHandle">
        <el-table-column v-if="show" type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="camera_id" header-align="center" align="center" width="80" label="摄像头ID">
        </el-table-column>
        <el-table-column prop="camera_addr" header-align="center" align="center" label="摄像头地址">
        </el-table-column>
        <el-table-column v-if="!show" prop="class_id" header-align="center" align="center" label="班级ID">
        </el-table-column>
        <el-table-column v-if="!show" prop="class_name" header-align="center" align="center" label="班级名称">
        </el-table-column>
        <el-table-column v-if="!show" prop="grade_name" header-align="center" align="center" label="年级名称">
        </el-table-column>
        <el-table-column prop="dt" header-align="center" align="center" label="录入日期">
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="show">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.camera_id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.camera_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
       <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList(clsid)"></add-or-update>
    </div>
  </div>
</template>

<script>
import AddOrUpdate from './caminfos-add-or-update'
export default {  
  name: "caminfos",
  props: {
    showbutton: {
      type: String,
      default: "false"
    }
  },
   components: {
      AddOrUpdate
    },
  data() {
    return {
      show: this.showbutton == "true" ? true : false,
      clsid:0,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      addOrUpdateVisible: false,
      dataListSelections: []
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.clsid)
        })
      },
    // 获取数据列表
    getDataList(id) {
      this.clsid=id||0;
      this.$http({
        url: this.$http.adornUrl("/eyereportdata/sccinfo/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          dept_id:this.clsid
        })
      }).then(({ data }) => {
        //console.log(data);
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      })
    },
     // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      //删除
    deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.camera_id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/eyereportdata/sccinfo/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList(this.clsid)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList(this.clsid);
    },

    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList(this.clsid);
    }
  }
};
</script>

