import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/static-code-analysis',
    component: () => import('@/components/Home'),
    children: [
      {
        path: 'static-code-analysis',
        components: {
          main: () => import('@/components/main/StaticCodeAnalysisMainView'),
          footer: () => import('@/components/footer/StaticCodeAnalysisFooterView')
        }
      },
      {
        path: 'code-format',
        components: {
          main: () => import('@/components/main/CodeFormatMainView'),
          footer: () => import('@/components/footer/CodeFormatFooterView')
        }
      },
      {
        path: 'online-judgement',
        components: {
          main: () => import('@/components/main/OnlineJudgementMainView'),
          footer: () => import('@/components/footer/OnlineJudgementFooterView')
        }
      }
    ]
  },
  // {
  //   path: '/monaco',
  //   name: 'Monaco',
  //   component: () => import('@/components/Monaco')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
// 参数1 : to 目标路由对象
// 参数2 : from 来源路由对象
// 参数3 : next() 下一步
router.beforeEach((to, from, next) => {
  // 1. 判断是不是登录页面
  // 是登录页面
  if(to.path === '/login') {
    next()
  } else {
    // 不是登录页面
    // 2. 判断 是否登录过
    /*
    example 取出sessionStore JSON.parse
     */
    sessionStorage.getItem('user_info') != null ? next() : next('/login')
  }
})

export default router
