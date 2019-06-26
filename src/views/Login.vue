<template>
  <div class="login">
    <div class="container">
      <el-form ref="login-Form" :model="loginForm" :rules="rules" label-width="0px" >
          <img src="../assets/avat.png" alt="" class="avatar">
        <el-form-item label="" prop='username'>
          <el-input v-model="loginForm.username" placeholder='用户名' prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop='password'>
          <el-input v-model="loginForm.password" placeholder='密码' type='password' prefix-icon="myicon myicon-key"
          @keyup.enter.native="loginSubmit('login-Form')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
          type="primary"
          class="login-btn"
          @click="loginSubmit('login-Form')"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/users_index.js'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // loginSubmit (fromname) {
    // //   console.log('submit!')
    //   this.$refs[fromname].validate((valid) => {
    //     if (valid) {
    //       console.log(1)
    //       login(this.loginForm)
    //         .then((result) => {
    //           // console.log(result)
    //           if (result.data.meta.status === 200) {
    //             localStorage.setItem('it-token', result.data.token)
    //             this.$router.push({ name: 'Home' })
    //           }
    //         })
    //     } else {
    //       console.log(2)
    //       this.$message.error('数据输入不合法')
    //       return false
    //     }
    //   })
    // }
    async loginSubmit (fromname) {
      let result = await login(this.loginForm)
      console.log(result)
      if (result.data.meta.status === 200) {
        console.log(1)
        localStorage.setItem('iutosystem_token', result.data.data.token)
        this.$router.push({ name: 'Home' })
      } else {
        console.log(2)
        this.$message.error('数据为己输入不合法')
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
