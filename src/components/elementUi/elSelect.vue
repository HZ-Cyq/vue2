<template>
    <div>
      <el-select v-model="version" placeholder="请选择版本">
        <el-option
          v-for="item in versions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </template>
  
  <script>
  // 按需局部引入组件
  import { Select, Option } from 'element-ui';
  
  export default {
    name: 'MySelect',
    components: {
      'el-select': Select,
      'el-option': Option
    },
    data() {
      return {
        versions: ['v1.0', 'v2.0', 'v3.0'],
        version: 'v1.0'
      };
    }
  };
  </script>
  