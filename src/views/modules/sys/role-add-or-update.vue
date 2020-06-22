<template>
  <el-dialog width="1000px"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptName">
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
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择班年级" class="dept-list__input"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="10">
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item size="mini" label="数据授权">
        <el-tree
          :data="deptLists"
          :props="deptListTreePropss"
          node-key="deptId"
          ref="deptListTrees"
          :default-expand-all="false"
          show-checkbox>
        </el-tree>
      </el-form-item>
        </el-col>
      </el-row>
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
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        deptLists: [],
        deptListTreePropss: {
          label: 'name',
          children: 'children'
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleName: '',
          remark: '',
          deptName: '',
          deptId: 0
        },
        dataRule: {
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '部门不能为空', trigger: 'blur' }
          ]
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/dept/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'deptId')
          this.deptLists = this.deptList
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/menu/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.menuList = treeDataTranslate(data, 'menuId')
          }).then(() => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
              this.$refs.menuListTree.setCheckedKeys([])
              this.$refs.deptListTrees.setCheckedKeys([])
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.roleName = data.role.roleName
                  this.dataForm.remark = data.role.remark
                  this.dataForm.deptId = data.role.deptId
                  var idx = data.role.menuIdList.indexOf(this.tempKey)
                  if (idx !== -1) {
                    data.role.menuIdList.splice(idx, data.role.menuIdList.length - idx)
                  }
                  var idxs = data.role.deptIdList.indexOf(this.tempKey)
                  if (idxs !== -1) {
                    data.role.deptIdList.splice(idxs, data.role.deptIdList.length - idxs)
                  }
                  this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
                  this.$refs.deptListTrees.setCheckedKeys(data.role.deptIdList)
                }
              })
              this.deptListTreeSetCurrentNode()
            } else {
              this.deptListTreeSetCurrentNode()
            }
          })
        })
      },
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
      this.$refs["deptListPopover"].doClose();
      },
      // 菜单树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
       // console.log(this.$refs.deptListTrees.getCheckedKeys())
        //console.log(this.$refs.deptListTrees.getHalfCheckedKeys())
        //console.log([].concat(this.$refs.deptListTrees.getCheckedKeys(), [this.tempKey], this.$refs.deptListTrees.getHalfCheckedKeys()));
        //return
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //console.log(this.dataForm)
            this.$http({
              url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'roleId': this.dataForm.id || undefined,
                'roleName': this.dataForm.roleName,
                'remark': this.dataForm.remark,
                'deptId': this.dataForm.deptId,
                'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
                'deptIdList': [].concat(this.$refs.deptListTrees.getCheckedKeys(), [this.tempKey])
              
              //  'deptIdList': [].concat(this.$refs.deptListTrees.getCheckedKeys(), [this.tempKey], this.$refs.deptListTrees.getHalfCheckedKeys())
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