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

// 获取角色列表
export const getRolesList = () => {
  return axios({
    method: 'get',
    url: 'roles'
  })
}

// 删除指定角色的指定权限
export const removeRightById = (roleid, rightid) => {
  return axios({
    method: 'delete',
    url: `roles/${roleid}/rights/${rightid}`
  })
}

// 添加角色
export const addRoles = (obj) => {
  return axios({
    method: 'post',
    url: 'roles',
    data: obj
  })
}

// 删除角色
export const delRole = (id) => {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}

// 编辑角色
export const editRole = (id, obj) => {
  return axios({
    method: 'put',
    url: `roles/${id}`,
    data: obj
  })
}
