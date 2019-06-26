<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮 -->
    <el-button
      type="success"
      plain
      style="margin-bottom:10px"
      @click="addRoleDialogFormVisible = true"
    >添加角色</el-button>

    <!-- 添加角色弹出框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogFormVisible" width='30%'>
      <el-form :model="addRoleForm" :label-width="'110px'">
        <el-form-item label="角色名称" >
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogFormVisible" width='36%'>
      <el-form :model="editRoleForm" :label-width="'110px'">
        <el-form-item label="角色名称" >
          <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" >
          <el-input v-model="editRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--带展开行table表格  -->
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="border-bottom:1px dashed #ccc;margin-top:15px"
          >
            <el-col :span="3">
              <div class="grid-content bg-purple">
                <el-tag closable :type="'success'">{{first.authName}}</el-tag>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="grid-content bg-purple-light">
                <el-row v-for="second in first.children" :key="second.id">
                  <el-col :span="3">
                    <el-tag closable :type="'info'" style="margin-bottom:15px">{{second.authName}}</el-tag>
                  </el-col>
                  <el-col :span="21">
                    <el-tag
                      closable
                      :type="'success'"
                      style="margin-bottom:15px ;margin-right:15px"
                      v-for="third in second.children"
                      :key="third.id"
                      @close="removeSingleRight(scope.row,third.id)"
                    >{{third.authName}}</el-tag>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="scope.row.children.length === 0">没有任何数据，请先分配！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="180" align="center"></el-table-column>

      <el-table-column label="角色名称" prop="roleName" align="center" width="360"></el-table-column>
      <el-table-column label="描述" prop="roleDesc" align="center" width="360"></el-table-column>
      <el-table-column label="操作" align="center" width="310">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button size="mini" type="info" icon="el-icon-share" @click="showRoles(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column></el-table-column>
      <el-table-column></el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { getAllRightsList } from '@/api/rights_index.js'
import { getRolesList, removeRightById, addRoles, delRole, editRole } from '@/api/roles_index.js'
export default {
  data () {
    return {
      addRoleDialogFormVisible: false,
      // 添加角色
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色
      editRoleDialogFormVisible: false,
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      roleList: []
    }
  },
  methods: {
    //     getAllRights () {
    //       getAllRightsList('tree')
    //         .then(result => {
    //           console.log(result)
    //           // this.rightsList = result.data.data
    //         })
    //     },
    // 显示角色下拉列表
    async getRoles () {
      let result = await getRolesList()
      console.log(result)
      this.roleList = result.data.data
    },
    // 删除指定角色的指定权限
    async removeSingleRight (row, rid) {
      let result = await removeRightById(row.id, rid)
      // console.log(result)
      // console.log(row.id, rid)
      if (result.data.meta.status === 200) {
        row.children = result.data.data
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
      } else {
        this.$message({
          type: 'danger',
          message: result.data.meta.msg
        })
      }
    },
    // 添加角色
    async addRoleSubmit () {
      // let result = await addRoles({ roleName: this.addRoleForm.roleName, roleDesc: this.addRoleForm.roleDesc })
      let result = await addRoles(this.addRoleForm)
      console.log(result)
      if (result.data.meta.status === 201) {
        // 信息提示
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        // 角色数据刷新
        this.getRoles()
        // 弹框隐藏
        this.addRoleDialogFormVisible = false
        // 清空表单数据
        this.addRoleForm.roleName = ''
        this.addRoleForm.roleDesc = ''
      }
    },
    // 删除角色
    async del (id) {
      let result = await delRole(id)
      console.log(result)
      if (result.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: result.data.meta.msg
        })
        // 角色数据刷新
        this.getRoles()
      }
    },
    // 编辑角色
    edit (row) {
      this.editRoleDialogFormVisible = true
      console.log(row)
      this.editRoleForm.id = row.id
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
    },
    async editRoleSubmit () {
      // let result = await editRole(this.editRoleForm.id, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
      let result = await editRole(this.editRoleForm.id, this.editRoleForm)
      console.log(result)
      this.$message({
        type: 'success',
        message: '编辑成功'
      })
      // 角色数据刷新
      this.getRoles()
      this.editRoleDialogFormVisible = false
    }

  },
  mounted () {
    this.getRoles()
    //     this.getAllRights()
  }
}
</script>

<style>
</style>
