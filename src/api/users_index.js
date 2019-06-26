import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?获取token,传递
  // 1.获取token
  var token = localStorage.getItem('iutosystem_token')
  if (token) {
    // 2.在发送请求的时候传递token
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// export const login = (obj) => {
//   return axios.post('login', obj)
//     .then((result) => {
//       return result.data
//     })
// }

// 登录
export const login = (obj) => {
  return axios({
    method: 'post',
    url: 'login',
    data: obj
  })
}

// 获取用户数据
export const getAllUserList = (params) => {
  return axios({
    method: 'get',
    url: 'users',
    params
  })
}

// 编辑用户
export const editUser = (obj) => {
  return axios({
    method: 'put',
    url: `users/${obj.id}`,
    data: obj
  })
}

// 实现编辑用户提交
// export const editUser = (obj) => {
//   return axios.put(`users/${obj.id}`, obj)
//     .then((result) => {
//       console.log(result)
//       return result.data
//     })
// }

// 实现用户删除
export const delUserById = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}

// 修改用户状态
export const updateUserStatuById = (uid, type) => {
  return axios({
    method: 'put',
    url: `users/${uid}/state/${type}`
  })
}

// 添加用户
export const addUser = (obj) => {
  return axios({
    method: 'post',
    url: 'users',
    data: obj
  })
}

// 获取角色列表
// export const getRolesList = () => {
//   return axios({
//     method: 'get',
//     url: 'roles'
//   })
// }
