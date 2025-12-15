<template>
    <div class="show-image">
      <h3>展示 public/test.png 图片</h3>
      <!-- 注意这里使用的是 /test.png -->
      <img src="/test.png" alt="Test Image" class="image" />
    </div>
  </template>
  
  <script>
  export default {};
  </script>
  
  <style scoped>
  .image {
    max-width: 300px;
    border: 1px solid #ccc;
    padding: 8px;
    margin-top: 10px;
  }
  </style>
  