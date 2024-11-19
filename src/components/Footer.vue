<template>
    <div class="footer">
        <a href="https://github.com/xuyuan-upward" class="toLearn">
            <span> <i class="iconfont icon-github"></i>站长： 许苑向上</span>
        </a>
        <a href="https://blog.csdn.net/a147775" class="toLearn">
            <span> <i class="iconfont icon-bokeyuan"></i>博客： xuyuan-upward</span>
        </a>
        <a href="https://user.qzone.qq.com/2517115657/main" class="toLearn">
            <span> <i class="iconfont icon-shouye"></i>联系方式： 许苑向上</span>
        </a>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick } from 'vue'
</script>
<style lang='less' scoped>
.toGithub {
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    padding: 10px 0;
    display: block;
    text-align: center;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.iconfont {
    margin-right: 5px;
}

.footer {
    height: 100%;
    display: flex;
    justify-content: center;

    a {
        margin-right: 40px;
        color: #00000073;

        span {
            line-height: 60px;
        }
    }
}
</style>