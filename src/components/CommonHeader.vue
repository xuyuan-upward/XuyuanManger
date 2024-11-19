<template>
    <div class="header">
        <div class="l-header">
            <el-button size="small" @click="store.state.isCollapse = !store.state.isCollapse">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
        
        </div>
        <div class="r-header">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img src="@/assets/images/xuyuan.jpg" alt="" class="r-header-avatar">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handlerLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>

        </div>

    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, computed } from 'vue'
import { useAllDataStore } from '@/stores'
import { ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const store = useAllDataStore()
const router = useRouter()
let currentPath = computed(() => {
    console.log("store.state.currentMenu", store.state.currentMenu);
    return store.state.currentMenu;
})
const handlerLogout = () => {
    store.clean()
    router.push('/login')
}
</script>
<style lang='less' scoped>
.header {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .l-header {
        display: flex;
        justify-content: center;
        align-items: center;

        .el-button {
            margin-right: 15px;
        }
    }
}

.r-header-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}
</style>

    <!--  -- 面包屑功能 <el-breadcrumb :separator-icon="ArrowRight">
               
                <el-breadcrumb-item :to=" '/' ">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentPath" :to="currentPath.path" @cl>{{ currentPath.label
                }}
                </el-breadcrumb-item>
            </el-breadcrumb> -->