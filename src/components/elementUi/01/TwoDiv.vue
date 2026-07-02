<template>
    <div>
      <button @click="showSecond = true">显示第二个</button>
      <div class="box-wrapper">
        <div v-show="!showSecond" class="box-first">第一个</div>
        <div v-show="showSecond" class="box-second">第二个</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return { showSecond: false };
    }
  };
  </script>
  
  <style scoped>
  .box-wrapper {
    position: relative;
    width: 200px;
    height: 100px;
    margin-top: 10px;
  }
  .box-first, .box-second {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .box-first { background: #eee; }
  .box-second { background: #188df0; color: #fff; }
  </style>