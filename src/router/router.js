import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/permission/Rights.vue'
import Roles from '../components/permission/Roles.vue'
import Goods from '../components/produce/Goods.vue'
import Params from '../components/produce/Params.vue'
import Categories from '../components/produce/Categories.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/report/Reports.vue'





Vue.use(Router)

const router =  new Router({
    routes: [
        {path: '/', redirect: '/login'},
        {path: '/login', component: Login},
        {path: '/home', component: Home, redirect: '/welcome',
            children:[
                {path: '/welcome', component: Welcome},
                {path: '/users', component: Users},
                {path: '/rights', component: Rights},
                {path: '/roles', component: Roles},
                {path: '/goods', component: Goods},
                {path: '/params', component: Params},
                {path: '/categories', component: Categories},
                {path: '/orders', component: Orders},
                {path: '/reports', component: Reports},
            ]
        },
    ]
})
// Mount router navigation guard
router.beforeEach((to, from, next) => {
    if(to.path === '/login')    return next();
    const token = window.sessionStorage.getItem('token');
    if(!token) return next('/login');
    next();
})

export default router
