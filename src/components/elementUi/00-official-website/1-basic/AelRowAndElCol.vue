<template>
  <!-- 添加一个 div 作为唯一的根元素，将所有内容包裹起来 -->
  <div class="theme-wrapper">
    <!-- 基础栅格：一行两列，各占一半 -->
    <el-row>
      <el-col :span="12"><div class="grid-box">占 14栏</div></el-col>
      <el-col :span="12"><div class="grid-box">占 12 栏</div></el-col>
    </el-row>

    <!-- 带间距的栅格 -->
    <el-row :gutter="20">
      <el-col :span="8"><div class="grid-box">占 8 栏</div></el-col>
      <el-col :span="8"><div class="grid-box">占 8 栏</div></el-col>
      <el-col :span="8"><div class="grid-box">占 8 栏</div></el-col>
    </el-row>
  </div>
</template>

<script>
import { ThemeUtil } from '../../../../utils/theme';

export default {
  name: 'AelRowAndElCol',
  computed: {
    themeClass() {
      return `theme-${ThemeUtil.getCurrentTheme()}`;
    }
  }
}
</script>

<style>
.theme-wrapper {
  background-color: var(--el-row-bg-color, #f5f7fa);
  padding: 10px;
  transition: background-color 0.3s;
}

.grid-box {
  background: var(--el-col-bg-color, #409EFF);
  color: var(--el-col-text-color, #fff);
  text-align: center;
  padding: 20px 0;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}
</style>