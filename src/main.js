import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// api
import api from './axios/api.js'
Vue.prototype.$api=api;
Vue.config.productionTip = false

import axios from 'axios'
Vue.prototype.$axios=axios;

// element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'

import './excel/Blob'
import './excel/Export2Excel'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
