import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { LoginUserVO } from '@/api/user/type'
import { getLoginUser as getLoginUserApi } from '@/api/user/userApi'
import ACCESS_ENUM from '@/access/accessEnum'
import checkAccess from '@/access/checkAccess'

export const useUserStore = defineStore('user', () => {
  // 当前登录用户信息
  const loginUser = ref<LoginUserVO>({
    userName: '未登录',
    userRole: ACCESS_ENUM.NOT_LOGIN
  })

  // 获取当前登录用户
  const getLoginUser = async () => {
    try {
      const res = await getLoginUserApi()
      if (res.code === 0) {
        loginUser.value = res.data
      } else {
        // 获取用户信息失败，设置为未登录状态
        loginUser.value = {
          userName: '未登录',
          userRole: ACCESS_ENUM.NOT_LOGIN
        }
      }
    } catch (error) {
      // 请求异常，设置为未登录状态
      loginUser.value = {
        userName: '未登录',
        userRole: ACCESS_ENUM.NOT_LOGIN
      }
    }
  }

  // 设置登录用户
  const setLoginUser = (user: LoginUserVO) => {
    loginUser.value = user
  }

  // 用户是否已登录
  const isLoggedIn = computed(() => {
    return loginUser.value?.userRole !== ACCESS_ENUM.NOT_LOGIN
  })

  // 用户是否为管理员
  const isAdmin = computed(() => {
    return loginUser.value?.userRole === ACCESS_ENUM.ADMIN
  })

  // 检查用户是否有权限访问指定资源
  const hasAccess = (needAccess: string) => {
    return checkAccess(loginUser.value, needAccess)
  }

  // 用户登出
  const logout = () => {
    loginUser.value = {
      userName: '未登录',
      userRole: ACCESS_ENUM.NOT_LOGIN
    }
  }

  // 检查用户登录状态是否有效（用于解决长时间后状态显示不正确的问题）
  const checkLoginStatus = async () => {
    try {
      // 发送请求验证当前登录状态
      const res = await getLoginUserApi()
      if (res.code === 0) {
        // 登录状态有效，更新用户信息
        loginUser.value = res.data
        return true
      } else {
        // 登录状态无效，设置为未登录
        logout()
        return false
      }
    } catch (error) {
      // 网络错误或服务器错误，认为登录状态无效
      logout()
      return false
    }
  }

  return {
    loginUser,
    getLoginUser,
    setLoginUser,
    isLoggedIn,
    isAdmin,
    hasAccess,
    logout,
    checkLoginStatus
  }
}, {
  // Pinia 持久化插件配置
  persist: {
    key: 'zoj-user-store',
    storage: localStorage,
    paths: ['loginUser']
  }
})