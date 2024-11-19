<template>
    <div class="exception">
        <img :src="getImageUrl(404)" />
        <el-button class="btn-home" @click="goHome">回到上一个页面</el-button>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const getImageUrl = (img) => {
    return new URL(`../assets/images/${img}.png`, import.meta.url).href;
}

const goHome = () => {
    //go方法：按指定方向访问历史。如果是正数则是路由记录向前跳转，如果是负数则是向后回退
    //这里我们回退两个页面到跳转前的页面
    router.go(-2)
}

</script>

<style lang="less">
.exception {
    position: relative;

    img {
        width: 100%;
        height: 100vh;
    }

    .btn-home {
        position: absolute;
        left: 50%;
        bottom: 100px;
        margin-left: -34px;
    }
}
</style>