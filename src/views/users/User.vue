<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 15px ">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        @keyup.enter.native="searchUser"
        class="input-with-select"
        style="width:300px"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        style="margin-left:10px"
        @click="addDialogFormVisible = true"
      >添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top: 15px ">
      <el-table-column type="index" width="110" align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" width="230" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="230" align="center"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="230" align="center"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column prop="role_name" label="角色" align="center"></el-table-column>

      <el-table-column prop="address" label="状态" width="160" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatu($event,scope.row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="address" label="操作">
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        <el-button type="info" icon="el-icon-share" size="mini"></el-button>
      </el-table-column>-->

      <el-table-column label="操作" width="330" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button size="mini" type="info" icon="el-icon-share" @click="showRoles(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹出 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" ref="editForm" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹出框 -->
    <el-dialog title="角色分配" :visible.sync="roleDialogFormVisible" width=30%>
      <el-form :model="roleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="roleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色ID" :label-width="formLabelWidth">
          <el-select v-model="roleForm.rid" placeholder="请选择要分配的角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style='margin-top:20px'>
    </el-pagination>
  </div>
</template>

<script>
import { getRolesList } from '@/api/roles_index.js'
import {
  getAllUserList,
  editUser,
  delUserById,
  updateUserStatuById,
  addUser
} from '@/api/users_index.js'
export default {
  data () {
    return {
      //  userstatu: ' mg_state',
      query: '',
      // 打开时默认的当前页码
      pagenum: 1,
      // 设置每页显示多少条信息
      pagesize: 10,
      // 设置一共有多少条信息，最终会根据获取的数据更新
      total: 1,
      userList: [],
      editDialogFormVisible: false,
      formLabelWidth: '80px',
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑操作验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: '请输入正确的邮箱地址'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[34578]\d{9}$/,
            message: '目前只支持中国大陆的手机号码'
          }
        ]
      },
      roleDialogFormVisible: false,
      roleForm: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 分布结构
    // 当用户修改每页显示的数量会触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    // 当修改当前页码 : 单击页码会触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },

    // 显示角色下拉列表
    async showRoles (row) {
      this.roleDialogFormVisible = true
      let result = await getRolesList()
      console.log(result)
      this.roleList = result.data.data
      // this.roleForm.username = result.data.data.roleName
      this.roleForm.username = row.username
      this.roleForm.id = row.id
      this.roleForm.rid = row.rid
      // this.item.label = result.data.data.roleName
    },
    // 实现搜索操作
    searchUser () {
      this.init()
    },
    // 添加用户
    addUserSubmit () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm).then(result => {
            console.log(result)
            if (result.data.meta.status === 201) {
              this.addDialogFormVisible = false
              this.$message({
                type: 'success',
                message: result.data.meta.msg
              })
              this.init()
              this.$refs['addForm'].resetFields()
            } else {
              this.$message({
                type: 'warning',
                message: result.data.meta.msg
              })
            }
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    // 修改用户状态
    changeStatu (type, id) {
      updateUserStatuById(id, type).then(result => {
        // console.log(result)
        if (result.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: result.data.meta.msg
          })
        }
      })
    },
    // 删除单个用户
    del (id) {
      this.$confirm(`此操作将永久删除id号为${id}的用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id).then(result => {
            console.log(result)
            if (result.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: result.data.meta.msg
              })
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: result.data.meta.msg
              })
            }
          })
        })
        // 单击取消会触发catch中的回调
        .catch(() => {
          this.$message({
            type: 'info',
            message: '己取消删除'
          })
        })
    },
    // 编辑用户
    editUser (row) {
      console.log(row)
      this.editDialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    // 实现编辑用户提交
    editSubmit (editForm) {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm).then(result => {
            console.log(result)
            this.init()
            this.editDialogFormVisible = false
            this.$message({
              type: 'success',
              message: result.data.meta.msg
            })
          })
        } else {
          this.$message({
            message: '用户输入不合法',
            type: 'warning'
          })
        }
      })
    },
    init () {
      getAllUserList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(result => {
        console.log(result)
        this.userList = result.data.data.users
        this.total = result.data.data.total
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
