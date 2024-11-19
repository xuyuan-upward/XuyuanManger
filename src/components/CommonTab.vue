<template>
    <div class="common-tab">
        <el-tag v-for="(tag, index) in tags" :key="tag.name" :closable="tag.name !== 'home'"
            :effect="route.name === tag.name ? 'dark' : 'plain'" @click="handleTags(tag)" @close="handleClose(tag, index)">
            {{ tag.label }}
        </el-tag>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllDataStore } from '@/stores'
const store = useAllDataStore()
const route = useRoute()
const router = useRouter()
/* computed 会自动跟踪 store.state.tags 的变化，
并在 store.state.tags 发生变化时重新计算 tags 的值*/
const tags = computed(() => store.state.tags)

// 点击关闭文件的时候
const handleClose = (tag, index) => {
    console.log("index  ", index);
    store.deleteMenu(tag)
    // 如果点击的关闭的是最后一个标签
    if (tag.name !== route.name) return
    if (index === store.state.tags.length) {
        // store.selectMenu(tags.value[index - 1])
        router.push(tags.value[index - 1].name)
    }
    else {
        // 跳转到当前自己的索引下
        // store.selectMenu(tags.value[index])
        router.push(tags.value[index].name)
    }

}
const handleTags = (tag) => {
    console.log(tag.path);
    router.push(tag.path)
}
</script>
<style lang='less' scoped>
.common-tab {
    .el-tag {
        margin: 2px 15px;
    }
}
</style>