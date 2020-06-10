// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'  // ElementUI
import 'element-ui/lib/theme-chalk/index.css' // ElementUI
import router from './router/router.js' // Router
import './assets/css/global.css'  // Global CSS
import axios from 'axios' // Axios

// Set axios baseURL
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
// Set axios request interceptor
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})

// Mount axios on http
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
