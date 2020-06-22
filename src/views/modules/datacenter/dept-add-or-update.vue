<template>
  <el-dialog
    :title="!dataForm.deptId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-tag>说明：班级按照层级划分填入，如先增加院系/学校->年级->班级，树结构中上层目录代表最顶层结构</el-tag>
      <el-form-item label="班年级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="班年级名称"></el-input>
      </el-form-item>
      <el-form-item label="上级" prop="parentName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择上级班级" class="dept-list__input"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          deptId: 0,
          name: '',
          parentId: '',
          parentName: '',
          orderNum: ''
        },
        dataRule: {
          name: [
            { required: true, message: '班级名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级班级不能为空', trigger: 'change' }
          ]
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.deptId = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dept/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'deptId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.deptId) {
            // 新增
            this.deptListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/info/${this.dataForm.deptId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.deptId = data.dept.deptId
              this.dataForm.name = data.dept.name
              this.dataForm.parentId = data.dept.parentId
              this.dataForm.orderNum = data.dept.orderNum
              this.dataForm.parentName = data.dept.parentName
              this.deptListTreeSetCurrentNode()
            })
          }
        })
      },
      // 菜单树选中
      deptListTreeCurrentChangeHandle (data, node) {
       // console.log(data)
        this.dataForm.parentId = data.deptId
        this.dataForm.parentName = data.name
      this.$refs["deptListPopover"].doClose();
      },
      // 菜单树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/${!this.dataForm.deptId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'deptId': this.dataForm.deptId || undefined,
                'name': this.dataForm.name,
                'parentId': this.dataForm.parentId,
                'parentName': this.dataForm.parentName,
                'orderNum': this.dataForm.orderNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-menu {
    .dept-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
  }
</style>
