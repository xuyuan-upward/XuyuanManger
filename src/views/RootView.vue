<template>
  <div class="common-layout">
    <el-container class="main-container">
      <div class="aside-container">
        <CommonAside />
      </div>
      <el-container class="right-container">
        <el-header style="height: 40px;">
          <CommonHeader />
        </el-header>
        <el-divider style="margin: 5px 0;" />
        <CommonTab />
        <el-main>
          <router-view />
        </el-main>
        <el-footer>
          <Footer />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, nextTick } from 'vue'
import CommonAside from '@/components/CommonAside.vue';
import CommonHeader from '@/components/CommonHeader.vue';
import CommonTab from '@/components/CommonTab.vue';
import Footer from '@/components/Footer.vue';
</script>
<style lang='less' scoped>
.common-layout,
.main-container,
right-container {
  height: 100%;
  background-color: #f0f2f5;

  .el-main {
    padding: 8px;
  }
}
</style>