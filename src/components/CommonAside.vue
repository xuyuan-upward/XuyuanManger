<template>
    <!-- default-active通常与对应的index相关 -->
    <el-aside :width="width">
        <el-menu text-color="#fff" background-color="#545c64" :collapse="isCollapse" :collapse-transition="false" 
        :default-active="activeMenu"
            class="el-menu-vertical-demo">
            <div class="title">
                <i class="iconfont icon-quanpingtai"> </i>
                <h4 v-show="!isCollapse">许苑后台管理</h4>
            </div>
            <!-- 没有子菜单 -->
            <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path" @click="handleMenu(item)">
                <component :is="item.icon" class="icon" />
                <span style="margin-left: 10px">{{ item.label }}</span>
            </el-menu-item>
            <!-- 有子菜单 -->
            <el-sub-menu v-for="item in hasChildren" :key="item.path" :index="item.path">
                <template #title>
                    <component :is="item.icon" class="icon" />
                    <span style="margin-left: 10px">{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(subItem) in item.children" :index="subItem.path" :key="subItem.path">
                        <component :is="subItem.icon" class="icon" />
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAllDataStore } from '@/stores'
const store = useAllDataStore()
const router = useRouter()
const route = useRoute()
/* const list = ref([
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
        url: 'Home'
    },
    {
        path: '/mall',
        name: 'mall',
        label: '商品管理',
        icon: 'ShoppingBag',
        url: 'Mall'
    },
    {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'user',
        url: 'User'
    },
    {
        path: 'other',
        label: '其他',
        icon: 'location',
        children: [
            {
                path: '/page1',
                name: 'page1',
                label: '页面1',
                icon: 'setting',
                url: 'Page1'
            },
            {
                path: '/page2',
                name: 'page2',
                label: '页面2',
                icon: 'setting',
                url: 'Page2'
            }
        ]
    }
])
 */
const list = computed(() => store.state.menuList)
const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))
const width = computed(() => store.state.isCollapse ? '60px' : '200px')
const isCollapse = computed(() => store.state.isCollapse)
const activeMenu = computed(() => route.path)
const handleMenu = (item) => {
    if (item.children) {
        return
    }
    router.push(item.path)
    store.selectMenu(item)
}
</script>
<style lang='less' scoped>
.icon {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-aside {
    background-color: #545c64;
    height: 100vh;

    .el-menu {
        border-right: none;

        .title {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        h4 {
            color: #fff;
            font-size: 17px;
            margin: 20px;
            font-weight: 500px;
            text-align: center;
        }


    }
}

span {}
</style>