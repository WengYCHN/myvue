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
// import QuillEditor from 'vue-quill-editor'  // vue-quill-editor
// import 'quill/dist/quill.core.css'  // vue-quill-editor
// import 'quill/dist/quill.bubble.css'  // vue-quill-editor
// import 'quill/dist/quill.snow.css'// vue-quill-editor
// import echarts from "echarts" // echarts
import NProgress from 'nprogress' // nprogress
import 'nprogress/nprogress.css'  // nprogress

// Set axios baseURL
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"



// Set axios request interceptor
axios.interceptors.request.use(config => {
    // Request interceptor
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

//  Response interceptor
axios.interceptors.response.use(config => {NProgress.done();return config;})

// Mount axios on http
Vue.prototype.$http = axios // Axios
Vue.config.productionTip = false
Vue.use(ElementUI); // ElementUI
Vue.component('tree-table',TreeTable)  // vue-table-with-tree-grid
// Vue.use(QuillEditor) // vue-quill-editor
// Vue.prototype.$echarts = echarts; // echarts

// Date format
Vue.filter('dataFormat',function(originValue){
  const date = new Date(originValue);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1 + '').padStart(2, '0');
  const day = (date.getDate() + '').padStart(2, '0');
  const hour = (date.getHours() + '').padStart(2, '0');
  const minute = (date.getMinutes() + '').padStart(2, '0');
  const sedcond = (date.getSeconds() + '').padStart(2, '0');
  return `${year}/${month}/${day} ${hour}:${minute}:${sedcond}`;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
