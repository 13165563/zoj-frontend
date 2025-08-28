// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ACCESS_ENUM from '@/access/accessEnum'
import checkAccess from '@/access/checkAccess'

// Views
import UserLayout from "@/layouts/UserLayout.vue"
import BasicLayout from "@/layouts/BasicLayout.vue"
import UserLoginView from "@/views/user/UserLoginView.vue"
import UserRegisterView from "@/views/user/UserRegisterView.vue"
import QuestionsView from "@/views/question/QuestionsView.vue"
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue"
import ViewQuestionView from "@/views/question/ViewQuestionView.vue"
import AddQuestionView from "@/views/question/AddQuestionView.vue"
import ManageQuestionView from "@/views/question/ManageQuestionView.vue"
import NoAuthView from "@/views/NoAuthView.vue"
import AdminView from "@/views/AdminView.vue"

// 定义路由元信息接口
export interface RouteMeta {
  title?: string
  icon?: string
  hidden?: boolean
  alwaysShow?: boolean
  access?: string
  children?: RouteMeta[]
  hideInMenu?: boolean
}

// 修复后的 AppRouteRecordRaw 接口
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

// 路由配置
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
      },
    ],
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true,
    },
  },
  {
    path: "/manage/question/",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/admin",
    name: "管理员可见",
    component: AdminView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes as RouteRecordRaw[]
})

// 添加路由守卫
router.beforeEach(async (to, from, next) => {
  console.log("路由守卫触发，当前路由:", to.path);
  const userStore = useUserStore();
  
  // 1. 检查用户登录状态有效性
  if (userStore.isLoggedIn) {
    const isLoginValid = await userStore.checkLoginStatus();
    if (!isLoginValid) {
      console.log('检测到登录状态已失效');
      // 清除用户信息
      userStore.logout();
    }
  }
  
  // 2. 防止已登录用户访问登录页
  if (to.path === '/user/login' && userStore.isLoggedIn) {
    console.log('已登录用户尝试访问登录页，正在重定向到首页');
    next('/');
    return;
  }
  
  // 3. 所有检查通过，继续导航
  next();
})

export default router