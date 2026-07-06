<template>
  <!-- 添加一个 div 作为唯一的根元素，将所有内容包裹起来 -->
  <div>
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
export default {
  name: 'AelRowAndElCol'
}
</script>

<style scoped>
.grid-box {
  background: #409EFF;
  color: #fff;
  /* text-align: center;
  padding: 20px 0;
  border-radius: 4px; */
}
</style>