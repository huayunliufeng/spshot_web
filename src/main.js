import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, {Message} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SidebarItem from './components/SidebarItem'
import './assets/iconfont.css'
import 'default-passive-events'

Vue.use(ElementUI);
Vue.use(SidebarItem);
Vue.prototype.$message = Message
Vue.config.productionTip = false;

//格式化时间
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal[0], originVal[1], originVal[2], originVal[3], originVal[4], originVal[5])
    const yyyy = dt.getFullYear()
    const MM = (dt.getMonth() + 1 + '').padStart(2, 0);
    const dd = (dt.getDate() + '').padStart(2, 0);
    const HH = (dt.getHours() + '').padStart(2, 0);
    const mm = (dt.getMinutes() + '').padStart(2, 0);
    const ss = (dt.getSeconds() + '').padStart(2, 0);
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
})

//格式化时间2
Vue.filter('dateFormat2', function (originVal) {
    const dt = new Date(originVal)
    const yyyy = dt.getFullYear()
    const MM = (dt.getMonth() + 1 + '').padStart(2, 0);
    const dd = (dt.getDate() + '').padStart(2, 0);
    const HH = (dt.getHours() + '').padStart(2, 0);
    const mm = (dt.getMinutes() + '').padStart(2, 0);
    const ss = (dt.getSeconds() + '').padStart(2, 0);
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
})


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

//全局前置守卫（回调函数）
router.beforeEach((to, from, next) => {
    let path = window.sessionStorage.getItem(to.path);
    if ((path !== null && path !== '') || to.path === '/' || from.path === '/') {
        next();
    } else {
        Message.error({message: "权限不足，无法访问"});
        router.replace(from.path);
    }
})
