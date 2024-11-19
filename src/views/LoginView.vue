<template class="login-view">
    <div class="login-view">
        <h1>欢迎来到许苑后台管理系统</h1>
        <el-form :model="loginForm" class="login-form">

            <h2>登录</h2>

            <el-form-item>
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin" style="width: 40% ; margin-left: 10%;">登录</el-button>
                <span @click="handleRegister">注册</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'
const router = useRouter()
const store = useAllDataStore()
const loginForm = reactive({
    username: '',
    password: ''
})
const {proxy} = getCurrentInstance()
const handleLogin = async() => {
    console.log(loginForm)
    const res = await proxy.$apis.getMenu(loginForm)
    console.log("res的数据为", res);
    // 修改展示菜单数据
    store.updateMenuList(res.menuList)
    store.state.token = res.token
    // 根据权限添加路由配置
    store.addRoutes(router)
    router.push('/home')
   
}
</script>
<style lang='less' scoped>
.login-view {
    height: 100%;
    background-image: url("@/assets/images/image.png");
    background-size: 100%;
    overflow: hidden;

}

h1 {
    width: 450px;
    text-align: center;
    color: rgb(171, 224, 244);
    font-size: 30px;
    margin: 40px 20px;
}

.login-form {
    width: 500px;
    margin: 100px auto;
    padding: 50px;
    background-color: transparent;
    border-radius: 10px;

    h2 {
        width: 300px;
        text-align: center;
        color: rgb(212, 225, 232);
        font-size: 30px;
        margin-bottom: 30px;
    }

    .el-form-item {
        width: 300px;

        span {
            width: 40%;
            text-align: center;
            color: rgb(27, 174, 186);
            cursor: pointer;
        }

    }
}
</style>