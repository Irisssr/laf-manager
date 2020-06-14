import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'*',
    component:()=>import('@/views/Pages/404.vue')
  },
  {
    path:'/',
       component:()=>import('@/views/Pages/Login/Index.vue'),
       children:[
         {
           path:'login',
           component:()=>import('@/views/Pages/Login/Login.vue')
         },
         {
           path:'register',
           component:()=>import('@/views/Pages/Login/Register.vue')
         }
       ]
  },
  {
    path:'/',
    component:()=>import('@/views/Layout/Home.vue'),
    children:[
      {
        path:'/dashboard',
        meta:{title:'系统首页'},
        component:()=>import('@/views/Pages/Dashboard.vue')
      },
      {
        path:'admin',
        meta:{title:'后台用户管理'},
        component:()=>import('@/views/Pages/People/Admin.vue')
      },
      {
        path:'user',
        meta:{ title:'小程序注册用户管理' },
        component:()=>import('@/views/Pages/People/User.vue')
      },
      {
        path:'/goods',
        meta:{ title:'物品信息管理' },
        component:()=>import('@/views/Pages/Goods.vue')
      },
      {
        path:'cards',
        meta:{ title:'证件信息管理'},
        component:()=>import('@/views/Pages/Card/Cards.vue')
      },
      {
        path:'/listen',
        meta:{ title:'证件监听管理'},
        component:()=>import('@/views/Pages/Card/Listen.vue')
      },
      {
        path:'/banners',
        meta:{ title:'首页轮播图管理' },
        component:()=>import('@/views/Pages/Banners.vue')
      },
      {
        path:'/boards',
        meta:{ title:'公告管理' },
        component:()=>import('@/views/Pages/Boards.vue')
      }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
