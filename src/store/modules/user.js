import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    name: '',
    id: '',
    welcome: '欢迎您，来到老寇云平台',
    avatar: '',
    permissions: [],
    deptIds: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_DEPT_IDS: (state, deptIds) => {
       state.deptIds = deptIds
    }
  },

  actions: {
    // 登录
    Login ({ commit }, loginParam) {
      return new Promise((resolve, reject) => {
        login(loginParam).then(res => {
          storage.set(ACCESS_TOKEN, res.access_token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', res.access_token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.data
          const id = user.userId
          const name = user.username
          const avatar = user.imgUrl === '' ? require('@/assets/images/profile.jpg') : user.imgUrl
          if (user.permissionList && user.permissionList.length > 0) {
            commit('SET_PERMISSIONS', user.permissionList)
          }
          if (user.deptIds && user.deptIds.length > 0) {
            commit('SET_DEPT_IDS', user.deptIds)
          }
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_ID', id)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
