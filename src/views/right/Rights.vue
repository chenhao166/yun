<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table表格 -->
    <el-table :data="rightsList" border style="width: 100%">
      <el-table-column type="index" width="180" align='center'></el-table-column>
      <el-table-column prop="authName" label="权限" width="380" align='center'></el-table-column>
      <el-table-column prop="path" label="路径" width="380" align='center'></el-table-column>
      <!-- <el-table-column prop="level" label="层级"></el-table-column> -->
      <el-table-column label="层级" width="380" align='center'>
        <template slot-scope="scope">
          <span>{{scope.row.level | levelFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRightsList } from '@/api/rights_index.js'
export default {
  data () {
    return {
      rightsList: []
    }
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  },
  methods: {
    getRightList () {
      getAllRightsList('list')
        .then(result => {
          console.log(result)
          this.rightsList = result.data.data
        })
    }
  },
  mounted () {
    this.getRightList()
  }
}
</script>

<style>
</style>
