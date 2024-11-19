import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/less/index.less"
import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import { useAllDataStore } from '@/stores'
/* 引入mock */
import "@/apis/mock.js"
/* 引入apis 管理请求接口 */
import apis from "@/apis/apis.js"
const pinia = createPinia()
const app = createApp(App)
/* 定义全局配置使用 */
app.config.globalProperties.$apis = apis

app.use(ElementPlus)
app.use(pinia)
// localStorage.removeItem("store")
const store = useAllDataStore()
store.addRoutes(router, "refresh")
app.use(router)
function isRoute(to) {
    let routes = router.getRoutes()
    console.log("routes", routes);
    let resFil = routes.filter(item =>
        /* 相当于return */
        item.path === to.path
    )
    /*  let resFil = routes.filter(item => { 
     相当于一段代码，只有return为true时候才会保留对应的数据
     item.path === to.path}
       
     ) */
    return resFil
}
router.beforeEach((to, from, next) => {
    console.log("store.state.token", store.state.token);
    if (!store.state.token && to.path !== '/login') {
        console.log("to.path1", to.path);
        next({ name: 'login' })
    }
    if (store.state.token && to.path === '/login') {
        console.log("to.path2", to.path);
        next({ name: 'home' })
    }
    if (store.state.token && to.path !== '/login') {
        console.log("to.path3", to.path);
        console.log("isRoute", isRoute(to));
        if (isRoute(to).length === 0) {
            console.log("to.path3", to.path);
            next({ name: '404' })
        }
    }
    console.log("to.path4", to.path);
    next()
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
