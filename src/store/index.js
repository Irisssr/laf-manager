import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',
    userInfo:{},
    collapse:false,
    visitedViews:[],
    tagsList:[],
    items:[
      {
          icon: 'el-icon-house',
          path: 'dashboard',
          title: '系统首页'
      },
      {
          icon: 'el-icon-user',
          path: 'people',
          title: '用户',
          subs:[
              {
                  icon:'el-icon-s-custom',
                  path:'admin',
                  title:'后台管理用户'
              },
              {
                  icon:'el-icon-user-solid',
                  path:'user',
                  title:'小程序注册用户'
              }
          ]
      },
      {
          icon: 'el-icon-mobile',
          path: 'goods',
          title: '物品信息'
      },
      {
          icon:'el-icon-bank-card',
          path:'cards',
          title:'证件',
          subs:[
            {
              icon:'el-icon-postcard',
              path:'cards',
              title:'证件信息'
            },
            {
              icon:'el-icon-view',
              path:'listen',
              title:'证件监听'
            }
          ]
      },
      {
          icon:'el-icon-picture-outline',
          path:'banners',
          title:'首页轮播图'
      },
      {
          icon:'el-icon-data-board',
          path:'boards',
          title:'公告'
      }
  ]
  },
  mutations: {
    getUser(state,user){
      state.userInfo=user;
      state.token=user.token;
    },
    changeCollpase(state){
      state.collapse=!state.collapse
    },
    addTags(state,route){
      state.tagsList.push(route)
    },
    clearAll(state){
      state.tagsList=[]
    },
    clearOther(state,route){
      state.tagsList=state.tagsList.filter(item=>{
          return item.path===route.fullPath;
      })
    }
  },
  actions: {
  },
  modules: {
  }
})
