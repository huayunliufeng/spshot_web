import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home.vue'
import Chart from '../components/data/Chart'
import Promote from '../components/data/Promote'
import Statistical from '../components/data/Statistical'
import Feedback from '../components/data/Feedback'
import Treated from '../components/data/feedback/Treated'
import Untreated from '../components/data/feedback/Untreated'
import UnVerify from '../components/issure/UnVerify'
import Pass from '../components/issure/Pass'
import Ongoing from '../components/issure/pass/Ongoing'
import Overdue from '../components/issure/pass/Overdue'
import UnPass from '../components/issure/UnPass'
import NoSpec from '../components/issure/unpass/NoSpec'
import Banned from '../components/issure/unpass/Banned'
import Record from '../components/issure/Record'
import User from '../components/user/User'
import Role from '../components/user/Role'
import Admin from '../components/user/Admin'

Vue.use(VueRouter)

//以下代码解决路由地址重复点击的报错问题(此方法不建议使用，但目前没有找到更好的办法)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        meta: {requireAuth: true},
        component: Home,
        redirect: '/data/chart',
        children: [
            {
                path: '/data/chart',
                name: 'Chart',
                meta: {requireAuth: true},
                component: Chart
            },
            {
                path: '/data/promote',
                name: 'Promote',
                meta: {requireAuth: true},
                component: Promote
            },
            {
                path: '/data/statistical',
                name: 'Statistical',
                meta: {requireAuth: true},
                component: Statistical
            },
            {
                path: '/data/feedback',
                name: 'Feedback',
                component: Feedback,
                redirect: '/data/feedback/untreated',
                children: [
                    {
                        path: 'untreated',
                        name: 'Untreated',
                        meta: {requireAuth: true},
                        component: Untreated
                    },
                    {
                        path: 'treated',
                        name: 'Treated',
                        meta: {requireAuth: true},
                        component: Treated
                    }
                ]
            },
            {
                path: '/issure/unverify',
                name: 'UnVerify',
                meta: {requireAuth: true},
                component: UnVerify
            },
            {
                path: '/issure/pass',
                name: 'Pass',
                component: Pass,
                redirect: '/issure/pass/ongoing',
                children: [
                    {
                        path: 'ongoing',
                        name: 'Ongoing',
                        meta: {requireAuth: true},
                        component: Ongoing
                    },
                    {
                        path: 'overdue',
                        name: 'Overdue',
                        meta: {requireAuth: true},
                        component: Overdue
                    }
                ]
            },

            {
                path: '/issure/unpass',
                name: 'UnPass',
                component: UnPass,
                redirect: '/issure/unpass/nospec',
                children: [
                    {
                        path: 'nospec',
                        name: 'NoSpec',
                        meta: {requireAuth: true},
                        component: NoSpec
                    },
                    {
                        path: 'banned',
                        name: 'Banned',
                        meta: {requireAuth: true},
                        component: Banned
                    }
                ]
            },
            {
                path: '/issure/record',
                name: 'Record',
                meta: {requireAuth: true},
                component: Record
            },
            {
                path: '/user/user',
                name: 'User',
                meta: {requireAuth: true},
                component: User
            },
            {
                path: '/user/role',
                name: 'Role',
                meta: {requireAuth: true},
                component: Role
            },
            {
                path: '/user/admin',
                name: 'Admin',
                meta: {requireAuth: true},
                component: Admin
            }
        ]
    }
]

const router = new VueRouter({
    routes
})



export default router
