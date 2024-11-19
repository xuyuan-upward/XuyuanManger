
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
function initData() {
    return {
        isCollapse: false,
        tags: [
            {
                path: '/home',
                name: 'home',
                label: '首页',
                icon: 'hone'
            }
        ],
        currentMenu: null,
        /* 展示菜单列表的数组 */
        menuList: [],
        token: null,
        routerList: [],
    }
}

export const useAllDataStore = defineStore('allData', () => {
    const state = ref(initData())

    // 进行数据持久化
    watch(state, newObj => {
        if (!newObj.token) return
        localStorage.setItem('store', JSON.stringify(newObj))
    }, {
        deep: true,
    })


    function selectMenu(val) {
        if (val.name === 'home') {
            state.value.currentMenu = null
        }
        else {
            state.value.currentMenu = val
            let index = state.value.tags.findIndex(item => item.name === val.name)
            index === -1 ? state.value.tags.push(val) : ""
        }
    }

    function deleteMenu(tag) {
        let index = state.value.tags.findIndex(item => item.name == tag.name)
        // 将当前tags切除
        state.value.tags.splice(index, 1);
    }

    function updateMenuList(val) {
        // 将当前tags切除
        state.value.menuList = val;
    }
    function clean() {
        // 将所有路由移除
        state.value.routerList.forEach(item => {
            if (item) item();
            state.value = initData();
            // 删除本地的缓存
            localStorage.removeItem('store')
        })
    }

    function addRoutes(router, type) {
        // 刷新页面时候
        if (type === 'refresh') {
            if (JSON.parse(localStorage.getItem('store'))) {
                state.value = JSON.parse(localStorage.getItem('store'))
                //
                state.value.routerList = []
            }
            else {
                return;
            }
        }
        // 将当前tags切除
        const menu = state.value.menuList;
        console.log("menu", menu);
        /* 执行该代码后  import.meta.glob可能返回的是这样的对象
  '@/views/Home.vue': () => import('@/views/Home.vue'),
  '@/views/About.vue': () => import('@/views/About.vue'),
  '@/views/User/Profile.vue': () => import('@/views/User/Profile.vue')
 */
        const module = import.meta.glob('../views/*.vue')
        console.log("module", module);
        const routeArr = []
        menu.forEach(item => {
            if (item.children) {
                item.children.forEach(child => {
                    let url = `../views/${child.url}.vue`
                    console.log("url", url);
                    child.component = module[url]
                    console.log("child.component", child.component);
                    routeArr.push(...item.children)
                })
            }
            else {
                let url = `../views/${item.url}.vue`
                console.log("url", url);
                item.component = module[url]
                console.log("item.component", item.component);
                routeArr.push(item)
            }
            routeArr.forEach(item => {
                state.value.routerList.push(router.addRoute("main", item));
            })
        })
        console.log("state.value.routerList", state.value.routerList);
        console.log("state.value.routeArr", routeArr);
    }
    return {
        /* 其实是直接返回的是state.value */
        state,
        selectMenu,
        deleteMenu,
        updateMenuList,
        addRoutes,
        clean,
    }
})