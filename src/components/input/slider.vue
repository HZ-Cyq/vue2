<template>
    <div class="inline-slider-row">
      <!-- 1. 左侧标签 -->
      <span class="slider-label">参数值：</span>
  
      <!-- 2. 中间滑条 (flex: 1 让它自动填满剩余空间) -->
      <el-slider 
        v-model="value" 
        :min="0" 
        :max="1" 
        :step="0.001" 
        class="custom-slider"
      />
  
      <!-- 3. 右侧输入框 -->
      <el-input-number 
        v-model="value" 
        :min="0" 
        :max="1" 
        :step="0.001" 
        :precision="3"
        size="small"
        controls-position="right"
        class="custom-input"
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        value: 0.5
      };
    }
  };
  </script>
  
  <style scoped>
  /* 1. 核心：使用 Flex 布局让所有元素排成一行，并垂直居中 */
  .inline-slider-row {
    display: flex;
    align-items: center; /* 垂直居中对齐，非常关键 */
    gap: 12px;           /* 元素之间保持统一的间距 */
    width: 100%;         /* 确保容器占满父级宽度 */
  }
  
  /* 2. 标签样式：防止被压缩，文字不换行 */
  .slider-label {
    white-space: nowrap;
    font-size: 14px;
    color: #606266;
  }
  
  /* 3. 滑条样式：自动占据中间剩余空间 */
  .custom-slider {
    flex: 1; 
    /* 注意：el-slider 内部需要一点高度空间，默认即可 */
  }
  
  /* 4. 输入框样式：固定宽度，防止挤压 */
  .custom-input {
    width: 130px; 
  }
  </style>