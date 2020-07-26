<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="userName" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="班年级" prop="deptName" :class="{ 'is-required': !dataForm.id }">
        <el-popover ref="deptListPopover" placement="bottom-start" trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.deptName"
          v-popover:deptListPopover
          :readonly="true"
          placeholder="点击选择班年级"
          class="dept-list__input"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
          >{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row>
      <el-tabs>
        <el-tab-pane label="标准照信息">
          <studentpho ref="Studentpho" :username="dataForm.userName" @studentpho="studentphohange"></studentpho>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import { isEmail, isMobile } from "@/utils/validate";
import studentpho from "./studentpho";

export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (!this.dataForm.name && !/\S/.test(value)) {
        callback(new Error("姓名不能为空"));
      } else {
        callback();
      }
    };
    var validateUserName = (rule, value, callback) => {
      if (!this.dataForm.userName && !/\S/.test(value)) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    var validateDeptName = (rule, value, callback) => {
      if (!this.dataForm.deptName && !/\S/.test(value)) {
        callback(new Error("部门不能为空"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        userName: "",
        name: "",
        password: "",
        comfirmPassword: "",
        salt: "",
        email: "",
        mobile: "",
        deptName: "",
        deptId: 0,
        roleIdList: [],
        status: 1
      },
      deptList: [],
      deptListTreeProps: {
        label: "name",
        children: "children"
      },
      dataRule: {
        userName: [{ validator: validateUserName, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" }
        ],
        deptName: [{ validator: validateDeptName, trigger: "blur" }]
      },
      studentphodata: [],
    };
  },
  components: {
    studentpho
  },
  methods: {
    cancle() {
      this.visible = false;
      this.$refs["dataForm"].resetFields();
      this.$refs["Studentpho"].fileList = []
    },
    studentphohange(data) {
      this.studentphodata = [];
      data.forEach(element => {
        var values = {
          studentNumber: this.dataForm.studentNumber,
          imageId: element
        };
        this.studentphodata.push(values);
      });
      //console.log(this.studentphodata)
    },
    init(id, username) {
      this.dataForm.id = id || 0;
      this.dataForm.userName = username || '';
      // console.log("liuxxx", this.dataForm.id, this.dataForm.userName)
      this.visible = true;
      this.$nextTick(() => {
        setTimeout(() => {
          // console.log(this.$refs)
          // console.log(this.$refs.Studentpho)
          this.$refs.Studentpho.init(username)
        }, 50)
      });
      
      this.$http({
        url: this.$http.adornUrl("/sys/dept/select"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.deptList = treeDataTranslate(data.deptList, "deptId");
        })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/sys/role/select"),
            method: "get",
            params: this.$http.adornParams()
          })
            .then(({ data }) => {
              this.roleList = data && data.code === 0 ? data.list : [];
            })
            .then(() => {
              this.visible = true;
              this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
              });
            })
            .then(() => {
              if (!this.dataForm.id) {
                this.deptListTreeSetCurrentNode();
                    this.dataForm = {
                      id: 0,
                      userName: "",
                      name: "",
                      password: "",
                      comfirmPassword: "",
                      salt: "",
                      email: "",
                      mobile: "",
                      deptName: "",
                      deptId: 0,
                      roleIdList: [],
                      status: 1
                    };
              } else {
                this.$http({
                  url: this.$http.adornUrl(
                    `/sys/user/info/${this.dataForm.id}`
                  ),
                  method: "get",
                  params: this.$http.adornParams()
                }).then(({ data }) => {
                  if (data && data.code === 0) {
                    this.dataForm.userName = data.user.username;
                    this.dataForm.name = data.user.name;
                    this.dataForm.salt = data.user.salt;
                    this.dataForm.email = data.user.email;
                    this.dataForm.mobile = data.user.mobile;
                    this.dataForm.roleIdList = data.user.roleIdList;
                    this.dataForm.status = data.user.status;
                    this.dataForm.deptId = data.user.deptId;
                    this.dataForm.deptName = data.user.deptName;
                    this.deptListTreeSetCurrentNode();
                  } else {
                    this.dataForm = {
                      id: 0,
                      userName: "",
                      name: "",
                      password: "",
                      comfirmPassword: "",
                      salt: "",
                      email: "",
                      mobile: "",
                      deptName: "",
                      deptId: 0,
                      roleIdList: [],
                      status: 1
                    };
                  }
                });
              }
            });
        });
    },
    deptListTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.deptId;
      this.dataForm.deptName = data.name;
      this.$refs["deptListPopover"].doClose();
    },
    // 菜单树设置当前选中节点
    deptListTreeSetCurrentNode() {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId);
      this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})[
        "name"
      ];
    },
    // 表单提交
    dataFormSubmit() {
      // console.log(this.dataForm)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/sys/user/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              userInfo: {
                userId: this.dataForm.id || undefined,
                username: this.dataForm.userName,
                name: this.dataForm.name,
                password: this.dataForm.password,
                salt: this.dataForm.salt,
                email: this.dataForm.email,
                mobile: this.dataForm.mobile,
                status: this.dataForm.status,
                roleIdList: this.dataForm.roleIdList,
                deptId: this.dataForm.deptId,
              },
              studentphodata: this.studentphodata,
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
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