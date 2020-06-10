// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI, { Tree } from 'element-ui'  // ElementUI
import 'element-ui/lib/theme-chalk/index.css' // ElementUI
import router from './router/router.js' // Router
import './assets/css/global.css'  // Global CSS
import axios from 'axios' // Axios
import TreeTable  from 'vue-table-with-tree-grid' // vue-table-with-tree-grid
 


// Set axios baseURL
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
// Set axios request interceptor
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})

// Mount axios on http
Vue.prototype.$http = axios // Axios
Vue.config.productionTip = false
Vue.use(ElementUI); // ElementUI
Vue.component('tree-table',TreeTable)  // vue-table-with-tree-grid

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
